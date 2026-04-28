<?php
declare(strict_types=1);

require __DIR__ . '/seo.php';

$lang = seo_normalize_lang($_GET['lang'] ?? null);
$text = seo_text($lang);
$page = seo_page_meta('home', $lang);
$canonical = seo_canonical_url('home', $lang);
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

$heroImageValue = seo_localized_payload_string($payload, $lang, ['hero', 'image']);
$heroImageSrc = $heroImageValue !== '' ? seo_preferred_hero_image_src($heroImageValue) : seo_preferred_hero_image_src('images/ola-01.jpg');
$heroResponsiveSources = $heroImageValue !== '' ? seo_responsive_image_sources($heroImageValue) : seo_responsive_image_sources('images/ola-01.jpg');
$heroImageSrcSet = '';
if ($heroResponsiveSources !== []) {
  $srcsetParts = [];
  foreach ($heroResponsiveSources as $source) {
    $srcValue = isset($source['src']) ? trim((string) $source['src']) : '';
    $widthValue = isset($source['width']) ? (int) $source['width'] : 0;
    if ($srcValue === '' || $widthValue <= 0) {
      continue;
    }
    $srcsetParts[] = $srcValue . ' ' . $widthValue . 'w';
  }
  $heroImageSrcSet = implode(', ', $srcsetParts);
}
$heroImageDimensions = seo_image_dimensions($heroImageSrc);
$heroImageWidth = isset($heroImageDimensions['width']) ? (int) $heroImageDimensions['width'] : 0;
$heroImageHeight = isset($heroImageDimensions['height']) ? (int) $heroImageDimensions['height'] : 0;
$heroImageAlt = seo_localized_payload_string($payload, $lang, ['hero', 'imageAlt']);
if ($heroImageAlt === '') {
  $heroImageAlt = $lang === 'en' ? 'Watercolor hero image' : 'Akvarell i blå vintertoner';
}
$heroEyebrow = seo_localized_payload_string($payload, $lang, ['hero', 'eyebrow']);
if ($heroEyebrow === '') {
  $heroEyebrow = $lang === 'en' ? 'Watercolor painting' : 'Akvarellmåleri';
}
$heroTitle = seo_localized_payload_string($payload, $lang, ['hero', 'title']);
if ($heroTitle === '') {
  $heroTitle = $lang === 'en'
    ? 'Nordic landscapes in light, mood and movement.'
    : 'Nordiska landskap i ljus, stämning och rörelse.';
}
$heroIntro = seo_localized_payload_string($payload, $lang, ['hero', 'intro']);
$heroLine = seo_localized_payload_string($payload, $lang, ['hero', 'line']);
$galleryEyebrow = seo_localized_payload_string($payload, $lang, ['gallery', 'eyebrow']);
if ($galleryEyebrow === '') {
  $galleryEyebrow = $lang === 'en' ? 'Recent paintings' : 'Senaste målningar';
}
$galleryHeading = seo_localized_payload_string($payload, $lang, ['gallery', 'heading']);
if ($galleryHeading === '') {
  $galleryHeading = $lang === 'en' ? 'Gallery' : 'Galleri';
}
$homeGalleryItems = seo_home_gallery_items($payload, $lang);
$aboutEyebrow = seo_localized_payload_string($payload, $lang, ['about', 'eyebrow']);
if ($aboutEyebrow === '') {
  $aboutEyebrow = $lang === 'en' ? 'About the practice' : 'Om konstnärskapet';
}
$aboutHeading = seo_localized_payload_string($payload, $lang, ['about', 'heading']);
if ($aboutHeading === '') {
  $aboutHeading = $lang === 'en' ? 'Light, presence and the rhythm of nature' : 'Ljus, närvaro och naturens rytm';
}
$aboutParagraphs = seo_normalize_string_list(seo_localized_payload_array($payload, $lang, ['about', 'paragraphs']));
$aboutDayJobLine = seo_localized_payload_string($payload, $lang, ['about', 'dayJobLine']);
$materialsHeading = seo_localized_payload_string($payload, $lang, ['about', 'materialsHeading']);
$materialsBody = seo_localized_payload_string($payload, $lang, ['about', 'materialsBody']);
$inspirationHeading = seo_localized_payload_string($payload, $lang, ['about', 'inspirationHeading']);
$inspirationBody = seo_localized_payload_string($payload, $lang, ['about', 'inspirationBody']);
$ambitionsHeading = seo_localized_payload_string($payload, $lang, ['about', 'ambitionsHeading']);
$ambitions = seo_normalize_string_list(seo_localized_payload_array($payload, $lang, ['about', 'ambitions']));
$recognitionHeading = seo_localized_payload_string($payload, $lang, ['about', 'recognitionHeading']);
$recognitionItems = seo_normalize_string_list(seo_localized_payload_array($payload, $lang, ['about', 'recognitionItems']));
$aboutSideNote = seo_localized_payload_string($payload, $lang, ['about', 'sideNote']);
$portraitImageValue = seo_localized_payload_string($payload, 'sv', ['about', 'portraitImage']);
$portraitImageSrc = $portraitImageValue !== '' ? seo_image_variant_src($portraitImageValue, false) : 'images/web/ola-portrait.jpg';
$portraitAlt = seo_localized_payload_string($payload, $lang, ['about', 'portraitAlt']);
if ($portraitAlt === '') {
  $portraitAlt = $lang === 'en' ? 'Portrait of Ola Gustafsson' : 'Porträtt av Ola Gustafsson';
}
$materialImageValue = seo_localized_payload_string($payload, 'sv', ['about', 'materialImage']);
$materialImageSrc = $materialImageValue !== '' ? seo_image_variant_src($materialImageValue, false) : 'images/web/ola-22.jpg';
$materialImageAlt = seo_localized_payload_string($payload, $lang, ['about', 'materialImageAlt']);
if ($materialImageAlt === '') {
  $materialImageAlt = $lang === 'en' ? 'Studio materials' : 'Material i ateljén';
}
$featureImageValue = seo_localized_payload_string($payload, 'sv', ['about', 'featureImage']);
$featureImageSrc = $featureImageValue !== '' ? seo_image_variant_src($featureImageValue, false) : 'images/web/ola-plein-air-sandemar.jpg';
$featureImageAlt = seo_localized_payload_string($payload, $lang, ['about', 'featureImageAlt']);
if ($featureImageAlt === '') {
  $featureImageAlt = $lang === 'en' ? 'Ola Gustafsson painting outdoors in Sandemar' : 'Ola Gustafsson målar i Sandemar';
}
$projectEyebrow = seo_localized_payload_string($payload, $lang, ['project', 'eyebrow']);
if ($projectEyebrow === '') {
  $projectEyebrow = $lang === 'en' ? 'Project' : 'Projekt';
}
$projectHeading = seo_localized_payload_string($payload, $lang, ['project', 'heading']);
$projectDescription = seo_localized_payload_string($payload, $lang, ['project', 'description']);
$projectCollageImageValue = seo_localized_payload_string($payload, 'sv', ['project', 'collageImage']);
$projectCollageImageSrc = $projectCollageImageValue !== '' ? seo_image_variant_src($projectCollageImageValue, false) : 'images/web/monterade-solar.jpg';
$projectCollageAlt = seo_localized_payload_string($payload, $lang, ['project', 'collageAlt']);
$projectSampleHeading = seo_localized_payload_string($payload, $lang, ['project', 'sampleHeading']);
$projectSamples = seo_localized_image_entries($payload, $lang, ['project', 'samples']);
$hasProjectContent = trim($projectHeading) !== '' || trim($projectDescription) !== '' || trim($projectCollageImageValue) !== '' || $projectSamples !== [];
$contactEyebrow = seo_localized_payload_string($payload, $lang, ['contact', 'eyebrow']);
if ($contactEyebrow === '') {
  $contactEyebrow = $lang === 'en' ? 'Contact' : 'Kontakt';
}
$contactHeading = seo_localized_payload_string($payload, $lang, ['contact', 'heading']);
if ($contactHeading === '') {
  $contactHeading = $lang === 'en' ? 'Originals, commissions and collaborations' : 'Original, uppdrag och samarbeten';
}
$contactBody = seo_localized_payload_string($payload, $lang, ['contact', 'body']);
$publicContact = portfolio_public_contact_config($payload);
$contactEmail = isset($publicContact['email']) && is_string($publicContact['email']) ? trim($publicContact['email']) : '';
$contactEmailLabel = isset($publicContact['emailLabel']) && is_string($publicContact['emailLabel']) && trim($publicContact['emailLabel']) !== ''
  ? trim($publicContact['emailLabel'])
  : ($lang === 'en' ? 'Send email' : 'Skicka e-post');
