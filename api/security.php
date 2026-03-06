<?php
declare(strict_types=1);

const API_AUTH_SESSION_KEY_USER_ID = 'studio_user_id';
const API_AUTH_SESSION_KEY_VERSION = 'studio_session_version';
const API_AUTH_SESSION_KEY_LAST_SEEN = 'studio_last_seen';
const API_AUTH_SESSION_KEY_CSRF = 'studio_csrf_token';
const API_AUTH_SESSION_KEY_BOOTSTRAP = 'studio_bootstrap_pending';
const API_AUTH_BOOTSTRAP_TTL_SECONDS = 15 * 60;

function api_security_config(): array
{
  static $config = null;
  if (is_array($config)) {
    return $config;
  }

  $db = api_load_db_config();
  $security = [];
  if (isset($db['security']) && is_array($db['security'])) {
    $security = $db['security'];
  }

  $derivedSecret = hash('sha256', implode('|', [
    (string) ($db['host'] ?? ''),
    (string) ($db['database'] ?? ''),
    (string) ($db['username'] ?? ''),
    (string) ($db['password'] ?? ''),
    __FILE__
  ]));

  $appSecret = isset($security['appSecret']) && is_string($security['appSecret'])
    ? trim($security['appSecret'])
    : '';
  if ($appSecret === '' || str_starts_with(strtolower($appSecret), 'change_me')) {
    $appSecret = $derivedSecret;
  }

  $host = isset($_SERVER['HTTP_HOST']) && is_string($_SERVER['HTTP_HOST']) ? trim($_SERVER['HTTP_HOST']) : 'localhost';
  $issuer = isset($security['issuer']) && is_string($security['issuer']) && trim($security['issuer']) !== ''
    ? trim($security['issuer'])
    : $host;

  $defaultResetBase = sprintf('https://%s/studio.html', $host);
  $resetBaseUrl = isset($security['resetBaseUrl']) && is_string($security['resetBaseUrl']) && trim($security['resetBaseUrl']) !== ''
    ? trim($security['resetBaseUrl'])
    : $defaultResetBase;

  $config = [
    'appSecret' => $appSecret,
    'authMode' => (isset($security['authMode']) && is_string($security['authMode']) && trim($security['authMode']) !== '')
      ? trim($security['authMode'])
      : 'session-2fa',
    'sessionName' => (isset($security['sessionName']) && is_string($security['sessionName']) && trim($security['sessionName']) !== '')
      ? trim($security['sessionName'])
      : 'ola_studio_session',
    'sessionTtlSeconds' => (int) ($security['sessionTtlSeconds'] ?? 30 * 60),
    'loginMaxAttempts' => (int) ($security['loginMaxAttempts'] ?? 5),
    'loginWindowSeconds' => (int) ($security['loginWindowSeconds'] ?? 15 * 60),
    'loginBlockSeconds' => (int) ($security['loginBlockSeconds'] ?? 30 * 60),
    'resetMaxRequests' => (int) ($security['resetMaxRequests'] ?? 3),
    'resetWindowSeconds' => (int) ($security['resetWindowSeconds'] ?? 15 * 60),
    'resetBlockSeconds' => (int) ($security['resetBlockSeconds'] ?? 30 * 60),
    'resetTokenTtlSeconds' => (int) ($security['resetTokenTtlSeconds'] ?? 30 * 60),
    'contactMaxRequests' => (int) ($security['contactMaxRequests'] ?? 3),
    'contactWindowSeconds' => (int) ($security['contactWindowSeconds'] ?? 10 * 60),
    'contactBlockSeconds' => (int) ($security['contactBlockSeconds'] ?? 30 * 60),
    'issuer' => $issuer,
    'resetBaseUrl' => $resetBaseUrl,
    'mailerFrom' => (isset($security['mailerFrom']) && is_string($security['mailerFrom'])) ? trim($security['mailerFrom']) : '',
    'mailerReplyTo' => (isset($security['mailerReplyTo']) && is_string($security['mailerReplyTo'])) ? trim($security['mailerReplyTo']) : '',
    'contactRecipient' => (isset($security['contactRecipient']) && is_string($security['contactRecipient']))
      ? trim($security['contactRecipient'])
      : '',
    'bootstrapAccessKey' => (isset($security['bootstrapAccessKey']) && is_string($security['bootstrapAccessKey']))
      ? trim($security['bootstrapAccessKey'])
      : '',
    'turnstileSiteKey' => (isset($security['turnstileSiteKey']) && is_string($security['turnstileSiteKey']))
      ? trim($security['turnstileSiteKey'])
      : '',
    'turnstileSecret' => (isset($security['turnstileSecret']) && is_string($security['turnstileSecret']))
      ? trim($security['turnstileSecret'])
      : ''
  ];

  return $config;
}

