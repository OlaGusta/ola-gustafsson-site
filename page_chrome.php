<?php
declare(strict_types=1);

// Sidhuvud och sidfot för enkla sidor (presentkort, ateljébrev). Samma markup som
// kassa.php, så att script.js (meny, språk, färgläge) och shop.js (kundvagn) fungerar.

function page_chrome_open(string $lang, string $title, array $options = []): void
{
  $h = static fn (string $value): string => htmlspecialchars($value, ENT_QUOTES);
  $payload = portfolio_load_overrides();
  $fontStylesheetHref = seo_google_fonts_href($payload);
  $overridesRev = (int) (@filemtime(__DIR__ . '/overrides.js') ?: 0);
  $canonical = (string) ($options['canonical'] ?? '');
  $description = (string) ($options['description'] ?? '');
  $robots = (string) ($options['robots'] ?? 'index,follow');
  $page = (string) ($options['page'] ?? 'simple');
  ?>
<!DOCTYPE html>
<html lang="<?= $h($lang) ?>">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <base href="/" />
    <title><?= $h($title) ?></title>
    <?php if ($description !== ''): ?><meta name="description" content="<?= $h($description) ?>" /><?php endif; ?>
    <meta name="robots" content="<?= $h($robots) ?>" />
    <?php if ($canonical !== ''): ?><link rel="canonical" href="<?= $h($canonical) ?>" /><?php endif; ?>
    <meta name="theme-color" content="#f3efe6" />
    <link id="favicon-png" rel="icon" type="image/png" sizes="32x32" href="/favicon-light-32x32.png?v=20260317-14" />
    <link id="favicon-ico" rel="icon" href="/favicon-light.ico?v=20260317-14" sizes="any" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=20260317-14" />
    <?php if ($fontStylesheetHref !== ''): ?>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link href="<?= $h($fontStylesheetHref) ?>" rel="stylesheet" />
    <?php endif; ?>
    <link rel="stylesheet" href="styles.css?v=20261116-02" />
    <script src="overrides.js?v=<?= $h((string) $overridesRev) ?>"></script>
    <script src="content.js?v=20260928-01" defer></script>
    <?= seo_currency_rates_script() ?>
    <script src="script.js?v=20261102-02" defer></script>
    <script src="shop.js?v=20261116-02" defer></script>
  </head>
  <body id="page-top" data-page="<?= $h($page) ?>">
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
<?php
}

function page_chrome_close(): void
{
  ?>
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
<?php
}
