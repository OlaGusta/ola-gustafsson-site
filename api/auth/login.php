<?php
declare(strict_types=1);

require dirname(__DIR__) . '/bootstrap.php';

api_require_method('POST');

$pdo = api_get_pdo();
api_ensure_schema($pdo);
api_security_start_session();

$admin = api_security_get_admin($pdo);
if (!$admin) {
  api_respond_json(409, [
    'ok' => false,
    'error' => 'admin_not_initialized',
    'message' => 'Studio-admin är inte initierad ännu.'
  ]);
}

$body = api_decode_request_json();
$email = isset($body['email']) && is_string($body['email']) ? api_security_normalize_email($body['email']) : '';
$password = isset($body['password']) && is_string($body['password']) ? $body['password'] : '';
$totpCode = isset($body['totpCode']) && is_string($body['totpCode']) ? $body['totpCode'] : '';
$recoveryCode = isset($body['recoveryCode']) && is_string($body['recoveryCode']) ? $body['recoveryCode'] : '';

$ipKey = 'ip:' . api_security_client_ip();
$emailKey = 'email:' . ($email !== '' ? $email : 'unknown');

$cfg = api_security_config();
$maxAttempts = (int) ($cfg['loginMaxAttempts'] ?? 5);
$windowSeconds = (int) ($cfg['loginWindowSeconds'] ?? 900);
$blockSeconds = (int) ($cfg['loginBlockSeconds'] ?? 1800);

api_security_require_not_rate_limited($pdo, 'login', $ipKey, 'För många inloggningsförsök. Vänta en stund.');
api_security_require_not_rate_limited($pdo, 'login', $emailKey, 'Kontot är temporärt låst efter för många försök.');

$adminEmail = api_security_normalize_email((string) ($admin['email'] ?? ''));
$passwordValid = $email !== '' && hash_equals($adminEmail, $email) && password_verify($password, (string) ($admin['password_hash'] ?? ''));

$factorValid = false;
$usedRecovery = false;
if ($passwordValid) {
  if (trim($recoveryCode) !== '') {
    $factorValid = api_security_consume_recovery_code($pdo, (int) $admin['id'], $recoveryCode);
    $usedRecovery = $factorValid;
  } else {
    $factorValid = api_security_totp_verify((string) ($admin['totp_secret'] ?? ''), $totpCode, 1);
  }
}

if (!$passwordValid || !$factorValid) {
  api_security_rate_limit_register_failure($pdo, 'login', $ipKey, $maxAttempts, $windowSeconds, $blockSeconds);
  api_security_rate_limit_register_failure($pdo, 'login', $emailKey, $maxAttempts, $windowSeconds, $blockSeconds);

  api_respond_json(401, [
    'ok' => false,
    'error' => 'invalid_credentials',
    'message' => 'Fel e-post, lösenord eller 2FA-kod.'
  ]);
}

api_security_rate_limit_clear($pdo, 'login', $ipKey);
api_security_rate_limit_clear($pdo, 'login', $emailKey);
api_security_login($pdo, $admin);

api_respond_json(200, [
  'ok' => true,
  'message' => 'Inloggning lyckades.',
  'csrfToken' => api_security_csrf_token(),
  'usedRecoveryCode' => $usedRecovery
]);
