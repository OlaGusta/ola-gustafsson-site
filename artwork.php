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
$fontStylesheetHref = seo_google_fonts_href($payload);
$publicContactConfig = portfolio_public_contact_config($payload);
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
      <link id="favicon-png" rel="icon" type="image/png" sizes="32x32" href="/favicon-light-32x32.png?v=20260317-14" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-light-32x32.png?v=20260317-14" media="(prefers-color-scheme: light)" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-dark-32x32.png?v=20260317-14" media="(prefers-color-scheme: dark)" />
      <link id="favicon-ico" rel="icon" href="/favicon-light.ico?v=20260317-14" sizes="any" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=20260317-14" />
      <link rel="manifest" href="/site.webmanifest?v=20260317-14" />

      <script type="application/ld+json"><?= $structuredJson ?></script>

      <?php if ($fontStylesheetHref !== ''): ?>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="<?= htmlspecialchars($fontStylesheetHref, ENT_QUOTES) ?>" rel="stylesheet" media="print" data-deferred-stylesheet="fonts" />
        <noscript><link href="<?= htmlspecialchars($fontStylesheetHref, ENT_QUOTES) ?>" rel="stylesheet" /></noscript>
      <?php endif; ?>
      <link rel="stylesheet" href="/styles.css?v=20260428-02" />
    </head>
    <body id="page-top" data-page="artwork">
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
            <span class="footer-logo" aria-hidden="true"></span>
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
      <script src="/script.js?v=20260428-02" defer></script>
    </body>
  </html>
  <?php
  exit;
}

