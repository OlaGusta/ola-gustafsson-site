<?php
declare(strict_types=1);

header('X-Content-Type-Options: nosniff');

function api_respond_json(int $status, array $payload): never
{
  http_response_code($status);
  header('Content-Type: application/json; charset=utf-8');
  header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
  echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
  exit;
}

function api_load_db_config(): array
{
  $configPath = dirname(__DIR__) . '/.db-config.php';
  if (!is_file($configPath)) {
    api_respond_json(500, [
      'ok' => false,
      'error' => 'db_config_missing',
      'message' => 'Databas-konfiguration saknas (.db-config.php).'
    ]);
  }

  $config = require $configPath;
  if (!is_array($config)) {
    api_respond_json(500, [
      'ok' => false,
      'error' => 'db_config_invalid',
      'message' => 'Databas-konfigurationen är ogiltig.'
    ]);
  }

  $required = ['host', 'database', 'username', 'password', 'charset'];
  foreach ($required as $key) {
    if (!array_key_exists($key, $config)) {
      api_respond_json(500, [
        'ok' => false,
        'error' => 'db_config_incomplete',
        'message' => "Databas-konfiguration saknar fältet '{$key}'."
      ]);
    }
  }

  return $config;
}

function api_get_pdo(): PDO
{
  static $pdo = null;
  if ($pdo instanceof PDO) {
    return $pdo;
  }

  $cfg = api_load_db_config();
  $dsn = sprintf('mysql:host=%s;dbname=%s;charset=%s', $cfg['host'], $cfg['database'], $cfg['charset']);

  try {
    $pdo = new PDO($dsn, (string) $cfg['username'], (string) $cfg['password'], [
      PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
      PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
      PDO::ATTR_EMULATE_PREPARES => false
    ]);
  } catch (Throwable $error) {
    api_respond_json(500, [
      'ok' => false,
      'error' => 'db_connect_failed',
      'message' => 'Kunde inte ansluta till databasen.'
    ]);
  }

  return $pdo;
}

function api_ensure_schema(PDO $pdo): void
{
  $pdo->exec(
    <<<SQL
CREATE TABLE IF NOT EXISTS portfolio_state (
  id TINYINT UNSIGNED NOT NULL PRIMARY KEY,
  payload_json LONGTEXT NOT NULL,
  payload_hash CHAR(64) NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
SQL
  );

  $pdo->exec(
    <<<SQL
CREATE TABLE IF NOT EXISTS studio_admin (
  id TINYINT UNSIGNED NOT NULL PRIMARY KEY,
  email VARCHAR(190) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  totp_secret VARCHAR(64) NOT NULL,
  session_version INT UNSIGNED NOT NULL DEFAULT 1,
  last_login_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY studio_admin_email_unique (email)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
SQL
  );

  $pdo->exec(
    <<<SQL
CREATE TABLE IF NOT EXISTS studio_recovery_codes (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id TINYINT UNSIGNED NOT NULL,
  code_hash VARCHAR(255) NOT NULL,
  used_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX studio_recovery_user_idx (user_id, used_at)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
SQL
  );

  $pdo->exec(
    <<<SQL
CREATE TABLE IF NOT EXISTS security_rate_limits (
  scope VARCHAR(64) NOT NULL,
  key_hash CHAR(64) NOT NULL,
  hits INT UNSIGNED NOT NULL DEFAULT 0,
  window_started_at DATETIME NOT NULL,
  blocked_until DATETIME NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (scope, key_hash)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
SQL
  );

  $pdo->exec(
    <<<SQL
CREATE TABLE IF NOT EXISTS studio_password_resets (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id TINYINT UNSIGNED NOT NULL,
  token_hash CHAR(64) NOT NULL,
  request_ip_hash CHAR(64) NOT NULL,
  expires_at DATETIME NOT NULL,
  used_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY studio_password_resets_token_unique (token_hash),
  INDEX studio_password_resets_user_idx (user_id, used_at)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
SQL
  );

  $pdo->exec(
    <<<SQL
CREATE TABLE IF NOT EXISTS contact_messages (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL,
  message TEXT NOT NULL,
  ip_hash CHAR(64) NOT NULL,
  user_agent_hash CHAR(64) NOT NULL,
  mail_delivered TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
SQL
  );
}

function api_decode_request_json(): array
{
  $raw = file_get_contents('php://input');
  if (!is_string($raw) || trim($raw) === '') {
    api_respond_json(400, [
      'ok' => false,
      'error' => 'empty_body',
      'message' => 'Request body saknas.'
    ]);
  }

  if (strlen($raw) > 8 * 1024 * 1024) {
    api_respond_json(413, [
      'ok' => false,
      'error' => 'payload_too_large',
      'message' => 'Payload är för stor.'
    ]);
  }

  try {
    $decoded = json_decode($raw, true, 512, JSON_THROW_ON_ERROR);
  } catch (Throwable $error) {
    api_respond_json(400, [
      'ok' => false,
      'error' => 'invalid_json',
      'message' => 'Ogiltig JSON i request body.'
    ]);
  }

  if (!is_array($decoded)) {
    api_respond_json(400, [
      'ok' => false,
      'error' => 'invalid_payload',
      'message' => 'Payload måste vara ett JSON-objekt.'
    ]);
  }

  return $decoded;
}

function api_require_method(string $method): void
{
  if ($_SERVER['REQUEST_METHOD'] !== $method) {
    header('Allow: ' . $method);
    api_respond_json(405, [
      'ok' => false,
      'error' => 'method_not_allowed',
      'message' => "Metoden {$_SERVER['REQUEST_METHOD']} stöds inte."
    ]);
  }
}

function api_is_authenticated_user(): bool
{
  $candidates = [
    $_SERVER['PHP_AUTH_USER'] ?? '',
    $_SERVER['REMOTE_USER'] ?? '',
    $_SERVER['REDIRECT_REMOTE_USER'] ?? ''
  ];

  foreach ($candidates as $value) {
    if (is_string($value) && trim($value) !== '') {
      return true;
    }
  }

  return false;
}

function api_require_authenticated_user(): void
{
  $mode = api_security_auth_mode();

  if ($mode === 'basic' || $mode === 'session-or-basic') {
    if (api_is_authenticated_user()) {
      return;
    }
  }

  if ($mode === 'session-2fa' || $mode === 'session-or-basic') {
    $pdo = api_get_pdo();
    api_ensure_schema($pdo);
    $admin = api_security_authenticated_admin($pdo);
    if ($admin) {
      api_security_require_csrf();
      return;
    }
  }

  api_respond_json(401, [
    'ok' => false,
    'error' => 'auth_required',
    'message' => 'Publicering kräver inloggning med 2FA i Studio.'
  ]);
}

function api_now_iso_utc(): string
{
  return gmdate('Y-m-d\TH:i:s\Z');
}

require_once __DIR__ . '/security.php';
