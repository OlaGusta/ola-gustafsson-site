<?php
declare(strict_types=1);

// Kassan: ordertabeller, prisberäkning mot katalogen, ordernummer, mejl.
// Delas av api/shop.php (kunden lägger order), order.php (orderns sida) och
// Studios orderflik (api/orders.php).

require_once __DIR__ . '/bootstrap.php';
require_once dirname(__DIR__) . '/seo.php';
require_once dirname(__DIR__) . '/portfolio_core.php';

const SHOP_VAT_RATE_PRINT = 25;
const SHOP_VAT_RATE_ORIGINAL = 0;
const SHOP_STATUSES = ['pending', 'paid', 'shipped', 'completed', 'cancelled'];

function shop_ensure_schema(PDO $pdo): void
{
  $pdo->exec(
    <<<SQL
CREATE TABLE IF NOT EXISTS shop_orders (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  order_no VARCHAR(16) NOT NULL,
  token CHAR(40) NOT NULL,
  status VARCHAR(16) NOT NULL DEFAULT 'pending',
  language VARCHAR(8) NOT NULL DEFAULT 'sv',
  customer_name VARCHAR(120) NOT NULL,
  customer_email VARCHAR(190) NOT NULL,
  customer_phone VARCHAR(40) NULL,
  address_line VARCHAR(190) NOT NULL,
  postal_code VARCHAR(16) NOT NULL,
  city VARCHAR(80) NOT NULL,
  country VARCHAR(2) NOT NULL DEFAULT 'SE',
  note TEXT NULL,
  subtotal_sek INT UNSIGNED NOT NULL DEFAULT 0,
  shipping_sek INT UNSIGNED NOT NULL DEFAULT 0,
  shipping_vat_rate TINYINT UNSIGNED NOT NULL DEFAULT 25,
  total_sek INT UNSIGNED NOT NULL DEFAULT 0,
  vat_sek INT UNSIGNED NOT NULL DEFAULT 0,
  paid_sek INT UNSIGNED NULL,
  paid_method VARCHAR(32) NULL,
  paid_at DATETIME NULL,
  shipped_at DATETIME NULL,
  tracking_no VARCHAR(80) NULL,
  cancelled_at DATETIME NULL,
  admin_note TEXT NULL,
  reminder_sent_at DATETIME NULL,
  mail_delivered TINYINT(1) NOT NULL DEFAULT 0,
  ip_hash CHAR(64) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY shop_orders_no_unique (order_no),
  UNIQUE KEY shop_orders_token_unique (token),
  INDEX shop_orders_status_idx (status, created_at)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
SQL
  );
  $pdo->exec(
    <<<SQL
CREATE TABLE IF NOT EXISTS shop_order_items (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  order_id BIGINT UNSIGNED NOT NULL,
  kind VARCHAR(24) NOT NULL,
  ref VARCHAR(190) NOT NULL,
  title VARCHAR(255) NOT NULL,
  detail VARCHAR(255) NULL,
  qty SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  unit_sek INT UNSIGNED NOT NULL,
  vat_rate TINYINT UNSIGNED NOT NULL DEFAULT 25,
  edition_no SMALLINT UNSIGNED NULL,
  sort SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  INDEX shop_order_items_order_idx (order_id, sort),
  INDEX shop_order_items_ref_idx (kind, ref)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
SQL
  );
  api_schema_add_column_if_missing($pdo, 'shop_orders', 'payment_choice', "VARCHAR(16) NOT NULL DEFAULT 'swish'");
}

// Leveransblock för mejl. Ordrar som skapas i Studio kan sakna adress.
function shop_address_text(array $order, string $lang): string
{
  $address = trim((string) ($order['address_line'] ?? ''));
  if ($address === '') {
    return $lang === 'en'
      ? "Delivery address: please reply to this email with your address, or let me know if you would rather collect the work in Stockholm."
      : "Leveransadress: svara på det här mejlet med din adress, eller säg till om du hellre hämtar verket i Stockholm.";
  }
  return ($lang === 'en' ? "Delivery to:\n" : "Leverans till:\n")
    . "{$order['customer_name']}\n{$address}\n{$order['postal_code']} {$order['city']}";
}

// Sålda postrar (alla ordrar utom avbrutna) och antal kvar att sälja.
function shop_poster_sold(PDO $pdo): int
{
  $stmt = $pdo->prepare(
    'SELECT COALESCE(SUM(i.qty), 0) FROM shop_order_items i JOIN shop_orders o ON o.id = i.order_id
     WHERE i.kind = \'poster\' AND o.status <> \'cancelled\''
  );
  $stmt->execute();
  return (int) $stmt->fetchColumn();
}

function shop_poster_available(PDO $pdo, array $payload): int
{
  $cfg = seo_poster_config($payload, 'sv');
  return max(0, $cfg['stock'] - shop_poster_sold($pdo));
}

// Betalsätt kunden valt i kassan: swish eller bank.
function shop_payment_choice(array $order): string
{
  return isset($order['payment_choice']) && $order['payment_choice'] === 'bank' ? 'bank' : 'swish';
}

function shop_payload(): array
{
  static $payload = null;
  if ($payload === null) {
    $payload = portfolio_load_overrides();
  }
  return $payload;
}

function shop_money(int $amount, string $lang = 'sv'): string
{
  return number_format($amount, 0, ',', "\u{00a0}") . ($lang === 'en' ? ' SEK' : ' kr');
}

// Momsbelopp som ingår i ett pris inkl. moms.
function shop_vat_included(int $amount, int $rate): int
{
  if ($rate <= 0) {
    return 0;
  }
  return (int) round($amount - $amount / (1 + $rate / 100));
}

// Antal sålda eller reserverade exemplar av ett tryck (för upplagan om 20).
function shop_edition_used(PDO $pdo, string $kind, string $ref): int
{
  $stmt = $pdo->prepare(
    'SELECT COALESCE(SUM(i.qty), 0) FROM shop_order_items i
     JOIN shop_orders o ON o.id = i.order_id
     WHERE i.kind = :kind AND i.ref = :ref AND o.status IN (\'pending\', \'paid\', \'shipped\', \'completed\')'
  );
  $stmt->execute([':kind' => $kind, ':ref' => $ref]);
  return (int) $stmt->fetchColumn();
}

// Nästa lediga upplagenummer för ett tryck. Rader med flera exemplar upptar
// intervallet edition_no .. edition_no + qty - 1.
function shop_next_edition_no(PDO $pdo, string $kind, string $ref): int
{
  $stmt = $pdo->prepare(
    'SELECT COALESCE(MAX(i.edition_no + i.qty - 1), 0) FROM shop_order_items i
     JOIN shop_orders o ON o.id = i.order_id
     WHERE i.kind = :kind AND i.ref = :ref AND i.edition_no IS NOT NULL AND o.status <> \'cancelled\''
  );
  $stmt->execute([':kind' => $kind, ':ref' => $ref]);
  return (int) $stmt->fetchColumn() + 1;
}

// Gör om kundvagnens rader till kontrollerade orderrader med serverns priser.
// Kastar InvalidArgumentException med ett meddelande kunden kan visa.
function shop_resolve_items(PDO $pdo, array $cartItems, string $lang, bool $allowReserved = false): array
{
  $payload = shop_payload();
  $catalog = seo_shop_catalog($payload);
  $cfg = seo_shop_config($payload);
  $lines = [];
  $sort = 0;
  $seenOriginals = [];

  foreach ($cartItems as $raw) {
    if (!is_array($raw)) {
      continue;
    }
    $kind = isset($raw['kind']) && is_string($raw['kind']) ? $raw['kind'] : '';
    $ref = isset($raw['ref']) && is_string($raw['ref']) ? trim($raw['ref']) : (isset($raw['ref']) && is_int($raw['ref']) ? (string) $raw['ref'] : '');
    $size = isset($raw['size']) && is_string($raw['size']) ? trim($raw['size']) : '';
    $qty = isset($raw['qty']) && is_numeric($raw['qty']) ? max(1, min(20, (int) $raw['qty'])) : 1;

    if ($kind === 'poster') {
      $poster = seo_poster_config($payload, $lang);
      if (!$poster['enabled'] || $poster['price'] <= 0) {
        throw new InvalidArgumentException($lang === 'en' ? 'The poster is not for sale right now.' : 'Postern säljs inte just nu.');
      }
      $available = shop_poster_available($pdo, $payload);
      if ($qty > $poster['maxPerOrder']) {
        throw new InvalidArgumentException(sprintf($lang === 'en' ? 'At most %d posters per order.' : 'Högst %d postrar per beställning.', $poster['maxPerOrder']));
      }
      if ($available <= 0) {
        throw new InvalidArgumentException($lang === 'en' ? 'The poster is sold out.' : 'Postern är slutsåld.');
      }
      if ($qty > $available) {
        throw new InvalidArgumentException(sprintf($lang === 'en' ? 'Only %d posters left.' : 'Bara %d postrar kvar.', $available));
      }
      $lines[] = [
        'kind' => 'poster', 'ref' => 'poster', 'title' => $poster['title'],
        'detail' => $poster['description'] !== '' ? (function_exists('mb_substr') ? (string) mb_substr($poster['description'], 0, 190) : substr($poster['description'], 0, 190)) : ($lang === 'en' ? 'Printed poster' : 'Tryckt poster'),
        'qty' => $qty, 'unit' => $poster['price'], 'vat' => SHOP_VAT_RATE_PRINT, 'edition' => null, 'sort' => $sort++
      ];
      continue;
    }

    if ($kind === 'extra' && $allowReserved) {
      // Fri rad från Studio: ram, montering, serviceavgift. Pris inkl. 25 % moms.
      $title = isset($raw['title']) && is_string($raw['title']) ? trim($raw['title']) : '';
      $amount = isset($raw['amount']) && is_numeric($raw['amount']) ? (int) round((float) $raw['amount']) : 0;
      if ($title === '' || $amount <= 0) {
        continue;
      }
      $lines[] = [
        'kind' => 'extra', 'ref' => '', 'title' => function_exists('mb_substr') ? (string) mb_substr($title, 0, 190) : substr($title, 0, 190),
        'detail' => isset($raw['detail']) && is_string($raw['detail']) ? trim($raw['detail']) : '',
        'qty' => 1, 'unit' => $amount, 'vat' => SHOP_VAT_RATE_PRINT, 'edition' => null, 'sort' => $sort++
      ];
      continue;
    }

    if ($kind === 'original') {
      $art = $catalog['artworks'][$ref] ?? null;
      if (!$art || isset($seenOriginals[$ref])) {
        throw new InvalidArgumentException($lang === 'en' ? 'A work in the cart could not be found.' : 'Ett verk i kundvagnen gick inte att hitta.');
      }
      $reservedOk = $allowReserved && $art['availability'] === 'reserved' && (int) $art['price'] > 0;
      if (!$art['originalForSale'] && !$reservedOk) {
        throw new InvalidArgumentException(sprintf($lang === 'en' ? '"%s" is no longer available.' : '"%s" är inte längre tillgänglig.', $art['title']));
      }
      $seenOriginals[$ref] = true;
      $lines[] = [
        'kind' => 'original', 'ref' => $ref, 'title' => $art['title'],
        'detail' => trim(($lang === 'en' ? 'Original, watercolour' : 'Original, akvarell') . ($art['format'] !== '' ? ', ' . $art['format'] : '')),
        'qty' => 1, 'unit' => (int) $art['price'], 'vat' => SHOP_VAT_RATE_ORIGINAL, 'edition' => null, 'sort' => $sort++
      ];
      if (!empty($raw['mat']) && $art['matPrice'] > 0) {
        $lines[] = [
          'kind' => 'mat', 'ref' => $ref, 'title' => ($lang === 'en' ? 'Mat with backing board for ' : 'Passepartout med bakstycke till ') . $art['title'],
          'detail' => ($lang === 'en' ? 'Frame size ' : 'Ramformat ') . str_replace('x', ' × ', $art['matClass']) . ' cm',
          'qty' => 1, 'unit' => (int) $art['matPrice'], 'vat' => SHOP_VAT_RATE_PRINT, 'edition' => null, 'sort' => $sort++
        ];
      }
      continue;
    }

    if ($kind === 'print') {
      $art = $catalog['artworks'][$ref] ?? null;
      $sizes = $art ? $art['prints'] : [];
      $match = null;
      foreach ($sizes as $candidate) {
        if (seo_print_format_key($candidate['format']) === seo_print_format_key($size)) {
          $match = $candidate;
        }
      }
      if (!$art || !$match || $match['price'] <= 0) {
        throw new InvalidArgumentException($lang === 'en' ? 'A print size in the cart is not available.' : 'Ett printformat i kundvagnen finns inte.');
      }
      $used = shop_edition_used($pdo, 'print', $ref);
      if ($used + $qty > $cfg['editionSize']) {
        throw new InvalidArgumentException(sprintf($lang === 'en' ? 'The edition of "%s" is sold out.' : 'Upplagan av "%s" är slut.', $art['title']));
      }
      $lines[] = [
        'kind' => 'print', 'ref' => $ref, 'title' => 'Fine Art Print – ' . $art['title'],
        'detail' => seo_print_frame_label($match['format'], $lang) . ($match['image'] !== '' ? ' (' . ($lang === 'en' ? 'image ' : 'bild ') . $match['image'] . ')' : ''),
        'qty' => $qty, 'unit' => (int) $match['price'], 'vat' => SHOP_VAT_RATE_PRINT, 'edition' => null, 'sort' => $sort++
      ];
      continue;
    }

    if ($kind === 'sun') {
      $day = (int) $ref;
      $match = null;
      foreach ($catalog['sunPrints'] as $candidate) {
        if (seo_print_format_key($candidate['format']) === seo_print_format_key($size)) {
          $match = $candidate;
        }
      }
      if ($day < 1 || $day > 100 || !$match || $match['price'] <= 0) {
        throw new InvalidArgumentException($lang === 'en' ? 'A sun in the cart is not available.' : 'En sol i kundvagnen finns inte.');
      }
      $used = shop_edition_used($pdo, 'sun', (string) $day);
      if ($used + $qty > $cfg['editionSize']) {
        throw new InvalidArgumentException(sprintf($lang === 'en' ? 'The edition of sun %d is sold out.' : 'Upplagan av sol %d är slut.', $day));
      }
      $lines[] = [
        'kind' => 'sun', 'ref' => (string) $day, 'title' => sprintf($lang === 'en' ? '100 days of sun – day %d' : '100 dagar av sol – dag %d', $day),
        'detail' => 'Fine Art Print, ' . seo_print_frame_label($match['format'], $lang) . ($match['image'] !== '' ? ' (' . ($lang === 'en' ? 'image ' : 'bild ') . $match['image'] . ')' : ''),
        'qty' => $qty, 'unit' => (int) $match['price'], 'vat' => SHOP_VAT_RATE_PRINT, 'edition' => null, 'sort' => $sort++
      ];
      continue;
    }
  }

  if ($lines === []) {
    throw new InvalidArgumentException($lang === 'en' ? 'The cart is empty.' : 'Kundvagnen är tom.');
  }
  return $lines;
}

// Summor: frakt 150 kr per beställning. Frakten följer momsen på varorna: 25 % om
// något i ordern är momspliktigt, annars momsfri (bara original).
function shop_totals(array $lines, ?int $shippingOverride = null): array
{
  $payload = shop_payload();
  $cfg = seo_shop_config($payload);
  $subtotal = 0;
  $vat = 0;
  $taxable = false;
  foreach ($lines as $line) {
    $amount = $line['unit'] * $line['qty'];
    $subtotal += $amount;
    $vat += shop_vat_included($amount, $line['vat']);
    if ($line['vat'] > 0) {
      $taxable = true;
    }
  }
  $shipping = (int) $cfg['shippingPrint'];
  foreach ($lines as $line) {
    if ($line['kind'] === 'original') {
      $shipping = max($shipping, (int) $cfg['shippingOriginalSmall']);
    }
  }
  if ($shippingOverride !== null) {
    $shipping = max(0, $shippingOverride);
  }
  $shippingVatRate = $taxable ? SHOP_VAT_RATE_PRINT : 0;
  $vat += shop_vat_included($shipping, $shippingVatRate);
  return [
    'subtotal' => $subtotal,
    'shipping' => $shipping,
    'shippingVatRate' => $shippingVatRate,
    'total' => $subtotal + $shipping,
    'vat' => $vat
  ];
}

function shop_next_order_no(PDO $pdo): string
{
  $year = date('Y');
  $stmt = $pdo->prepare('SELECT order_no FROM shop_orders WHERE order_no LIKE :prefix ORDER BY order_no DESC LIMIT 1');
  $stmt->execute([':prefix' => $year . '-%']);
  $last = (string) $stmt->fetchColumn();
  $next = $last !== '' ? (int) substr($last, 5) + 1 : 1;
  return sprintf('%s-%04d', $year, $next);
}

function shop_find_order_by_token(PDO $pdo, string $token): ?array
{
  if (preg_match('/^[a-f0-9]{40}$/', $token) !== 1) {
    return null;
  }
  $stmt = $pdo->prepare('SELECT * FROM shop_orders WHERE token = :token LIMIT 1');
  $stmt->execute([':token' => $token]);
  $order = $stmt->fetch();
  if (!is_array($order)) {
    return null;
  }
  $order['items'] = shop_order_items($pdo, (int) $order['id']);
  return $order;
}

function shop_order_items(PDO $pdo, int $orderId): array
{
  $stmt = $pdo->prepare('SELECT * FROM shop_order_items WHERE order_id = :id ORDER BY sort ASC, id ASC');
  $stmt->execute([':id' => $orderId]);
  $rows = $stmt->fetchAll();
  return is_array($rows) ? $rows : [];
}

function shop_order_url(array $order, string $lang = 'sv'): string
{
  $url = seo_base_url() . '/order/' . $order['token'];
  return $lang === 'en' ? $url . '?lang=en' : $url;
}

// Förifylld Swish-QR från Swish egen generator (Guide Swish QR code specification,
// avsnitt 4): nummer, belopp och meddelande låsta. Tom sträng om tjänsten inte svarar.
function shop_fetch_swish_qr(string $payee, int $amount, string $message, bool $messageEditable = false): string
{
  $request = json_encode([
    'format' => 'png',
    'size' => 400,
    'border' => 0,
    'payee' => ['value' => $payee, 'editable' => false],
    'amount' => ['value' => $amount, 'editable' => false],
    'message' => ['value' => $message, 'editable' => $messageEditable]
  ]);
  if (!is_string($request) || !function_exists('curl_init')) {
    return '';
  }
  $ch = curl_init('https://mpc.getswish.net/qrg-swish/api/v1/prefilled');
  if ($ch === false) {
    return '';
  }
  curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $request,
    CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CONNECTTIMEOUT => 5,
    CURLOPT_TIMEOUT => 10
  ]);
  $body = curl_exec($ch);
  $status = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
  curl_close($ch);
  return $status === 200 && is_string($body) && str_starts_with($body, "\x89PNG") ? $body : '';
}

function shop_swish_qr_url(array $order): string
{
  return '/api/swish-qr.php?token=' . $order['token'];
}

function shop_edition_label(array $item): string
{
  $first = (int) ($item['edition_no'] ?? 0);
  $qty = max(1, (int) ($item['qty'] ?? 1));
  if ($first <= 0) {
    return '';
  }
  $range = $qty > 1 ? sprintf('%d–%d', $first, $first + $qty - 1) : (string) $first;
  return $range . '/' . SEO_PRINT_EDITION_SIZE;
}

function shop_find_order_by_id(PDO $pdo, int $id): ?array
{
  $stmt = $pdo->prepare('SELECT * FROM shop_orders WHERE id = :id LIMIT 1');
  $stmt->execute([':id' => $id]);
  $order = $stmt->fetch();
  if (!is_array($order)) {
    return null;
  }
  $order['items'] = shop_order_items($pdo, (int) $order['id']);
  return $order;
}

function shop_list_orders(PDO $pdo, string $status = '', int $limit = 60): array
{
  $where = '';
  $params = [];
  if ($status !== '' && in_array($status, SHOP_STATUSES, true)) {
    $where = 'WHERE status = :status';
    $params[':status'] = $status;
  } elseif ($status === 'open') {
    $where = "WHERE status IN ('pending', 'paid')";
  }
  $stmt = $pdo->prepare("SELECT * FROM shop_orders {$where} ORDER BY created_at DESC LIMIT " . max(1, min(200, $limit)));
  $stmt->execute($params);
  $orders = $stmt->fetchAll();
  if (!is_array($orders) || $orders === []) {
    return [];
  }
  $ids = array_map(static fn (array $o): int => (int) $o['id'], $orders);
  $in = implode(',', array_fill(0, count($ids), '?'));
  $itemStmt = $pdo->prepare("SELECT * FROM shop_order_items WHERE order_id IN ({$in}) ORDER BY sort ASC, id ASC");
  $itemStmt->execute($ids);
  $byOrder = [];
  foreach ($itemStmt->fetchAll() ?: [] as $item) {
    $byOrder[(int) $item['order_id']][] = $item;
  }
  foreach ($orders as &$order) {
    $order['items'] = $byOrder[(int) $order['id']] ?? [];
  }
  unset($order);
  return $orders;
}

// Markera betald: status, belopp, sätt; original blir sålda; kunden får mejl.
function shop_mark_paid(PDO $pdo, array $order, int $paidAmount, string $method, bool $notify = true): array
{
  if ($order['status'] !== 'pending') {
    throw new InvalidArgumentException('Bara ordrar som väntar på betalning kan markeras betalda.');
  }
  $pdo->prepare('UPDATE shop_orders SET status = \'paid\', paid_sek = :amount, paid_method = :method, paid_at = UTC_TIMESTAMP() WHERE id = :id')
    ->execute([':amount' => $paidAmount, ':method' => $method !== '' ? $method : null, ':id' => (int) $order['id']]);
  foreach ($order['items'] as $item) {
    if ($item['kind'] === 'original') {
      try {
        portfolio_set_artwork_availability((string) $item['ref'], 'sold', $pdo);
      } catch (Throwable $error) {
        // Statusen i innehållet får rättas för hand i Studio om skrivningen misslyckas.
      }
    }
  }
  $updated = shop_find_order_by_id($pdo, (int) $order['id']) ?? $order;
  $lang = $updated['language'] === 'en' ? 'en' : 'sv';
  $url = shop_order_url($updated, $lang);
  $summary = shop_order_summary_text($updated, $lang);
  if (!$notify) {
    return $updated;
  }
  $addressText = shop_address_text($updated, $lang);
  $body = $lang === 'en'
    ? "Hi {$updated['customer_name']},\n\nThank you, your payment for order {$updated['order_no']} has arrived.\n\n{$summary}\n\nThe order is now being prepared.\n{$addressText}\n\nYou will get another email with the tracking number when it is on its way. Order page: {$url}\n\nOla Gustafsson\nola@olagustafsson.com"
    : "Hej {$updated['customer_name']},\n\nTack, din betalning för beställning {$updated['order_no']} har kommit in.\n\n{$summary}\n\nBeställningen görs nu i ordning.\n{$addressText}\n\nDu får ett nytt mejl med spårningsnummer när den är på väg. Ordersida: {$url}\n\nOla Gustafsson\nola@olagustafsson.com";
  $subject = $lang === 'en' ? "Payment received – order {$updated['order_no']}" : "Betalning mottagen – beställning {$updated['order_no']}";
  api_security_send_mail($updated['customer_email'], $subject, $body, api_security_contact_recipient());
  return $updated;
}

// Ångra "betald": tillbaka till väntar på betalning. Mejlet som gick ut går inte att
// ta tillbaka; original som blivit sålda blir reserverade igen.
function shop_unmark_paid(PDO $pdo, array $order): array
{
  if ($order['status'] !== 'paid') {
    throw new InvalidArgumentException('Bara betalda, ännu inte skickade, ordrar kan ångras.');
  }
  $pdo->prepare('UPDATE shop_orders SET status = \'pending\', paid_sek = NULL, paid_method = NULL, paid_at = NULL WHERE id = :id')
    ->execute([':id' => (int) $order['id']]);
  foreach ($order['items'] as $item) {
    if ($item['kind'] === 'original') {
      try {
        portfolio_set_artwork_availability((string) $item['ref'], 'reserved', $pdo);
      } catch (Throwable $error) {
        // Rättas för hand om skrivningen misslyckas.
      }
    }
  }
  return shop_find_order_by_id($pdo, (int) $order['id']) ?? $order;
}

function shop_mark_shipped(PDO $pdo, array $order, string $trackingNo): array
{
  if (!in_array($order['status'], ['paid', 'shipped'], true)) {
    throw new InvalidArgumentException('Bara betalda ordrar kan markeras skickade.');
  }
  $pdo->prepare('UPDATE shop_orders SET status = \'shipped\', shipped_at = UTC_TIMESTAMP(), tracking_no = :tracking WHERE id = :id')
    ->execute([':tracking' => $trackingNo !== '' ? $trackingNo : null, ':id' => (int) $order['id']]);
  $updated = shop_find_order_by_id($pdo, (int) $order['id']) ?? $order;
  $lang = $updated['language'] === 'en' ? 'en' : 'sv';
  $url = shop_order_url($updated, $lang);
  $tracking = $trackingNo !== ''
    ? ($lang === 'en' ? "Tracking number: {$trackingNo}\n\n" : "Spårningsnummer: {$trackingNo}\n\n")
    : '';
  $body = $lang === 'en'
    ? "Hi {$updated['customer_name']},\n\nYour order {$updated['order_no']} has been shipped.\n\n{$tracking}Order page: {$url}\n\nAs a private customer you have a 14-day right of withdrawal from the day you receive the work.\n\nOla Gustafsson\nola@olagustafsson.com"
    : "Hej {$updated['customer_name']},\n\nDin beställning {$updated['order_no']} är skickad.\n\n{$tracking}Ordersida: {$url}\n\nSom privatperson har du 14 dagars ångerrätt från att du tagit emot verket.\n\nOla Gustafsson\nola@olagustafsson.com";
  $subject = $lang === 'en' ? "Shipped – order {$updated['order_no']}" : "Skickad – beställning {$updated['order_no']}";
  api_security_send_mail($updated['customer_email'], $subject, $body, api_security_contact_recipient());
  return $updated;
}

// Avbryt: original släpps (tillgängliga igen), upplagenummer frigörs genom statusen.
function shop_cancel_order(PDO $pdo, array $order): array
{
  if (in_array($order['status'], ['cancelled', 'completed'], true)) {
    throw new InvalidArgumentException('Ordern kan inte avbrytas.');
  }
  $pdo->prepare('UPDATE shop_orders SET status = \'cancelled\', cancelled_at = UTC_TIMESTAMP() WHERE id = :id')
    ->execute([':id' => (int) $order['id']]);
  foreach ($order['items'] as $item) {
    if ($item['kind'] === 'original') {
      try {
        portfolio_set_artwork_availability((string) $item['ref'], 'available', $pdo);
      } catch (Throwable $error) {
        // Rättas för hand om skrivningen misslyckas.
      }
    }
  }
  return shop_find_order_by_id($pdo, (int) $order['id']) ?? $order;
}

// Kunden avbryter själv från ordersidan, bara så länge ordern inte är betald.
function shop_customer_cancel(PDO $pdo, array $order): array
{
  if ($order['status'] !== 'pending') {
    throw new InvalidArgumentException('Ordern är redan betald. Mejla ola@olagustafsson.com om du vill ångra köpet.');
  }
  $updated = shop_cancel_order($pdo, $order);
  $lang = $updated['language'] === 'en' ? 'en' : 'sv';
  $subject = $lang === 'en' ? "Order {$updated['order_no']} cancelled" : "Beställning {$updated['order_no']} avbruten";
  $body = $lang === 'en'
    ? "Hi {$updated['customer_name']},\n\nYour order {$updated['order_no']} has been cancelled as requested. Nothing has been charged.\n\nOla Gustafsson\nola@olagustafsson.com"
    : "Hej {$updated['customer_name']},\n\nDin beställning {$updated['order_no']} är avbruten enligt önskemål. Inget har debiterats.\n\nOla Gustafsson\nola@olagustafsson.com";
  api_security_send_mail($updated['customer_email'], $subject, $body, api_security_contact_recipient());
  api_security_send_mail(api_security_contact_recipient(), "Kunden avbröt beställning {$updated['order_no']}", "Kunden {$updated['customer_name']} avbröt beställning {$updated['order_no']} (" . shop_money((int) $updated['total_sek']) . ") från ordersidan innan betalning.\n", $updated['customer_email']);
  return $updated;
}

function shop_complete_order(PDO $pdo, array $order): array
{
  if ($order['status'] !== 'shipped') {
    throw new InvalidArgumentException('Bara skickade ordrar kan markeras klara.');
  }
  $pdo->prepare('UPDATE shop_orders SET status = \'completed\' WHERE id = :id')->execute([':id' => (int) $order['id']]);
  return shop_find_order_by_id($pdo, (int) $order['id']) ?? $order;
}

function shop_status_label(string $status, string $lang): string
{
  $labels = [
    'pending' => ['sv' => 'Väntar på betalning', 'en' => 'Awaiting payment'],
    'paid' => ['sv' => 'Betald', 'en' => 'Paid'],
    'shipped' => ['sv' => 'Skickad', 'en' => 'Shipped'],
    'completed' => ['sv' => 'Klar', 'en' => 'Completed'],
    'cancelled' => ['sv' => 'Avbruten', 'en' => 'Cancelled']
  ];
  return $labels[$status][$lang === 'en' ? 'en' : 'sv'] ?? $status;
}

// Textsammanfattning av en order, till mejl.
function shop_order_summary_text(array $order, string $lang): string
{
  $out = [];
  foreach ($order['items'] as $item) {
    $amount = (int) $item['unit_sek'] * (int) $item['qty'];
    $label = (int) $item['qty'] > 1 ? sprintf('%d × %s', (int) $item['qty'], $item['title']) : $item['title'];
    $out[] = sprintf('%s%s – %s', $label, $item['detail'] ? ' (' . $item['detail'] . ')' : '', shop_money($amount, $lang));
  }
  $out[] = sprintf('%s – %s', $lang === 'en' ? 'Shipping' : 'Frakt', shop_money((int) $order['shipping_sek'], $lang));
  $out[] = sprintf('%s: %s', $lang === 'en' ? 'Total' : 'Att betala', shop_money((int) $order['total_sek'], $lang));
  $out[] = sprintf('%s: %s', $lang === 'en' ? 'Of which VAT' : 'Varav moms', shop_money((int) $order['vat_sek'], $lang));
  return implode("\n", $out);
}

function shop_send_order_mails(array $order, string $lang, bool $notifyCustomer = true, string $intro = ''): bool
{
  $payload = shop_payload();
  $details = seo_payment_details($payload);
  $url = shop_order_url($order, $lang);
  $summary = shop_order_summary_text($order, $lang);
  $choice = shop_payment_choice($order);
  $pay = [];
  if ($details['swish'] !== '' && ($choice === 'swish' || $details['bank'] === '')) {
    $pay[] = 'Swish ' . $details['swish'];
  }
  if ($details['bank'] !== '' && ($choice === 'bank' || $details['swish'] === '')) {
    $pay[] = ($lang === 'en' ? 'bank transfer to ' : 'bankkonto ') . $details['bank'];
  }
  $payText = $pay !== [] ? implode($lang === 'en' ? ' or ' : ' eller ', $pay) : '';

  if ($lang === 'en') {
    $customerSubject = sprintf('Order %s – Ola Gustafsson', $order['order_no']);
    $customerBody = "Hi {$order['customer_name']},\n\n" . ($intro !== '' ? $intro : 'Thank you for your order.') . "\n\n{$summary}\n\n"
      . "Pay by {$payText}. Write {$order['order_no']} as the message, and the order is confirmed as soon as the payment has arrived.\n"
      . ($choice === 'swish' ? "On the order page there is a Swish code with the amount and order number filled in.\n\n" : "\n")
      . "Order page with status and payment details: {$url}\n\n"
      . shop_address_text($order, 'en') . "\n\n"
      . "As a private customer you have a 14-day right of withdrawal from the day you receive the work.\n\nOla Gustafsson\nola@olagustafsson.com";
  } else {
    $customerSubject = sprintf('Beställning %s – Ola Gustafsson', $order['order_no']);
    $customerBody = "Hej {$order['customer_name']},\n\n" . ($intro !== '' ? $intro : 'Tack för din beställning.') . "\n\n{$summary}\n\n"
      . "Betala med {$payText}. Skriv {$order['order_no']} som meddelande, så bekräftas beställningen så snart betalningen kommit in.\n"
      . ($choice === 'swish' ? "På ordersidan finns en Swish-kod med belopp och ordernummer ifyllda.\n\n" : "\n")
      . "Ordersidan med status och betalningsuppgifter: {$url}\n\n"
      . shop_address_text($order, 'sv') . "\n\n"
      . "Som privatperson har du 14 dagars ångerrätt från att du tagit emot verket.\n\nOla Gustafsson\nola@olagustafsson.com";
  }
  $customerOk = $notifyCustomer
    ? api_security_send_mail($order['customer_email'], $customerSubject, $customerBody, api_security_contact_recipient())
    : false;

  $adminBody = "Ny beställning {$order['order_no']}\n\n{$summary}\n\nKunden betalar med: " . ($choice === 'bank' ? 'bankkonto' : 'Swish') . "\n"
    . "Kund: {$order['customer_name']} <{$order['customer_email']}>" . ($order['customer_phone'] ? ", {$order['customer_phone']}" : '') . "\n"
    . "Adress: " . (trim((string) $order['address_line']) !== '' ? "{$order['address_line']}, {$order['postal_code']} {$order['city']}" : 'saknas, kunden ombeds svara med adress') . "\n"
    . ($order['note'] ? "Meddelande: {$order['note']}\n" : '')
    . "\nStatus: väntar på betalning. Markera betald i Studio när pengarna kommit in.\n"
    . "Ordersida: " . shop_order_url($order, 'sv') . "\n";
  api_security_send_mail(api_security_contact_recipient(), "Ny beställning {$order['order_no']} – " . shop_money((int) $order['total_sek']), $adminBody, $order['customer_email']);

  return $customerOk;
}

// Skapar ordern i en transaktion, reserverar original, tilldelar upplagenummer.
function shop_create_order(PDO $pdo, array $lines, array $customer, string $lang, ?int $shippingOverride = null): array
{
  $totals = shop_totals($lines, $shippingOverride);
  $token = bin2hex(random_bytes(20));

  $pdo->beginTransaction();
  try {
    $orderNo = shop_next_order_no($pdo);
    $stmt = $pdo->prepare(
      'INSERT INTO shop_orders (order_no, token, status, language, customer_name, customer_email, customer_phone, address_line, postal_code, city, country, note,
        subtotal_sek, shipping_sek, shipping_vat_rate, total_sek, vat_sek, ip_hash, payment_choice)
       VALUES (:order_no, :token, \'pending\', :language, :name, :email, :phone, :address, :postal, :city, \'SE\', :note,
        :subtotal, :shipping, :shipping_vat_rate, :total, :vat, :ip_hash, :payment_choice)'
    );
    $stmt->execute([
      ':order_no' => $orderNo,
      ':token' => $token,
      ':language' => $lang,
      ':name' => $customer['name'],
      ':email' => $customer['email'],
      ':phone' => $customer['phone'] !== '' ? $customer['phone'] : null,
      ':address' => $customer['address'],
      ':postal' => $customer['postal'],
      ':city' => $customer['city'],
      ':note' => $customer['note'] !== '' ? $customer['note'] : null,
      ':subtotal' => $totals['subtotal'],
      ':shipping' => $totals['shipping'],
      ':shipping_vat_rate' => $totals['shippingVatRate'],
      ':total' => $totals['total'],
      ':vat' => $totals['vat'],
      ':ip_hash' => api_security_hash('ip:' . api_security_client_ip()),
      ':payment_choice' => ($customer['payment'] ?? '') === 'bank' ? 'bank' : 'swish'
    ]);
    $orderId = (int) $pdo->lastInsertId();

    $itemStmt = $pdo->prepare(
      'INSERT INTO shop_order_items (order_id, kind, ref, title, detail, qty, unit_sek, vat_rate, edition_no, sort)
       VALUES (:order_id, :kind, :ref, :title, :detail, :qty, :unit, :vat, :edition, :sort)'
    );
    foreach ($lines as $line) {
      $edition = null;
      if ($line['kind'] === 'print' || $line['kind'] === 'sun') {
        $edition = shop_next_edition_no($pdo, $line['kind'], $line['ref']);
      }
      $itemStmt->execute([
        ':order_id' => $orderId,
        ':kind' => $line['kind'],
        ':ref' => $line['ref'],
        ':title' => $line['title'],
        ':detail' => $line['detail'],
        ':qty' => $line['qty'],
        ':unit' => $line['unit'],
        ':vat' => $line['vat'],
        ':edition' => $edition,
        ':sort' => $line['sort']
      ]);
    }
    $pdo->commit();
  } catch (Throwable $error) {
    $pdo->rollBack();
    throw $error;
  }

  // Originalen reserveras i innehållet (fil + databas) så att ingen annan kan köpa dem.
  foreach ($lines as $line) {
    if ($line['kind'] === 'original') {
      try {
        portfolio_set_artwork_availability($line['ref'], 'reserved', $pdo);
      } catch (Throwable $error) {
        // Ordern finns; reservationen får göras för hand i Studio om skrivningen misslyckas.
      }
    }
  }

  $order = shop_find_order_by_token($pdo, $token);
  return is_array($order) ? $order : [];
}