function api_security_auth_mode(): string
{
  $mode = strtolower((string) (api_security_config()['authMode'] ?? 'session-2fa'));
  $allowed = ['session-2fa', 'session-or-basic', 'basic'];
  if (!in_array($mode, $allowed, true)) {
    return 'session-2fa';
  }
  return $mode;
}

function api_security_bootstrap_key_required(): bool
{
  $key = (string) (api_security_config()['bootstrapAccessKey'] ?? '');
  return $key !== '';
}

function api_security_verify_bootstrap_key(string $providedKey): bool
{
  $expected = (string) (api_security_config()['bootstrapAccessKey'] ?? '');
  if ($expected === '') {
    return true;
  }
  $provided = trim($providedKey);
  if ($provided === '') {
    return false;
  }
  return hash_equals($expected, $provided);
}

function api_security_hash(string $value): string
{
  $secret = (string) (api_security_config()['appSecret'] ?? 'fallback-secret');
  return hash_hmac('sha256', $value, $secret);
}

function api_security_random_hex(int $bytes = 32): string
{
  try {
    return bin2hex(random_bytes(max(16, $bytes)));
  } catch (Throwable $error) {
    return hash('sha256', uniqid('api_security_random_hex', true) . microtime(true));
  }
}

function api_security_now_utc(): DateTimeImmutable
{
  return new DateTimeImmutable('now', new DateTimeZone('UTC'));
}

function api_security_now_sql(): string
{
  return api_security_now_utc()->format('Y-m-d H:i:s');
}

function api_security_future_sql(int $seconds): string
{
  return api_security_now_utc()->modify(sprintf('+%d seconds', max(1, $seconds)))->format('Y-m-d H:i:s');
}

function api_security_to_epoch(?string $value): int
{
  if (!is_string($value) || trim($value) === '') {
    return 0;
  }
  $timestamp = strtotime($value . ' UTC');
  if ($timestamp === false) {
    return 0;
  }
  return (int) $timestamp;
}

function api_security_client_ip(): string
{
  $ip = isset($_SERVER['REMOTE_ADDR']) && is_string($_SERVER['REMOTE_ADDR']) ? trim($_SERVER['REMOTE_ADDR']) : '';
  if ($ip === '') {
    return '0.0.0.0';
  }
  return substr($ip, 0, 64);
}

function api_security_user_agent(): string
{
  $ua = isset($_SERVER['HTTP_USER_AGENT']) && is_string($_SERVER['HTTP_USER_AGENT']) ? trim($_SERVER['HTTP_USER_AGENT']) : '';
  if ($ua === '') {
    return 'unknown';
  }
  return substr($ua, 0, 400);
}

function api_security_is_https(): bool
{
  if (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') {
    return true;
  }
  if (isset($_SERVER['SERVER_PORT']) && (string) $_SERVER['SERVER_PORT'] === '443') {
    return true;
  }
  return false;
}

function api_security_start_session(): void
{
  if (session_status() === PHP_SESSION_ACTIVE) {
    return;
  }

  $cfg = api_security_config();
  session_name((string) ($cfg['sessionName'] ?? 'ola_studio_session'));

  if (function_exists('session_set_cookie_params')) {
    session_set_cookie_params([
      'lifetime' => 0,
      'path' => '/',
      'secure' => api_security_is_https(),
      'httponly' => true,
      'samesite' => 'Strict'
    ]);
  }

  ini_set('session.use_strict_mode', '1');
  session_start();
}

