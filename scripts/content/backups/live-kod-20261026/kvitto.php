<?php
declare(strict_types=1);

// Kvitto (/order/<token>/kvitto): utskriftsvänlig sida för betalda ordrar.
// Samma token som ordersidan, så kunden kan hämta kvittot själv. Skriv ut → spara som PDF.
require __DIR__ . '/seo.php';
require_once __DIR__ . '/api/shop_lib.php';

$lang = seo_normalize_lang($_GET['lang'] ?? null);
$token = isset($_GET['token']) && is_string($_GET['token']) ? strtolower(trim($_GET['token'])) : '';
$payload = portfolio_load_overrides();
$fontStylesheetHref = seo_google_fonts_href($payload);
$h = static fn (string $value): string => htmlspecialchars($value, ENT_QUOTES);
$t = static fn (string $sv, string $en): string => $lang === 'en' ? $en : $sv;

$order = null;
try {
  $pdo = api_get_pdo();
  shop_ensure_schema($pdo);
  $order = shop_find_order_by_token($pdo, $token);
} catch (Throwable $error) {
  $order = null;
}
$paidStatuses = ['paid', 'shipped', 'completed'];
if (!$order || !in_array((string) $order['status'], $paidStatuses, true)) {
  http_response_code(404);
  header('Content-Type: text/html; charset=UTF-8');
  echo '<!DOCTYPE html><html lang="' . $h($lang) . '"><head><meta charset="UTF-8" /><title>' . $h($t('Inget kvitto', 'No receipt')) . '</title></head><body style="font-family:sans-serif;padding:2rem">'
    . '<p>' . $h($order ? $t('Kvittot finns när betalningen är registrerad.', 'The receipt is available once the payment has been registered.') : $t('Beställningen hittades inte.', 'Order not found.')) . '</p></body></html>';
  exit;
}

$sender = seo_receipt_sender();
$fmtDate = static function (?string $value): string {
  if (!$value) {
    return '';
  }
  try {
    return (new DateTimeImmutable($value, new DateTimeZone('UTC')))->setTimezone(new DateTimeZone('Europe/Stockholm'))->format('Y-m-d');
  } catch (Throwable $error) {
    return substr($value, 0, 10);
  }
};
$paidMethod = (string) ($order['paid_method'] ?? '');
$paidMethodLabel = $paidMethod === 'bank' ? $t('bankgiro/bankkonto', 'bank transfer') : ($paidMethod === 'swish' ? 'Swish' : $t('annat sätt', 'other'));

