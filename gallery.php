<?php
declare(strict_types=1);

require __DIR__ . '/seo.php';

$lang = seo_normalize_lang($_GET['lang'] ?? null);
$text = seo_text($lang);
$page = seo_page_meta('gallery', $lang);
$canonical = seo_canonical_url('gallery', $lang);
$baseUrl = seo_base_url();
$robots = seo_is_stage() ? $text['robots_stage'] : $text['robots_live'];
$ogImageValue = isset($page['og_image']) && is_string($page['og_image']) ? trim($page['og_image']) : '';
$ogImagePath = '/' . ltrim($ogImageValue !== '' ? $ogImageValue : '/images/ola-02.jpg', '/');
$ogImage = $baseUrl . $ogImagePath;
if ($ogImageValue !== '' && preg_match('/^https?:\\/\\//i', $ogImageValue) === 1) {
  $ogImage = $ogImageValue;
  $ogImagePath = '';
}
$ogImageAlt = $page['og_image_alt'];
$ogImageMeta = $ogImagePath !== '' ? seo_local_image_meta($ogImagePath) : [];
$ogImageTag = $ogImage;
if ($ogImagePath !== '') {
  $ogImageFile = __DIR__ . $ogImagePath;
  $ogImageRev = (int) (@filemtime($ogImageFile) ?: 0);
  if ($ogImageRev > 0) {
    $ogImageTag = $ogImage . (str_contains($ogImage, '?') ? '&' : '?') . 'v=' . $ogImageRev;
  }
}
$ogLocale = seo_lang_og_locale($lang);
$ogLocaleAlt = $lang === 'en' ? seo_lang_og_locale('sv') : seo_lang_og_locale('en');
$overridesRev = (int) (@filemtime(__DIR__ . '/overrides.js') ?: 0);
$overridesRevParam = $overridesRev > 0 ? (string) $overridesRev : '0';
$payload = seo_overrides_payload();
$fontStylesheetHref = seo_google_fonts_href($payload);
$galleryPageHeading = seo_localized_payload_string($payload, $lang, ['gallery', 'pageHeading']);
if ($galleryPageHeading === '') {
  $galleryPageHeading = $lang === 'en' ? 'Watercolor paintings by Ola Gustafsson' : 'Akvarellmålningar av Ola Gustafsson';
}
$gallerySubheading = seo_localized_payload_string($payload, $lang, ['gallery', 'subheading']);
$galleryItems = seo_sorted_gallery_page_items($payload, $lang);