$src = isset($artwork['src']) && is_string($artwork['src']) ? trim($artwork['src']) : '';
$src = ltrim($src, '/');
$imagePath = '/' . $src;
$buildImageVariantPath = static function (string $value, string $variant): string {
  $trimmed = trim($value);
  if ($trimmed === '' || preg_match('/^https?:\\/\\//i', $trimmed) === 1) {
    return $trimmed;
  }

  $normalized = '/' . ltrim((string) preg_replace('/[?#].*$/', '', $trimmed), '/');
  if (preg_match('#^/images/#i', $normalized) !== 1 || preg_match('#^/images/(web|thumbs)/#i', $normalized) === 1) {
    return $normalized;
  }

  return '/images/' . trim($variant, '/') . '/' . basename($normalized);
};
$displayImagePath = $buildImageVariantPath($imagePath, 'web');
$imageUrl = $baseUrl . $displayImagePath;

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
$seoTitle = '';
if ($lang === 'en') {
  if (isset($translation['seoTitle']) && is_string($translation['seoTitle']) && trim($translation['seoTitle']) !== '') {
    $seoTitle = trim($translation['seoTitle']);
  }
} else {
  $seoTitle = $seoTitleSv;
}

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
} elseif ($lang !== 'en') {
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

$ogImageCandidate = $shareImage !== '' ? $shareImage : $displayImagePath;
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
$categoryLabels = portfolio_category_labels(
  $payload,
  $lang,
  isset($artwork['categories']) && is_array($artwork['categories']) ? $artwork['categories'] : [],
  $category
);
$categoryLabel = implode(', ', $categoryLabels);
$availability = isset($artwork['availability']) && is_string($artwork['availability'])
  ? strtolower(trim($artwork['availability']))
  : '';
if (!in_array($availability, ['available', 'reserved', 'sold', 'nfs'], true)) {
  $availability = '';
}

$availabilityMapSv = [
  'available' => 'Tillgänglig',
  'reserved' => 'Reserverad',
  'sold' => 'Såld',
  'nfs' => 'Ej till salu',
];
$availabilityMapEn = [
  'available' => 'Available',
  'reserved' => 'Reserved',
  'sold' => 'Sold',
  'nfs' => 'Not for sale',
];
$availabilityLabel = $availability !== ''
  ? ($lang === 'en' ? ($availabilityMapEn[$availability] ?? '') : ($availabilityMapSv[$availability] ?? ''))
  : '';
$availabilityTone = $availability !== '' ? $availability : 'default';
$inquiryMode = in_array($availability, ['sold', 'nfs'], true) ? 'similar' : 'artwork';
$inquiryHeading = $lang === 'en'
  ? ($inquiryMode === 'similar' ? 'Ask about similar work' : 'Ask about this artwork')
  : ($inquiryMode === 'similar' ? 'Fråga om liknande verk' : 'Fråga om detta verk');
$inquiryBody = $lang === 'en'
  ? ($inquiryMode === 'similar'
      ? 'This artwork is not currently available, but you are very welcome to ask about similar works or upcoming paintings.'
      : 'Feel free to get in touch if you would like more details, to reserve the piece, or to receive additional images before deciding.')
  : ($inquiryMode === 'similar'
      ? 'Det här verket är inte tillgängligt just nu, men du kan gärna fråga om liknande verk eller kommande målningar.'
      : 'Skriv gärna om du vill veta mer, reservera verket eller få fler bilder innan beslut.');
$inquiryButtonLabel = $lang === 'en'
  ? ($inquiryMode === 'similar' ? 'Ask about similar work' : 'Interested in this work')
  : ($inquiryMode === 'similar' ? 'Fråga om liknande verk' : 'Intresserad av verket');
$priceLabelSv = isset($artwork['priceLabel']) && is_string($artwork['priceLabel']) ? trim($artwork['priceLabel']) : '';
$priceLabel = isset($translation['priceLabel']) && is_string($translation['priceLabel']) && trim($translation['priceLabel']) !== ''
  ? trim($translation['priceLabel'])
  : $priceLabelSv;
if ($priceLabel !== '' && $availabilityLabel !== '' && strcasecmp($priceLabel, $availabilityLabel) === 0) {
  $priceLabel = '';
}
$collectorNoteSv = isset($artwork['collectorNote']) && is_string($artwork['collectorNote']) ? trim($artwork['collectorNote']) : '';
$collectorNote = isset($translation['collectorNote']) && is_string($translation['collectorNote']) && trim($translation['collectorNote']) !== ''
  ? trim($translation['collectorNote'])
  : $collectorNoteSv;
$artworkInquiryFormEnabled = !empty($publicContactConfig['formEnabled']);
$publicContactEmail = isset($publicContactConfig['email']) && is_string($publicContactConfig['email'])
  ? trim($publicContactConfig['email'])
  : '';
$inquiryMailtoHref = '';
if ($publicContactEmail !== '') {
  $mailSubject = $lang === 'en'
    ? sprintf('Inquiry about "%s"', $title)
    : sprintf('Intresse för "%s"', $title);
  $mailBody = $lang === 'en'
    ? sprintf("Hello,\n\nI am interested in \"%s\".\n\nLink: %s\n\nBest regards,", $title, seo_artwork_url($slug, $lang))
    : sprintf("Hej,\n\nJag är intresserad av \"%s\".\n\nLänk: %s\n\nVänliga hälsningar,", $title, seo_artwork_url($slug, $lang));
  $inquiryMailtoHref = 'mailto:' . rawurlencode($publicContactEmail)
    . '?subject=' . rawurlencode($mailSubject)
    . '&body=' . rawurlencode($mailBody);
}
$inquiryPrimaryHref = $artworkInquiryFormEnabled ? '#artwork-inquiry' : ($inquiryMailtoHref !== '' ? $inquiryMailtoHref : '#artwork-inquiry');
$inquiryFallbackBody = $lang === 'en'
  ? 'For security reasons the web form is only shown when verified captcha protection is active. Please email me directly instead.'
  : 'Av säkerhetsskäl visas webbformuläret bara när verifierad captcha är aktiverad. Mejla mig gärna direkt i stället.';

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
$descriptionTail = $lang === 'en' ? 'Original watercolor painting by Ola Gustafsson.' : 'Originalmålning i akvarell av Ola Gustafsson.';
$generatedDescription = $descriptionLead;
if (count($pieces) > 0) {
  $generatedDescription .= '. ' . implode(' · ', $pieces) . '.';
} else {
  $generatedDescription .= '.';
}
$generatedDescription .= ' ' . $descriptionTail;

$description = $seoDescription !== '' ? $seoDescription : $generatedDescription;
$visibleDescription = $generatedDescription;

if ($seoTitle !== '') {
  $pageTitle = $seoTitle;
} else {
  $pageTitleSource = $title !== '' ? $title : '';
  $fallbackTitleSuffix = $lang === 'en' ? 'Watercolor by Ola Gustafsson' : 'Akvarell av Ola Gustafsson';
  $pageTitle = $pageTitleSource !== '' ? "{$pageTitleSource} | {$fallbackTitleSuffix}" : $text['site_name'];
}
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

$offerAvailabilityMap = [
  'available' => 'https://schema.org/InStock',
  'reserved' => 'https://schema.org/PreOrder',
  'sold' => 'https://schema.org/SoldOut',
  'nfs' => 'https://schema.org/Discontinued',
];
if ($availability !== '' && isset($offerAvailabilityMap[$availability])) {
  $offer = [
    '@type' => 'Offer',
    'url' => $canonical,
    'availability' => $offerAvailabilityMap[$availability],
    'seller' => ['@id' => $personId],
  ];

  if ($priceLabel !== '' && preg_match('/([0-9][0-9\\s.,]*)\\s*(SEK|EUR|USD|GBP)/i', $priceLabel, $m) === 1) {
    $numeric = str_replace(' ', '', $m[1]);
    $numeric = str_replace(',', '.', $numeric);
    $priceValue = (float) $numeric;
    $currency = strtoupper($m[2]);
    if ($priceValue > 0 && $currency !== '') {
      $offer['price'] = number_format($priceValue, 2, '.', '');
      $offer['priceCurrency'] = $currency;
    }
  }

  $visualArtwork['offers'] = $offer;
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
    <link id="favicon-png" rel="icon" type="image/png" sizes="32x32" href="/favicon-light-32x32.png?v=20260317-14" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-light-32x32.png?v=20260317-14" media="(prefers-color-scheme: light)" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-dark-32x32.png?v=20260317-14" media="(prefers-color-scheme: dark)" />
    <link id="favicon-ico" rel="icon" href="/favicon-light.ico?v=20260317-14" sizes="any" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=20260317-14" />
    <link rel="manifest" href="/site.webmanifest?v=20260317-14" />

    <script type="application/ld+json"><?= $structuredJson ?></script>

    <?php if ($fontStylesheetHref !== ''): ?>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link href="<?= htmlspecialchars($fontStylesheetHref, ENT_QUOTES) ?>" rel="stylesheet" media="print" data-deferred-stylesheet="fonts" />
      <noscript><link href="<?= htmlspecialchars($fontStylesheetHref, ENT_QUOTES) ?>" rel="stylesheet" /></noscript>
    <?php endif; ?>
    <link rel="stylesheet" href="/styles.css?v=20260428-02" />
    <script src="/overrides.js?v=<?= htmlspecialchars($overridesRevParam, ENT_QUOTES) ?>"></script>
    <script src="/content.js?v=20260222-06" defer></script>
    <script src="/script.js?v=20260428-02" defer></script>
  </head>
  <body id="page-top" data-page="artwork">
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
                src="<?= htmlspecialchars($displayImagePath, ENT_QUOTES) ?>"
                alt="<?= htmlspecialchars($alt, ENT_QUOTES) ?>"
                loading="eager"
                decoding="async"
              />
            </figure>

            <aside class="artwork-details surface-soft">
              <p class="eyebrow"><?= htmlspecialchars($lang === 'en' ? 'Artwork' : 'Verk', ENT_QUOTES) ?></p>
              <h1><?= htmlspecialchars($title, ENT_QUOTES) ?></h1>
              <p class="artwork-lead"><?= htmlspecialchars($visibleDescription, ENT_QUOTES) ?></p>

              <?php if ($availabilityLabel !== '' || $priceLabel !== ''): ?>
                <div class="artwork-market-strip">
                  <?php if ($availabilityLabel !== ''): ?>
                    <div class="artwork-market-block">
                      <span class="artwork-market-label"><?= htmlspecialchars($lang === 'en' ? 'Availability' : 'Status', ENT_QUOTES) ?></span>
                      <span class="artwork-status-badge is-<?= htmlspecialchars($availabilityTone, ENT_QUOTES) ?>">
                        <?= htmlspecialchars($availabilityLabel, ENT_QUOTES) ?>
                      </span>
                    </div>
                  <?php endif; ?>
                  <?php if ($priceLabel !== ''): ?>
                    <div class="artwork-market-block">
                      <span class="artwork-market-label"><?= htmlspecialchars($lang === 'en' ? 'Price' : 'Pris', ENT_QUOTES) ?></span>
                      <strong class="artwork-price-value"><?= htmlspecialchars($priceLabel, ENT_QUOTES) ?></strong>
                    </div>
                  <?php endif; ?>
                </div>
              <?php endif; ?>

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

              <?php if ($collectorNote !== ''): ?>
                <section class="artwork-collector-note">
                  <p class="artwork-market-label"><?= htmlspecialchars($lang === 'en' ? 'Collector note' : 'För samlare', ENT_QUOTES) ?></p>
                  <p><?= htmlspecialchars($collectorNote, ENT_QUOTES) ?></p>
                </section>
              <?php endif; ?>

              <div class="artwork-actions">
                <a class="btn btn-primary" href="<?= htmlspecialchars($inquiryPrimaryHref, ENT_QUOTES) ?>"><?= htmlspecialchars($inquiryButtonLabel, ENT_QUOTES) ?></a>
                <a class="btn btn-ghost" href="/gallery.html" data-lang-link><?= $lang === 'en' ? 'Back to gallery' : 'Till galleriet' ?></a>
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
              </div>

              <div id="artwork-copy-status" class="copy-status" aria-live="polite"></div>
            </aside>
          </div>

          <section id="artwork-inquiry" class="artwork-inquiry-card surface-soft">
            <div class="artwork-inquiry-copy">
              <p class="eyebrow"><?= htmlspecialchars($lang === 'en' ? 'Inquiry' : 'Intresseanmälan', ENT_QUOTES) ?></p>
              <h2><?= htmlspecialchars($inquiryHeading, ENT_QUOTES) ?></h2>
              <p><?= htmlspecialchars($artworkInquiryFormEnabled ? $inquiryBody : $inquiryFallbackBody, ENT_QUOTES) ?></p>
            </div>
            <?php if ($artworkInquiryFormEnabled): ?>
              <form
                id="artwork-inquiry-form"
                class="contact-form artwork-inquiry-form"
                data-artwork-title="<?= htmlspecialchars($title, ENT_QUOTES) ?>"
                data-inquiry-mode="<?= htmlspecialchars($inquiryMode, ENT_QUOTES) ?>"
                data-form-enabled="true"
                data-turnstile-site-key="<?= htmlspecialchars((string) ($publicContactConfig['turnstileSiteKey'] ?? ''), ENT_QUOTES) ?>"
                novalidate
              >
                <input type="hidden" name="inquirySlug" value="<?= htmlspecialchars($canonicalSlug, ENT_QUOTES) ?>" />
                <input type="hidden" name="inquiryTitle" value="<?= htmlspecialchars($title, ENT_QUOTES) ?>" />
                <input type="hidden" name="inquiryAvailability" value="<?= htmlspecialchars($availability, ENT_QUOTES) ?>" />
                <input type="hidden" name="inquiryPriceLabel" value="<?= htmlspecialchars($priceLabel, ENT_QUOTES) ?>" />
                <input type="hidden" name="inquirySourceUrl" value="<?= htmlspecialchars($canonical, ENT_QUOTES) ?>" />
                <input type="hidden" name="turnstileToken" value="" />

                <label><?= htmlspecialchars($lang === 'en' ? 'Name' : 'Namn', ENT_QUOTES) ?>
                  <input type="text" name="name" autocomplete="name" required />
                </label>

                <label><?= htmlspecialchars($lang === 'en' ? 'Email' : 'E-post', ENT_QUOTES) ?>
                  <input type="email" name="email" autocomplete="email" required />
                </label>

                <label><?= htmlspecialchars($lang === 'en' ? 'Message' : 'Meddelande', ENT_QUOTES) ?>
                  <textarea
                    name="message"
                    rows="6"
                    placeholder="<?= htmlspecialchars($lang === 'en'
                      ? 'Tell me what you would like to know more about: price, shipping, framing, or whether you would like to reserve the work.'
                      : 'Berätta gärna vad du vill veta mer om: pris, frakt, inramning eller om du vill boka verket.', ENT_QUOTES) ?>"
                    required
                  ></textarea>
                </label>

                <label class="contact-honeypot" aria-hidden="true">
                  Website
                  <input type="text" name="website" tabindex="-1" autocomplete="off" />
                </label>

                <div id="artwork-inquiry-turnstile" class="contact-turnstile" hidden></div>

                <div class="artwork-inquiry-actions">
                  <button class="btn btn-primary" type="submit">
                    <?= htmlspecialchars($lang === 'en'
                      ? ($inquiryMode === 'similar' ? 'Ask about similar work' : 'Send inquiry')
                      : ($inquiryMode === 'similar' ? 'Skicka förfrågan om liknande verk' : 'Skicka förfrågan'), ENT_QUOTES) ?>
                  </button>
                </div>

                <p id="artwork-inquiry-status" class="contact-form-status" data-kind="info" aria-live="polite"></p>
              </form>
            <?php elseif ($inquiryMailtoHref !== ''): ?>
              <div class="artwork-inquiry-actions">
                <a class="btn btn-primary" href="<?= htmlspecialchars($inquiryMailtoHref, ENT_QUOTES) ?>">
                  <?= htmlspecialchars($lang === 'en' ? 'Email about this artwork' : 'Mejla om verket', ENT_QUOTES) ?>
                </a>
              </div>
            <?php else: ?>
              <p id="artwork-inquiry-status" class="contact-form-status" data-kind="error" aria-live="polite">
                <?= htmlspecialchars($lang === 'en' ? 'Direct contact is not configured yet.' : 'Direkt kontakt är inte konfigurerad ännu.', ENT_QUOTES) ?>
              </p>
            <?php endif; ?>
          </section>
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
          <a href="#page-top" data-scroll-top data-bind="ui.scrollTop">Till toppen</a>
        </div>
      </div>
    </footer>
  </body>
</html>