// Momsrader per sats.
$vatByRate = [];
$netByRate = [];
foreach ($order['items'] as $item) {
  $amount = (int) $item['unit_sek'] * (int) $item['qty'];
  $rate = (int) $item['vat_rate'];
  $vat = shop_vat_included($amount, $rate);
  $vatByRate[$rate] = ($vatByRate[$rate] ?? 0) + $vat;
  $netByRate[$rate] = ($netByRate[$rate] ?? 0) + ($amount - $vat);
}
$shipping = (int) $order['shipping_sek'];
if ($shipping > 0) {
  $rate = (int) $order['shipping_vat_rate'];
  $vat = shop_vat_included($shipping, $rate);
  $vatByRate[$rate] = ($vatByRate[$rate] ?? 0) + $vat;
  $netByRate[$rate] = ($netByRate[$rate] ?? 0) + ($shipping - $vat);
}
krsort($vatByRate);
$hasOriginal = false;
foreach ($order['items'] as $item) {
  if ($item['kind'] === 'original') {
    $hasOriginal = true;
  }
}
$customerName = (string) $order['customer_name'];
$pageTitle = sprintf($t('Kvitto %s – Ola Gustafsson', 'Receipt %s – Ola Gustafsson'), $order['order_no']);
?>
<!DOCTYPE html>
<html lang="<?= $h($lang) ?>">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <base href="/" />
    <title><?= $h($pageTitle) ?></title>
    <meta name="robots" content="noindex,nofollow" />
    <?php if ($fontStylesheetHref !== ''): ?>
      <link href="<?= $h($fontStylesheetHref) ?>" rel="stylesheet" />
    <?php endif; ?>
    <link rel="stylesheet" href="styles.css?v=20261013-11" />
  </head>
  <body class="receipt-body">
    <main class="receipt">
      <div class="receipt-toolbar">
        <a href="/order/<?= $h((string) $order['token']) ?>"><?= $h($t('← Till beställningen', '← Back to the order')) ?></a>
        <button type="button" onclick="window.print()"><?= $h($t('Skriv ut / spara som PDF', 'Print / save as PDF')) ?></button>
      </div>
      <header class="receipt-head">
        <div>
          <h1><?= $h($t('Kvitto', 'Receipt')) ?></h1>
          <p class="receipt-meta"><?= $h($t('Kvittonummer', 'Receipt no.')) ?> <strong><?= $h((string) $order['order_no']) ?></strong><br />
            <?= $h($t('Beställt', 'Ordered')) ?> <?= $h($fmtDate((string) $order['created_at'])) ?><br />
            <?= $h($t('Betalt', 'Paid')) ?> <?= $h($fmtDate($order['paid_at'] ?? null)) ?> <?= $h($t('via', 'by')) ?> <?= $h($paidMethodLabel) ?></p>
        </div>
        <div class="receipt-sender">
          <strong><?= $h($sender['name']) ?></strong><br />
          <?= $h($sender['address']) ?><br />
          <?= $h($sender['email']) ?><?= $sender['phone'] !== '' ? ' · ' . $h($sender['phone']) : '' ?><br />
          <?= $h($t('Org.nr', 'Org. no.')) ?> <?= $h($sender['orgnr']) ?> · <?= $h($t('Momsreg.nr', 'VAT no.')) ?> <?= $h($sender['vatNo']) ?><br />
          <?= $h($sender['fTax']) ?>
        </div>
      </header>

      <section class="receipt-customer">
        <h2><?= $h($t('Köpare', 'Buyer')) ?></h2>
        <p><?= $h($customerName) ?><br />
          <?php if (trim((string) $order['address_line']) !== ''): ?><?= $h((string) $order['address_line']) ?><br /><?= $h((string) $order['postal_code']) ?> <?= $h((string) $order['city']) ?><br /><?php endif; ?>
          <?= $h((string) $order['customer_email']) ?></p>
      </section>

      <table class="receipt-table">
        <thead>
          <tr><th><?= $h($t('Vara', 'Item')) ?></th><th class="num"><?= $h($t('Antal', 'Qty')) ?></th><th class="num"><?= $h($t('Moms', 'VAT')) ?></th><th class="num"><?= $h($t('Belopp', 'Amount')) ?></th></tr>
        </thead>
        <tbody>
          <?php foreach ($order['items'] as $item): ?>
            <tr>
              <td><?= $h((string) $item['title']) ?><?php if (!empty($item['detail'])): ?><br /><small><?= $h((string) $item['detail']) ?></small><?php endif; ?><?php if (!empty($item['edition_no'])): ?><br /><small><?= $h($t('Exemplar', 'Edition')) ?> <?= $h(shop_edition_label($item)) ?></small><?php endif; ?></td>
              <td class="num"><?= (int) $item['qty'] ?></td>
              <td class="num"><?= (int) $item['vat_rate'] ?> %</td>
              <td class="num"><?= $h(shop_money((int) $item['unit_sek'] * (int) $item['qty'], $lang)) ?></td>
            </tr>
          <?php endforeach; ?>
          <?php if ($shipping > 0): ?>
            <tr><td><?= $h($t('Frakt', 'Shipping')) ?></td><td class="num">1</td><td class="num"><?= (int) $order['shipping_vat_rate'] ?> %</td><td class="num"><?= $h(shop_money($shipping, $lang)) ?></td></tr>
          <?php endif; ?>
        </tbody>
        <tfoot>
          <tr class="receipt-total"><td colspan="3"><?= $h($t('Summa betald, inkl. moms', 'Total paid, incl. VAT')) ?></td><td class="num"><?= $h(shop_money((int) $order['total_sek'], $lang)) ?></td></tr>
          <?php foreach ($vatByRate as $rate => $vat): ?>
            <tr class="receipt-vat"><td colspan="3"><?= $h($t('Varav moms', 'Of which VAT')) ?> <?= (int) $rate ?> % (<?= $h($t('underlag', 'on')) ?> <?= $h(shop_money((int) $netByRate[$rate], $lang)) ?>)</td><td class="num"><?= $h(shop_money((int) $vat, $lang)) ?></td></tr>
          <?php endforeach; ?>
        </tfoot>
      </table>

      <?php if ($hasOriginal): ?>
        <p class="receipt-note"><?= $h($t('Originalverk säljs av upphovsmannen och är undantagna från moms (0 %).', 'Original works are sold by the artist and are exempt from VAT (0 %).')) ?></p>
      <?php endif; ?>
      <p class="receipt-note"><?= $h($t('Tack för ditt köp.', 'Thank you for your purchase.')) ?> <?= $h($sender['name']) ?>, <?= $h($sender['email']) ?></p>
    </main>
  </body>
</html>