function api_security_destroy_session(): void
{
  if (session_status() !== PHP_SESSION_ACTIVE) {
    api_security_start_session();
  }

  $_SESSION = [];

  if (ini_get('session.use_cookies')) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000, $params['path'] ?? '/', $params['domain'] ?? '', (bool) ($params['secure'] ?? false), true);
  }

  session_destroy();
}

function api_security_csrf_token(): string
{
  api_security_start_session();
  $existing = $_SESSION[API_AUTH_SESSION_KEY_CSRF] ?? null;
  if (is_string($existing) && strlen($existing) >= 32) {
    return $existing;
  }

  $token = api_security_random_hex(32);
  $_SESSION[API_AUTH_SESSION_KEY_CSRF] = $token;
  return $token;
}

function api_security_require_csrf(): void
{
  $provided = isset($_SERVER['HTTP_X_CSRF_TOKEN']) && is_string($_SERVER['HTTP_X_CSRF_TOKEN'])
    ? trim($_SERVER['HTTP_X_CSRF_TOKEN'])
    : '';

  if ($provided === '' && isset($_POST['csrfToken']) && is_string($_POST['csrfToken'])) {
    $provided = trim($_POST['csrfToken']);
  }

  $expected = api_security_csrf_token();
  if ($provided === '' || !hash_equals($expected, $provided)) {
    api_respond_json(403, [
      'ok' => false,
      'error' => 'csrf_invalid',
      'message' => 'Ogiltig säkerhetstoken. Ladda om sidan och försök igen.'
    ]);
  }
}

function api_security_normalize_email(string $email): string
{
  return strtolower(trim($email));
}

function api_security_validate_password(string $password): ?string
{
  if (strlen($password) < 14) {
    return 'Lösenordet måste vara minst 14 tecken.';
  }

  $checks = 0;
  $checks += preg_match('/[a-z]/', $password) ? 1 : 0;
  $checks += preg_match('/[A-Z]/', $password) ? 1 : 0;
  $checks += preg_match('/\d/', $password) ? 1 : 0;
  $checks += preg_match('/[^A-Za-z\d]/', $password) ? 1 : 0;

  if ($checks < 3) {
    return 'Lösenordet behöver minst tre typer: små bokstäver, stora bokstäver, siffror och specialtecken.';
  }

  return null;
}

function api_security_strlen(string $value): int
{
  if (function_exists('mb_strlen')) {
    return (int) mb_strlen($value);
  }
  return strlen($value);
}

function api_security_get_admin(PDO $pdo): ?array
{
  $stmt = $pdo->query(
    'SELECT id, email, password_hash, totp_secret, session_version, last_login_at, created_at, updated_at FROM studio_admin WHERE id = 1 LIMIT 1'
  );
  $row = $stmt->fetch();
  if (!is_array($row)) {
    return null;
  }
  return $row;
}

function api_security_admin_exists(PDO $pdo): bool
{
  return api_security_get_admin($pdo) !== null;
}

function api_security_login(PDO $pdo, array $admin): void
{
  api_security_start_session();
  session_regenerate_id(true);

  $_SESSION[API_AUTH_SESSION_KEY_USER_ID] = (int) ($admin['id'] ?? 1);
  $_SESSION[API_AUTH_SESSION_KEY_VERSION] = (int) ($admin['session_version'] ?? 1);
  $_SESSION[API_AUTH_SESSION_KEY_LAST_SEEN] = time();
  $_SESSION[API_AUTH_SESSION_KEY_CSRF] = api_security_random_hex(32);

  $stmt = $pdo->prepare('UPDATE studio_admin SET last_login_at = :last_login_at WHERE id = 1');
  $stmt->execute([
    ':last_login_at' => api_security_now_sql()
  ]);
}

function api_security_logout(): void
{
  api_security_destroy_session();
}

