<?php
declare(strict_types=1);

// Ateljébrevet: e-postlista med dubbel bekräftelse. Anmälan från sajten blir
// 'pending' tills mottagaren klickat på länken i bekräftelsemejlet. Kryss i kassan
// räknas som bekräftat (adressen är redan använd för beställningen).
// Utskick görs i Mailchimp. Bekräftade adresser förs över direkt (newsletter_mailchimp_*),
// avregistreringar går åt båda hållen (api/mailchimp-webhook.php tar emot Mailchimps).
// Studio → Ateljébrev listar, synkar om och exporterar CSV som reserv.

require_once __DIR__ . '/bootstrap.php';
require_once dirname(__DIR__) . '/seo.php';

function newsletter_ensure_schema(PDO $pdo): void
{
  $pdo->exec(
    <<<SQL
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(190) NOT NULL,
  language VARCHAR(8) NOT NULL DEFAULT 'sv',
  source VARCHAR(60) NOT NULL DEFAULT '',
  status VARCHAR(16) NOT NULL DEFAULT 'pending',
  token CHAR(40) NOT NULL,
  confirmed_at DATETIME NULL,
  unsubscribed_at DATETIME NULL,
  confirm_sent_at DATETIME NULL,
  ip_hash CHAR(64) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  mailchimp_synced_at DATETIME NULL,
  mailchimp_error VARCHAR(255) NULL,
  UNIQUE KEY newsletter_email_unique (email),
  UNIQUE KEY newsletter_token_unique (token),
  INDEX newsletter_status_idx (status, created_at)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
SQL
  );
  api_schema_add_column_if_missing($pdo, 'newsletter_subscribers', 'mailchimp_synced_at', 'DATETIME NULL');
  api_schema_add_column_if_missing($pdo, 'newsletter_subscribers', 'mailchimp_error', 'VARCHAR(255) NULL');
  api_schema_add_column_if_missing($pdo, 'newsletter_subscribers', 'welcome_sent_at', 'DATETIME NULL');
}

// Välkomstmejlet som [subject, body]. Texten är Olas (godkänd 2026-11-16).
function newsletter_welcome_mail(array $row): array
{
  $lang = (string) $row['language'] === 'en' ? 'en' : 'sv';
  // Kort, allmän länk i stället för den personliga token-länken (som såg rörig ut i texten).
  // Sidan ber om e-postadressen och mejlar en avregistreringslänk.
  $unsubscribe = newsletter_url('/ateljebrev/avsluta', $lang);
  if ($lang === 'en') {
    return [
      'subject' => 'Welcome to the studio letter',
      'body' => "Hi,\n\nThank you for following my painting.\n\n"
        . "In the studio letter I write about exhibitions and what I learn while painting. Sometimes I recommend a good course, an exciting artist who inspires me or a demonstration I'm giving myself. New series and new prints end up here too. The letters come at regular intervals.\n\n"
        . "If you want to look around in the meantime:\n"
        . "Gallery: https://olagustafsson.com/gallery.html?lang=en\n"
        . "100 days of sun: https://olagustafsson.com/100-dagar-av-sol?lang=en\n"
        . "Gift cards: https://olagustafsson.com/presentkort?lang=en\n\n"
        . "Ola Gustafsson\nola@olagustafsson.com\n\n"
        . "To stop receiving the letter: {$unsubscribe}\n"
    ];
  }
  return [
    'subject' => 'Välkommen till ateljébrevet',
    'body' => "Hej,\n\nTack för att du vill följa mitt måleri.\n\n"
      . "I ateljébrevet berättar jag om utställningar och om vad jag lär mig när jag målar. Ibland tipsar jag om en bra kurs, en spännande konstnär som inspirerar mig eller en demonstration jag själv håller. Nya serier och nya printar hamnar här också. Breven kommer med jämna mellanrum.\n\n"
      . "Vill du titta runt under tiden:\n"
      . "Galleriet: https://olagustafsson.com/gallery.html\n"
      . "100 dagar av sol: https://olagustafsson.com/100-dagar-av-sol\n"
      . "Presentkort: https://olagustafsson.com/presentkort\n\n"
      . "Ola Gustafsson\nola@olagustafsson.com\n\n"
      . "Vill du sluta få brevet kan du avsluta här: {$unsubscribe}\n"
  ];
}

