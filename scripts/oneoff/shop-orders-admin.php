<?php
/**
 * Engångsskript för ordertabellerna (shop_orders/shop_order_items), utanför Studio.
 * Laddas upp till api/ under ett tillfälligt namn, anropas med ?token=...&action=list|purge
 * och raderas direkt efteråt. purge tömmer ALLA ordrar: bara före lansering/efter test.
 */
declare(strict_types=1);

const ADMIN_TOKEN = '__SYNC_TOKEN__';

require __DIR__ . '/shop_lib.php';

api_require_method('GET');
$token = isset($_GET['token']) && is_string($_GET['token']) ? $_GET['token'] : '';
if (str_starts_with(ADMIN_TOKEN, '__') || strlen(ADMIN_TOKEN) < 32 || !hash_equals(ADMIN_TOKEN, $token)) {
  api_respond_json(403, ['ok' => false, 'error' => 'forbidden']);
}
$action = isset($_GET['action']) && is_string($_GET['action']) ? $_GET['action'] : 'list';
$pdo = api_get_pdo();
shop_ensure_schema($pdo);

if ($action === 'purge') {
  $orders = (int) $pdo->query('SELECT COUNT(*) FROM shop_orders')->fetchColumn();
  $pdo->exec('DELETE FROM shop_order_items');
  $pdo->exec('DELETE FROM shop_orders');
  api_respond_json(200, ['ok' => true, 'purged' => $orders]);
}

$rows = shop_list_orders($pdo, '', 200);
api_respond_json(200, ['ok' => true, 'count' => count($rows), 'orders' => array_map(static fn (array $o): array => [
  'order_no' => $o['order_no'], 'status' => $o['status'], 'total' => (int) $o['total_sek'],
  'customer' => $o['customer_name'] . ' <' . $o['customer_email'] . '>', 'created' => $o['created_at'],
  'items' => array_map(static fn (array $i): string => $i['kind'] . ':' . $i['ref'] . ' ×' . $i['qty'], $o['items'])
], $rows)]);
