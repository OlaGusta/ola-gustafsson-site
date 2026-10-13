<?php
declare(strict_types=1);

// Studio → Ordrar. GET listar ordrar (status=open|pending|paid|shipped|completed|cancelled),
// POST utför en åtgärd: mark_paid, mark_shipped, complete, cancel, note.

require __DIR__ . '/shop_lib.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if (!in_array($method, ['GET', 'POST'], true)) {
  header('Allow: GET, POST');
  api_respond_json(405, ['ok' => false, 'error' => 'method_not_allowed', 'message' => "Metoden {$method} stöds inte."]);
}

api_require_authenticated_user();

$pdo = api_get_pdo();
api_ensure_schema($pdo);
shop_ensure_schema($pdo);

$present = static function (array $order): array {
  $order['items'] = array_map(static function (array $item): array {
    $item['edition_label'] = shop_edition_label($item);
    return $item;
  }, $order['items']);
  $order['status_label'] = shop_status_label((string) $order['status'], 'sv');
  $order['order_url'] = shop_order_url($order, 'sv');
  return $order;
};

if ($method === 'GET') {
  $status = isset($_GET['status']) && is_string($_GET['status']) ? trim($_GET['status']) : 'open';
  $orders = shop_list_orders($pdo, $status === 'all' ? '' : $status, 100);
  api_respond_json(200, ['ok' => true, 'orders' => array_map($present, $orders)]);
}

$request = api_decode_request_json();
$action = isset($request['action']) && is_string($request['action']) ? trim($request['action']) : '';
$id = isset($request['id']) ? (int) $request['id'] : 0;
$order = $id > 0 ? shop_find_order_by_id($pdo, $id) : null;
if (!$order) {
  api_respond_json(404, ['ok' => false, 'error' => 'not_found', 'message' => 'Ordern hittades inte.']);
}

try {
  switch ($action) {
    case 'mark_paid':
      $amount = isset($request['paidAmount']) && is_numeric($request['paidAmount']) ? (int) $request['paidAmount'] : (int) $order['total_sek'];
      $paymentMethod = isset($request['method']) && is_string($request['method']) ? trim($request['method']) : 'swish';
      $order = shop_mark_paid($pdo, $order, $amount, in_array($paymentMethod, ['swish', 'bank', 'other'], true) ? $paymentMethod : 'swish');
      break;
    case 'unmark_paid':
      $order = shop_unmark_paid($pdo, $order);
      break;
    case 'mark_shipped':
      $tracking = isset($request['trackingNo']) && is_string($request['trackingNo']) ? trim($request['trackingNo']) : '';
      $order = shop_mark_shipped($pdo, $order, function_exists('mb_substr') ? (string) mb_substr($tracking, 0, 80) : substr($tracking, 0, 80));
      break;
    case 'complete':
      $order = shop_complete_order($pdo, $order);
      break;
    case 'cancel':
      $order = shop_cancel_order($pdo, $order);
      break;
    case 'note':
      $note = isset($request['adminNote']) && is_string($request['adminNote']) ? trim($request['adminNote']) : '';
      $pdo->prepare('UPDATE shop_orders SET admin_note = :note WHERE id = :id')
        ->execute([':note' => $note !== '' ? (function_exists('mb_substr') ? (string) mb_substr($note, 0, 2000) : substr($note, 0, 2000)) : null, ':id' => (int) $order['id']]);
      $order = shop_find_order_by_id($pdo, (int) $order['id']) ?? $order;
      break;
    default:
      api_respond_json(422, ['ok' => false, 'error' => 'invalid_action', 'message' => 'Okänd åtgärd.']);
  }
} catch (InvalidArgumentException $error) {
  api_respond_json(422, ['ok' => false, 'error' => 'invalid_state', 'message' => $error->getMessage()]);
}

api_respond_json(200, ['ok' => true, 'order' => $present($order)]);
