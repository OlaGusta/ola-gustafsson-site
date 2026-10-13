<?php
declare(strict_types=1);

// Kunden avbryter en obetald beställning från ordersidan. POST {"token": "<orderns token>"}.
require __DIR__ . '/shop_lib.php';

api_require_method('POST');
$pdo = api_get_pdo();
shop_ensure_schema($pdo);

$body = api_decode_request_json();
$token = isset($body['token']) && is_string($body['token']) ? strtolower(trim($body['token'])) : '';
$order = shop_find_order_by_token($pdo, $token);
if (!$order) {
  api_respond_json(404, ['ok' => false, 'error' => 'not_found', 'message' => 'Beställningen hittades inte.']);
}
try {
  $order = shop_customer_cancel($pdo, $order);
} catch (InvalidArgumentException $error) {
  api_respond_json(422, ['ok' => false, 'error' => 'invalid_state', 'message' => $error->getMessage()]);
}
api_respond_json(200, ['ok' => true, 'status' => $order['status']]);