// Skickas en gång per adress, när den blir bekräftad (länk eller kryss i kassan).
function newsletter_send_welcome(PDO $pdo, string $email): void
{
  $row = newsletter_find_by_email($pdo, strtolower(trim($email)));
  if (!$row || $row['status'] !== 'confirmed' || !empty($row['welcome_sent_at'])) {
    return;
  }
  $mail = newsletter_welcome_mail($row);
  if (api_security_send_mail((string) $row['email'], $mail['subject'], $mail['body'], api_security_contact_recipient())) {
    $pdo->prepare('UPDATE newsletter_subscribers SET welcome_sent_at = UTC_TIMESTAMP() WHERE id = :id')->execute([':id' => (int) $row['id']]);
  }
}

// ---- Mailchimp ---------------------------------------------------------------
// Konfiguration i .db-config.php: 'mailchimp' => ['apiKey' => '…-us18', 'listId' => '…', 'webhookSecret' => '…'].
function newsletter_mailchimp_config(): array
{
  $db = api_load_db_config();
  $cfg = isset($db['mailchimp']) && is_array($db['mailchimp']) ? $db['mailchimp'] : [];
  $apiKey = trim((string) ($cfg['apiKey'] ?? getenv('MAILCHIMP_API_KEY') ?: ''));
  $dc = str_contains($apiKey, '-') ? substr($apiKey, strrpos($apiKey, '-') + 1) : '';
  return [
    'apiKey' => $apiKey,
    'listId' => trim((string) ($cfg['listId'] ?? '')),
    'webhookSecret' => trim((string) ($cfg['webhookSecret'] ?? '')),
    'base' => $dc !== '' ? "https://{$dc}.api.mailchimp.com/3.0" : '',
    'enabled' => $apiKey !== '' && $dc !== '' && trim((string) ($cfg['listId'] ?? '')) !== ''
  ];
}

// Anrop mot Mailchimp. Returnerar [httpStatus, svar som array]. Status 0 = nätverksfel.
function newsletter_mailchimp_request(string $method, string $path, ?array $body = null): array
{
  $cfg = newsletter_mailchimp_config();
  if (!$cfg['enabled'] || !function_exists('curl_init')) {
    return [0, ['detail' => 'Mailchimp är inte konfigurerat.']];
  }
  $ch = curl_init($cfg['base'] . $path);
  if ($ch === false) {
    return [0, ['detail' => 'curl kunde inte starta.']];
  }
  $options = [
    CURLOPT_CUSTOMREQUEST => $method,
    CURLOPT_USERPWD => 'ola-site:' . $cfg['apiKey'],
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CONNECTTIMEOUT => 5,
    CURLOPT_TIMEOUT => 12,
    CURLOPT_HTTPHEADER => ['Content-Type: application/json']
  ];
  if ($body !== null) {
    $options[CURLOPT_POSTFIELDS] = json_encode($body, JSON_UNESCAPED_UNICODE);
  }
  curl_setopt_array($ch, $options);
  $raw = curl_exec($ch);
  $status = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
  $decoded = is_string($raw) ? json_decode($raw, true) : null;
  return [$status, is_array($decoded) ? $decoded : []];
}

function newsletter_mailchimp_member_path(string $email): string
{
  $cfg = newsletter_mailchimp_config();
  return '/lists/' . rawurlencode($cfg['listId']) . '/members/' . md5(strtolower(trim($email)));
}

// För över en rad till Mailchimp enligt sajtens status och sparar resultatet på raden.
// Bekräftad = subscribed (redan dubbelt bekräftad på sajten, så inget nytt mejl från Mailchimp).
// Avregistrerad = unsubscribed om personen finns där. Väntande skickas inte.
function newsletter_mailchimp_sync(PDO $pdo, array $row): bool
{
  if (!newsletter_mailchimp_config()['enabled']) {
    return false;
  }
  $email = (string) $row['email'];
  $status = (string) $row['status'];
  if ($status === 'confirmed') {
    [$code, $response] = newsletter_mailchimp_request('PUT', newsletter_mailchimp_member_path($email), [
      'email_address' => $email,
      'status_if_new' => 'subscribed',
      'status' => 'subscribed',
      'language' => (string) $row['language'] === 'en' ? 'en' : 'sv',
      'merge_fields' => ['LANG' => (string) $row['language'], 'SOURCE' => (string) $row['source']]
    ]);
  } elseif ($status === 'unsubscribed') {
    [$code, $response] = newsletter_mailchimp_request('PATCH', newsletter_mailchimp_member_path($email), ['status' => 'unsubscribed']);
    if ($code === 404) {
      $code = 200;
    }
  } else {
    return false;
  }
  $ok = $code >= 200 && $code < 300;
  $error = $ok ? null : substr(trim((string) ($response['title'] ?? 'Fel') . ': ' . (string) ($response['detail'] ?? "HTTP {$code}")), 0, 250);
  $pdo->prepare('UPDATE newsletter_subscribers SET mailchimp_synced_at = ' . ($ok ? 'UTC_TIMESTAMP()' : 'mailchimp_synced_at') . ', mailchimp_error = :error WHERE id = :id')
    ->execute([':error' => $error, ':id' => (int) $row['id']]);
  return $ok;
}

