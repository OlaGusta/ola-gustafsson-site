<?php
declare(strict_types=1);

require __DIR__ . '/seo.php';
require_once __DIR__ . '/portfolio_core.php';

$lang = seo_normalize_lang($_GET['lang'] ?? null);
$text = seo_text($lang);
$robots = seo_is_stage() ? $text['robots_stage'] : $text['robots_live'];
$baseUrl = seo_base_url();
$overridesRev = (int) (@filemtime(__DIR__ . '/overrides.js') ?: 0);
$overridesRevParam = $overridesRev > 0 ? (string) $overridesRev : '0';

$payload = portfolio_load_overrides();
$slugMap = portfolio_build_artwork_slug_map($payload);

$slug = isset($_GET['slug']) && is_string($_GET['slug']) ? trim($_GET['slug']) : '';
$slug = portfolio_slugify($slug);

$artworks = [];
if (isset($payload['gallery']) && is_array($payload['gallery']) && isset($payload['gallery']['artworks'])) {
  $artworks = $payload['gallery']['artworks'];
}
if (!is_array($artworks)) {
  $artworks = [];
}

$artworkIndex = array_key_exists($slug, $slugMap) ? $slugMap[$slug] : null;
$artwork = is_int($artworkIndex) && isset($artworks[$artworkIndex]) && is_array($artworks[$artworkIndex])
  ? $artworks[$artworkIndex]
  : null;

