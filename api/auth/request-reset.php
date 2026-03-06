<?php
declare(strict_types=1);

require dirname(__DIR__) . '/bootstrap.php';

api_require_method('POST');

$pdo = api_get_pdo();
api_ensure_schema($pdo);

$body = api_decode_request_json();
$email = isset($body['email']) && is_string($body['email']) ? api_security_normalize_email($body['email']) : '';

$cfg = api_security_config();
$maxRequests = (int) ($cfg['resetMaxRequests'] ?? 3);
$windowSeconds = (int) ($cfg['resetWindowSeconds'] ?? 900);
$blockSeconds = (int) ($cfg['resetBlockSeconds'] ?? 1800);
$tokenTtlSeconds = (int) ($cfg['resetTokenTtlSeconds'] ?? 1800);

$ipKey = 'ip:' . api_security_client_ip();
$emailKey = 'email:' . ($email !== '' ? $email : 'unknown');

api_security_require_not_rate_limited($pdo, 'reset', $ipKey, 'För många återställningsförsök från denna anslutning.');
api_security_require_not_rate_limited($pdo, 'reset', $emailKey, 'För många återställningsförsök för detta konto.');

$admin = api_security_get_admin($pdo);
if ($admin) {
  $adminEmail = api_security_normalize_email((string) ($admin['email'] ?? ''));
  if ($email !== '' && hash_equals($adminEmail, $email)) {
    $token = api_security_random_hex(32);
    $tokenHash = api_security_hash('reset:' . $token);
    $ipHash = api_security_hash('ip:' . api_security_client_ip());

    try {
      api_security_store_reset_token($pdo, (int) $admin['id'], $tokenHash, $ipHash, $tokenTtlSeconds);
      $link = api_security_reset_url($token);
      $subject = 'Återställ Studio-lösenord';
      $bodyText = "Du (eller någon annan) begärde återställning av Studio-lösenordet.\n\n";
      $bodyText .= "Länk (giltig i cirka " . max(1, (int) floor($tokenTtlSeconds / 60)) . " minuter):\n";
      $bodyText .= $link . "\n\n";
      $bodyText .= "Om du inte begärde detta kan du ignorera mejlet.";
      api_security_send_mail($adminEmail, $subject, $bodyText);
    } catch (Throwable $error) {
      // Intentionally swallow errors to avoid account enumeration and side-channel leaks.
    }
  }
}

api_security_rate_limit_register_failure($pdo, 'reset', $ipKey, $maxRequests, $windowSeconds, $blockSeconds);
api_security_rate_limit_register_failure($pdo, 'reset', $emailKey, $maxRequests, $windowSeconds, $blockSeconds);

api_respond_json(200, [
  'ok' => true,
  'message' => 'Om e-postadressen finns skickas en återställningslänk.'
]);