$contactSocialLinks = [];
$contactBlock = isset($payload['contact']) && is_array($payload['contact']) ? $payload['contact'] : [];
$localizedContactBlock = $lang !== 'sv'
  ? seo_localized_payload_array($payload, $lang, ['contact'])
  : $contactBlock;
$socialLinksSource = isset($localizedContactBlock['socialLinks']) && is_array($localizedContactBlock['socialLinks'])
  ? $localizedContactBlock['socialLinks']
  : (isset($contactBlock['socialLinks']) && is_array($contactBlock['socialLinks']) ? $contactBlock['socialLinks'] : []);
foreach ($socialLinksSource as $entry) {
  if (!is_array($entry)) {
    continue;
  }
  $label = isset($entry['label']) && is_string($entry['label']) ? trim($entry['label']) : '';
  $url = isset($entry['url']) && is_string($entry['url']) ? trim($entry['url']) : '';
  if ($label === '' || $url === '' || filter_var($url, FILTER_VALIDATE_URL) === false) {
    continue;
  }
  $contactSocialLinks[] = ['label' => $label, 'url' => $url];
}
if ($contactSocialLinks === []) {
  foreach (['instagramUrl' => 'Instagram', 'facebookUrl' => 'Facebook'] as $field => $label) {
    $url = isset($contactBlock[$field]) && is_string($contactBlock[$field]) ? trim($contactBlock[$field]) : '';
    if ($url !== '' && filter_var($url, FILTER_VALIDATE_URL) !== false) {
      $contactSocialLinks[] = ['label' => $label, 'url' => $url];
    }
  }
}