if (!$artwork) {
  http_response_code(404);
  $pageTitle = $lang === 'en' ? 'Artwork not found' : 'Verket hittades inte';
  $description = $lang === 'en'
    ? 'The requested artwork could not be found. Return to the gallery to browse all works.'
    : 'Det begärda verket kunde inte hittas. Gå tillbaka till galleriet för att se alla verk.';
  $canonical = $baseUrl . '/gallery.html?lang=' . rawurlencode($lang);
  $ogImageValue = seo_choose_share_image((string) ($text['og_image'] ?? '/images/ola-02.jpg'), '/images/ola-portrait.jpg');
  if (preg_match('/^https?:\\/\\//i', $ogImageValue) === 1) {
    $ogImage = $ogImageValue;
    $ogImagePath = '';
  } else {
    $ogImagePath = '/' . ltrim($ogImageValue, '/');
    $ogImage = $baseUrl . $ogImagePath;
  }
  $ogImageAlt = $text['og_image_alt'] ?? '';
  $ogImageMeta = seo_local_image_meta($ogImagePath);
  $ogLocale = seo_lang_og_locale($lang);
  $ogLocaleAlt = $lang === 'en' ? seo_lang_og_locale('sv') : seo_lang_og_locale('en');

  $structuredData = [
    [
      '@context' => 'https://schema.org',
      '@type' => 'WebPage',
      '@id' => $canonical . '#webpage',
      'url' => $canonical,
      'name' => $pageTitle,
      'description' => $description,
      'inLanguage' => seo_lang_locale($lang),
    ],
  ];
  $structuredJson = json_encode($structuredData, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) ?: '[]';
  ?>
  <!DOCTYPE html>
  <html lang="<?= htmlspecialchars($lang, ENT_QUOTES) ?>">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <base href="/" />
      <title><?= htmlspecialchars($pageTitle, ENT_QUOTES) ?></title>
      <meta name="description" content="<?= htmlspecialchars($description, ENT_QUOTES) ?>" />
      <meta name="robots" content="<?= htmlspecialchars($robots, ENT_QUOTES) ?>" />
      <link rel="canonical" href="<?= htmlspecialchars($canonical, ENT_QUOTES) ?>" />

      <meta property="og:title" content="<?= htmlspecialchars($pageTitle, ENT_QUOTES) ?>" />
      <meta property="og:description" content="<?= htmlspecialchars($description, ENT_QUOTES) ?>" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="<?= htmlspecialchars($canonical, ENT_QUOTES) ?>" />
      <meta property="og:site_name" content="<?= htmlspecialchars($text['site_name'], ENT_QUOTES) ?>" />
      <meta property="og:locale" content="<?= htmlspecialchars($ogLocale, ENT_QUOTES) ?>" />
      <meta property="og:locale:alternate" content="<?= htmlspecialchars($ogLocaleAlt, ENT_QUOTES) ?>" />
      <meta property="og:image" content="<?= htmlspecialchars($ogImage, ENT_QUOTES) ?>" />
      <meta property="og:image:url" content="<?= htmlspecialchars($ogImage, ENT_QUOTES) ?>" />
      <meta property="og:image:secure_url" content="<?= htmlspecialchars($ogImage, ENT_QUOTES) ?>" />
      <meta property="og:image:alt" content="<?= htmlspecialchars($ogImageAlt, ENT_QUOTES) ?>" />
      <?php if (isset($ogImageMeta['width'], $ogImageMeta['height'])): ?>
        <meta property="og:image:width" content="<?= htmlspecialchars((string) $ogImageMeta['width'], ENT_QUOTES) ?>" />
        <meta property="og:image:height" content="<?= htmlspecialchars((string) $ogImageMeta['height'], ENT_QUOTES) ?>" />
        <?php if (isset($ogImageMeta['mime']) && is_string($ogImageMeta['mime']) && $ogImageMeta['mime'] !== ''): ?>
          <meta property="og:image:type" content="<?= htmlspecialchars($ogImageMeta['mime'], ENT_QUOTES) ?>" />
        <?php endif; ?>
      <?php endif; ?>

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="<?= htmlspecialchars($pageTitle, ENT_QUOTES) ?>" />
      <meta name="twitter:description" content="<?= htmlspecialchars($description, ENT_QUOTES) ?>" />
      <meta name="twitter:image" content="<?= htmlspecialchars($ogImage, ENT_QUOTES) ?>" />
      <meta name="twitter:image:alt" content="<?= htmlspecialchars($ogImageAlt, ENT_QUOTES) ?>" />

      <meta name="theme-color" content="#f3efe6" />
      <link rel="icon" href="/favicon.ico?v=20260222-10" sizes="any" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=20260222-10" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=20260222-10" />
      <link rel="manifest" href="/site.webmanifest?v=20260222-10" />

      <script type="application/ld+json"><?= $structuredJson ?></script>

      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Fraunces:opsz,wght@9..144,300..800&family=Lora:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Source+Sans+3:wght@300;400;500;600;700;800&display=swap"
        rel="stylesheet"
      />
      <link rel="stylesheet" href="/styles.css?v=20260222-12" />
    </head>
    <body id="page-top" data-page="artwork">
      <header class="site-header" id="top">
        <div class="container header-inner">
          <a class="brand" href="/index.html#top" data-lang-link>
            <img
              class="brand-logo"
              src="/brand-logo-blue.png?v=20260222-01"
              alt=""
              aria-hidden="true"
              loading="eager"
              decoding="async"
            />
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
          </div>
          <button
            class="menu-toggle"
            aria-expanded="false"
            aria-controls="main-nav"
            aria-label="Öppna meny"
            data-bind="ui.menuButton"
            data-bind-aria="ui.menuAriaLabel"
          >
            Meny
          </button>
        </div>
      </header>

      <main>
        <section class="section reveal">
          <div class="container surface-soft" style="padding: var(--space-6);">
            <h1 style="margin-top: 0;"><?= htmlspecialchars($pageTitle, ENT_QUOTES) ?></h1>
            <p style="color: var(--color-soft-ink); margin-bottom: 0;"><?= htmlspecialchars($description, ENT_QUOTES) ?></p>
            <div style="margin-top: var(--space-5); display: flex; gap: var(--space-3); flex-wrap: wrap;">
              <a class="btn btn-primary" href="/gallery.html" data-lang-link><?= $lang === 'en' ? 'Back to gallery' : 'Till galleriet' ?></a>
              <a class="btn btn-ghost" href="/index.html" data-lang-link><?= $lang === 'en' ? 'Back to home' : 'Till startsidan' ?></a>
            </div>
          </div>
        </section>
      </main>

      <footer class="site-footer">
        <div class="container footer-inner">
          <div class="footer-brand">
            <img class="footer-logo" src="/brand-logo-blue.png?v=20260222-01" alt="Ola Gustafsson logotyp" loading="lazy" decoding="async" />
            <p data-bind="site.footerText">© 2026 Ola Gustafsson Akvarell</p>
          </div>
          <div class="footer-tools">
            <a id="studio-footer-link" class="footer-auth-btn" href="/studio.html">Studio</a>
            <a href="#page-top" data-scroll-top data-bind="ui.scrollTop">Till toppen</a>
          </div>
        </div>
      </footer>

      <script src="/overrides.js?v=<?= htmlspecialchars($overridesRevParam, ENT_QUOTES) ?>"></script>
      <script src="/content.js?v=20260222-06" defer></script>
      <script src="/script.js?v=20260222-09" defer></script>
    </body>
  </html>
  <?php
  exit;
}