function api_security_authenticated_admin(PDO $pdo): ?array
{
  api_security_start_session();

  $userId = (int) ($_SESSION[API_AUTH_SESSION_KEY_USER_ID] ?? 0);
  $sessionVersion = (int) ($_SESSION[API_AUTH_SESSION_KEY_VERSION] ?? 0);
  $lastSeen = (int) ($_SESSION[API_AUTH_SESSION_KEY_LAST_SEEN] ?? 0);

  if ($userId !== 1 || $sessionVersion <= 0 || $lastSeen <= 0) {
    return null;
  }

  $ttl = (int) (api_security_config()['sessionTtlSeconds'] ?? 1800);
  if (time() - $lastSeen > max(60, $ttl)) {
    api_security_logout();
    return null;
  }

  $admin = api_security_get_admin($pdo);
  if (!$admin) {
    api_security_logout();
    return null;
  }

  if ((int) $admin['session_version'] !== $sessionVersion) {
    api_security_logout();
    return null;
  }

  $_SESSION[API_AUTH_SESSION_KEY_LAST_SEEN] = time();
  return $admin;
}

function api_security_require_authenticated_admin(PDO $pdo): array
{
  $admin = api_security_authenticated_admin($pdo);
  if ($admin) {
    return $admin;
  }

  api_respond_json(401, [
    'ok' => false,
    'error' => 'auth_required',
    'message' => 'Inloggning krävs.'
  ]);
}

function api_security_rate_key(string $scope, string $key): string
{
  return api_security_hash(sprintf('%s|%s', $scope, $key));
}

function api_security_rate_limit_row(PDO $pdo, string $scope, string $rawKey): ?array
{
  $keyHash = api_security_rate_key($scope, $rawKey);
  $stmt = $pdo->prepare('SELECT scope, key_hash, hits, window_started_at, blocked_until FROM security_rate_limits WHERE scope = :scope AND key_hash = :key_hash LIMIT 1');
  $stmt->execute([
    ':scope' => $scope,
    ':key_hash' => $keyHash
  ]);
  $row = $stmt->fetch();
  return is_array($row) ? $row : null;
}

function api_security_rate_limit_blocked(PDO $pdo, string $scope, string $rawKey): int
{
  $row = api_security_rate_limit_row($pdo, $scope, $rawKey);
  if (!$row) {
    return 0;
  }

  $blockedUntil = api_security_to_epoch((string) ($row['blocked_until'] ?? ''));
  if ($blockedUntil <= time()) {
    return 0;
  }

  return max(0, $blockedUntil - time());
}

function api_security_rate_limit_register_failure(
  PDO $pdo,
  string $scope,
  string $rawKey,
  int $maxHits,
  int $windowSeconds,
  int $blockSeconds
): array {
  $row = api_security_rate_limit_row($pdo, $scope, $rawKey);
  $now = api_security_now_utc();
  $nowEpoch = $now->getTimestamp();
  $windowStartEpoch = $nowEpoch;
  $hits = 1;

  if ($row) {
    $rowWindowStart = api_security_to_epoch((string) ($row['window_started_at'] ?? ''));
    if ($rowWindowStart > 0 && ($nowEpoch - $rowWindowStart) <= max(60, $windowSeconds)) {
      $windowStartEpoch = $rowWindowStart;
      $hits = ((int) ($row['hits'] ?? 0)) + 1;
    }
  }

  $blockedUntilSql = null;
  if ($hits >= max(1, $maxHits)) {
    $blockedUntilSql = $now->modify(sprintf('+%d seconds', max(60, $blockSeconds)))->format('Y-m-d H:i:s');
  }

  $stmt = $pdo->prepare(
    <<<SQL
INSERT INTO security_rate_limits (scope, key_hash, hits, window_started_at, blocked_until)
VALUES (:scope, :key_hash, :hits, :window_started_at, :blocked_until)
ON DUPLICATE KEY UPDATE
  hits = VALUES(hits),
  window_started_at = VALUES(window_started_at),
  blocked_until = VALUES(blocked_until)
SQL
  );
  $stmt->execute([
    ':scope' => $scope,
    ':key_hash' => api_security_rate_key($scope, $rawKey),
    ':hits' => $hits,
    ':window_started_at' => gmdate('Y-m-d H:i:s', $windowStartEpoch),
    ':blocked_until' => $blockedUntilSql
  ]);

  return [
    'hits' => $hits,
    'blocked' => $blockedUntilSql !== null,
    'retryAfterSeconds' => $blockedUntilSql !== null ? max(0, api_security_to_epoch($blockedUntilSql) - time()) : 0
  ];
}

