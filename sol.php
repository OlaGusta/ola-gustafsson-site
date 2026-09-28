<?php
declare(strict_types=1);

require __DIR__ . '/seo.php';
require_once __DIR__ . '/portfolio_core.php';

// Sidan med alla 100 solar från projektet "100 dagar av sol", i dagordning.
// Varje sol kan beställas som Fine Art Print (upplaga om 20 ex per sol).
// Bilderna byggs av scripts/content/build-sun-images.sh till images/sol/.

$lang = seo_normalize_lang($_GET['lang'] ?? null);
$text = seo_text($lang);
$canonical = seo_canonical_url('sun', $lang);
seo_redirect_explicit_sv_lang_to($canonical);
$baseUrl = seo_base_url();
$robots = seo_is_stage() ? $text['robots_stage'] : $text['robots_live'];
$ogLocale = seo_lang_og_locale($lang);
$ogLocaleAlt = $lang === 'en' ? seo_lang_og_locale('sv') : seo_lang_og_locale('en');
$overridesRev = (int) (@filemtime(__DIR__ . '/overrides.js') ?: 0);
$overridesRevParam = $overridesRev > 0 ? (string) $overridesRev : '0';
$payload = seo_overrides_payload();
$fontStylesheetHref = seo_google_fonts_href($payload);
$publicContactConfig = portfolio_public_contact_config($payload);
$formEnabled = !empty($publicContactConfig['formEnabled']);

$sunCount = 100;
$sunManifest = json_decode((string) @file_get_contents(__DIR__ . '/images/sol/manifest.json'), true);
if (!is_array($sunManifest)) {
  $sunManifest = [];
}

$projectDescription = seo_localized_payload_string($payload, $lang, ['project', 'description']);
if ($projectDescription === '') {
  $projectDescription = $lang === 'en'
    ? 'During the summer of 2025 I painted the sun every day for 100 days. Each small watercolor (18 × 26 cm) was limited to 20 minutes.'
    : 'Sommaren 2025 målade jag solen varje dag i 100 dagar. Varje liten akvarell (18 × 26 cm) fick ta max 20 minuter.';
}
$printSizes = seo_print_sizes($payload, $lang);
$printFromLabel = seo_print_from_label($printSizes, $lang);

$dayLabel = $lang === 'en' ? 'Day' : 'Dag';
$title = $lang === 'en' ? '100 days of sun – all 100 watercolors | Ola Gustafsson' : '100 dagar av sol – alla 100 akvareller | Ola Gustafsson';
$heading = $lang === 'en' ? '100 days of sun' : '100 dagar av sol';
$description = $lang === 'en'
  ? 'All 100 sun watercolors from Ola Gustafsson\'s project 100 days of sun (summer 2025). Each sun is available as a signed fine art print in an edition of 20.'
  : 'Alla 100 solakvareller från Ola Gustafssons projekt 100 dagar av sol (sommaren 2025). Varje sol finns som signerad fine art print i en upplaga om 20 ex.';
$ogImage = $baseUrl . '/images/monterade-solar.jpg';

$personId = $baseUrl . '/#ola-gustafsson';
$structuredData = [
  [
    '@context' => 'https://schema.org',
    '@type' => 'CollectionPage',
    '@id' => $canonical . '#webpage',
    'url' => $canonical,
    'name' => $heading,
    'description' => $description,
    'inLanguage' => seo_lang_locale($lang),
    'isPartOf' => ['@id' => $baseUrl . '/#website'],
    'about' => ['@id' => $personId],
    'creator' => ['@type' => 'Person', '@id' => $personId, 'name' => 'Ola Gustafsson']
  ],
  [
    '@context' => 'https://schema.org',
    '@type' => 'BreadcrumbList',
    'itemListElement' => [
      ['@type' => 'ListItem', 'position' => 1, 'name' => $lang === 'en' ? 'Home' : 'Hem', 'item' => seo_canonical_url('home', $lang)],
      ['@type' => 'ListItem', 'position' => 2, 'name' => $heading, 'item' => $canonical]
    ]
  ]
];
$structuredJson = json_encode($structuredData, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) ?: '[]';

