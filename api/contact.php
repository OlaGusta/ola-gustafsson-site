<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

api_require_method('POST');

$pdo = api_get_pdo();
api_ensure_schema($pdo);

$body = api_decode_request_json();

$name = isset($body['name']) && is_string($body['name']) ? trim($body['name']) : '';
$email = isset($body['email']) && is_string($body['email']) ? api_security_normalize_email($body['email']) : '';
$message = isset($body['message']) && is_string($body['message']) ? trim($body['message']) : '';
$honeypot = isset($body['website']) && is_string($body['website']) ? trim($body['website']) : '';
$elapsedMs = isset($body['elapsedMs']) ? (int) $body['elapsedMs'] : 0;
$turnstileToken = isset($body['turnstileToken']) && is_string($body['turnstileToken']) ? trim($body['turnstileToken']) : '';

$cfg = api_security_config();
$maxRequests = (int) ($cfg['contactMaxRequests'] ?? 3);
$windowSeconds = (int) ($cfg['contactWindowSeconds'] ?? 600);
$blockSeconds = (int) ($cfg['contactBlockSeconds'] ?? 1800);

$ipKey = 'ip:' . api_security_client_ip();
api_security_require_not_rate_limited($pdo, 'contact', $ipKey, 'För många meddelanden från samma anslutning. Vänta en stund.');

if ($honeypot !== '') {
  api_security_rate_limit_register_failure($pdo, 'contact', $ipKey, $maxRequests, $windowSeconds, $blockSeconds);
  api_respond_json(400, [
    'ok' => false,
    'error' => 'spam_detected',
    'message' => 'Meddelandet kunde inte skickas.'
  ]);
}

if ($elapsedMs > 0 && $elapsedMs < 3000) {
  api_security_rate_limit_register_failure($pdo, 'contact', $ipKey, $maxRequests, $windowSeconds, $blockSeconds);
  api_respond_json(429, [
    'ok' => false,
    'error' => 'too_fast',
    'message' => 'Skicka inte formuläret så snabbt. Försök igen om en stund.'
  ]);
}

if ($name === '' || api_security_strlen($name) < 2 || api_security_strlen($name) > 120) {
  api_respond_json(422, [
    'ok' => false,
    'error' => 'invalid_name',
    'message' => 'Ange ett namn mellan 2 och 120 tecken.'
  ]);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  api_respond_json(422, [
    'ok' => false,
    'error' => 'invalid_email',
    'message' => 'Ange en giltig e-postadress.'
  ]);
}

if ($message === '' || api_security_strlen($message) < 10 || api_security_strlen($message) > 5000) {
  api_respond_json(422, [
    'ok' => false,
    'error' => 'invalid_message',
    'message' => 'Meddelandet måste vara mellan 10 och 5000 tecken.'
  ]);
}

if (!api_security_verify_turnstile($turnstileToken)) {
  api_security_rate_limit_register_failure($pdo, 'contact', $ipKey, $maxRequests, $windowSeconds, $blockSeconds);
  api_respond_json(422, [
    'ok' => false,
    'error' => 'captcha_failed',
    'message' => 'Captcha-verifiering misslyckades. Försök igen.'
  ]);
}

$recipient = api_security_contact_recipient();
if ($recipient === '') {
  api_respond_json(503, [
    'ok' => false,
    'error' => 'contact_unavailable',
    'message' => 'Kontakt är tillfälligt otillgänglig. Försök igen senare.'
  ]);
}

$mailSubject = 'Nytt meddelande från kontaktformuläret';
$mailBody = "Namn: {$name}\n";
$mailBody .= "E-post: {$email}\n\n";
$mailBody .= "Meddelande:\n{$message}\n\n";
$mailBody .= 'Tid (UTC): ' . api_security_now_sql() . "\n";
$mailBody .= 'IP-hash: ' . api_security_hash('ip:' . api_security_client_ip()) . "\n";

$mailDelivered = api_security_send_mail($recipient, $mailSubject, $mailBody);

api_security_save_contact_message($pdo, $name, $email, $message, $mailDelivered);
api_security_rate_limit_register_failure($pdo, 'contact', $ipKey, $maxRequests, $windowSeconds, $blockSeconds);

api_respond_json(200, [
  'ok' => true,
  'message' => 'Tack, ditt meddelande är skickat.'
]);
