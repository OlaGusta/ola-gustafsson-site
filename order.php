<?php
declare(strict_types=1);

// Ordersidan (/order/<token>): status, varor, summor och betalningsuppgifter.
// Länken är hemlig (40 hex-tecken) och skickas i orderbekräftelsen.
require __DIR__ . '/seo.php';
require_once __DIR__ . '/api/shop_lib.php';

$lang = seo_normalize_lang($_GET['lang'] ?? null);
$token = isset($_GET['token']) && is_string($_GET['token']) ? strtolower(trim($_GET['token'])) : '';
$overridesRev = (int) (@filemtime(__DIR__ . '/overrides.js') ?: 0);
$overridesRevParam = $overridesRev > 0 ? (string) $overridesRev : '0';
$payload = portfolio_load_overrides();
$fontStylesheetHref = seo_google_fonts_href($payload);
$paymentDetails = seo_payment_details($payload);
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
if (!$order) {
  http_response_code(404);
}
$pageTitle = $order
  ? sprintf($t('Beställning %s | Ola Gustafsson', 'Order %s | Ola Gustafsson'), $order['order_no'])
  : $t('Beställningen hittades inte | Ola Gustafsson', 'Order not found | Ola Gustafsson');
$swishQrUrl = $order && seo_payment_details($payload)['swish'] !== '' ? shop_swish_qr_url($order) : '';
$paymentChoice = $order ? shop_payment_choice($order) : 'swish';
$showSwish = $swishQrUrl !== '' && ($paymentChoice === 'swish' || $paymentDetails['bank'] === '');
$showBank = $paymentDetails['bank'] !== '' && ($paymentChoice === 'bank' || $swishQrUrl === '');
$status = $order ? (string) $order['status'] : '';
?>
<!DOCTYPE html>
<html lang="<?= $h($lang) ?>">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <base href="/" />
    <title><?= $h($pageTitle) ?></title>
    <meta name="robots" content="noindex,nofollow" />
    <meta name="theme-color" content="#f3efe6" />
    <link id="favicon-png" rel="icon" type="image/png" sizes="32x32" href="/favicon-light-32x32.png?v=20260317-14" />
    <link id="favicon-ico" rel="icon" href="/favicon-light.ico?v=20260317-14" sizes="any" />
    <?php if ($fontStylesheetHref !== ''): ?>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link href="<?= $h($fontStylesheetHref) ?>" rel="stylesheet" />
    <?php endif; ?>
    <link rel="stylesheet" href="styles.css?v=20261013-11" />
    <script src="overrides.js?v=<?= $h($overridesRevParam) ?>"></script>
    <script src="content.js?v=20260928-01" defer></script>
    <script src="script.js?v=20261025-03" defer></script>
    <script src="shop.js?v=20261013-06" defer></script>
  </head>
  <body id="page-top" data-page="order">
    <header class="site-header" id="top">
      <div class="container header-inner">
        <a class="brand" href="/index.html#top" data-lang-link>
          <span class="brand-logo" aria-hidden="true"></span>
          <span class="brand-text">
            <span data-bind="site.brandName">Ola Gustafsson</span>
            <span data-bind="site.brandTag">Akvarell</span>
          </span>
        </a>
        <nav id="main-nav" class="main-nav" aria-label="Huvudmeny" data-bind-aria="ui.navAriaLabel">
          <a href="/index.html#hem" data-bind="ui.navHome" data-lang-link>Hem</a>
          <a href="/gallery.html" data-bind="ui.navGallery" data-lang-link>Galleri</a>
          <a href="/index.html#om" data-bind="ui.navAbout" data-lang-link>Om</a>
          <a href="/index.html#kontakt" data-bind="ui.navContact" data-lang-link>Kontakt</a>
        </nav>
        <div class="lang-switch" role="group" aria-label="Välj språk" data-bind-aria="ui.languageSwitcherAria">
          <button type="button" class="lang-switch-btn" data-lang-option="sv" aria-label="Svenska">SV</button>
          <button type="button" class="lang-switch-btn" data-lang-option="en" aria-label="English">EN</button>
        </div>
        <div class="theme-switch" role="group" aria-label="Välj färgläge" data-bind-aria="ui.themeSwitcherAria">
          <button type="button" class="theme-switch-btn" data-theme-option="light" aria-label="Ljus" data-bind="ui.themeOptionLight">Ljus</button>
          <button type="button" class="theme-switch-btn" data-theme-option="dark" aria-label="Mörk" data-bind="ui.themeOptionDark">Mörk</button>
          <button type="button" class="theme-switch-btn" data-theme-option="contrast" aria-label="Hög kontrast">Kontrast</button>
        </div>
        <button class="menu-toggle" aria-expanded="false" aria-controls="main-nav" aria-label="Öppna meny" data-bind="ui.menuButton" data-bind-aria="ui.menuAriaLabel">Meny</button>
      </div>
    </header>

    <main>
      <section class="section checkout-page">
        <div class="container checkout-container">
          <?php if (!$order): ?>
            <div class="section-head checkout-head">
              <div>
                <p class="eyebrow"><?= $h($t('Beställning', 'Order')) ?></p>
                <h1><?= $h($t('Beställningen hittades inte', 'Order not found')) ?></h1>
                <p class="section-lead"><?= $h($t('Kontrollera länken i din orderbekräftelse, eller mejla ola@olagustafsson.com.', 'Check the link in your order confirmation, or email ola@olagustafsson.com.')) ?></p>
              </div>
            </div>
          <?php else: ?>
            <div class="section-head checkout-head">
              <div>
                <p class="eyebrow"><?= $h($t('Beställning', 'Order')) ?> <?= $h($order['order_no']) ?></p>
                <h1><?= $h($status === 'pending' ? $t('Tack för din beställning', 'Thank you for your order') : $t('Din beställning', 'Your order')) ?></h1>
                <p class="order-status-badge is-<?= $h($status) ?>"><?= $h(shop_status_label($status, $lang)) ?></p>
              </div>
            </div>

            <div class="order-layout">
              <div class="order-main">
                <?php if ($status === 'pending'): ?>
                  <section class="surface-soft order-pay">
                    <h2><?= $h($t('Så betalar du', 'How to pay')) ?></h2>
                    <p class="order-pay-amount"><span><?= $h($t('Att betala', 'To pay')) ?></span><strong><?= $h(shop_money((int) $order['total_sek'], $lang)) ?></strong></p>
                    <div class="order-pay-grid<?= $showSwish ? '' : ' is-bank-only' ?>">
                      <?php if ($showSwish): ?>
                        <div class="order-pay-swish">
                          <img class="order-swish-qr" src="<?= $h($swishQrUrl) ?>" width="200" height="200" alt="<?= $h($t('Swish-kod med belopp och ordernummer', 'Swish code with amount and order number')) ?>" />
                          <p><strong>Swish <?= $h($paymentDetails['swish']) ?></strong><br /><?= $h($t('Öppna Swish, välj Skanna och rikta kameran mot koden. Belopp och ordernummer är ifyllda.', 'Open Swish, choose Scan and point the camera at the code. Amount and order number are filled in.')) ?></p>
                        </div>
                      <?php endif; ?>
                      <div class="order-pay-bank">
                        <?php if ($showBank): ?>
                          <p><strong><?= $h($t('Bankkonto', 'Bank account')) ?></strong><br /><?= $h($paymentDetails['bank']) ?></p>
                          <p><strong><?= $h($t('Belopp', 'Amount')) ?></strong><br /><?= $h(shop_money((int) $order['total_sek'], $lang)) ?></p>
                        <?php endif; ?>
                        <p><strong><?= $h($t('Meddelande', 'Message')) ?></strong><br /><?= $h($order['order_no']) ?></p>
                        <p class="field-hint"><?= $h($t('Beställningen bekräftas så snart betalningen kommit in. Du får ett mejl när den är registrerad.', 'The order is confirmed as soon as the payment has arrived. You will get an email when it is registered.')) ?></p>
                        <?php if ($showSwish && $paymentDetails['bank'] !== ''): ?>
                          <p class="field-hint"><?= $h($t('Vill du hellre betala via bankkonto: ', 'Prefer a bank transfer: ') . $paymentDetails['bank'] . $t(', med ordernumret som meddelande.', ', with the order number as the message.')) ?></p>
                        <?php elseif ($showBank && $swishQrUrl !== ''): ?>
                          <p class="field-hint"><?= $h($t('Vill du hellre swisha: ', 'Prefer Swish: ') . $paymentDetails['swish'] . $t(', samma belopp och meddelande.', ', same amount and message.')) ?></p>
                        <?php endif; ?>
                      </div>
                    </div>
                    <p class="order-cancel-row"><button type="button" class="checkout-remove" data-order-cancel="<?= $h((string) $order['token']) ?>"><?= $h($t('Avbryt beställningen', 'Cancel the order')) ?></button> <span class="field-hint"><?= $h($t('Går så länge den inte är betald. Efter betalning: mejla ola@olagustafsson.com, ångerrätten är 14 dagar från leverans.', 'Possible until it is paid. After payment: email ola@olagustafsson.com; the right of withdrawal is 14 days from delivery.')) ?></span></p>
                  </section>
                <?php elseif ($status === 'paid'): ?>
                  <section class="surface-soft order-pay">
                    <h2><?= $h($t('Betalningen är mottagen', 'Payment received')) ?></h2>
                    <p><?= $h($t('Tack. Beställningen packas och skickas; du får ett mejl med spårningsnummer när den är på väg.', 'Thank you. The order is being packed and shipped; you will get an email with a tracking number when it is on its way.')) ?></p>
                  </section>
                <?php elseif ($status === 'shipped' || $status === 'completed'): ?>
                  <section class="surface-soft order-pay">
                    <h2><?= $h($t('Beställningen är skickad', 'The order has been shipped')) ?></h2>
                    <?php if (!empty($order['tracking_no'])): ?>
                      <p><?= $h($t('Spårningsnummer', 'Tracking number')) ?>: <strong><?= $h((string) $order['tracking_no']) ?></strong></p>
                    <?php endif; ?>
                  </section>
                <?php elseif ($status === 'cancelled'): ?>
                  <section class="surface-soft order-pay">
                    <h2><?= $h($t('Beställningen är avbruten', 'The order has been cancelled')) ?></h2>
                    <p><?= $h($t('Har du frågor, mejla ola@olagustafsson.com.', 'If you have questions, email ola@olagustafsson.com.')) ?></p>
                  </section>
                <?php endif; ?>

                <section class="order-items">
                  <h2><?= $h($t('Varor', 'Items')) ?></h2>
                  <?php if (in_array($status, ['paid', 'shipped', 'completed'], true)): ?>
                    <p><a class="btn btn-ghost" href="/order/<?= $h((string) $order['token']) ?>/kvitto"><?= $h($t('Kvitto (skriv ut eller spara som PDF)', 'Receipt (print or save as PDF)')) ?></a></p>
                  <?php endif; ?>
                  <table class="order-table">
                    <tbody>
                      <?php foreach ($order['items'] as $item): ?>
                        <tr>
                          <td>
                            <strong><?= $h((int) $item['qty'] > 1 ? sprintf('%d × %s', (int) $item['qty'], $item['title']) : (string) $item['title']) ?></strong>
                            <?php if (!empty($item['detail'])): ?><br /><span class="order-detail"><?= $h((string) $item['detail']) ?></span><?php endif; ?>
                            <?php if (!empty($item['edition_no']) && $status !== 'pending'): ?><br /><span class="order-detail"><?= $h($t('Exemplar', 'Edition')) ?> <?= (int) $item['edition_no'] ?>/<?= SEO_PRINT_EDITION_SIZE ?></span><?php endif; ?>
                          </td>
                          <td class="order-amount"><?= $h(shop_money((int) $item['unit_sek'] * (int) $item['qty'], $lang)) ?></td>
                        </tr>
                      <?php endforeach; ?>
                      <tr><td><?= $h($t('Frakt', 'Shipping')) ?></td><td class="order-amount"><?= $h(shop_money((int) $order['shipping_sek'], $lang)) ?></td></tr>
                      <tr class="order-total"><td><?= $h($t('Att betala', 'Total')) ?></td><td class="order-amount"><?= $h(shop_money((int) $order['total_sek'], $lang)) ?></td></tr>
                      <tr><td class="order-detail"><?= $h($t('Varav moms', 'Of which VAT')) ?></td><td class="order-amount order-detail"><?= $h(shop_money((int) $order['vat_sek'], $lang)) ?></td></tr>
                    </tbody>
                  </table>
                </section>
              </div>

              <aside class="order-side">
                <section class="surface-soft order-address">
                  <h3><?= $h($t('Levereras till', 'Delivery to')) ?></h3>
                  <?php if (trim((string) $order['address_line']) !== ''): ?>
                    <p><?= $h((string) $order['customer_name']) ?><br /><?= $h((string) $order['address_line']) ?><br /><?= $h((string) $order['postal_code']) ?> <?= $h((string) $order['city']) ?></p>
                  <?php else: ?>
                    <p><?= $h((string) $order['customer_name']) ?></p>
                    <p class="field-hint"><?= $h($t('Leveransadress saknas. Mejla den till ola@olagustafsson.com, eller säg till om du hellre hämtar verket i Stockholm.', 'No delivery address yet. Email it to ola@olagustafsson.com, or let me know if you would rather collect the work in Stockholm.')) ?></p>
                  <?php endif; ?>
                  <p class="field-hint"><?= $h((string) $order['customer_email']) ?><?php if (!empty($order['customer_phone'])): ?><br /><?= $h((string) $order['customer_phone']) ?><?php endif; ?></p>
                </section>
                <p class="field-hint order-fineprint"><?= $h(seo_withdrawal_note($lang)) ?> <?= $h($t('Frågor: ola@olagustafsson.com.', 'Questions: ola@olagustafsson.com.')) ?></p>
              </aside>
            </div>
          <?php endif; ?>
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <div class="container footer-inner">
        <div class="footer-brand">
          <span class="footer-logo" aria-hidden="true"></span>
          <p data-bind="site.footerText">© 2026 Ola Gustafsson Akvarell</p>
        </div>
        <div class="footer-tools">
          <a id="studio-footer-link" class="footer-auth-btn" href="/studio.html">Studio</a>
          <button type="button" class="footer-contrast-toggle" data-contrast-toggle aria-pressed="false">Hög kontrast</button>
          <a href="#page-top" data-scroll-top data-bind="ui.scrollTop">Till toppen</a>
        </div>
      </div>
    </footer>
  </body>
</html>