function newsletter_mailchimp_sync_email(PDO $pdo, string $email): bool
{
  $row = newsletter_find_by_email($pdo, strtolower(trim($email)));
  if (!$row) {
    return false;
  }
  try {
    return newsletter_mailchimp_sync($pdo, $row);
  } catch (Throwable $error) {
    return false;
  }
}

// Alla bekräftade och avregistrerade, t.ex. första gången eller efter ett avbrott.
function newsletter_mailchimp_sync_all(PDO $pdo): array
{
  newsletter_ensure_schema($pdo);
  $rows = $pdo->query("SELECT * FROM newsletter_subscribers WHERE status IN ('confirmed', 'unsubscribed') ORDER BY id")->fetchAll() ?: [];
  $result = ['ok' => 0, 'failed' => 0, 'errors' => []];
  foreach ($rows as $row) {
    if (newsletter_mailchimp_sync($pdo, $row)) {
      $result['ok']++;
    } else {
      $result['failed']++;
      $result['errors'][] = $row['email'];
    }
  }
  return $result;
}

function newsletter_url(string $path, string $lang): string
{
  $url = seo_base_url() . $path;
  return $lang === 'en' ? $url . (str_contains($url, '?') ? '&' : '?') . 'lang=en' : $url;
}

function newsletter_find_by_token(PDO $pdo, string $token): ?array
{
  if (preg_match('/^[a-f0-9]{40}$/', $token) !== 1) {
    return null;
  }
  $stmt = $pdo->prepare('SELECT * FROM newsletter_subscribers WHERE token = :token LIMIT 1');
  $stmt->execute([':token' => $token]);
  $row = $stmt->fetch();
  return is_array($row) ? $row : null;
}

function newsletter_find_by_email(PDO $pdo, string $email): ?array
{
  $stmt = $pdo->prepare('SELECT * FROM newsletter_subscribers WHERE email = :email LIMIT 1');
  $stmt->execute([':email' => $email]);
  $row = $stmt->fetch();
  return is_array($row) ? $row : null;
}

// Returnerar 'confirmed' (redan med eller bekräftad direkt), 'pending' (bekräftelsemejl skickat)
// eller 'throttled' (bekräftelse skickad nyss, inget nytt mejl).
function newsletter_subscribe(PDO $pdo, string $email, string $lang, string $source, bool $confirmed = false): string
{
  newsletter_ensure_schema($pdo);
  $email = strtolower(trim($email));
  $lang = $lang === 'en' ? 'en' : 'sv';
  $source = function_exists('mb_substr') ? (string) mb_substr(trim($source), 0, 60) : substr(trim($source), 0, 60);
  $row = newsletter_find_by_email($pdo, $email);
  $ipHash = api_security_hash('ip:' . api_security_client_ip());

  if ($row && $row['status'] === 'confirmed') {
    return 'confirmed';
  }
  if (!$row) {
    $pdo->prepare('INSERT INTO newsletter_subscribers (email, language, source, status, token, ip_hash) VALUES (:email, :lang, :source, \'pending\', :token, :ip)')
      ->execute([':email' => $email, ':lang' => $lang, ':source' => $source, ':token' => bin2hex(random_bytes(20)), ':ip' => $ipHash]);
    $row = newsletter_find_by_email($pdo, $email);
  } else {
    // Avregistrerad eller obekräftad som anmäler sig igen.
    $pdo->prepare('UPDATE newsletter_subscribers SET status = \'pending\', language = :lang, source = :source, unsubscribed_at = NULL WHERE id = :id')
      ->execute([':lang' => $lang, ':source' => $source, ':id' => (int) $row['id']]);
  }
  if (!$row) {
    throw new RuntimeException('Anmälan kunde inte sparas.');
  }
  if ($confirmed) {
    $pdo->prepare('UPDATE newsletter_subscribers SET status = \'confirmed\', confirmed_at = UTC_TIMESTAMP() WHERE id = :id')->execute([':id' => (int) $row['id']]);
    newsletter_mailchimp_sync_email($pdo, $email);
    newsletter_send_welcome($pdo, $email);
    return 'confirmed';
  }
  // Högst ett bekräftelsemejl per adress och 10 minuter.
  $sentAt = $row['confirm_sent_at'] ? strtotime((string) $row['confirm_sent_at'] . ' UTC') : 0;
  if ($sentAt > 0 && time() - $sentAt < 600) {
    return 'throttled';
  }
  $confirmUrl = newsletter_url('/ateljebrev/bekrafta/' . $row['token'], $lang);
  $subject = $lang === 'en' ? 'Confirm the studio letter – Ola Gustafsson' : 'Bekräfta ateljébrevet – Ola Gustafsson';
  $body = $lang === 'en'
    ? "Hi,\n\nSomeone (hopefully you) signed up for my studio letter with this address. Confirm here:\n{$confirmUrl}\n\nIf it was not you, ignore this email and nothing more will be sent.\n\nOla Gustafsson\nola@olagustafsson.com"
    : "Hej,\n\nNågon (förhoppningsvis du) anmälde den här adressen till mitt ateljébrev. Bekräfta här:\n{$confirmUrl}\n\nVar det inte du kan du strunta i mejlet, så skickas inget mer.\n\nOla Gustafsson\nola@olagustafsson.com";
  api_security_send_mail($email, $subject, $body, api_security_contact_recipient());
  $pdo->prepare('UPDATE newsletter_subscribers SET confirm_sent_at = UTC_TIMESTAMP() WHERE id = :id')->execute([':id' => (int) $row['id']]);
  return 'pending';
}

