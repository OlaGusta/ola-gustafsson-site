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
$inquiry = isset($body['inquiry']) && is_array($body['inquiry']) ? $body['inquiry'] : [];
$inquirySlug = isset($inquiry['slug']) && is_string($inquiry['slug']) ? trim($inquiry['slug']) : '';
$inquiryTitle = isset($inquiry['title']) && is_string($inquiry['title']) ? trim($inquiry['title']) : '';
$inquiryStatus = isset($inquiry['availability']) && is_string($inquiry['availability']) ? trim($inquiry['availability']) : '';
$inquiryPriceLabel = isset($inquiry['priceLabel']) && is_string($inquiry['priceLabel']) ? trim($inquiry['priceLabel']) : '';
$inquirySourceUrl = isset($inquiry['sourceUrl']) && is_string($inquiry['sourceUrl']) ? trim($inquiry['sourceUrl']) : '';
$inquiryLanguage = isset($inquiry['language']) && is_string($inquiry['language']) ? trim($inquiry['language']) : '';
$leadKind = ($inquirySlug !== '' || $inquiryTitle !== '') ? 'artwork' : 'general';

$cfg = api_security_config();
$maxRequests = (int) ($cfg['contactMaxRequests'] ?? 3);
$windowSeconds = (int) ($cfg['contactWindowSeconds'] ?? 600);
$blockSeconds = (int) ($cfg['contactBlockSeconds'] ?? 1800);

$ipKey = 'ip:' . api_security_client_ip();
$emailKey = '';
$registerAttempt = static function () use ($pdo, $ipKey, &$emailKey, $maxRequests, $windowSeconds, $blockSeconds): void {
  api_security_rate_limit_register_hit($pdo, 'contact', $ipKey, $maxRequests, $windowSeconds, $blockSeconds);
  if ($emailKey !== '') {
    api_security_rate_limit_register_hit($pdo, 'contact', $emailKey, $maxRequests, $windowSeconds, $blockSeconds);
  }
};
$truncate = static function (string $value, int $maxLength): string {
  if ($maxLength <= 0) {
    return '';
  }
  if (function_exists('mb_substr')) {
    return (string) mb_substr($value, 0, $maxLength);
  }
  return substr($value, 0, $maxLength);
};
api_security_require_not_rate_limited($pdo, 'contact', $ipKey, 'För många meddelanden från samma anslutning. Vänta en stund.');

if (!api_security_contact_form_enabled()) {
  $registerAttempt();
  api_respond_json(503, [
    'ok' => false,
    'error' => 'contact_unavailable',
    'message' => 'Kontaktformuläret är tillfälligt avstängt tills säker verifiering är aktiverad.'
  ]);
}

if ($honeypot !== '') {
  $registerAttempt();
  api_respond_json(400, [
    'ok' => false,
    'error' => 'spam_detected',
    'message' => 'Meddelandet kunde inte skickas.'
  ]);
}

if ($elapsedMs > 0 && $elapsedMs < 3000) {
  $registerAttempt();
  api_respond_json(429, [
    'ok' => false,
    'error' => 'too_fast',
    'message' => 'Skicka inte formuläret så snabbt. Försök igen om en stund.'
  ]);
}

if ($name === '' || api_security_strlen($name) < 2 || api_security_strlen($name) > 120) {
  $registerAttempt();
  api_respond_json(422, [
    'ok' => false,
    'error' => 'invalid_name',
    'message' => 'Ange ett namn mellan 2 och 120 tecken.'
  ]);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  $registerAttempt();
  api_respond_json(422, [
    'ok' => false,
    'error' => 'invalid_email',
    'message' => 'Ange en giltig e-postadress.'
  ]);
}
$emailKey = 'email:' . $email;
api_security_require_not_rate_limited($pdo, 'contact', $emailKey, 'Den här e-postadressen används för ofta just nu. Vänta en stund.');

if ($message === '' || api_security_strlen($message) < 10 || api_security_strlen($message) > 5000) {
  $registerAttempt();
  api_respond_json(422, [
    'ok' => false,
    'error' => 'invalid_message',
    'message' => 'Meddelandet måste vara mellan 10 och 5000 tecken.'
  ]);
}

if ($leadKind === 'artwork') {
  $inquirySlug = preg_replace('/[^a-z0-9-]+/i', '-', strtolower($inquirySlug)) ?? '';
  $inquirySlug = trim($inquirySlug, '-');
  $inquiryTitle = $truncate($inquiryTitle, 255);
  $inquiryStatus = in_array($inquiryStatus, ['available', 'reserved', 'sold', 'nfs'], true) ? $inquiryStatus : '';
  $inquiryPriceLabel = $truncate($inquiryPriceLabel, 255);
  $inquirySourceUrl = api_security_normalize_same_origin_url($inquirySourceUrl);
  $inquiryLanguage = in_array($inquiryLanguage, ['sv', 'en'], true) ? $inquiryLanguage : '';
} else {
  $inquirySlug = '';
  $inquiryTitle = '';
  $inquiryStatus = '';
  $inquiryPriceLabel = '';
  $inquirySourceUrl = '';
  $inquiryLanguage = '';
}

if (!api_security_verify_turnstile($turnstileToken)) {
  $registerAttempt();
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

$mailSubject = $leadKind === 'artwork' && $inquiryTitle !== ''
  ? 'Ny verksförfrågan: ' . $inquiryTitle
  : 'Nytt meddelande från kontaktformuläret';
$mailBody = "Namn: {$name}\n";
$mailBody .= "E-post: {$email}\n\n";
$mailBody .= "Typ: " . ($leadKind === 'artwork' ? 'Verksförfrågan' : 'Allmän kontakt') . "\n";
if ($leadKind === 'artwork') {
  if ($inquiryTitle !== '') {
    $mailBody .= "Verk: {$inquiryTitle}\n";
  }
  if ($inquirySlug !== '') {
    $mailBody .= "Slug: {$inquirySlug}\n";
  }
  if ($inquiryStatus !== '') {
    $mailBody .= "Status: {$inquiryStatus}\n";
  }
  if ($inquiryPriceLabel !== '') {
    $mailBody .= "Prisetikett: {$inquiryPriceLabel}\n";
  }
  if ($inquirySourceUrl !== '') {
    $mailBody .= "Källa: {$inquirySourceUrl}\n";
  }
  if ($inquiryLanguage !== '') {
    $mailBody .= "Språk: {$inquiryLanguage}\n";
  }
  $mailBody .= "\n";
}
$mailBody .= "Meddelande:\n{$message}\n\n";
$mailBody .= 'Tid (UTC): ' . api_security_now_sql() . "\n";
$mailBody .= 'IP-hash: ' . api_security_hash('ip:' . api_security_client_ip()) . "\n";

$mailDelivered = api_security_send_mail($recipient, $mailSubject, $mailBody);

api_security_save_contact_message($pdo, $name, $email, $message, $mailDelivered, [
  'leadKind' => $leadKind,
  'inquirySlug' => $inquirySlug,
  'inquiryTitle' => $inquiryTitle,
  'inquiryStatus' => $inquiryStatus,
  'inquiryPriceLabel' => $inquiryPriceLabel,
  'inquirySourceUrl' => $inquirySourceUrl,
  'inquiryLanguage' => $inquiryLanguage,
  'followUpStatus' => 'new'
]);
$registerAttempt();

api_respond_json(200, [
  'ok' => true,
  'message' => 'Tack, ditt meddelande är skickat.'
]);
