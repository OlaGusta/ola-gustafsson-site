<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';
require dirname(__DIR__) . '/portfolio_core.php';

function publish_ensure_artwork_slugs(array &$payload): void
{
  if (!isset($payload['gallery']) || !is_array($payload['gallery'])) {
    return;
  }
  if (!isset($payload['gallery']['artworks']) || !is_array($payload['gallery']['artworks'])) {
    return;
  }

  $artworks = &$payload['gallery']['artworks'];
  $seen = [];

  foreach ($artworks as $index => &$artwork) {
    if (!is_array($artwork)) {
      continue;
    }

    $rawSlug = isset($artwork['slug']) && is_string($artwork['slug']) ? trim($artwork['slug']) : '';
    $title = isset($artwork['title']) && is_string($artwork['title']) ? trim($artwork['title']) : '';

    $candidate = $rawSlug !== '' ? portfolio_slugify($rawSlug) : '';
    if ($candidate === '' && $title !== '') {
      $candidate = portfolio_slugify($title);
    }

    if ($candidate === '') {
      $src = isset($artwork['src']) && is_string($artwork['src']) ? trim($artwork['src']) : '';
      $clean = preg_split('/[?#]/', $src, 2)[0] ?? $src;
      $filename = is_string($clean) && $clean !== '' ? basename($clean) : '';
      $baseName = $filename !== '' ? preg_replace('/\\.[a-z0-9]+$/i', '', $filename) : '';
      $candidate = portfolio_slugify(is_string($baseName) && $baseName !== '' ? $baseName : 'verk');
    }

    $base = $candidate;
    $suffix = 2;
    while (isset($seen[$candidate])) {
      $candidate = "{$base}-{$suffix}";
      $suffix += 1;
    }

    $seen[$candidate] = true;
    $artwork['slug'] = $candidate;
  }
}

api_require_method('POST');
api_require_authenticated_user();

$request = api_decode_request_json();
$payload = $request;
if (array_key_exists('payload', $request)) {
  $payload = $request['payload'];
}

if (!is_array($payload)) {
  api_respond_json(400, [
    'ok' => false,
    'error' => 'invalid_payload',
    'message' => 'Payload måste vara ett objekt.'
  ]);
}

publish_ensure_artwork_slugs($payload);
portfolio_sanitize_payload($payload);

$jsonForDb = json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
$jsonForJs = json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
if (!is_string($jsonForDb) || !is_string($jsonForJs)) {
  api_respond_json(500, [
    'ok' => false,
    'error' => 'encode_failed',
    'message' => 'Kunde inte serialisera payload.'
  ]);
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

$overridesPath = dirname(__DIR__) . '/overrides.js';
$jsBody = "// Live overrides för hela sajten.\n";
$jsBody .= "// Auto-genererad av Studio API.\n";
$jsBody .= "window.PORTFOLIO_OVERRIDES = {$jsonForJs};\n";

$writeOk = @file_put_contents($overridesPath, $jsBody, LOCK_EX);
if ($writeOk === false) {
  api_respond_json(500, [
    'ok' => false,
    'error' => 'overrides_write_failed',
    'message' => 'Data sparades i databas men kunde inte skriva overrides.js. Kontrollera filrättigheter i webbrot.'
  ]);
}

api_respond_json(200, [
  'ok' => true,
  'publishedAt' => api_now_iso_utc(),
  'payloadHash' => $payloadHash
]);