$src = isset($artwork['src']) && is_string($artwork['src']) ? trim($artwork['src']) : '';
$src = ltrim($src, '/');
$imagePath = '/' . $src;
$imageUrl = $baseUrl . $imagePath;

$translation = portfolio_artwork_translation($payload, $lang, $src);

$titleSv = isset($artwork['title']) && is_string($artwork['title']) ? trim($artwork['title']) : '';
$title = isset($translation['title']) && is_string($translation['title']) && trim($translation['title']) !== ''
  ? trim($translation['title'])
  : $titleSv;

$mediumSv = isset($artwork['medium']) && is_string($artwork['medium']) ? trim($artwork['medium']) : '';
$medium = isset($translation['medium']) && is_string($translation['medium']) && trim($translation['medium']) !== ''
  ? trim($translation['medium'])
  : $mediumSv;
if ($lang === 'en' && $medium === '' && $mediumSv !== '') {
  $medium = $mediumSv;
}
if ($lang === 'en' && $medium === 'Akvarell på papper') {
  $medium = 'Watercolor on paper';
}

$altSv = isset($artwork['alt']) && is_string($artwork['alt']) ? trim($artwork['alt']) : '';
$alt = isset($translation['alt']) && is_string($translation['alt']) && trim($translation['alt']) !== ''
  ? trim($translation['alt'])
  : ($altSv !== '' ? $altSv : $title);

$seoTitleSv = isset($artwork['seoTitle']) && is_string($artwork['seoTitle']) ? trim($artwork['seoTitle']) : '';
$seoTitle = isset($translation['seoTitle']) && is_string($translation['seoTitle']) && trim($translation['seoTitle']) !== ''
  ? trim($translation['seoTitle'])
  : $seoTitleSv;

$seoDescriptionSv = '';
if (isset($artwork['seoDescription']) && is_string($artwork['seoDescription'])) {
  $seoDescriptionSv = trim($artwork['seoDescription']);
} elseif (isset($artwork['metaDescription']) && is_string($artwork['metaDescription'])) {
  $seoDescriptionSv = trim($artwork['metaDescription']);
}
$seoDescription = '';
if (isset($translation['seoDescription']) && is_string($translation['seoDescription']) && trim($translation['seoDescription']) !== '') {
  $seoDescription = trim($translation['seoDescription']);
} elseif (isset($translation['metaDescription']) && is_string($translation['metaDescription']) && trim($translation['metaDescription']) !== '') {
  $seoDescription = trim($translation['metaDescription']);
} else {
  $seoDescription = $seoDescriptionSv;
}

$formatSv = isset($artwork['format']) && is_string($artwork['format']) ? trim($artwork['format']) : '';
$format = isset($translation['format']) && is_string($translation['format']) && trim($translation['format']) !== ''
  ? trim($translation['format'])
  : $formatSv;