$personId = $baseUrl . '/#ola-gustafsson';
$websiteId = $baseUrl . '/#website';
$breadcrumbItems = [
  [
    '@type' => 'ListItem',
    'position' => 1,
    'name' => $lang === 'en' ? 'Home' : 'Hem',
    'item' => $baseUrl . '/'
  ],
  [
    '@type' => 'ListItem',
    'position' => 2,
    'name' => $lang === 'en' ? 'Start' : 'Startsida',
    'item' => $canonical
  ]
];
$structuredData = [
  [
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
  ],
  [
    '@context' => 'https://schema.org',
    '@type' => 'WebSite',
    '@id' => $websiteId,
    'name' => $text['site_name'],
    'url' => $baseUrl . '/',
    'inLanguage' => ['sv-SE', 'en-US'],
    'publisher' => ['@id' => $personId]
  ],
  [
    '@context' => 'https://schema.org',
    '@type' => 'WebPage',
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
    <link rel="alternate" hreflang="sv" href="<?= htmlspecialchars(seo_canonical_url('home', 'sv'), ENT_QUOTES) ?>" />
    <link rel="alternate" hreflang="en" href="<?= htmlspecialchars(seo_canonical_url('home', 'en'), ENT_QUOTES) ?>" />
    <link rel="alternate" hreflang="x-default" href="<?= htmlspecialchars(seo_canonical_url('home', 'sv'), ENT_QUOTES) ?>" />

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
    <link
      rel="preload"
      as="image"
      href="<?= seo_escape_html($heroImageSrc) ?>"
      <?php if ($heroImageSrcSet !== ''): ?>imagesrcset="<?= seo_escape_html($heroImageSrcSet) ?>" imagesizes="100vw"<?php endif; ?>
      fetchpriority="high"
    />
    	    <script src="overrides.js?v=<?= htmlspecialchars($overridesRevParam, ENT_QUOTES) ?>" defer></script>
	    <link rel="stylesheet" href="styles.css?v=20260428-02" />
	    <script src="content.js?v=20260222-06" defer></script>
		    <script src="script.js?v=20260428-02" defer></script>
	  </head>
  <body id="page-top" data-page="home">
    <header class="site-header" id="top">
      <div class="container header-inner">
        <a class="brand" href="#top">
          <span class="brand-logo" aria-hidden="true"></span>
          <span class="brand-text">
            <span data-bind="site.brandName">Ola Gustafsson</span>
            <span data-bind="site.brandTag">Akvarell</span>
          </span>
        </a>
        <nav id="main-nav" class="main-nav" aria-label="Huvudmeny" data-bind-aria="ui.navAriaLabel">
          <a href="#hem" data-bind="ui.navHome">Hem</a>
          <a href="#galleri" data-bind="ui.navGallery">Galleri</a>
          <a href="#om" data-bind="ui.navAbout">Om</a>
          <a href="#kontakt" data-bind="ui.navContact">Kontakt</a>
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
      <section id="hem" class="hero reveal">
        <figure class="hero-media" data-fallback="Lägg in hero-bilden i images/ och uppdatera content.js">
          <img
            id="hero-image"
            class="artwork-photo hero-background"
            src="<?= seo_escape_html($heroImageSrc) ?>"
            <?php if ($heroImageSrcSet !== ''): ?>srcset="<?= seo_escape_html($heroImageSrcSet) ?>" sizes="100vw"<?php endif; ?>
            alt="<?= seo_escape_html($heroImageAlt) ?>"
            loading="eager"
            fetchpriority="high"
            decoding="async"
            <?php if ($heroImageWidth > 0): ?>width="<?= $heroImageWidth ?>"<?php endif; ?>
            <?php if ($heroImageHeight > 0): ?>height="<?= $heroImageHeight ?>"<?php endif; ?>
          />
          <div class="hero-overlay" aria-hidden="true"></div>
        </figure>

        <div class="container hero-content">
          <div id="hero-copy-panel" class="hero-copy surface-glass">
            <p class="eyebrow" data-bind="hero.eyebrow"><?= seo_escape_html($heroEyebrow) ?></p>
            <h1 data-bind="hero.title"><?= seo_escape_html($heroTitle) ?></h1>
            <p data-bind="hero.intro"><?= seo_render_multiline_html($heroIntro) ?></p>
            <p class="hero-line" data-bind="hero.line"><?= seo_escape_html($heroLine) ?></p>
            <div class="hero-actions">
              <a class="btn btn-ghost" href="#galleri" data-bind="hero.ctaPrimaryLabel">Se målningarna</a>
              <a class="btn btn-ghost" href="#om" data-bind="hero.ctaSecondaryLabel">Läs artist statement</a>
            </div>
          </div>
        </div>
      </section>

      <section id="galleri" class="section reveal">
        <div class="container">
          <div class="section-head">
            <div>
              <p class="eyebrow" data-bind="gallery.eyebrow"><?= seo_escape_html($galleryEyebrow) ?></p>
              <h2 data-bind="gallery.heading"><?= seo_escape_html($galleryHeading) ?></h2>
            </div>
          </div>

          <div
            id="gallery-controls"
            class="gallery-controls"
            aria-label="Filtrera och sortera galleri"
            data-bind-aria="ui.galleryControlsAria"
          ></div>
          <div id="gallery-grid" class="gallery-grid">
            <?php if ($homeGalleryItems === []): ?>
              <p class="gallery-empty"><?= seo_escape_html($lang === 'en' ? 'No artworks available right now.' : 'Inga verk tillgängliga just nu.') ?></p>
            <?php else: ?>
              <?php foreach ($homeGalleryItems as $index => $galleryItem): ?>
                <?= seo_render_gallery_card_html($galleryItem, $index, 'home') ?>
              <?php endforeach; ?>
            <?php endif; ?>
          </div>

          <div class="gallery-cta-row">
            <a class="btn btn-primary" href="gallery.html" data-bind="ui.homeToGallery" data-lang-link>Till galleriet</a>
          </div>
        </div>
      </section>

	      <section id="om" class="section reveal">
	        <div class="container about-grid">
	          <article class="about-text">
	            <p class="eyebrow" data-bind="about.eyebrow"><?= seo_escape_html($aboutEyebrow) ?></p>
	            <h2 data-bind="about.heading"><?= seo_escape_html($aboutHeading) ?></h2>
	            <div id="about-main-paragraphs" class="about-main-paragraphs">
                <?php foreach ($aboutParagraphs as $aboutParagraph): ?>
                  <p><?= seo_render_multiline_html($aboutParagraph) ?></p>
                <?php endforeach; ?>
              </div>
	            <p class="about-dayjob" data-bind="about.dayJobLine"><?= seo_escape_html($aboutDayJobLine) ?></p>
	          </article>

	          <div class="about-side">
	            <figure id="about-portrait" class="artist-portrait surface-soft" data-fallback="Kunde inte ladda porträttbilden.">
	              <img
	                id="about-portrait-image"
                class="artwork-photo"
                src="<?= seo_escape_html($portraitImageSrc) ?>"
                alt="<?= seo_escape_html($portraitAlt) ?>"
                loading="lazy"
                decoding="async"
	              />
	            </figure>
	          </div>
	        </div>
	      </section>

	      <section id="projekt" class="section reveal"<?= $hasProjectContent ? '' : ' hidden' ?>>
	        <div class="container">
	          <div class="project-flow">
	            <figure
	              id="about-feature-image-wrap"
	              class="project-process-figure"
	              data-fallback="Kunde inte ladda sektionsbilden."
	            >
	              <img
	                id="about-feature-image"
	                src="<?= seo_escape_html($featureImageSrc) ?>"
	                alt="<?= seo_escape_html($featureImageAlt) ?>"
	                loading="lazy"
	                decoding="async"
	              />
	            </figure>

	            <article class="sun-project surface-soft">
	              <p class="eyebrow" data-bind="project.eyebrow"><?= seo_escape_html($projectEyebrow) ?></p>
	              <div class="sun-project-layout">
	                <div class="sun-project-copy">
	                  <h2 data-bind="project.heading"><?= seo_escape_html($projectHeading) ?></h2>
	                  <p data-bind="project.description"><?= seo_render_multiline_html($projectDescription) ?></p>
	                </div>
	                <figure
	                  id="sun-project-collage-wrap"
	                  class="sun-project-collage"
	                  data-fallback="Kunde inte ladda projektbilden."
	                >
	                  <img
	                    id="sun-project-collage"
	                    class="artwork-photo"
	                    src="<?= seo_escape_html($projectCollageImageSrc) ?>"
	                    alt="<?= seo_escape_html($projectCollageAlt) ?>"
	                    loading="lazy"
	                    decoding="async"
	                  />
	                </figure>
	              </div>
	              <h3 class="sun-project-subheading" data-bind="project.sampleHeading"><?= seo_escape_html($projectSampleHeading) ?></h3>
	              <div id="sun-project-samples" class="sun-project-samples">
                  <?php foreach ($projectSamples as $sample): ?>
                    <figure class="sun-project-sample surface-soft">
                      <img
                        class="artwork-photo"
                        src="<?= seo_escape_html(seo_image_variant_src((string) $sample['src'], false)) ?>"
                        alt="<?= seo_escape_html((string) ($sample['alt'] ?? '')) ?>"
                        loading="lazy"
                        decoding="async"
                      />
                    </figure>
                  <?php endforeach; ?>
                </div>
	            </article>
	          </div>
	        </div>
	      </section>

	      <section class="section reveal about-support-section">
	        <div class="container about-support-grid">
	          <article class="about-material-layout surface-soft about-support-primary">
	            <figure
	              id="about-material-image-wrap"
	              class="about-material-media"
	              data-fallback="Kunde inte ladda materialbilden."
	            >
	              <img
	                id="about-material-image"
	                class="artwork-photo"
	                src="<?= seo_escape_html($materialImageSrc) ?>"
	                alt="<?= seo_escape_html($materialImageAlt) ?>"
	                loading="lazy"
	                decoding="async"
	              />
	            </figure>
	            <div class="about-material-copy">
	              <h3 data-bind="about.materialsHeading"><?= seo_escape_html($materialsHeading) ?></h3>
	              <p data-bind="about.materialsBody"><?= seo_render_multiline_html($materialsBody) ?></p>
	            </div>
	          </article>

	          <article class="about-inspiration-card surface-soft">
	            <h3 data-bind="about.inspirationHeading"><?= seo_escape_html($inspirationHeading) ?></h3>
	            <p id="about-inspiration-body" data-bind="about.inspirationBody"><?= seo_render_linkified_html($inspirationBody) ?></p>
	          </article>

	          <aside class="ambition-card surface-soft">
	            <h3 data-bind="about.ambitionsHeading"><?= seo_escape_html($ambitionsHeading) ?></h3>
	            <ul id="about-ambitions" class="ambitions-list">
                <?php foreach ($ambitions as $ambition): ?>
                  <li><?= seo_escape_html($ambition) ?></li>
                <?php endforeach; ?>
              </ul>
	            <p class="about-side-note" data-bind="about.sideNote"><?= seo_escape_html($aboutSideNote) ?></p>
	          </aside>
	        </div>
	      </section>

	      <section class="section reveal about-recognition-section">
	        <div class="container about-recognition-row">
	          <aside class="recognition-card surface-soft">
	            <h3 data-bind="about.recognitionHeading"><?= seo_escape_html($recognitionHeading) ?></h3>
	            <ul id="about-recognition" class="recognition-list">
                <?php foreach ($recognitionItems as $recognitionItem): ?>
                  <li><?= seo_render_linkified_html($recognitionItem) ?></li>
                <?php endforeach; ?>
              </ul>
	          </aside>
	        </div>
	      </section>

	      <section id="kontakt" class="section reveal">
	        <div class="container contact surface-soft">
	          <div class="contact-copy">
	            <p class="eyebrow" data-bind="contact.eyebrow"><?= seo_escape_html($contactEyebrow) ?></p>
	            <h2 data-bind="contact.heading"><?= seo_escape_html($contactHeading) ?></h2>
	            <p data-bind="contact.body"><?= seo_render_multiline_html($contactBody) ?></p>
	          </div>
	          <div class="contact-links-panel">
	            <div class="contact-links">
	              <a id="contact-email-link" class="btn btn-primary" href="<?= $contactEmail !== '' ? 'mailto:' . seo_escape_html($contactEmail) : '#' ?>"<?= $contactEmail === '' ? ' hidden' : '' ?>><?= seo_escape_html($contactEmailLabel) ?></a>
	              <div id="contact-social-links" class="contact-social-links"<?= $contactSocialLinks === [] ? ' hidden' : '' ?>>
                  <?php foreach ($contactSocialLinks as $socialLink): ?>
                    <a class="btn btn-ghost" href="<?= seo_escape_html((string) $socialLink['url']) ?>" target="_blank" rel="noreferrer"><?= seo_escape_html((string) $socialLink['label']) ?></a>
                  <?php endforeach; ?>
                </div>
	            </div>
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
