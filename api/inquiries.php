<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if (!in_array($method, ['GET', 'POST'], true)) {
  header('Allow: GET, POST');
  api_respond_json(405, [
    'ok' => false,
    'error' => 'method_not_allowed',
    'message' => "Metoden {$method} stöds inte."
  ]);
}

api_require_authenticated_user();

$pdo = api_get_pdo();
api_ensure_schema($pdo);

if ($method === 'POST') {
  $request = api_decode_request_json();
  $id = isset($request['id']) ? (int) $request['id'] : 0;
  $followUpStatus = isset($request['followUpStatus']) && is_string($request['followUpStatus'])
    ? trim($request['followUpStatus'])
    : '';
  if ($id <= 0 || !in_array($followUpStatus, ['new', 'replied', 'closed'], true)) {
    api_respond_json(422, [
      'ok' => false,
      'error' => 'invalid_request',
      'message' => 'Ogiltig uppdatering av uppföljningsstatus.'
    ]);
  }

  $stmt = $pdo->prepare('UPDATE contact_messages SET follow_up_status = :status WHERE id = :id');
  $stmt->execute([
    ':status' => $followUpStatus,
    ':id' => $id
  ]);

  api_respond_json(200, [
    'ok' => true,
    'id' => $id,
    'followUpStatus' => $followUpStatus
  ]);
}

$limit = isset($_GET['limit']) ? (int) $_GET['limit'] : 40;
$limit = max(1, min(100, $limit));
$followUpStatus = isset($_GET['followUpStatus']) && is_string($_GET['followUpStatus']) ? trim($_GET['followUpStatus']) : '';
$whereParts = [];
$params = [];

if (in_array($followUpStatus, ['new', 'replied', 'closed'], true)) {
  $whereParts[] = 'follow_up_status = :follow_up_status';
  $params[':follow_up_status'] = $followUpStatus;
}

$whereSql = count($whereParts) > 0 ? 'WHERE ' . implode(' AND ', $whereParts) : '';
$sql = <<<SQL
SELECT
  id,
  lead_kind,
  name,
  email,
  message,
  inquiry_slug,
  inquiry_title,
  inquiry_status,
  inquiry_price_label,
  inquiry_source_url,
  inquiry_language,
  follow_up_status,
  mail_delivered,
  created_at
FROM contact_messages
{$whereSql}
ORDER BY created_at DESC
LIMIT :limit
SQL;

$stmt = $pdo->prepare($sql);
foreach ($params as $key => $value) {
  $stmt->bindValue($key, $value, PDO::PARAM_STR);
}
$stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
$stmt->execute();
$rows = $stmt->fetchAll();

api_respond_json(200, [
  'ok' => true,
  'inquiries' => is_array($rows) ? $rows : []
]);
