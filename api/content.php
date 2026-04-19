<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';
require dirname(__DIR__) . '/portfolio_core.php';

api_require_method('GET');

$pdo = api_get_pdo();
api_ensure_schema($pdo);

$statement = $pdo->query('SELECT payload_json, payload_hash, updated_at FROM portfolio_state WHERE id = 1 LIMIT 1');
$row = $statement->fetch();

if (!$row || !isset($row['payload_json'])) {
  api_respond_json(200, [
    'ok' => true,
    'payload' => new stdClass(),
    'payloadHash' => '',
    'updatedAt' => null
  ]);
}

try {
  $payload = json_decode((string) $row['payload_json'], true, 512, JSON_THROW_ON_ERROR);
} catch (Throwable $error) {
  api_respond_json(500, [
    'ok' => false,
    'error' => 'payload_decode_failed',
    'message' => 'Kunde inte läsa sparad payload från databasen.'
  ]);
}

if (!is_array($payload)) {
  $payload = [];
}
portfolio_sanitize_payload($payload);

api_respond_json(200, [
  'ok' => true,
  'payload' => $payload,
  'payloadHash' => (string) ($row['payload_hash'] ?? ''),
  'updatedAt' => (string) ($row['updated_at'] ?? '')
]);
