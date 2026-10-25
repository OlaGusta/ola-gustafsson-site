<?php
declare(strict_types=1);

require __DIR__ . '/seo.php';
require_once __DIR__ . '/portfolio_core.php';
require_once __DIR__ . '/exhibition_core.php';

// Utställningssida, en per post i payload.exhibitions (Studio → Utställningar).
// Adress: /utstallning/<slug>, utom äldre sidor i SEO_EXHIBITION_LEGACY_PATHS
// (t.ex. /ljusets-aterkomst).

$lang = seo_normalize_lang($_GET['lang'] ?? null);
$en = $lang === 'en';
$slug = isset($_GET['slug']) && is_string($_GET['slug']) ? strtolower(trim($_GET['slug'])) : '';
$payload = seo_overrides_payload();
$exhibition = seo_exhibition_slug_valid($slug) ? seo_exhibition_find($payload, $slug, $lang) : null;

if ($exhibition === null || empty($exhibition['enabled'])) {
  http_response_code(404);
  header('Content-Type: text/html; charset=utf-8');
  echo '<!DOCTYPE html><html lang="' . ($en ? 'en' : 'sv') . '"><meta charset="UTF-8" /><title>404</title><p>'
    . ($en ? 'The page could not be found.' : 'Sidan finns inte.') . ' <a href="/">' . ($en ? 'Home' : 'Startsidan') . '</a></p></html>';
  exit;
}

// Gammal adress /utstallning/<slug> för en sida med egen adress: skicka vidare.
$requestPath = (string) parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH);
if (isset(SEO_EXHIBITION_LEGACY_PATHS[$slug]) && rtrim($requestPath, '/') !== SEO_EXHIBITION_LEGACY_PATHS[$slug]) {
  header('Location: ' . seo_exhibition_url($slug, $lang), true, 301);
  exit;
}

$text = seo_text($lang);
$canonical = seo_exhibition_url($slug, $lang);
seo_redirect_explicit_sv_lang_to($canonical);
$baseUrl = seo_base_url();
$robots = seo_is_stage() ? $text['robots_stage'] : $text['robots_live'];
$ogLocale = seo_lang_og_locale($lang);
$ogLocaleAlt = $en ? seo_lang_og_locale('sv') : seo_lang_og_locale('en');
$overridesRev = (int) (@filemtime(__DIR__ . '/overrides.js') ?: 0);
$overridesRevParam = $overridesRev > 0 ? (string) $overridesRev : '0';
$fontStylesheetHref = seo_google_fonts_href($payload);
$poster = seo_poster_config($payload, $lang);

$str = static fn (string $key): string => isset($exhibition[$key]) && is_string($exhibition[$key]) ? trim($exhibition[$key]) : '';
$heading = $str('title');
$description = $str('description');
$title = $heading . ($en ? ' – exhibition' : ' – utställning') . ($str('venue') !== '' ? ($en ? ' at ' : ' i ') . $str('venue') : '')
  . (preg_match('/^\d{4}/', $str('startDate')) === 1 ? ' ' . substr($str('startDate'), 0, 4) : '') . ' | Ola Gustafsson';
$ogSrc = $str('ogImage') !== '' ? $str('ogImage') : $str('heroImage');
$ogImageInfo = seo_exhibition_image($ogSrc);
$ogImage = $ogImageInfo !== null ? $baseUrl . '/' . $ogImageInfo['src'] : $baseUrl . '/images/monterade-solar.jpg';

$personId = $baseUrl . '/#ola-gustafsson';
$works = seo_exhibition_works($str('worksText'));
$performers = [['@type' => 'Person', '@id' => $personId, 'name' => 'Ola Gustafsson']];
foreach (array_filter(array_map('trim', explode(',', $str('artists')))) as $artist) {
  $performers[] = ['@type' => 'Person', 'name' => $artist];
}
$event = [
  '@context' => 'https://schema.org',
  '@type' => 'ExhibitionEvent',
  '@id' => $canonical . '#exhibition',
  'name' => $heading,
  'description' => $description,
  'eventAttendanceMode' => 'https://schema.org/OfflineEventAttendanceMode',
  'eventStatus' => 'https://schema.org/EventScheduled',
  'image' => $ogImage,
  'url' => $canonical,
  'performer' => $performers,
];
if ($str('altTitle') !== '') {
  $event['alternateName'] = $str('altTitle');
}
foreach (['startDate', 'endDate'] as $dateKey) {
  if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $str($dateKey)) === 1) {
    $event[$dateKey] = $str($dateKey);
  }
}
if ($str('venue') !== '') {
  $event['location'] = [
    '@type' => 'Place',
    'name' => $str('venue'),
    'address' => array_filter(['@type' => 'PostalAddress', 'addressLocality' => $str('city'), 'addressCountry' => 'SE']),
  ];
}
if ($works !== []) {
  $event['workFeatured'] = array_map(
    static fn (array $work): array => ['@type' => 'VisualArtwork', 'name' => $work[0], 'artform' => 'Watercolor', 'creator' => ['@id' => $personId]],
    $works
  );
}
$structuredData = [
  [
    '@context' => 'https://schema.org',
    '@type' => 'WebPage',
    '@id' => $canonical . '#webpage',
    'url' => $canonical,
    'name' => $heading,
    'description' => $description,
    'inLanguage' => seo_lang_locale($lang),
    'isPartOf' => ['@id' => $baseUrl . '/#website'],
    'about' => ['@id' => $canonical . '#exhibition'],
    'primaryImageOfPage' => $ogImage,
  ],
  $event,
  [
    '@context' => 'https://schema.org',
    '@type' => 'BreadcrumbList',
    'itemListElement' => [
      ['@type' => 'ListItem', 'position' => 1, 'name' => $en ? 'Home' : 'Hem', 'item' => seo_canonical_url('home', $lang)],
      ['@type' => 'ListItem', 'position' => 2, 'name' => $heading, 'item' => $canonical],
    ],
  ],
];
$structuredJson = json_encode($structuredData, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) ?: '[]';

