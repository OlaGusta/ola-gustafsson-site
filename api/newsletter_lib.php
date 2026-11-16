<?php
declare(strict_types=1);

// Ateljébrevet: e-postlista med dubbel bekräftelse. Anmälan från sajten blir
// 'pending' tills mottagaren klickat på länken i bekräftelsemejlet. Kryss i kassan
// räknas som bekräftat (adressen är redan använd för beställningen).
// Utskick görs utanför sajten; Studio → Ateljébrev listar och exporterar adresserna.

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
  UNIQUE KEY newsletter_email_unique (email),
  UNIQUE KEY newsletter_token_unique (token),
  INDEX newsletter_status_idx (status, created_at)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
SQL
  );
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
    api_security_send_mail(api_security_contact_recipient(), 'Ny läsare av ateljébrevet', "{$row['email']} bekräftade ateljébrevet (källa: " . ($row['source'] !== '' ? $row['source'] : 'okänd') . ").\n");
  }
}

function newsletter_unsubscribe(PDO $pdo, array $row): void
{
  $pdo->prepare('UPDATE newsletter_subscribers SET status = \'unsubscribed\', unsubscribed_at = UTC_TIMESTAMP() WHERE id = :id')
    ->execute([':id' => (int) $row['id']]);
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
  $rows = $pdo->query('SELECT id, email, language, source, status, confirmed_at, unsubscribed_at, created_at, token FROM newsletter_subscribers ORDER BY created_at DESC')->fetchAll();
  return is_array($rows) ? $rows : [];
}
