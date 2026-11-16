<?php
declare(strict_types=1);

// Kassan kontrollerar en presentkortskod: POST {code, language} → saldo och giltighet.
// Själva avdraget görs av api/shop.php när ordern skapas.

require __DIR__ . '/shop_lib.php';

api_require_method('POST');
$pdo = api_get_pdo();
api_ensure_schema($pdo);
shop_ensure_schema($pdo);

$body = api_decode_request_json();
$lang = ($body['language'] ?? '') === 'en' ? 'en' : 'sv';
$t = static fn (string $sv, string $en): string => $lang === 'en' ? $en : $sv;

$ipKey = 'ip:' . api_security_client_ip();
api_security_require_not_rate_limited($pdo, 'giftcard', $ipKey, $t('För många försök. Vänta en stund.', 'Too many attempts. Please wait a moment.'));

$code = isset($body['code']) && is_string($body['code']) ? $body['code'] : '';
$card = shop_giftcard_find($pdo, $code);
if (!$card) {
  api_security_rate_limit_register_hit($pdo, 'giftcard', $ipKey, 10, 900, 1800);
  api_respond_json(404, ['ok' => false, 'error' => 'not_found', 'message' => $t('Koden finns inte. Kontrollera stavningen.', 'The code does not exist. Check the spelling.')]);
}
if ($card['expired']) {
  api_respond_json(422, ['ok' => false, 'error' => 'expired', 'message' => sprintf($t('Presentkortet gick ut %s.', 'The gift card expired on %s.'), $card['expires_at'])]);
}
if ($card['balance'] <= 0) {
  api_respond_json(422, ['ok' => false, 'error' => 'empty', 'message' => $t('Presentkortet är redan använt.', 'The gift card has already been used.')]);
}
api_respond_json(200, ['ok' => true, 'code' => $card['code'], 'balance' => (int) $card['balance'], 'expires' => $card['expires_at']]);
