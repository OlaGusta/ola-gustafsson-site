<?php
declare(strict_types=1);

// Ateljébrevet.
// Publikt: POST {action: subscribe|unsubscribe_request, email, language, source, website, elapsedMs}.
// Studio (inloggad): GET listar (CSV byggs i Studio), POST {action: delete, id} och {action: sync_all}.

require __DIR__ . '/newsletter_lib.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$pdo = api_get_pdo();
api_ensure_schema($pdo);
newsletter_ensure_schema($pdo);

if ($method === 'GET') {
  api_require_authenticated_user();
  $rows = newsletter_list($pdo);
  $list = array_map(static function (array $row): array {
    $row['unsubscribe_url'] = newsletter_url('/ateljebrev/avsluta/' . $row['token'], (string) $row['language']);
    unset($row['token']);
    return $row;
  }, $rows);
  api_respond_json(200, ['ok' => true, 'subscribers' => $list, 'mailchimp' => newsletter_mailchimp_config()['enabled']]);
}

api_require_method('POST');
$body = api_decode_request_json();
$action = isset($body['action']) && is_string($body['action']) ? $body['action'] : 'subscribe';

if ($action === 'delete') {
  api_require_authenticated_user();
  $id = isset($body['id']) ? (int) $body['id'] : 0;
  $stmt = $pdo->prepare('SELECT email FROM newsletter_subscribers WHERE id = :id');
  $stmt->execute([':id' => $id]);
  $email = $stmt->fetchColumn();
  $pdo->prepare('DELETE FROM newsletter_subscribers WHERE id = :id')->execute([':id' => $id]);
  if (is_string($email) && newsletter_mailchimp_config()['enabled']) {
    // Arkiveras i Mailchimp (finns kvar i historiken men får inga brev).
    newsletter_mailchimp_request('DELETE', newsletter_mailchimp_member_path($email));
  }
  api_respond_json(200, ['ok' => true]);
}

if ($action === 'sync_all') {
  api_require_authenticated_user();
  if (!newsletter_mailchimp_config()['enabled']) {
    api_respond_json(422, ['ok' => false, 'error' => 'not_configured', 'message' => 'Mailchimp är inte konfigurerat på servern.']);
  }
  $result = newsletter_mailchimp_sync_all($pdo);
  api_respond_json(200, ['ok' => true, 'synced' => $result['ok'], 'failed' => $result['failed'], 'errors' => $result['errors']]);
}

$lang = ($body['language'] ?? '') === 'en' ? 'en' : 'sv';
$t = static fn (string $sv, string $en): string => $lang === 'en' ? $en : $sv;
$ipKey = 'ip:' . api_security_client_ip();
api_security_require_not_rate_limited($pdo, 'newsletter', $ipKey, $t('För många försök. Vänta en stund.', 'Too many attempts. Please wait a moment.'));
api_security_rate_limit_register_hit($pdo, 'newsletter', $ipKey, 8, 600, 1800);

$honeypot = isset($body['website']) && is_string($body['website']) ? trim($body['website']) : '';
$elapsedMs = isset($body['elapsedMs']) ? (int) $body['elapsedMs'] : 0;
if ($honeypot !== '' || $elapsedMs < 1500) {
  api_respond_json(422, ['ok' => false, 'error' => 'rejected', 'message' => $t('Anmälan kunde inte skickas. Försök igen.', 'The sign-up could not be sent. Please try again.')]);
}
$email = api_security_normalize_email(is_string($body['email'] ?? null) ? $body['email'] : '');
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  api_respond_json(422, ['ok' => false, 'error' => 'invalid_email', 'message' => $t('Skriv en giltig e-postadress.', 'Enter a valid email address.')]);
}

if ($action === 'unsubscribe_request') {
  newsletter_send_unsubscribe_link($pdo, $email, $lang);
  // Samma svar oavsett om adressen finns, så att listan inte går att fiska i.
  api_respond_json(200, ['ok' => true, 'message' => $t('Om adressen finns på listan har en avregistreringslänk skickats dit.', 'If the address is on the list, an unsubscribe link has been sent to it.')]);
}

$source = isset($body['source']) && is_string($body['source']) ? $body['source'] : '';
try {
  $status = newsletter_subscribe($pdo, $email, $lang, $source);
} catch (Throwable $error) {
  api_respond_json(500, ['ok' => false, 'error' => 'failed', 'message' => $t('Anmälan kunde inte sparas. Försök igen senare.', 'The sign-up could not be saved. Please try again later.')]);
}
$message = $status === 'confirmed'
  ? $t('Du får redan ateljébrevet.', 'You already get the studio letter.')
  : $t('Tack! Kolla din e-post och klicka på länken för att bekräfta.', 'Thank you! Check your email and click the link to confirm.');
api_respond_json(200, ['ok' => true, 'status' => $status, 'message' => $message]);