$shareImageSv = isset($artwork['shareImage']) && is_string($artwork['shareImage']) ? trim($artwork['shareImage']) : '';
$shareImage = isset($translation['shareImage']) && is_string($translation['shareImage']) && trim($translation['shareImage']) !== ''
  ? trim($translation['shareImage'])
  : $shareImageSv;

$ogImageCandidate = $shareImage !== '' ? $shareImage : $imagePath;
$ogImageResolved = seo_choose_share_image($ogImageCandidate, '/images/ola-portrait.jpg');
if (preg_match('/^https?:\\/\\//i', $ogImageResolved) === 1) {
  $ogImageUrl = $ogImageResolved;
  $ogImagePath = '';
} else {
  $ogImagePath = '/' . ltrim($ogImageResolved, '/');
  $ogImageUrl = $baseUrl . $ogImagePath;
}

$ogImageMetaPath = $ogImagePath;
if ($ogImageMetaPath !== '') {
  $split = preg_split('/[?#]/', $ogImageMetaPath, 2);
  if (is_array($split) && isset($split[0]) && is_string($split[0])) {
    $ogImageMetaPath = $split[0];
  }
}
$ogImageMeta = $ogImageMetaPath !== '' ? seo_local_image_meta($ogImageMetaPath) : [];
$ogImageTag = $ogImageUrl;
if ($ogImagePath !== '') {
  $ogImageFile = __DIR__ . $ogImagePath;
  $ogImageRev = (int) (@filemtime($ogImageFile) ?: 0);
  if ($ogImageRev > 0) {
    $ogImageTag = $ogImageUrl . (str_contains($ogImageUrl, '?') ? '&' : '?') . 'v=' . $ogImageRev;
  }
}

$year = isset($artwork['year']) ? (int) $artwork['year'] : 0;
$category = isset($artwork['category']) && is_string($artwork['category']) ? trim($artwork['category']) : '';
$categoryLabel = portfolio_category_label($payload, $lang, $category);

$canonicalSlug = $slug;
$canonical = seo_artwork_url($canonicalSlug, $lang);
$alternateSv = seo_artwork_url($canonicalSlug, 'sv');
$alternateEn = seo_artwork_url($canonicalSlug, 'en');

// If the slug in the URL isn't the canonical slug (e.g. casing, spaces), redirect to the normalized version.
if (isset($_GET['slug']) && is_string($_GET['slug']) && trim($_GET['slug']) !== '' && trim($_GET['slug']) !== $canonicalSlug) {
  header('Location: ' . $canonical, true, 301);
  exit;
}

$pieces = [];
if ($medium !== '') {
  $pieces[] = $medium;
}
if ($format !== '') {
  $pieces[] = $format;
}
if ($year > 0) {
  $pieces[] = (string) $year;
}
if ($categoryLabel !== '') {
  $pieces[] = $categoryLabel;
}

$descriptionLead = $title !== '' ? $title : ($lang === 'en' ? 'Watercolor painting' : 'Akvarellmålning');
$descriptionTail = $lang === 'en' ? 'Watercolor by Ola Gustafsson.' : 'Akvarell av Ola Gustafsson.';
$generatedDescription = $descriptionLead;
if (count($pieces) > 0) {
  $generatedDescription .= '. ' . implode(' · ', $pieces) . '.';
} else {
  $generatedDescription .= '.';
}
$generatedDescription .= ' ' . $descriptionTail;

$description = $seoDescription !== '' ? $seoDescription : $generatedDescription;
$visibleDescription = $generatedDescription;

$pageTitleSource = $seoTitle !== '' ? $seoTitle : $title;
$pageTitle = $pageTitleSource !== '' ? "{$pageTitleSource} | {$text['site_name']}" : $text['site_name'];
$ogLocale = seo_lang_og_locale($lang);
$ogLocaleAlt = $lang === 'en' ? seo_lang_og_locale('sv') : seo_lang_og_locale('en');

$personId = $baseUrl . '/#ola-gustafsson';
$websiteId = $baseUrl . '/#website';
$artworkId = $canonical . '#artwork';

