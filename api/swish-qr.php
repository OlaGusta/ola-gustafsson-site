<?php
declare(strict_types=1);

// Swish-QR för en order, hämtad från Swish egen generator (mpc.getswish.net) så att
// koden följer deras specifikation och fungerar i Swish-appen: nummer, belopp och
// ordernummer låsta. Bilden cachas per order i cache/swish-qr/.
// GET /api/swish-qr.php?token=<orderns token>

require __DIR__ . '/shop_lib.php';

$token = isset($_GET['token']) && is_string($_GET['token']) ? strtolower(trim($_GET['token'])) : '';
if (preg_match('/^[a-f0-9]{40}$/', $token) !== 1) {
  http_response_code(404);
  exit;
}

$pdo = api_get_pdo();
shop_ensure_schema($pdo);
$order = shop_find_order_by_token($pdo, $token);
if (!$order) {
  http_response_code(404);
  exit;
}

$details = seo_payment_details(shop_payload());
$payee = preg_replace('/[^0-9]/', '', $details['swish']);
if (!is_string($payee) || $payee === '') {
  http_response_code(404);
  exit;
}

$cacheDir = dirname(__DIR__) . '/cache/swish-qr';
$cacheFile = $cacheDir . '/' . $order['order_no'] . '-' . (int) $order['total_sek'] . '.png';
if (!is_file($cacheFile)) {
  if (!is_dir($cacheDir)) {
    @mkdir($cacheDir, 0755, true);
  }
  $png = shop_fetch_swish_qr($payee, (int) $order['total_sek'], (string) $order['order_no']);
  if ($png === '') {
    http_response_code(503);
    exit;
  }
  @file_put_contents($cacheFile, $png, LOCK_EX);
  header('Content-Type: image/png');
  header('Cache-Control: private, max-age=86400');
  echo $png;
  exit;
}

header('Content-Type: image/png');
header('Cache-Control: private, max-age=86400');
header('Content-Length: ' . (string) filesize($cacheFile));
readfile($cacheFile);
