<?php
declare(strict_types=1);

// /presentkort: köp ett presentkort (läggs i kundvagnen via shop.js).
// /presentkort/<token>: det utfärdade kortet, att skriva ut eller skicka vidare.
require __DIR__ . '/seo.php';
require_once __DIR__ . '/portfolio_core.php';
require_once __DIR__ . '/api/shop_lib.php';
require_once __DIR__ . '/page_chrome.php';

$lang = seo_normalize_lang($_GET['lang'] ?? null);
$h = static fn (string $value): string => htmlspecialchars($value, ENT_QUOTES);
$t = static fn (string $sv, string $en): string => $lang === 'en' ? $en : $sv;
$cardToken = isset($_GET['card']) && is_string($_GET['card']) ? strtolower(trim($_GET['card'])) : '';

if ($cardToken !== '') {
  $card = null;
  try {
    $pdo = api_get_pdo();
    shop_ensure_schema($pdo);
    $card = shop_find_giftcard_by_token($pdo, $cardToken);
  } catch (Throwable $error) {
    $card = null;
  }
  if (!$card) {
    http_response_code(404);
  }
  page_chrome_open($lang, $t('Presentkort | Ola Gustafsson', 'Gift card | Ola Gustafsson'), ['robots' => 'noindex,nofollow', 'page' => 'giftcard-card']);
  ?>
    <main>
      <section class="section giftcard-page">
        <div class="container giftcard-container">
          <?php if (!$card): ?>
            <h1><?= $h($t('Presentkortet hittades inte', 'Gift card not found')) ?></h1>
            <p><?= $h($t('Kontrollera länken, eller mejla ola@olagustafsson.com.', 'Check the link, or email ola@olagustafsson.com.')) ?></p>
          <?php else: ?>
            <p class="giftcard-toolbar"><button type="button" class="btn btn-ghost" onclick="window.print()"><?= $h($t('Skriv ut / spara som PDF', 'Print / save as PDF')) ?></button></p>
            <article class="giftcard-card">
              <p class="eyebrow"><?= $h($t('Presentkort', 'Gift card')) ?></p>
              <p class="giftcard-amount"><?= $h(shop_money((int) $card['amount_sek'], $lang)) ?></p>
              <p class="giftcard-artist">Ola Gustafsson · <?= $h($t('Akvarell', 'Watercolour')) ?></p>
              <?php if (!empty($card['recipient']) || !empty($card['sender'])): ?>
                <p class="giftcard-names">
                  <?php if (!empty($card['recipient'])): ?><span><?= $h($t('Till', 'To')) ?> <strong><?= $h((string) $card['recipient']) ?></strong></span><?php endif; ?>
                  <?php if (!empty($card['sender'])): ?><span><?= $h($t('Från', 'From')) ?> <strong><?= $h((string) $card['sender']) ?></strong></span><?php endif; ?>
                </p>
              <?php endif; ?>
              <?php if (!empty($card['message'])): ?>
                <p class="giftcard-message"><?= nl2br($h((string) $card['message'])) ?></p>
              <?php endif; ?>
              <div class="giftcard-code-box">
                <span><?= $h($t('Kod', 'Code')) ?></span>
                <strong><?= $h((string) $card['code']) ?></strong>
              </div>
              <p class="giftcard-howto"><?= $h($t(
                'Välj en målning, en print eller en poster på olagustafsson.com och skriv koden i kassan. Gäller till och med ',
                'Choose a painting, a print or a poster at olagustafsson.com and enter the code at checkout. Valid until '
              ) . (string) $card['expires_at'] . '.') ?></p>
              <?php if ((int) $card['balance'] < (int) $card['amount_sek']): ?>
                <p class="giftcard-balance"><?= $h($t('Kvar att använda: ', 'Remaining balance: ') . shop_money((int) $card['balance'], $lang)) ?></p>
              <?php endif; ?>
            </article>
          <?php endif; ?>
        </div>
      </section>
    </main>
  <?php
  page_chrome_close();
  exit;
}

