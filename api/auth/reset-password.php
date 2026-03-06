<?php
declare(strict_types=1);

require dirname(__DIR__) . '/bootstrap.php';

api_require_method('POST');

$pdo = api_get_pdo();
api_ensure_schema($pdo);

$body = api_decode_request_json();
$token = isset($body['token']) && is_string($body['token']) ? trim($body['token']) : '';
$newPassword = isset($body['newPassword']) && is_string($body['newPassword']) ? $body['newPassword'] : '';

if ($token === '' || strlen($token) < 32) {
  api_respond_json(400, [
    'ok' => false,
    'error' => 'invalid_token',
    'message' => 'Ogiltig eller saknad återställningstoken.'
  ]);
}

$passwordError = api_security_validate_password($newPassword);
if ($passwordError !== null) {
  api_respond_json(422, [
    'ok' => false,
    'error' => 'weak_password',
    'message' => $passwordError
  ]);
}

$tokenHash = api_security_hash('reset:' . $token);
$row = api_security_find_reset_token($pdo, $tokenHash);
if (!$row) {
  api_respond_json(400, [
    'ok' => false,
    'error' => 'invalid_token',
    'message' => 'Återställningslänken är ogiltig eller har redan använts.'
  ]);
}

if (!empty($row['used_at'])) {
  api_respond_json(400, [
    'ok' => false,
    'error' => 'token_used',
    'message' => 'Återställningslänken har redan använts.'
  ]);
}

$expiresAt = api_security_to_epoch((string) ($row['expires_at'] ?? ''));
if ($expiresAt <= 0 || $expiresAt < time()) {
  api_respond_json(400, [
    'ok' => false,
    'error' => 'token_expired',
    'message' => 'Återställningslänken har gått ut. Begär en ny.'
  ]);
}

$passwordHash = password_hash($newPassword, PASSWORD_DEFAULT);

$pdo->beginTransaction();
try {
  api_security_update_password($pdo, (int) $row['user_id'], $passwordHash);
  api_security_mark_reset_token_used($pdo, (int) $row['id']);
  api_security_invalidate_reset_tokens($pdo, (int) $row['user_id']);
  $pdo->commit();
} catch (Throwable $error) {
  if ($pdo->inTransaction()) {
    $pdo->rollBack();
  }

  api_respond_json(500, [
    'ok' => false,
    'error' => 'reset_failed',
    'message' => 'Kunde inte uppdatera lösenordet.'
  ]);
}

api_security_logout();

api_respond_json(200, [
  'ok' => true,
  'message' => 'Lösenordet är uppdaterat. Logga in igen med 2FA.'
]);
