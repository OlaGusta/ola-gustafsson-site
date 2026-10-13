<?php
declare(strict_types=1);

// Kassan (/kassa): kundvagnen ligger i webbläsaren (shop.js); den här sidan ger
// katalogen med serverns priser, formuläret och sidramen. Ordern skapas av api/shop.php.
require __DIR__ . '/seo.php';
require_once __DIR__ . '/portfolio_core.php';

$lang = seo_normalize_lang($_GET['lang'] ?? null);
$text = seo_text($lang);
$canonical = seo_canonical_url('checkout', $lang);
seo_redirect_explicit_sv_lang_to($canonical);
$baseUrl = seo_base_url();
$overridesRev = (int) (@filemtime(__DIR__ . '/overrides.js') ?: 0);
$overridesRevParam = $overridesRev > 0 ? (string) $overridesRev : '0';
$payload = portfolio_load_overrides();
$fontStylesheetHref = seo_google_fonts_href($payload);
$publicContactConfig = portfolio_public_contact_config($payload);
$catalogJson = json_encode(seo_shop_catalog($payload), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG | JSON_HEX_AMP);
if (!is_string($catalogJson)) {
  $catalogJson = '{}';
}
$paymentDetails = seo_payment_details($payload);
$h = static fn (string $value): string => htmlspecialchars($value, ENT_QUOTES);
$pageTitle = $lang === 'en' ? 'Checkout | Ola Gustafsson' : 'Kassa | Ola Gustafsson';
?>
<!DOCTYPE html>
<html lang="<?= $h($lang) ?>">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <base href="/" />
    <title><?= $h($pageTitle) ?></title>
    <meta name="robots" content="noindex,follow" />
    <link rel="canonical" href="<?= $h($canonical) ?>" />
    <meta name="theme-color" content="#f3efe6" />
    <link id="favicon-png" rel="icon" type="image/png" sizes="32x32" href="/favicon-light-32x32.png?v=20260317-14" />
    <link id="favicon-ico" rel="icon" href="/favicon-light.ico?v=20260317-14" sizes="any" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=20260317-14" />
    <?php if ($fontStylesheetHref !== ''): ?>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link href="<?= $h($fontStylesheetHref) ?>" rel="stylesheet" />
    <?php endif; ?>
    <link rel="stylesheet" href="styles.css?v=20261013-05" />
    <script src="overrides.js?v=<?= $h($overridesRevParam) ?>"></script>
    <script src="content.js?v=20260928-01" defer></script>
    <script src="script.js?v=20261007-03" defer></script>
    <script src="shop.js?v=20261013-04" defer></script>
  </head>
  <body id="page-top" data-page="checkout">
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
          <div class="section-head checkout-head">
            <div>
              <p class="eyebrow"><?= $h($lang === 'en' ? 'Order' : 'Beställning') ?></p>
              <h1><?= $h($lang === 'en' ? 'Checkout' : 'Kassa') ?></h1>
            </div>
          </div>
          <div
            id="checkout-app"
            class="checkout-app"
            data-lang="<?= $h($lang) ?>"
            data-turnstile-site-key="<?= $h((string) ($publicContactConfig['turnstileSiteKey'] ?? '')) ?>"
            data-swish="<?= $h($paymentDetails['swish']) ?>"
            data-bank="<?= $h($paymentDetails['bank']) ?>"
            data-terms-url="<?= $h(seo_canonical_url('home', $lang) . '#faq') ?>"
          >
            <noscript><p><?= $h($lang === 'en' ? 'The checkout needs JavaScript. Email ola@olagustafsson.com to order.' : 'Kassan kräver JavaScript. Mejla ola@olagustafsson.com för att beställa.') ?></p></noscript>
          </div>
          <script type="application/json" id="shop-catalog"><?= $catalogJson ?></script>
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