$h = static fn (string $value): string => htmlspecialchars($value, ENT_QUOTES);
?>
<!DOCTYPE html>
<html lang="<?= $h($lang) ?>">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <base href="/" />
    <title><?= $h($title) ?></title>
    <meta name="description" content="<?= $h($description) ?>" />
    <meta name="robots" content="<?= $h($robots) ?>" />
    <link rel="canonical" href="<?= $h($canonical) ?>" />
    <link rel="alternate" hreflang="sv" href="<?= $h(seo_canonical_url('sun', 'sv')) ?>" />
    <link rel="alternate" hreflang="en" href="<?= $h(seo_canonical_url('sun', 'en')) ?>" />
    <link rel="alternate" hreflang="x-default" href="<?= $h(seo_canonical_url('sun', 'sv')) ?>" />

    <meta property="og:title" content="<?= $h($title) ?>" />
    <meta property="og:description" content="<?= $h($description) ?>" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="<?= $h($canonical) ?>" />
    <meta property="og:site_name" content="<?= $h($text['site_name']) ?>" />
    <meta property="og:locale" content="<?= $h($ogLocale) ?>" />
    <meta property="og:locale:alternate" content="<?= $h($ogLocaleAlt) ?>" />
    <meta property="og:image" content="<?= $h($ogImage) ?>" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content="<?= $h($ogImage) ?>" />

    <meta name="theme-color" content="#f3efe6" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-light-32x32.png?v=20260317-14" media="(prefers-color-scheme: light)" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-dark-32x32.png?v=20260317-14" media="(prefers-color-scheme: dark)" />
    <link id="favicon-ico" rel="icon" href="/favicon-light.ico?v=20260317-14" sizes="any" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=20260317-14" />
    <link rel="manifest" href="/site.webmanifest?v=20260317-14" />

    <script type="application/ld+json"><?= $structuredJson ?></script>

    <?php if ($fontStylesheetHref !== ''): ?>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link href="<?= $h($fontStylesheetHref) ?>" rel="stylesheet" media="print" data-deferred-stylesheet="fonts" />
      <noscript><link href="<?= $h($fontStylesheetHref) ?>" rel="stylesheet" /></noscript>
    <?php endif; ?>
    <link rel="stylesheet" href="styles.css?v=20260928-19" />
    <script src="overrides.js?v=<?= $h($overridesRevParam) ?>"></script>
    <script src="content.js?v=20260928-01" defer></script>
    <script src="script.js?v=20260928-13" defer></script>
    <script src="sol.js?v=20260928-04" defer></script>
  </head>
  <body id="page-top" data-page="sun" data-day-label="<?= $h($dayLabel) ?>" data-remove-label="<?= $h($lang === 'en' ? 'Remove day' : 'Ta bort dag') ?>">
    <header class="site-header" id="top">
      <div class="container header-inner">
        <a class="brand" href="index.html#top" data-lang-link>
          <span class="brand-logo" aria-hidden="true"></span>
          <span class="brand-text">
            <span data-bind="site.brandName">Ola Gustafsson</span>
            <span data-bind="site.brandTag">Akvarell</span>
          </span>
        </a>
        <nav id="main-nav" class="main-nav" aria-label="Huvudmeny" data-bind-aria="ui.navAriaLabel">
          <a href="index.html#hem" data-bind="ui.navHome" data-lang-link>Hem</a>
          <a href="gallery.html" data-bind="ui.navGallery" data-lang-link>Galleri</a>
          <a href="index.html#om" data-bind="ui.navAbout" data-lang-link>Om</a>
          <a href="index.html#kontakt" data-bind="ui.navContact" data-lang-link>Kontakt</a>
        </nav>
        <div class="lang-switch" role="group" aria-label="Välj språk" data-bind-aria="ui.languageSwitcherAria">
          <button type="button" class="lang-switch-btn" data-lang-option="sv" aria-label="Svenska">SV</button>
          <button type="button" class="lang-switch-btn" data-lang-option="en" aria-label="English">EN</button>
        </div>
        <div class="theme-switch" role="group" aria-label="Välj färgläge" data-bind-aria="ui.themeSwitcherAria">
          <button type="button" class="theme-switch-btn" data-theme-option="light" aria-label="Ljus" data-bind="ui.themeOptionLight">Ljus</button>
          <button type="button" class="theme-switch-btn" data-theme-option="dark" aria-label="Mörk" data-bind="ui.themeOptionDark">Mörk</button>
        </div>
        <button class="menu-toggle" aria-expanded="false" aria-controls="main-nav" aria-label="Öppna meny" data-bind="ui.menuButton" data-bind-aria="ui.menuAriaLabel">Meny</button>
      </div>
    </header>

    <main>
      <section class="section sun-page">
        <div class="container">
          <div class="sun-page-head">
            <div>
              <p class="eyebrow"><?= $h($lang === 'en' ? 'Project · Summer 2025' : 'Projekt · Sommaren 2025') ?></p>
              <h1><?= $h($heading) ?></h1>
              <p class="section-lead"><?= seo_render_multiline_html($projectDescription) ?></p>
            </div>
            <aside class="sun-print-card surface-soft" aria-labelledby="sun-print-heading">
              <p class="artwork-market-label" id="sun-print-heading">Fine Art Print</p>
              <table class="sun-print-table">
                <caption class="visually-hidden"><?= $h($lang === 'en' ? 'Print sizes and prices per sun' : 'Printformat och pris per sol') ?></caption>
                <tbody>
                  <?php foreach ($printSizes as $size): ?>
                    <?php $imageSize = seo_print_image_size($size['format'], $lang); ?>
                    <tr>
                      <th scope="row"><?= $h(seo_print_frame_label($size['format'], $lang)) ?><?php if ($imageSize !== ''): ?><small><?= $h(($lang === 'en' ? 'image ' : 'bild ') . $imageSize) ?></small><?php endif; ?></th>
                      <td><?= $h($size['price'] !== '' ? $size['price'] : ($lang === 'en' ? 'on request' : 'på förfrågan')) ?></td>
                    </tr>
                  <?php endforeach; ?>
                </tbody>
              </table>
              <p class="sun-print-edition"><?= $h(seo_print_paper_label($lang)) ?>.<br /><?= $h(seo_print_edition_label($lang)) ?><?= $h($lang === 'en' ? ' per sun.' : ' per sol.') ?></p>
              <p class="sun-print-extras"><?= $h(seo_order_extras_note($lang)) ?></p>
              <a class="btn btn-primary" href="<?= $h($canonical) ?>#bestall"><?= $h($lang === 'en' ? 'Order prints' : 'Beställ print') ?></a>
            </aside>
          </div>

          <p class="sun-grid-hint"><?= $h($lang === 'en'
            ? 'Click a sun to see it larger. Mark the ones you want and they are added to the order form below.'
            : 'Klicka på en sol för att se den större. Markera de du vill ha så hamnar de i beställningen längst ner.') ?></p>

          <ol class="sun-grid" id="sun-grid">
            <?php for ($day = 1; $day <= $sunCount; $day++):
              $file = sprintf('dag-%03d.jpg', $day);
              $size = isset($sunManifest[(string) $day]) && is_array($sunManifest[(string) $day]) ? $sunManifest[(string) $day] : [330, 520];
              $alt = $lang === 'en'
                ? sprintf('100 days of sun, day %d. Watercolor, 18 × 26 cm.', $day)
                : sprintf('100 dagar av sol, dag %d. Akvarell, 18 × 26 cm.', $day);
            ?>
              <li class="sun-tile" id="dag-<?= $day ?>" data-day="<?= $day ?>">
                <button type="button" class="sun-tile-open" data-sun-open="<?= $day ?>" data-full="images/sol/<?= $file ?>" aria-label="<?= $h($dayLabel . ' ' . $day) ?>">
                  <img src="images/sol/thumb/<?= $file ?>" alt="<?= $h($alt) ?>" width="<?= (int) $size[0] ?>" height="<?= (int) $size[1] ?>" loading="<?= $day <= 12 ? 'eager' : 'lazy' ?>" decoding="async" />
                </button>
                <span class="sun-tile-day"><?= $h($dayLabel) ?> <?= $day ?></span>
                <label class="sun-tile-pick">
                  <input type="checkbox" data-sun-pick="<?= $day ?>" />
                  <span class="visually-hidden"><?= $h(sprintf($lang === 'en' ? 'Add day %d to order' : 'Lägg dag %d i beställningen', $day)) ?></span>
                </label>
              </li>
            <?php endfor; ?>
          </ol>

          <section id="bestall" class="artwork-inquiry-card surface-soft sun-order">
            <div class="artwork-inquiry-copy">
              <p class="eyebrow"><?= $h($lang === 'en' ? 'Order' : 'Beställning') ?></p>
              <h2><?= $h($lang === 'en' ? 'Order fine art prints' : 'Beställ fine art print') ?></h2>
              <p><?= $h($lang === 'en'
                ? sprintf('Each sun is printed on %s with a 2 cm margin for edition number and signature, %s. %s.', seo_print_paper_label($lang), $printFromLabel, seo_print_edition_label($lang))
                : sprintf('Varje sol trycks på %s med 2 cm marginal där upplaga och signatur skrivs, %s. %s.', seo_print_paper_label($lang), $printFromLabel, seo_print_edition_label($lang))) ?></p>
              <p><?= $h($lang === 'en'
                ? 'The size is the frame size. The mat is cut to fit the frame and shows the whole image and the signature.'
                : 'Formatet är ramens mått. Passepartouten skärs till ramen och visar hela bilden och signaturen.') ?></p>
              <p><?= $h(seo_order_extras_note($lang)) ?></p>
              <p><?= $h($lang === 'en'
                ? 'Sending the form is not a binding order. I reply with a total and payment details.'
                : 'Formuläret är inte en bindande beställning. Jag svarar med totalpris och betalningsuppgifter.') ?></p>
            </div>
            <?php if ($formEnabled): ?>
              <form
                id="artwork-inquiry-form"
                class="contact-form artwork-inquiry-form"
                data-artwork-title="<?= $h($heading) ?>"
                data-inquiry-mode="artwork"
                data-prefill="<?= $h($lang === 'en' ? 'Hi! I would like to order fine art prints of the suns above.' : 'Hej! Jag vill beställa fine art print av solarna ovan.') ?>"
                data-form-enabled="true"
                data-turnstile-site-key="<?= $h((string) ($publicContactConfig['turnstileSiteKey'] ?? '')) ?>"
                novalidate
              >
                <input type="hidden" name="inquirySlug" value="100-dagar-av-sol" />
                <input type="hidden" name="inquiryTitle" value="Fine Art Print – <?= $h($heading) ?>" data-title-base="Fine Art Print – <?= $h($heading) ?>" />
                <input type="hidden" name="inquiryAvailability" value="available" />
                <input type="hidden" name="inquiryPriceLabel" value="" />
                <input type="hidden" name="inquirySourceUrl" value="<?= $h($canonical) ?>" />
                <input type="hidden" name="turnstileToken" value="" />

                <label><?= $h($lang === 'en' ? 'Size (same for all)' : 'Format (samma för alla)') ?>
                  <select id="sun-order-size" name="printSize">
                    <?php foreach ($printSizes as $i => $size): ?>
                      <option value="<?= $h($size['format']) ?>" data-price="<?= $h($size['price']) ?>" <?= $i === 0 ? 'selected' : '' ?>><?php $optionImage = seo_print_image_size($size['format'], $lang); ?><?= $h(seo_print_frame_label($size['format'], $lang) . ($optionImage !== '' ? ' (' . ($lang === 'en' ? 'image ' : 'bild ') . $optionImage . ')' : '') . ($size['price'] !== '' ? ' – ' . $size['price'] : '')) ?></option>
                    <?php endforeach; ?>
                  </select>
                </label>

                <label><?= $h($lang === 'en' ? 'Which suns? (day numbers)' : 'Vilka solar? (dagnummer)') ?>
                  <input type="text" id="sun-order-days" name="sunDays" inputmode="numeric" autocomplete="off" placeholder="<?= $h($lang === 'en' ? 'e.g. 12, 37, 88' : 't.ex. 12, 37, 88') ?>" />
                  <small class="field-hint" id="sun-order-summary" aria-live="polite"></small>
                </label>
                <ul class="sun-picked" id="sun-picked-form" aria-label="<?= $h($lang === 'en' ? 'Selected suns' : 'Valda solar') ?>" hidden></ul>
                <p class="field-hint sun-picked-hint"><?= $h($lang === 'en' ? 'Different size for a single sun? Change it under that sun.' : 'Vill du ha ett annat format på en enskild sol? Ändra under den solen.') ?></p>



                <label><?= $h($lang === 'en' ? 'Name' : 'Namn') ?>
                  <input type="text" name="name" autocomplete="name" required />
                </label>

                <label><?= $h($lang === 'en' ? 'Email' : 'E-post') ?>
                  <input type="email" name="email" autocomplete="email" required />
                </label>

                <label><?= $h($lang === 'en' ? 'Message' : 'Meddelande') ?>
                  <textarea name="message" rows="4" required placeholder="<?= $h($lang === 'en' ? 'Mat with backing? Pickup or shipping (address)?' : 'Passepartout med bakstycke? Hämtning eller frakt (adress)?') ?>"></textarea>
                </label>

                <label class="contact-honeypot" aria-hidden="true">
                  Website
                  <input type="text" name="website" tabindex="-1" autocomplete="off" />
                </label>

                <div id="artwork-inquiry-turnstile" class="contact-turnstile" hidden></div>

                <div class="artwork-inquiry-actions">
                  <button class="btn btn-primary" type="submit"><?= $h($lang === 'en' ? 'Send order request' : 'Skicka beställning') ?></button>
                </div>

                <p id="artwork-inquiry-status" class="contact-form-status" data-kind="info" aria-live="polite"></p>
              </form>
            <?php else: ?>
              <?php $mail = (string) ($publicContactConfig['email'] ?? ''); ?>
              <div class="artwork-inquiry-actions">
                <?php if ($mail !== ''): ?>
                  <a class="btn btn-primary" href="mailto:<?= $h($mail) ?>?subject=<?= rawurlencode('Fine Art Print – 100 dagar av sol') ?>"><?= $h($lang === 'en' ? 'Email your order' : 'Mejla din beställning') ?></a>
                <?php endif; ?>
              </div>
            <?php endif; ?>
          </section>

          <div class="gallery-cta-row">
            <a class="btn btn-ghost" href="index.html#galleri" data-lang-link><?= $h($lang === 'en' ? 'Back to the home page' : 'Tillbaka till startsidan') ?></a>
            <a class="btn btn-ghost" href="gallery.html" data-lang-link><?= $h($lang === 'en' ? 'All paintings' : 'Alla målningar') ?></a>
          </div>
        </div>
      </section>
    </main>

    <div class="sun-tray" id="sun-tray" hidden>
      <div class="container sun-tray-inner">
        <ul class="sun-picked" id="sun-picked-tray" aria-label="<?= $h($lang === 'en' ? 'Selected suns' : 'Valda solar') ?>"></ul>
        <a class="btn btn-primary" href="<?= $h($canonical) ?>#bestall"><?= $h($lang === 'en' ? 'Go to order' : 'Till beställningen') ?> (<span id="sun-tray-count">0</span>)</a>
      </div>
    </div>

    <dialog id="sun-viewer" class="sun-viewer" aria-label="<?= $h($heading) ?>">
      <div class="sun-viewer-inner">
        <button type="button" class="sun-viewer-close" data-sun-close aria-label="<?= $h($lang === 'en' ? 'Close' : 'Stäng') ?>">✕</button>
        <button type="button" class="sun-viewer-nav sun-viewer-prev" data-sun-step="-1" aria-label="<?= $h($lang === 'en' ? 'Previous day' : 'Föregående dag') ?>">◀</button>
        <figure>
          <img id="sun-viewer-image" src="" alt="" />
          <figcaption>
            <strong id="sun-viewer-day"></strong>
            <span>Fine Art Print <?= $h($printFromLabel) ?> · Hahnemühle Photo Rag · <?= $h(sprintf($lang === 'en' ? 'signed, edition of %d' : 'signerad, upplaga %d ex', SEO_PRINT_EDITION_SIZE)) ?></span>
            <label class="sun-viewer-pick">
              <input type="checkbox" id="sun-viewer-pick" />
              <span><?= $h($lang === 'en' ? 'Add to order' : 'Lägg i beställningen') ?></span>
            </label>
            <a class="btn btn-primary" href="<?= $h($canonical) ?>#bestall" data-sun-order><?= $h($lang === 'en' ? 'Go to order' : 'Till beställningen') ?></a>
          </figcaption>
        </figure>
        <button type="button" class="sun-viewer-nav sun-viewer-next" data-sun-step="1" aria-label="<?= $h($lang === 'en' ? 'Next day' : 'Nästa dag') ?>">▶</button>
      </div>
    </dialog>

    <footer class="site-footer">
      <div class="container footer-inner">
        <div class="footer-brand">
          <span class="footer-logo" aria-hidden="true"></span>
          <p data-bind="site.footerText">© 2026 Ola Gustafsson Akvarell</p>
        </div>
        <div class="footer-tools">
          <a id="studio-footer-link" class="footer-auth-btn" href="/studio.html">Studio</a>
          <a href="#page-top" data-scroll-top data-bind="ui.scrollTop">Till toppen</a>
        </div>
      </div>
    </footer>
  </body>
</html>
