<?php
declare(strict_types=1);

require dirname(__DIR__) . '/bootstrap.php';

api_require_method('POST');

$pdo = api_get_pdo();
api_ensure_schema($pdo);
api_security_start_session();

if (api_security_admin_exists($pdo)) {
  api_respond_json(409, [
    'ok' => false,
    'error' => 'already_initialized',
    'message' => 'Admin-konto är redan initierat.'
  ]);
}

$body = api_decode_request_json();
$action = isset($body['action']) && is_string($body['action']) ? trim($body['action']) : '';
$bootstrapKey = isset($body['bootstrapKey']) && is_string($body['bootstrapKey']) ? trim($body['bootstrapKey']) : '';
if ($bootstrapKey === '' && isset($_SERVER['HTTP_X_BOOTSTRAP_KEY']) && is_string($_SERVER['HTTP_X_BOOTSTRAP_KEY'])) {
  $bootstrapKey = trim($_SERVER['HTTP_X_BOOTSTRAP_KEY']);
}
$ipKey = 'ip:' . api_security_client_ip();

$cfg = api_security_config();
$maxAttempts = (int) ($cfg['loginMaxAttempts'] ?? 5);
$windowSeconds = (int) ($cfg['loginWindowSeconds'] ?? 900);
$blockSeconds = (int) ($cfg['loginBlockSeconds'] ?? 1800);

$bootstrapKeyRequired = api_security_bootstrap_key_required();
$bootstrapKeyValid = api_security_verify_bootstrap_key($bootstrapKey);

if (!($action === 'start' && $bootstrapKeyValid)) {
  api_security_require_not_rate_limited($pdo, 'bootstrap', $ipKey, 'För många försök vid konto-setup. Vänta en stund.');
}

if ($action === 'start' && $bootstrapKeyRequired && !$bootstrapKeyValid) {
  api_security_rate_limit_register_failure($pdo, 'bootstrap', $ipKey, $maxAttempts, $windowSeconds, $blockSeconds);
  api_respond_json(403, [
    'ok' => false,
    'error' => 'bootstrap_key_invalid',
    'message' => 'Bootstrap-nyckeln är ogiltig.'
  ]);
}

if ($action === 'start') {
  $email = isset($body['email']) && is_string($body['email']) ? $body['email'] : '';
  $password = isset($body['password']) && is_string($body['password']) ? $body['password'] : '';

  $pending = api_security_bootstrap_start($email, $password);
  api_security_rate_limit_clear($pdo, 'bootstrap', $ipKey);

  api_respond_json(200, [
    'ok' => true,
    'pending' => [
      'email' => $pending['email'],
      'totpSecret' => $pending['totpSecret'],
      'otpauthUrl' => $pending['otpauthUrl']
    ],
    'message' => 'Skanna QR/secret i din authenticator-app och verifiera med en 6-siffrig kod.'
  ]);
}

if ($action === 'finish') {
  $pending = api_security_bootstrap_pending();
  if (!$pending) {
    api_respond_json(400, [
      'ok' => false,
      'error' => 'bootstrap_expired',
      'message' => 'Setup-sessionen har gått ut. Starta om initieringen.'
    ]);
  }

  $totpCode = isset($body['totpCode']) && is_string($body['totpCode']) ? $body['totpCode'] : '';
  if (!api_security_totp_verify((string) $pending['totp_secret'], $totpCode, 1)) {
    api_security_rate_limit_register_failure($pdo, 'bootstrap', $ipKey, $maxAttempts, $windowSeconds, $blockSeconds);
    api_respond_json(422, [
      'ok' => false,
      'error' => 'invalid_totp',
      'message' => 'Fel 2FA-kod. Kontrollera tiden i din authenticator-app och försök igen.'
    ]);
  }

  $recoveryCodes = api_security_generate_recovery_codes(8);

  try {
    api_security_create_admin(
      $pdo,
      (string) $pending['email'],
      (string) $pending['password_hash'],
      (string) $pending['totp_secret'],
      $recoveryCodes
    );
  } catch (Throwable $error) {
    api_respond_json(500, [
      'ok' => false,
      'error' => 'bootstrap_failed',
      'message' => 'Kunde inte skapa admin-kontot.'
    ]);
  }

  api_security_bootstrap_clear();
  api_security_rate_limit_clear($pdo, 'bootstrap', $ipKey);

  $admin = api_security_get_admin($pdo);
  if (!$admin) {
    api_respond_json(500, [
      'ok' => false,
      'error' => 'bootstrap_missing_admin',
      'message' => 'Admin-konto saknas efter setup.'
    ]);
  }

  api_security_login($pdo, $admin);

  api_respond_json(200, [
    'ok' => true,
    'message' => 'Admin-konto skapat och inloggning aktiv.',
    'csrfToken' => api_security_csrf_token(),
    'recoveryCodes' => $recoveryCodes
  ]);
}

api_respond_json(400, [
  'ok' => false,
  'error' => 'invalid_action',
  'message' => 'Ogiltig action. Använd start eller finish.'
]);