// Länkar i den avslutande rutan: interna (utan https://) får språkparameter via data-lang-link.
$linkAttrs = static function (string $href): string {
  $href = trim($href);
  if ($href === '' || preg_match('/^\s*(javascript|data|vbscript):/i', $href) === 1) {
    return '';
  }
  $external = preg_match('#^https?://#i', $href) === 1 && preg_match('#^https?://([^/]+\.)?olagustafsson\.com(/|$)#i', $href) !== 1;
  return ' href="' . seo_escape_html($href) . '"' . ($external ? ' target="_blank" rel="noopener"' : ' data-lang-link');
};

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
    <link rel="alternate" hreflang="sv" href="<?= $h(seo_exhibition_url($slug, 'sv')) ?>" />
    <link rel="alternate" hreflang="en" href="<?= $h(seo_exhibition_url($slug, 'en')) ?>" />
    <link rel="alternate" hreflang="x-default" href="<?= $h(seo_exhibition_url($slug, 'sv')) ?>" />

    <meta property="og:title" content="<?= $h($title) ?>" />
    <meta property="og:description" content="<?= $h($description) ?>" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="<?= $h($canonical) ?>" />
    <meta property="og:site_name" content="<?= $h($text['site_name']) ?>" />
    <meta property="og:locale" content="<?= $h($ogLocale) ?>" />
    <meta property="og:locale:alternate" content="<?= $h($ogLocaleAlt) ?>" />
    <meta property="og:image" content="<?= $h($ogImage) ?>" />
    <?php if ($ogImageInfo !== null): ?>
      <meta property="og:image:width" content="<?= (int) $ogImageInfo['width'] ?>" />
      <meta property="og:image:height" content="<?= (int) $ogImageInfo['height'] ?>" />
    <?php endif; ?>
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
    <link rel="stylesheet" href="styles.css?v=20261025-06" />
    <script src="overrides.js?v=<?= $h($overridesRevParam) ?>"></script>
    <script src="content.js?v=20260928-01" defer></script>
    <script src="script.js?v=20261025-03" defer></script>
    <script src="shop.js?v=20261013-06" defer></script>
  </head>
  <body id="page-top" data-page="exhibition">
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
          <button type="button" class="theme-switch-btn" data-theme-option="contrast" aria-label="Hög kontrast">Kontrast</button>
        </div>
        <button class="menu-toggle" aria-expanded="false" aria-controls="main-nav" aria-label="Öppna meny" data-bind="ui.menuButton" data-bind-aria="ui.menuAriaLabel">Meny</button>
      </div>
    </header>

    <main>
      <article class="section exhibition-page">
        <div class="container">
          <header class="exhibition-head">
            <?php if ($str('eyebrow') !== ''): ?><p class="eyebrow"><?= $h($str('eyebrow')) ?></p><?php endif; ?>
            <h1><?= $h($heading) ?></h1>
            <?php if ($str('meta') !== ''): ?><p class="exhibition-meta"><?= $h($str('meta')) ?></p><?php endif; ?>
          </header>

          <?php if ($str('heroImage') !== ''): ?>
            <div class="exhibition-wide"><?= seo_exhibition_figure_html($str('heroImage'), $str('heroAlt'), $str('heroCaption'), 'wide', true) ?></div>
          <?php endif; ?>

          <?php
          // Block i ordning. Ett textblock med rubrik börjar ett nytt avsnitt; utan
          // rubrik fortsätter det föregående. Bilder ligger i textspalten, bildpar
          // över hela bredden.
          $open = '';
          $close = static function () use (&$open): string {
            $out = $open === 'prose' ? '</div>' : '';
            $open = '';
            return $out;
          };
          $sectionOpen = false;
          foreach ($exhibition['blocks'] as $block):
            $type = isset($block['type']) && is_string($block['type']) ? $block['type'] : 'text';
            $b = static fn (string $key): string => isset($block[$key]) && is_string($block[$key]) ? trim($block[$key]) : '';
            if ($type === 'text'):
              if ($b('heading') !== ''):
                echo $close();
                if ($sectionOpen) { echo '</section>'; }
                echo '<section class="exhibition-section">';
                $sectionOpen = true;
              endif;
              if ($open !== 'prose') { echo '<div class="exhibition-prose">'; $open = 'prose'; }
              if ($b('heading') !== '') { echo '<h2>' . seo_exhibition_emphasis_html($b('heading')) . '</h2>'; }
              echo seo_exhibition_paragraphs_html($b('body'));
            elseif ($type === 'image'):
              if ($open !== 'prose') { echo '<div class="exhibition-prose">'; $open = 'prose'; }
              echo seo_exhibition_figure_html($b('image'), $b('alt'), $b('caption'));
            elseif ($type === 'pair'):
              echo $close();
              $ratio = seo_exhibition_pair_ratio($b('image'), $b('image2'));
              echo '<div class="exhibition-figures exhibition-figures--pair">'
                . seo_exhibition_figure_html($b('image'), $b('alt'), $b('caption'), 'pair', false, $ratio)
                . seo_exhibition_figure_html($b('image2'), $b('alt2'), $b('caption2'), 'pair', false, $ratio)
                . '</div>';
            endif;
          endforeach;
          echo $close();
          if ($sectionOpen) { echo '</section>'; }
          ?>

          <?php if ($works !== []): ?>
            <section class="exhibition-section">
              <div class="exhibition-prose">
                <h2><?= $h($str('worksHeading') !== '' ? $str('worksHeading') : ($en ? 'The works' : 'Verken')) ?></h2>
                <?php if ($str('worksNote') !== ''): ?><p class="exhibition-works-note"><?= $h($str('worksNote')) ?></p><?php endif; ?>
                <ul class="exhibition-works">
                  <?php foreach ($works as [$workTitle, $workSize]): ?>
                    <li><em><?= $h($workTitle) ?></em><span><?= $h($workSize) ?></span></li>
                  <?php endforeach; ?>
                </ul>
                <p><?= $en
                  ? 'Questions about the works? <a href="index.html#kontakt" data-lang-link>Write to me</a>.'
                  : 'Frågor om verken? <a href="index.html#kontakt" data-lang-link>Skriv till mig</a>.' ?></p>
              </div>
            </section>
          <?php endif; ?>

          <?php if (!empty($exhibition['ctaEnabled']) && $str('ctaHeading') !== ''):
            $ctaPoster = !empty($exhibition['ctaPoster']) && $poster['enabled'];
          ?>
            <section class="exhibition-cta surface-soft" aria-labelledby="exhibition-cta-heading">
              <?= $str('ctaImage') !== '' ? seo_exhibition_figure_html($str('ctaImage'), $str('ctaImageAlt'), '', 'pair') : '' ?>
              <div class="exhibition-cta-body">
                <?php if ($str('ctaEyebrow') !== ''): ?><p class="eyebrow"><?= $h($str('ctaEyebrow')) ?></p><?php endif; ?>
                <h2 id="exhibition-cta-heading"><?= $h($str('ctaHeading')) ?></h2>
                <?php if ($str('ctaText') !== '' || $ctaPoster): ?>
                  <p><?= seo_exhibition_inline_html($str('ctaText')) ?><?= $ctaPoster ? ' ' . $h($en ? 'The whole series is also collected on a poster.' : 'Hela serien finns också samlad på en poster.') : '' ?></p>
                <?php endif; ?>
                <div class="exhibition-cta-actions">
                  <?php if (($ctaLink = $linkAttrs($str('ctaHref'))) !== '' && $str('ctaLinkLabel') !== ''): ?>
                    <a class="btn btn-primary"<?= $ctaLink ?>><?= $h($str('ctaLinkLabel')) ?></a>
                  <?php endif; ?>
                  <?php if ($ctaPoster): ?>
                    <a class="btn btn-ghost" href="100-dagar-av-sol#poster" data-lang-link><?= $h($en ? 'The poster' : 'Postern') ?></a>
                  <?php endif; ?>
                </div>
              </div>
            </section>
          <?php endif; ?>

          <div class="gallery-cta-row">
            <a class="btn btn-ghost" href="index.html#hem" data-lang-link><?= $h($en ? 'Back to the home page' : 'Tillbaka till startsidan') ?></a>
            <a class="btn btn-ghost" href="gallery.html" data-lang-link><?= $h($en ? 'All paintings' : 'Alla målningar') ?></a>
          </div>
        </div>
      </article>
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
