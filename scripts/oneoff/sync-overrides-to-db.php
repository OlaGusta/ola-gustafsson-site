<?php
/**
 * Engångsskript: kopiera overrides.js (fil) till portfolio_state (DB), id=1.
 *
 * Bakgrund: Studio läser DB (api/content.php) och publicerar till BÅDA lagren
 * (api/publish.php). Om overrides.js laddas upp via FTP utan att DB uppdateras
 * skulle nästa publicering från Studio skriva över filen med gammal DB-data.
 *
 * Används av scripts/publish-prices.sh: laddas upp till api/ under ett tillfälligt
 * slumpat filnamn, anropas en gång med ?token=..., raderas direkt efteråt.
 * Hashen beräknas exakt som i api/publish.php.
 */
declare(strict_types=1);

const SYNC_TOKEN = '__SYNC_TOKEN__';

require __DIR__ . '/bootstrap.php';
require dirname(__DIR__) . '/portfolio_core.php';

api_require_method('GET');

$token = isset($_GET['token']) && is_string($_GET['token']) ? $_GET['token'] : '';
// OBS: jämför inte mot platshållar-literalen här – sed byter ut ALLA förekomster vid deploy.
if (str_starts_with(SYNC_TOKEN, '__') || strlen(SYNC_TOKEN) < 32 || !hash_equals(SYNC_TOKEN, $token)) {
  api_respond_json(403, ['ok' => false, 'error' => 'forbidden']);
}

$payload = portfolio_load_overrides();
if (!isset($payload['gallery']['artworks']) || !is_array($payload['gallery']['artworks']) || count($payload['gallery']['artworks']) === 0) {
  api_respond_json(500, ['ok' => false, 'error' => 'overrides_invalid', 'message' => 'overrides.js saknar gallery.artworks – avbryter utan att röra databasen.']);
}

$jsonForDb = json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
if (!is_string($jsonForDb)) {
  api_respond_json(500, ['ok' => false, 'error' => 'encode_failed']);
}
$payloadHash = hash('sha256', $jsonForDb);

$pdo = api_get_pdo();
api_ensure_schema($pdo);
$statement = $pdo->prepare(
  <<<SQL
INSERT INTO portfolio_state (id, payload_json, payload_hash)
VALUES (1, :payload_json, :payload_hash)
ON DUPLICATE KEY UPDATE
  payload_json = VALUES(payload_json),
  payload_hash = VALUES(payload_hash),
  updated_at = CURRENT_TIMESTAMP
SQL
);
$statement->execute([
  ':payload_json' => $jsonForDb,
  ':payload_hash' => $payloadHash
]);

$priced = 0;
foreach ($payload['gallery']['artworks'] as $artwork) {
  if (is_array($artwork) && isset($artwork['priceLabel']) && is_string($artwork['priceLabel']) && trim($artwork['priceLabel']) !== '') {
    $priced += 1;
  }
}

api_respond_json(200, [
  'ok' => true,
  'artworks' => count($payload['gallery']['artworks']),
  'priced' => $priced,
  'payloadHash' => $payloadHash
]);