$personId = $baseUrl . '/#ola-gustafsson';
$websiteId = $baseUrl . '/#website';
$breadcrumbItems = [
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
    'item' => $canonical
  ]
];
$structuredData = [
  [
    '@context' => 'https://schema.org',
    '@type' => 'CollectionPage',
    '@id' => $canonical . '#webpage',
    'url' => $canonical,
    'name' => $page['title'],
    'description' => $page['description'],
    'inLanguage' => seo_lang_locale($lang),
    'isPartOf' => ['@id' => $websiteId],
    'about' => ['@id' => $personId]
  ],
  [
    '@context' => 'https://schema.org',
    '@type' => 'BreadcrumbList',
    '@id' => $canonical . '#breadcrumb',
    'itemListElement' => $breadcrumbItems
  ]
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
    <title><?= htmlspecialchars($page['title'], ENT_QUOTES) ?></title>
    <meta name="description" content="<?= htmlspecialchars($page['description'], ENT_QUOTES) ?>" />
    <meta name="robots" content="<?= htmlspecialchars($robots, ENT_QUOTES) ?>" />
    <link rel="canonical" href="<?= htmlspecialchars($canonical, ENT_QUOTES) ?>" />
    <link rel="alternate" hreflang="sv" href="<?= htmlspecialchars(seo_canonical_url('gallery', 'sv'), ENT_QUOTES) ?>" />
    <link rel="alternate" hreflang="en" href="<?= htmlspecialchars(seo_canonical_url('gallery', 'en'), ENT_QUOTES) ?>" />
    <link rel="alternate" hreflang="x-default" href="<?= htmlspecialchars(seo_canonical_url('gallery', 'sv'), ENT_QUOTES) ?>" />

    <meta property="og:title" content="<?= htmlspecialchars($page['title'], ENT_QUOTES) ?>" />
    <meta property="og:description" content="<?= htmlspecialchars($page['description'], ENT_QUOTES) ?>" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="<?= htmlspecialchars($canonical, ENT_QUOTES) ?>" />
    <meta property="og:site_name" content="<?= htmlspecialchars($text['site_name'], ENT_QUOTES) ?>" />
    <meta property="og:locale" content="<?= htmlspecialchars($ogLocale, ENT_QUOTES) ?>" />
    <meta property="og:locale:alternate" content="<?= htmlspecialchars($ogLocaleAlt, ENT_QUOTES) ?>" />
    <meta property="og:image" content="<?= htmlspecialchars($ogImageTag, ENT_QUOTES) ?>" />
    <meta property="og:image:url" content="<?= htmlspecialchars($ogImageTag, ENT_QUOTES) ?>" />
    <meta property="og:image:secure_url" content="<?= htmlspecialchars($ogImageTag, ENT_QUOTES) ?>" />
    <meta property="og:image:alt" content="<?= htmlspecialchars($ogImageAlt, ENT_QUOTES) ?>" />
    <?php if (isset($ogImageMeta['width'], $ogImageMeta['height'])): ?>
      <meta property="og:image:width" content="<?= htmlspecialchars((string) $ogImageMeta['width'], ENT_QUOTES) ?>" />
      <meta property="og:image:height" content="<?= htmlspecialchars((string) $ogImageMeta['height'], ENT_QUOTES) ?>" />
      <?php if (isset($ogImageMeta['mime']) && is_string($ogImageMeta['mime']) && $ogImageMeta['mime'] !== ''): ?>
        <meta property="og:image:type" content="<?= htmlspecialchars($ogImageMeta['mime'], ENT_QUOTES) ?>" />
      <?php endif; ?>
    <?php endif; ?>

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="<?= htmlspecialchars($page['title'], ENT_QUOTES) ?>" />
    <meta name="twitter:description" content="<?= htmlspecialchars($page['description'], ENT_QUOTES) ?>" />
    <meta name="twitter:image" content="<?= htmlspecialchars($ogImageTag, ENT_QUOTES) ?>" />
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
    <link rel="stylesheet" href="styles.css?v=20260428-03" />
    <script src="overrides.js?v=<?= htmlspecialchars($overridesRevParam, ENT_QUOTES) ?>"></script>
    <script src="content.js?v=20260222-06" defer></script>
    <script src="script.js?v=20260428-03" defer></script>
  </head>
  <body id="page-top" data-page="gallery">
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
          <a href="#galleri" data-bind="ui.navGallery">Galleri</a>
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
      <section id="galleri" class="section reveal gallery-page">
        <div class="container">
          <div class="section-head">
            <div>
              <h1 data-bind="gallery.pageHeading"><?= htmlspecialchars($galleryPageHeading, ENT_QUOTES) ?></h1>
              <p id="gallery-page-subheading" class="section-lead gallery-page-lead" data-bind="gallery.subheading"><?= seo_render_multiline_html($gallerySubheading) ?></p>
            </div>
          </div>
          <div
            id="gallery-controls"
            class="gallery-controls"
            aria-label="Filtrera och sortera galleri"
            data-bind-aria="ui.galleryControlsAria"
          ></div>
          <div id="gallery-grid" class="gallery-grid">
            <?php if ($galleryItems === []): ?>
              <p class="gallery-empty"><?= htmlspecialchars($lang === 'en' ? 'No paintings are available right now.' : 'Inga målningar är tillgängliga just nu.', ENT_QUOTES) ?></p>
            <?php else: ?>
              <?php foreach ($galleryItems as $index => $item): ?>
                <?= seo_render_gallery_card_html($item, (int) $index, 'gallery') ?>
              <?php endforeach; ?>
            <?php endif; ?>
          </div>
          <div class="gallery-cta-row">
            <a class="btn btn-ghost" href="index.html#galleri" data-bind="ui.galleryBackHome" data-lang-link>Tillbaka till startsidan</a>
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

    <div
      id="lightbox"
      class="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Bildvisning"
      data-bind-aria="ui.lightboxAriaLabel"
      aria-hidden="true"
    >
      <button
        id="lightbox-close"
        class="lightbox-close"
        type="button"
        aria-label="Stäng bildvisning"
        data-bind="ui.lightboxClose"
        data-bind-aria="ui.lightboxCloseAria"
      >
        Stäng
      </button>
      <button
        id="lightbox-prev"
        class="lightbox-nav lightbox-prev"
        type="button"
        aria-label="Föregående bild"
        data-bind-aria="ui.lightboxPrevAria"
      >
        ◀
      </button>
	      <figure class="lightbox-figure">
	        <div class="lightbox-media">
	          <img id="lightbox-image" src="" alt="" />
	        </div>
	        <figcaption id="lightbox-caption">
	          <div id="lightbox-caption-text" class="lightbox-caption-text"></div>
	          <div class="lightbox-caption-actions">
	            <a
	              id="lightbox-open-artwork"
	              class="btn btn-ghost"
	              href="#"
	              target="_blank"
	              rel="noreferrer"
	              data-bind="ui.openArtworkPage"
	            >
	              Öppna verk-sida
	            </a>
	            <a
	              id="lightbox-artwork-inquiry"
	              class="btn btn-ghost"
	              href="#"
	              target="_blank"
	              rel="noreferrer"
	              data-bind="ui.inquiryArtworkLink"
	            >
	              Intresserad av verket
	            </a>
	            <button
	              id="lightbox-copy-artwork-link"
	              class="btn btn-primary"
	              type="button"
	              data-bind="ui.copyArtworkLink"
	              data-copy-link=""
	              data-copy-status-target="#lightbox-copy-status"
	            >
	              Kopiera länk
	            </button>
	          </div>
	          <div id="lightbox-copy-status" class="lightbox-copy-status" aria-live="polite"></div>
	        </figcaption>
	      </figure>
	      <button
	        id="lightbox-next"
	        class="lightbox-nav lightbox-next"
        type="button"
        aria-label="Nästa bild"
        data-bind-aria="ui.lightboxNextAria"
      >
        ▶
      </button>
    </div>
  </body>
</html>