$structuredData = [];
$structuredData[] = [
  '@context' => 'https://schema.org',
  '@type' => 'Person',
  '@id' => $personId,
  'name' => 'Ola Gustafsson',
  'url' => $baseUrl . '/',
  'image' => $baseUrl . '/images/ola-portrait.jpg',
  'sameAs' => [
    'https://www.instagram.com/holagustafsson/',
    'https://www.facebook.com/holagustafsson'
  ]
];
$structuredData[] = [
  '@context' => 'https://schema.org',
  '@type' => 'WebSite',
  '@id' => $websiteId,
  'name' => $text['site_name'],
  'url' => $baseUrl . '/',
  'inLanguage' => ['sv-SE', 'en-US'],
  'publisher' => ['@id' => $personId]
];

$visualArtwork = [
  '@context' => 'https://schema.org',
  '@type' => 'VisualArtwork',
  '@id' => $artworkId,
  'name' => $title,
  'url' => $canonical,
  'image' => $imageUrl,
  'artform' => 'Painting',
  'artMedium' => $medium,
  'creator' => ['@id' => $personId],
  'inLanguage' => seo_lang_locale($lang),
];
if ($description !== '') {
  $visualArtwork['description'] = $description;
}
if ($year > 0) {
  $visualArtwork['dateCreated'] = (string) $year;
}
$formatParts = portfolio_parse_format_cm($format);
if (isset($formatParts['width_cm'], $formatParts['height_cm'])) {
  $visualArtwork['width'] = [
    '@type' => 'QuantitativeValue',
    'value' => $formatParts['width_cm'],
    'unitCode' => 'CMT'
  ];
  $visualArtwork['height'] = [
    '@type' => 'QuantitativeValue',
    'value' => $formatParts['height_cm'],
    'unitCode' => 'CMT'
  ];
}
$structuredData[] = $visualArtwork;

$structuredData[] = [
  '@context' => 'https://schema.org',
  '@type' => 'BreadcrumbList',
  '@id' => $canonical . '#breadcrumb',
  'itemListElement' => [
    [
      '@type' => 'ListItem',
      'position' => 1,
      'name' => $lang === 'en' ? 'Home' : 'Hem',
      'item' => seo_canonical_url('home', $lang)
    ],
    [
      '@type' => 'ListItem',
      'position' => 2,
      'name' => $lang === 'en' ? 'Gallery' : 'Galleri',
      'item' => seo_canonical_url('gallery', $lang)
    ],
    [
      '@type' => 'ListItem',
      'position' => 3,
      'name' => $title,
      'item' => $canonical
    ]
  ]
];

$structuredData[] = [
  '@context' => 'https://schema.org',
  '@type' => 'WebPage',
  '@id' => $canonical . '#webpage',
  'url' => $canonical,
  'name' => $pageTitle,
  'description' => $description,
  'inLanguage' => seo_lang_locale($lang),
  'isPartOf' => ['@id' => $websiteId],
  'mainEntity' => ['@id' => $artworkId],
];