$payload = portfolio_load_overrides();
$catalog = seo_shop_catalog($payload);
$originalPrices = [];
$printPrices = [];
foreach ($catalog['artworks'] as $art) {
  if (!empty($art['originalForSale']) && (int) $art['price'] > 0) {
    $originalPrices[] = (int) $art['price'];
  }
  foreach ($art['prints'] ?? [] as $size) {
    if ((int) $size['price'] > 0) {
      $printPrices[] = (int) $size['price'];
    }
  }
}
foreach ($catalog['sunPrints'] as $size) {
  if ((int) ($size['price'] ?? 0) > 0) {
    $printPrices[] = (int) $size['price'];
  }
}
$poster = $catalog['poster'] ?? [];
$hints = [];
if (!empty($poster['enabled']) && (int) ($poster['price'] ?? 0) > 0) {
  $hints[] = $t('Poster ', 'Poster ') . shop_money((int) $poster['price'], $lang);
}
if ($printPrices !== []) {
  $hints[] = $t('Fine Art Print från ', 'Fine Art Print from ') . shop_money(min($printPrices), $lang);
}
if ($originalPrices !== []) {
  $hints[] = $t('Original från ', 'Originals from ') . shop_money(min($originalPrices), $lang);
}
$description = $t(
  'Presentkort på akvareller av Ola Gustafsson. Gäller original, signerade Fine Art Prints och postrar, i två år. Skickas med e-post.',
  'Gift cards for watercolours by Ola Gustafsson. Valid for originals, signed fine art prints and posters for two years. Sent by email.'
);
page_chrome_open($lang, $t('Presentkort | Ola Gustafsson', 'Gift card | Ola Gustafsson'), [
  'canonical' => seo_canonical_url('giftcard', $lang),
  'description' => $description,
  'page' => 'giftcard'
]);
?>
    <main>
      <section class="section giftcard-page">
        <div class="container giftcard-container">
          <div class="section-head">
            <div>
              <p class="eyebrow"><?= $h($t('Present', 'Gift')) ?></p>
              <h1><?= $h($t('Presentkort', 'Gift card')) ?></h1>
              <p class="section-lead"><?= $h($t(
                'Ge bort en målning och låt mottagaren välja själv. Presentkortet gäller till original, signerade Fine Art Prints och postrar i två år.',
                'Give a painting and let the recipient choose. The gift card is valid for originals, signed fine art prints and posters for two years.'
              )) ?></p>
            </div>
          </div>
          <div class="giftcard-layout">
            <form class="contact-form surface-soft giftcard-form" id="giftcard-form" novalidate>
              <fieldset class="giftcard-amounts">
                <legend><?= $h($t('Belopp', 'Amount')) ?></legend>
                <?php foreach (SHOP_GIFTCARD_AMOUNTS as $index => $amount): ?>
                  <label class="giftcard-amount-option"><input type="radio" name="amount" value="<?= (int) $amount ?>" <?= $index === 1 ? 'checked' : '' ?> /> <span><?= $h(shop_money($amount, $lang)) ?></span></label>
                <?php endforeach; ?>
                <label class="giftcard-amount-option giftcard-amount-custom"><input type="radio" name="amount" value="custom" /> <span><?= $h($t('Annat belopp', 'Other amount')) ?></span>
                  <input type="number" name="customAmount" min="<?= SHOP_GIFTCARD_MIN ?>" max="<?= SHOP_GIFTCARD_MAX ?>" step="50" inputmode="numeric" placeholder="<?= $h(shop_money(SHOP_GIFTCARD_MIN, $lang) . '–' . shop_money(SHOP_GIFTCARD_MAX, $lang)) ?>" aria-label="<?= $h($t('Annat belopp i kronor', 'Other amount in SEK')) ?>" />
                </label>
              </fieldset>
              <label><?= $h($t('Till', 'To')) ?> <small><?= $h($t('(valfritt, står på kortet)', '(optional, shown on the card)')) ?></small><input type="text" name="to" maxlength="120" autocomplete="off" /></label>
              <label><?= $h($t('Från', 'From')) ?> <small><?= $h($t('(valfritt)', '(optional)')) ?></small><input type="text" name="from" maxlength="120" autocomplete="name" /></label>
              <label><?= $h($t('Hälsning', 'Message')) ?> <small><?= $h($t('(valfritt)', '(optional)')) ?></small><textarea name="message" rows="3" maxlength="400"></textarea></label>
              <div class="artwork-inquiry-actions"><button class="btn btn-primary" type="submit"><?= $h($t('Lägg i kundvagnen', 'Add to cart')) ?></button></div>
              <p id="giftcard-status" class="contact-form-status" data-kind="info" aria-live="polite"></p>
            </form>
            <aside class="giftcard-info">
              <h2><?= $h($t('Så fungerar det', 'How it works')) ?></h2>
              <ol>
                <li><?= $h($t('Välj belopp och betala med Swish eller bankkonto i kassan.', 'Choose an amount and pay by Swish or bank transfer at checkout.')) ?></li>
                <li><?= $h($t('När betalningen kommit in får du presentkortet med e-post: en sida med kod som du kan skriva ut eller skicka vidare.', 'When the payment has arrived you get the gift card by email: a page with a code that you can print or forward.')) ?></li>
                <li><?= $h($t('Mottagaren skriver koden i kassan. Det som inte används sparas på kortet.', 'The recipient enters the code at checkout. Any unused amount stays on the card.')) ?></li>
              </ol>
              <?php if ($hints !== []): ?>
                <p class="field-hint"><?= $h($t('Det räcker till exempel till: ', 'For example: ') . implode(' · ', $hints) . '.') ?></p>
              <?php endif; ?>
              <p class="field-hint"><?= $h($t('Ingen frakt för presentkort. Ingen moms tas ut på presentkortet; den ingår i priset på det som köps med det.', 'No shipping for gift cards. No VAT is charged on the gift card itself; it is included in the price of what it is used for.')) ?></p>
            </aside>
          </div>
        </div>
      </section>
    </main>
<?php
page_chrome_close();