function api_security_rate_limit_clear(PDO $pdo, string $scope, string $rawKey): void
{
  $stmt = $pdo->prepare('DELETE FROM security_rate_limits WHERE scope = :scope AND key_hash = :key_hash');
  $stmt->execute([
    ':scope' => $scope,
    ':key_hash' => api_security_rate_key($scope, $rawKey)
  ]);
}

function api_security_require_not_rate_limited(
  PDO $pdo,
  string $scope,
  string $rawKey,
  string $message = 'För många försök. Vänta en stund och prova igen.'
): void {
  $retryAfterSeconds = api_security_rate_limit_blocked($pdo, $scope, $rawKey);
  if ($retryAfterSeconds <= 0) {
    return;
  }

  header('Retry-After: ' . $retryAfterSeconds);
  api_respond_json(429, [
    'ok' => false,
    'error' => 'rate_limited',
    'message' => $message,
    'retryAfterSeconds' => $retryAfterSeconds
  ]);
}

function api_security_base32_decode(string $value): string
{
  $clean = strtoupper(preg_replace('/[^A-Z2-7]/', '', $value));
  if ($clean === '') {
    return '';
  }

  $alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  $bits = '';

  $length = strlen($clean);
  for ($i = 0; $i < $length; $i += 1) {
    $char = $clean[$i];
    $index = strpos($alphabet, $char);
    if ($index === false) {
      return '';
    }
    $bits .= str_pad(decbin($index), 5, '0', STR_PAD_LEFT);
  }

  $bytes = '';
  $bitLength = strlen($bits);
  for ($i = 0; $i + 8 <= $bitLength; $i += 8) {
    $chunk = substr($bits, $i, 8);
    $bytes .= chr(bindec($chunk));
  }

  return $bytes;
}

function api_security_base32_encode(string $raw): string
{
  if ($raw === '') {
    return '';
  }

  $alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  $bits = '';
  $length = strlen($raw);
  for ($i = 0; $i < $length; $i += 1) {
    $bits .= str_pad(decbin(ord($raw[$i])), 8, '0', STR_PAD_LEFT);
  }

  $padding = (5 - (strlen($bits) % 5)) % 5;
  if ($padding > 0) {
    $bits .= str_repeat('0', $padding);
  }

  $encoded = '';
  $bitLength = strlen($bits);
  for ($i = 0; $i < $bitLength; $i += 5) {
    $chunk = substr($bits, $i, 5);
    $encoded .= $alphabet[bindec($chunk)];
  }

  return $encoded;
}

function api_security_totp_generate_secret(int $bytes = 20): string
{
  $raw = random_bytes(max(16, $bytes));
  return api_security_base32_encode($raw);
}

function api_security_totp_code(string $base32Secret, int $counter): string
{
  $secret = api_security_base32_decode($base32Secret);
  if ($secret === '') {
    return '';
  }

  $binaryCounter = pack('N*', 0) . pack('N*', $counter);
  $hash = hash_hmac('sha1', $binaryCounter, $secret, true);
  $offset = ord(substr($hash, -1)) & 0x0F;
  $slice = substr($hash, $offset, 4);
  $value = unpack('N', $slice)[1] & 0x7FFFFFFF;
  $otp = $value % 1000000;

  return str_pad((string) $otp, 6, '0', STR_PAD_LEFT);
}

function api_security_totp_verify(string $base32Secret, string $code, int $window = 1): bool
{
  $normalized = preg_replace('/\D/', '', $code);
  if (!is_string($normalized) || strlen($normalized) !== 6) {
    return false;
  }

  $counter = (int) floor(time() / 30);
  $window = max(0, min(3, $window));

  for ($i = -$window; $i <= $window; $i += 1) {
    $candidate = api_security_totp_code($base32Secret, $counter + $i);
    if ($candidate !== '' && hash_equals($candidate, $normalized)) {
      return true;
    }
  }

  return false;
}

