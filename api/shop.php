<?php
declare(strict_types=1);

// Kassan: tar emot en beställning från /kassa, kontrollerar priserna mot katalogen,
// sparar ordern, reserverar original och mejlar kund och Ola. Betalningen sker
// med Swish eller bankgiro utanför sajten; Ola markerar betald i Studio.

require __DIR__ . '/shop_lib.php';

api_require_method('POST');

$pdo = api_get_pdo();
api_ensure_schema($pdo);
shop_ensure_schema($pdo);

$body = api_decode_request_json();
$lang = isset($body['language']) && $body['language'] === 'en' ? 'en' : 'sv';
$t = static fn (string $sv, string $en): string => $lang === 'en' ? $en : $sv;

$cfg = api_security_config();
$ipKey = 'ip:' . api_security_client_ip();
api_security_require_not_rate_limited($pdo, 'shop', $ipKey, $t('För många försök från samma anslutning. Vänta en stund.', 'Too many attempts from this connection. Please wait a moment.'));
$registerAttempt = static function () use ($pdo, $ipKey): void {
  api_security_rate_limit_register_hit($pdo, 'shop', $ipKey, 6, 600, 1800);
};

$honeypot = isset($body['website']) && is_string($body['website']) ? trim($body['website']) : '';
$elapsedMs = isset($body['elapsedMs']) ? (int) $body['elapsedMs'] : 0;
if ($honeypot !== '' || $elapsedMs < 2500) {
  $registerAttempt();
  api_respond_json(422, ['ok' => false, 'error' => 'rejected', 'message' => $t('Beställningen kunde inte skickas. Försök igen.', 'The order could not be sent. Please try again.')]);
}

if (api_security_contact_form_enabled()) {
  $turnstileToken = isset($body['turnstileToken']) && is_string($body['turnstileToken']) ? trim($body['turnstileToken']) : '';
  if (!api_security_verify_turnstile($turnstileToken)) {
    $registerAttempt();
    api_respond_json(422, ['ok' => false, 'error' => 'captcha', 'message' => $t('Verifieringen misslyckades. Ladda om sidan och försök igen.', 'Verification failed. Reload the page and try again.')]);
  }
}

$clean = static function ($value, int $max): string {
  $value = is_string($value) ? trim(preg_replace('/\s+/u', ' ', $value) ?? '') : '';
  return function_exists('mb_substr') ? (string) mb_substr($value, 0, $max) : substr($value, 0, $max);
};
$customerRaw = isset($body['customer']) && is_array($body['customer']) ? $body['customer'] : [];
$customer = [
  'name' => $clean($customerRaw['name'] ?? '', 120),
  'email' => api_security_normalize_email(is_string($customerRaw['email'] ?? null) ? $customerRaw['email'] : ''),
  'phone' => $clean($customerRaw['phone'] ?? '', 40),
  'address' => $clean($customerRaw['address'] ?? '', 190),
  'postal' => $clean($customerRaw['postal'] ?? '', 16),
  'city' => $clean($customerRaw['city'] ?? '', 80),
  'note' => is_string($customerRaw['note'] ?? null) ? (function_exists('mb_substr') ? (string) mb_substr(trim($customerRaw['note']), 0, 2000) : substr(trim($customerRaw['note']), 0, 2000)) : ''
];

$missing = [];
foreach (['name', 'address', 'postal', 'city'] as $field) {
  if ($customer[$field] === '') {
    $missing[] = $field;
  }
}
if (!filter_var($customer['email'], FILTER_VALIDATE_EMAIL)) {
  $missing[] = 'email';
}
if (empty($body['acceptTerms'])) {
  $missing[] = 'terms';
}
if ($missing !== []) {
  api_respond_json(422, ['ok' => false, 'error' => 'missing_fields', 'fields' => $missing, 'message' => $t('Fyll i alla uppgifter och godkänn köpvillkoren.', 'Fill in all details and accept the terms.')]);
}

$cartItems = isset($body['items']) && is_array($body['items']) ? array_slice($body['items'], 0, 60) : [];
try {
  $lines = shop_resolve_items($pdo, $cartItems, $lang);
} catch (InvalidArgumentException $error) {
  api_respond_json(422, ['ok' => false, 'error' => 'invalid_cart', 'message' => $error->getMessage()]);
}

try {
  $order = shop_create_order($pdo, $lines, $customer, $lang);
} catch (Throwable $error) {
  api_respond_json(500, ['ok' => false, 'error' => 'order_failed', 'message' => $t('Beställningen kunde inte sparas. Försök igen om en stund.', 'The order could not be saved. Please try again shortly.')]);
}
if ($order === []) {
  api_respond_json(500, ['ok' => false, 'error' => 'order_failed', 'message' => $t('Beställningen kunde inte sparas.', 'The order could not be saved.')]);
}

$mailOk = shop_send_order_mails($order, $lang);
$pdo->prepare('UPDATE shop_orders SET mail_delivered = :ok WHERE id = :id')->execute([':ok' => $mailOk ? 1 : 0, ':id' => (int) $order['id']]);
$registerAttempt();

api_respond_json(200, [
  'ok' => true,
  'orderNo' => $order['order_no'],
  'url' => shop_order_url($order, $lang),
  'path' => '/order/' . $order['token'] . ($lang === 'en' ? '?lang=en' : ''),
  'mailDelivered' => $mailOk
]);