function newsletter_confirm(PDO $pdo, array $row): void
{
  if ($row['status'] !== 'confirmed') {
    $pdo->prepare('UPDATE newsletter_subscribers SET status = \'confirmed\', confirmed_at = UTC_TIMESTAMP(), unsubscribed_at = NULL WHERE id = :id')
      ->execute([':id' => (int) $row['id']]);
    newsletter_mailchimp_sync_email($pdo, (string) $row['email']);
    newsletter_send_welcome($pdo, (string) $row['email']);
    api_security_send_mail(api_security_contact_recipient(), 'Ny läsare av ateljébrevet', "{$row['email']} bekräftade ateljébrevet (källa: " . ($row['source'] !== '' ? $row['source'] : 'okänd') . ").\n");
  }
}

// $fromMailchimp: avregistreringen kom från Mailchimp (webhook), skicka den inte tillbaka.
function newsletter_unsubscribe(PDO $pdo, array $row, bool $fromMailchimp = false): void
{
  $pdo->prepare('UPDATE newsletter_subscribers SET status = \'unsubscribed\', unsubscribed_at = UTC_TIMESTAMP()' . ($fromMailchimp ? ', mailchimp_synced_at = UTC_TIMESTAMP(), mailchimp_error = NULL' : '') . ' WHERE id = :id')
    ->execute([':id' => (int) $row['id']]);
  if (!$fromMailchimp) {
    newsletter_mailchimp_sync_email($pdo, (string) $row['email']);
  }
}

// Avregistrering utan token (t.ex. utskick med dold kopia): mejlar en avregistreringslänk.
function newsletter_send_unsubscribe_link(PDO $pdo, string $email, string $lang): void
{
  newsletter_ensure_schema($pdo);
  $row = newsletter_find_by_email($pdo, strtolower(trim($email)));
  if (!$row || $row['status'] === 'unsubscribed') {
    return;
  }
  $url = newsletter_url('/ateljebrev/avsluta/' . $row['token'], $lang);
  $subject = $lang === 'en' ? 'Unsubscribe from the studio letter' : 'Avsluta ateljébrevet';
  $body = $lang === 'en'
    ? "Hi,\n\nOpen this link to stop receiving my studio letter:\n{$url}\n\nOla Gustafsson"
    : "Hej,\n\nÖppna länken för att sluta få mitt ateljébrev:\n{$url}\n\nOla Gustafsson";
  api_security_send_mail((string) $row['email'], $subject, $body, api_security_contact_recipient());
}

function newsletter_list(PDO $pdo): array
{
  newsletter_ensure_schema($pdo);
  $rows = $pdo->query('SELECT id, email, language, source, status, confirmed_at, unsubscribed_at, created_at, token, mailchimp_synced_at, mailchimp_error FROM newsletter_subscribers ORDER BY created_at DESC')->fetchAll();
  return is_array($rows) ? $rows : [];
}