function api_security_totp_otpauth_url(string $email, string $secret): string
{
  $issuer = (string) (api_security_config()['issuer'] ?? 'Studio');
  $label = rawurlencode($issuer . ':' . $email);
  $issuerParam = rawurlencode($issuer);
  return sprintf('otpauth://totp/%s?secret=%s&issuer=%s&digits=6&period=30', $label, rawurlencode($secret), $issuerParam);
}

function api_security_generate_recovery_codes(int $count = 8): array
{
  $codes = [];
  for ($i = 0; $i < $count; $i += 1) {
    $raw = strtoupper(substr(bin2hex(random_bytes(4)), 0, 8));
    $codes[] = substr($raw, 0, 4) . '-' . substr($raw, 4, 4);
  }
  return $codes;
}

function api_security_replace_recovery_codes(PDO $pdo, int $userId, array $plainCodes): void
{
  $pdo->prepare('DELETE FROM studio_recovery_codes WHERE user_id = :user_id')->execute([
    ':user_id' => $userId
  ]);

  $insert = $pdo->prepare('INSERT INTO studio_recovery_codes (user_id, code_hash, used_at) VALUES (:user_id, :code_hash, NULL)');
  foreach ($plainCodes as $code) {
    if (!is_string($code) || trim($code) === '') {
      continue;
    }
    $insert->execute([
      ':user_id' => $userId,
      ':code_hash' => password_hash(strtoupper(str_replace('-', '', trim($code))), PASSWORD_DEFAULT)
    ]);
  }
}

function api_security_consume_recovery_code(PDO $pdo, int $userId, string $code): bool
{
  $needle = strtoupper(str_replace('-', '', trim($code)));
  if ($needle === '') {
    return false;
  }

  $stmt = $pdo->prepare('SELECT id, code_hash FROM studio_recovery_codes WHERE user_id = :user_id AND used_at IS NULL');
  $stmt->execute([
    ':user_id' => $userId
  ]);

  while ($row = $stmt->fetch()) {
    if (!is_array($row) || !isset($row['code_hash'])) {
      continue;
    }

    if (!password_verify($needle, (string) $row['code_hash'])) {
      continue;
    }

    $update = $pdo->prepare('UPDATE studio_recovery_codes SET used_at = :used_at WHERE id = :id AND used_at IS NULL');
    $update->execute([
      ':used_at' => api_security_now_sql(),
      ':id' => (int) $row['id']
    ]);

    return $update->rowCount() === 1;
  }

  return false;
}