$structuredJson = json_encode($structuredData, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
if (!is_string($structuredJson)) {
  $structuredJson = '[]';
}
?>
<!DOCTYPE html>
<html lang="<?= htmlspecialchars($lang, ENT_QUOTES) ?>">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <base href="/" />
    <title><?= htmlspecialchars($pageTitle, ENT_QUOTES) ?></title>
    <meta name="description" content="<?= htmlspecialchars($description, ENT_QUOTES) ?>" />
    <meta name="robots" content="<?= htmlspecialchars($robots, ENT_QUOTES) ?>" />
    <link rel="canonical" href="<?= htmlspecialchars($canonical, ENT_QUOTES) ?>" />
    <link rel="alternate" hreflang="sv" href="<?= htmlspecialchars($alternateSv, ENT_QUOTES) ?>" />
    <link rel="alternate" hreflang="en" href="<?= htmlspecialchars($alternateEn, ENT_QUOTES) ?>" />
    <link rel="alternate" hreflang="x-default" href="<?= htmlspecialchars($alternateSv, ENT_QUOTES) ?>" />

    <meta property="og:title" content="<?= htmlspecialchars($pageTitle, ENT_QUOTES) ?>" />
    <meta property="og:description" content="<?= htmlspecialchars($description, ENT_QUOTES) ?>" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="<?= htmlspecialchars($canonical, ENT_QUOTES) ?>" />
    <meta property="og:site_name" content="<?= htmlspecialchars($text['site_name'], ENT_QUOTES) ?>" />
    <meta property="og:locale" content="<?= htmlspecialchars($ogLocale, ENT_QUOTES) ?>" />
    <meta property="og:locale:alternate" content="<?= htmlspecialchars($ogLocaleAlt, ENT_QUOTES) ?>" />
    <meta property="og:image" content="<?= htmlspecialchars($ogImageTag, ENT_QUOTES) ?>" />
    <meta property="og:image:url" content="<?= htmlspecialchars($ogImageTag, ENT_QUOTES) ?>" />
    <meta property="og:image:secure_url" content="<?= htmlspecialchars($ogImageTag, ENT_QUOTES) ?>" />
    <meta property="og:image:alt" content="<?= htmlspecialchars($alt, ENT_QUOTES) ?>" />
    <?php if (isset($ogImageMeta['width'], $ogImageMeta['height'])): ?>
      <meta property="og:image:width" content="<?= htmlspecialchars((string) $ogImageMeta['width'], ENT_QUOTES) ?>" />
      <meta property="og:image:height" content="<?= htmlspecialchars((string) $ogImageMeta['height'], ENT_QUOTES) ?>" />
      <?php if (isset($ogImageMeta['mime']) && is_string($ogImageMeta['mime']) && $ogImageMeta['mime'] !== ''): ?>
        <meta property="og:image:type" content="<?= htmlspecialchars($ogImageMeta['mime'], ENT_QUOTES) ?>" />
      <?php endif; ?>
    <?php endif; ?>

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="<?= htmlspecialchars($pageTitle, ENT_QUOTES) ?>" />
    <meta name="twitter:description" content="<?= htmlspecialchars($description, ENT_QUOTES) ?>" />
    <meta name="twitter:image" content="<?= htmlspecialchars($ogImageTag, ENT_QUOTES) ?>" />
    <meta name="twitter:image:alt" content="<?= htmlspecialchars($alt, ENT_QUOTES) ?>" />

    <meta name="theme-color" content="#f3efe6" />
    <link rel="icon" href="/favicon.ico?v=20260222-10" sizes="any" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=20260222-10" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=20260222-10" />
    <link rel="manifest" href="/site.webmanifest?v=20260222-10" />

    <script type="application/ld+json"><?= $structuredJson ?></script>

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Fraunces:opsz,wght@9..144,300..800&family=Lora:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Source+Sans+3:wght@300;400;500;600;700;800&display=swap"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="/styles.css?v=20260222-12" />
    <script src="/overrides.js?v=<?= htmlspecialchars($overridesRevParam, ENT_QUOTES) ?>"></script>
    <script src="/content.js?v=20260222-06" defer></script>
    <script src="/script.js?v=20260222-09" defer></script>
  </head>
  <body id="page-top" data-page="artwork">
    <header class="site-header" id="top">
      <div class="container header-inner">
        <a class="brand" href="/index.html#top" data-lang-link>
          <img
            class="brand-logo"
            src="/brand-logo-blue.png?v=20260222-01"
            alt=""
            aria-hidden="true"
            loading="eager"
            decoding="async"
          />
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
        </div>
        <button
          class="menu-toggle"
          aria-expanded="false"
          aria-controls="main-nav"
          aria-label="Öppna meny"
          data-bind="ui.menuButton"
          data-bind-aria="ui.menuAriaLabel"
        >
          Meny
        </button>
      </div>
    </header>

    <main>
      <section class="section reveal artwork-page">
        <div class="container">
          <nav class="breadcrumb">
            <a href="/index.html#top" data-lang-link><?= $lang === 'en' ? 'Home' : 'Hem' ?></a>
            <span aria-hidden="true">/</span>
            <a href="/gallery.html" data-lang-link><?= $lang === 'en' ? 'Gallery' : 'Galleri' ?></a>
            <span aria-hidden="true">/</span>
            <span><?= htmlspecialchars($title, ENT_QUOTES) ?></span>
          </nav>

          <div class="artwork-layout">
            <figure class="artwork-media surface-soft" data-fallback="<?= htmlspecialchars($lang === 'en' ? 'Could not load image.' : 'Kunde inte ladda bilden.', ENT_QUOTES) ?>">
              <img
                class="artwork-photo"
                src="<?= htmlspecialchars($imagePath, ENT_QUOTES) ?>"
                alt="<?= htmlspecialchars($alt, ENT_QUOTES) ?>"
                loading="eager"
                decoding="async"
              />
            </figure>

            <aside class="artwork-details surface-soft">
              <p class="eyebrow"><?= htmlspecialchars($lang === 'en' ? 'Artwork' : 'Verk', ENT_QUOTES) ?></p>
              <h1><?= htmlspecialchars($title, ENT_QUOTES) ?></h1>
              <p class="artwork-lead"><?= htmlspecialchars($visibleDescription, ENT_QUOTES) ?></p>

              <dl class="artwork-facts">
                <?php if ($medium !== ''): ?>
                  <div>
                    <dt><?= htmlspecialchars($lang === 'en' ? 'Medium' : 'Teknik', ENT_QUOTES) ?></dt>
                    <dd><?= htmlspecialchars($medium, ENT_QUOTES) ?></dd>
                  </div>
                <?php endif; ?>
                <?php if ($format !== ''): ?>
                  <div>
                    <dt><?= htmlspecialchars($lang === 'en' ? 'Size' : 'Storlek', ENT_QUOTES) ?></dt>
                    <dd><?= htmlspecialchars($format, ENT_QUOTES) ?></dd>
                  </div>
                <?php endif; ?>
                <?php if ($year > 0): ?>
                  <div>
                    <dt><?= htmlspecialchars($lang === 'en' ? 'Year' : 'År', ENT_QUOTES) ?></dt>
                    <dd><?= htmlspecialchars((string) $year, ENT_QUOTES) ?></dd>
                  </div>
                <?php endif; ?>
                <?php if ($categoryLabel !== ''): ?>
                  <div>
                    <dt><?= htmlspecialchars($lang === 'en' ? 'Category' : 'Kategori', ENT_QUOTES) ?></dt>
                    <dd><?= htmlspecialchars($categoryLabel, ENT_QUOTES) ?></dd>
                  </div>
                <?php endif; ?>
              </dl>

              <div class="artwork-actions">
                <a class="btn btn-primary" href="/gallery.html" data-lang-link><?= $lang === 'en' ? 'Back to gallery' : 'Till galleriet' ?></a>
                <button
                  id="artwork-copy-link"
                  class="btn btn-ghost"
                  type="button"
                  data-bind="ui.copyArtworkLink"
                  data-copy-link="<?= htmlspecialchars($canonical, ENT_QUOTES) ?>"
                  data-copy-status-target="#artwork-copy-status"
                >
                  <?= htmlspecialchars($lang === 'en' ? 'Copy link' : 'Kopiera länk', ENT_QUOTES) ?>
                </button>
                <a class="btn btn-ghost" href="<?= htmlspecialchars($imagePath, ENT_QUOTES) ?>" target="_blank" rel="noreferrer">
                  <?= htmlspecialchars($lang === 'en' ? 'Open image' : 'Öppna bild', ENT_QUOTES) ?>
                </a>
              </div>

              <div id="artwork-copy-status" class="copy-status" aria-live="polite"></div>
            </aside>
          </div>
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <div class="container footer-inner">
        <div class="footer-brand">
          <img class="footer-logo" src="/brand-logo-blue.png?v=20260222-01" alt="Ola Gustafsson logotyp" loading="lazy" decoding="async" />
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
