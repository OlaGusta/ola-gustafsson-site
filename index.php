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
	    <script src="overrides.js?v=<?= htmlspecialchars($overridesRevParam, ENT_QUOTES) ?>"></script>
	    <script src="hero-preload.js?v=20260212-03"></script>
	    <link rel="stylesheet" href="styles.css?v=20260222-12" />
	    <script src="content.js?v=20260222-06" defer></script>
		    <script src="script.js?v=20260222-09" defer></script>
	  </head>
  <body id="page-top" data-page="home">
    <header class="site-header" id="top">
      <div class="container header-inner">
        <a class="brand" href="#top">
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
            src="images/ola-01.jpg"
            alt="Akvarell i blå vintertoner"
            loading="eager"
          />
          <div class="hero-overlay" aria-hidden="true"></div>
        </figure>

        <div class="container hero-content">
          <div id="hero-copy-panel" class="hero-copy surface-glass">
            <p class="eyebrow" data-bind="hero.eyebrow">Akvarellmåleri</p>
            <h1 data-bind="hero.title">Nordiska landskap i ljus, stämning och rörelse.</h1>
            <p data-bind="hero.intro"></p>
            <p class="hero-line" data-bind="hero.line"></p>
            <div class="hero-actions">
              <a class="btn btn-primary" href="#galleri" data-bind="hero.ctaPrimaryLabel">Se målningarna</a>
              <a class="btn btn-ghost" href="#om" data-bind="hero.ctaSecondaryLabel">Läs artist statement</a>
            </div>
          </div>
        </div>
      </section>

      <section id="galleri" class="section reveal">
        <div class="container">
          <div class="section-head">
            <div>
              <p class="eyebrow" data-bind="gallery.eyebrow">Senaste målningar</p>
              <h2 data-bind="gallery.heading">Galleri</h2>
            </div>
          </div>

          <div
            id="gallery-controls"
            class="gallery-controls"
            aria-label="Filtrera och sortera galleri"
            data-bind-aria="ui.galleryControlsAria"
          ></div>
          <div id="gallery-grid" class="gallery-grid"></div>

          <div class="gallery-cta-row">
            <a class="btn btn-primary" href="gallery.html" data-bind="ui.homeToGallery" data-lang-link>Till galleriet</a>
          </div>
        </div>
      </section>

	      <section id="om" class="section reveal">
	        <div class="container about-grid">
	          <article class="about-text">
	            <p class="eyebrow" data-bind="about.eyebrow">Om konstnärskapet</p>
	            <h2 data-bind="about.heading">Ljus, närvaro och naturens rytm</h2>
	            <div id="about-main-paragraphs" class="about-main-paragraphs"></div>
	            <p class="about-dayjob" data-bind="about.dayJobLine"></p>
	          </article>

          <div class="about-side">
            <figure id="about-portrait" class="artist-portrait surface-soft" data-fallback="Kunde inte ladda porträttbilden.">
              <img
                id="about-portrait-image"
                class="artwork-photo"
                src="images/ola-portrait.jpg"
                alt="Porträtt av Ola Gustafsson"
                loading="lazy"
                decoding="async"
              />
            </figure>
	          </div>
	        </div>

	        <div class="container about-material-row">
	          <article class="about-material-layout surface-soft">
	            <figure
	              id="about-material-image-wrap"
	              class="about-material-media"
	              data-fallback="Kunde inte ladda materialbilden."
	            >
	              <img
	                id="about-material-image"
	                class="artwork-photo"
	                src="images/ola-22.jpg"
	                alt="Material i ateljén"
	                loading="lazy"
	                decoding="async"
	              />
	            </figure>
	            <div class="about-material-copy">
	              <h3 data-bind="about.materialsHeading">Material</h3>
	              <p data-bind="about.materialsBody"></p>
	            </div>
	          </article>
	        </div>

	        <div class="container about-ambition-row">
	          <aside class="ambition-card surface-soft">
	            <h3 data-bind="about.ambitionsHeading">Ambitioner framåt</h3>
	            <ul id="about-ambitions" class="ambitions-list"></ul>
	          </aside>
	        </div>

	        <div class="container about-recognition-row">
	          <aside class="recognition-card surface-soft">
	            <h3 data-bind="about.recognitionHeading">Utmärkelser &amp; utställningar</h3>
	            <ul id="about-recognition" class="recognition-list"></ul>
	          </aside>
	        </div>
	      </section>

	      <section id="atelje-bild" class="section atelier-feature reveal">
	        <figure
	          id="about-feature-image-wrap"
	          class="atelier-feature-image"
	          data-fallback="Kunde inte ladda sektionsbilden."
	        >
	          <img
	            id="about-feature-image"
	            src="images/ola-plein-air-sandemar.jpg"
	            alt="Ola Gustafsson målar i Sandemar"
	            loading="lazy"
	            decoding="async"
	          />
	        </figure>
	      </section>

	      <section id="projekt" class="section reveal" hidden>
	        <div class="container">
	          <article class="sun-project surface-soft">
	            <p class="eyebrow" data-bind="project.eyebrow">Projekt</p>
	            <div class="sun-project-layout">
	              <div class="sun-project-copy">
	                <h2 data-bind="project.heading">100 dagar av sol</h2>
	                <p data-bind="project.description"></p>
	              </div>
	              <figure
	                id="sun-project-collage-wrap"
	                class="sun-project-collage"
	                data-fallback="Kunde inte ladda projektbilden."
	              >
	                <img
	                  id="sun-project-collage"
	                  class="artwork-photo"
	                  src="images/monterade-solar.jpg"
	                  alt="Projektbild"
	                  loading="lazy"
	                  decoding="async"
	                />
	              </figure>
	            </div>
	            <h3 class="sun-project-subheading" data-bind="project.sampleHeading">Exempel från serien</h3>
	            <div id="sun-project-samples" class="sun-project-samples"></div>
	          </article>
	        </div>
	      </section>

	      <section id="kontakt" class="section reveal">
	        <div class="container contact surface-soft">
	          <div>
	            <p class="eyebrow" data-bind="contact.eyebrow">Kontakt</p>
	            <h2 data-bind="contact.heading">Original, uppdrag och samarbeten</h2>
	            <p data-bind="contact.body"></p>
	          </div>
	          <div class="contact-links">
	            <a id="contact-email-link" class="btn btn-primary" href="#">Skicka e-post</a>
	            <div id="contact-social-links" class="contact-social-links"></div>
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
	        <img id="lightbox-image" src="" alt="" />
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