function api_security_create_admin(PDO $pdo, string $email, string $passwordHash, string $totpSecret, array $recoveryCodes): void
{
  $pdo->beginTransaction();
  try {
    $stmt = $pdo->prepare(
      <<<SQL
INSERT INTO studio_admin (id, email, password_hash, totp_secret, session_version, created_at, updated_at)
VALUES (1, :email, :password_hash, :totp_secret, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
SQL
    );
    $stmt->execute([
      ':email' => $email,
      ':password_hash' => $passwordHash,
      ':totp_secret' => $totpSecret
    ]);

    api_security_replace_recovery_codes($pdo, 1, $recoveryCodes);

    $pdo->commit();
  } catch (Throwable $error) {
    if ($pdo->inTransaction()) {
      $pdo->rollBack();
    }
    throw $error;
  }
}

function api_security_update_password(PDO $pdo, int $userId, string $passwordHash): void
{
  $stmt = $pdo->prepare(
    'UPDATE studio_admin SET password_hash = :password_hash, session_version = session_version + 1, updated_at = CURRENT_TIMESTAMP WHERE id = :id'
  );
  $stmt->execute([
    ':password_hash' => $passwordHash,
    ':id' => $userId
  ]);
}

function api_security_store_reset_token(PDO $pdo, int $userId, string $tokenHash, string $ipHash, int $ttlSeconds): void
{
  $stmt = $pdo->prepare(
    'INSERT INTO studio_password_resets (user_id, token_hash, request_ip_hash, expires_at, used_at) VALUES (:user_id, :token_hash, :request_ip_hash, :expires_at, NULL)'
  );
  $stmt->execute([
    ':user_id' => $userId,
    ':token_hash' => $tokenHash,
    ':request_ip_hash' => $ipHash,
    ':expires_at' => api_security_future_sql($ttlSeconds)
  ]);
}

function api_security_find_reset_token(PDO $pdo, string $tokenHash): ?array
{
  $stmt = $pdo->prepare(
    'SELECT id, user_id, expires_at, used_at FROM studio_password_resets WHERE token_hash = :token_hash LIMIT 1'
  );
  $stmt->execute([
    ':token_hash' => $tokenHash
  ]);
  $row = $stmt->fetch();
  if (!is_array($row)) {
    return null;
  }
  return $row;
}

function api_security_mark_reset_token_used(PDO $pdo, int $tokenId): void
{
  $stmt = $pdo->prepare('UPDATE studio_password_resets SET used_at = :used_at WHERE id = :id AND used_at IS NULL');
  $stmt->execute([
    ':used_at' => api_security_now_sql(),
    ':id' => $tokenId
  ]);
}

function api_security_invalidate_reset_tokens(PDO $pdo, int $userId): void
{
  $stmt = $pdo->prepare('UPDATE studio_password_resets SET used_at = :used_at WHERE user_id = :user_id AND used_at IS NULL');
  $stmt->execute([
    ':used_at' => api_security_now_sql(),
    ':user_id' => $userId
  ]);
}

function api_security_reset_url(string $token): string
{
  $base = (string) (api_security_config()['resetBaseUrl'] ?? '');
  if ($base === '') {
    $host = isset($_SERVER['HTTP_HOST']) && is_string($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : 'localhost';
    $base = sprintf('https://%s/studio.html', $host);
  }

  $separator = str_contains($base, '?') ? '&' : '?';
  return $base . $separator . 'reset_token=' . rawurlencode($token);
}

function api_security_mail_sender(): string
{
  $configured = (string) (api_security_config()['mailerFrom'] ?? '');
  if ($configured !== '' && filter_var($configured, FILTER_VALIDATE_EMAIL)) {
    return $configured;
  }

  $host = isset($_SERVER['HTTP_HOST']) && is_string($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : 'localhost';
  $domain = preg_replace('/^www\./i', '', strtolower($host));
  if (!is_string($domain) || trim($domain) === '') {
    $domain = 'localhost';
  }

  return 'noreply@' . $domain;
}

function api_security_send_mail(string $to, string $subject, string $body): bool
{
  $to = trim($to);
  if ($to === '' || !filter_var($to, FILTER_VALIDATE_EMAIL)) {
    return false;
  }

  $from = api_security_mail_sender();
  $replyToConfigured = (string) (api_security_config()['mailerReplyTo'] ?? '');
  $replyTo = filter_var($replyToConfigured, FILTER_VALIDATE_EMAIL) ? $replyToConfigured : $from;

  $headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'From: ' . $from,
    'Reply-To: ' . $replyTo,
    'X-Content-Type-Options: nosniff'
  ];

  return @mail($to, $subject, $body, implode("\r\n", $headers));
}

function api_security_contact_recipient(): string
{
  $configured = (string) (api_security_config()['contactRecipient'] ?? '');
  if ($configured !== '' && filter_var($configured, FILTER_VALIDATE_EMAIL)) {
    return $configured;
  }

  $admin = null;
  try {
    $pdo = api_get_pdo();
    api_ensure_schema($pdo);
    $admin = api_security_get_admin($pdo);
  } catch (Throwable $error) {
    $admin = null;
  }

  if (is_array($admin) && isset($admin['email']) && filter_var((string) $admin['email'], FILTER_VALIDATE_EMAIL)) {
    return (string) $admin['email'];
  }

  return '';
}

function api_security_verify_turnstile(string $token): bool
{
  $secret = (string) (api_security_config()['turnstileSecret'] ?? '');
  if ($secret === '') {
    return true;
  }

  $token = trim($token);
  if ($token === '') {
    return false;
  }

  $payload = http_build_query([
    'secret' => $secret,
    'response' => $token,
    'remoteip' => api_security_client_ip()
  ]);

  $responseBody = '';

  if (function_exists('curl_init')) {
    $ch = curl_init('https://challenges.cloudflare.com/turnstile/v0/siteverify');
    if ($ch === false) {
      return false;
    }

    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 8);
    $responseBody = (string) curl_exec($ch);
    curl_close($ch);
  } else {
    $context = stream_context_create([
      'http' => [
        'method' => 'POST',
        'header' => "Content-Type: application/x-www-form-urlencoded\r\n",
        'content' => $payload,
        'timeout' => 8
      ]
    ]);
    $responseBody = (string) @file_get_contents('https://challenges.cloudflare.com/turnstile/v0/siteverify', false, $context);
  }

  if ($responseBody === '') {
    return false;
  }

  $decoded = json_decode($responseBody, true);
  if (!is_array($decoded)) {
    return false;
  }

  return !empty($decoded['success']);
}

function api_security_bootstrap_start(string $email, string $password): array
{
  api_security_start_session();

  $normalizedEmail = api_security_normalize_email($email);
  if (!filter_var($normalizedEmail, FILTER_VALIDATE_EMAIL)) {
    api_respond_json(422, [
      'ok' => false,
      'error' => 'invalid_email',
      'message' => 'Ange en giltig e-postadress för admin-kontot.'
    ]);
  }

  $passwordError = api_security_validate_password($password);
  if ($passwordError !== null) {
    api_respond_json(422, [
      'ok' => false,
      'error' => 'weak_password',
      'message' => $passwordError
    ]);
  }

  $secret = api_security_totp_generate_secret();
  $passwordHash = password_hash($password, PASSWORD_DEFAULT);

  $_SESSION[API_AUTH_SESSION_KEY_BOOTSTRAP] = [
    'email' => $normalizedEmail,
    'password_hash' => $passwordHash,
    'totp_secret' => $secret,
    'created_at' => time()
  ];

  return [
    'email' => $normalizedEmail,
    'totpSecret' => $secret,
    'otpauthUrl' => api_security_totp_otpauth_url($normalizedEmail, $secret)
  ];
}

function api_security_bootstrap_pending(): ?array
{
  api_security_start_session();
  $pending = $_SESSION[API_AUTH_SESSION_KEY_BOOTSTRAP] ?? null;
  if (!is_array($pending)) {
    return null;
  }

  $createdAt = (int) ($pending['created_at'] ?? 0);
  if ($createdAt <= 0 || (time() - $createdAt) > API_AUTH_BOOTSTRAP_TTL_SECONDS) {
    unset($_SESSION[API_AUTH_SESSION_KEY_BOOTSTRAP]);
    return null;
  }

  return $pending;
}

function api_security_bootstrap_clear(): void
{
  api_security_start_session();
  unset($_SESSION[API_AUTH_SESSION_KEY_BOOTSTRAP]);
}

function api_security_save_contact_message(
  PDO $pdo,
  string $name,
  string $email,
  string $message,
  bool $mailDelivered
): void {
  $stmt = $pdo->prepare(
    'INSERT INTO contact_messages (name, email, message, ip_hash, user_agent_hash, mail_delivered) VALUES (:name, :email, :message, :ip_hash, :user_agent_hash, :mail_delivered)'
  );

  $stmt->execute([
    ':name' => $name,
    ':email' => $email,
    ':message' => $message,
    ':ip_hash' => api_security_hash('ip:' . api_security_client_ip()),
    ':user_agent_hash' => api_security_hash('ua:' . api_security_user_agent()),
    ':mail_delivered' => $mailDelivered ? 1 : 0
  ]);
}

function api_security_public_status(PDO $pdo): array
{
  $admin = api_security_authenticated_admin($pdo);
  $adminExists = api_security_admin_exists($pdo);
  return [
    'ok' => true,
    'adminExists' => $adminExists,
    'authenticated' => $admin !== null,
    'email' => $admin ? (string) $admin['email'] : '',
    'csrfToken' => api_security_csrf_token(),
    'bootstrapKeyRequired' => (!$adminExists && api_security_bootstrap_key_required()),
    'turnstileSiteKey' => (string) (api_security_config()['turnstileSiteKey'] ?? '')
  ];
}
