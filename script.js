document.documentElement.classList.add('js-enabled');

const DEFAULT_CONTENT = {
  site: {
    title: 'Ola Gustafsson | Akvarellkonstnär',
    metaDescription: 'Ola Gustafsson är akvarellkonstnär. Online-galleri med akvarellmålningar i nordiskt ljus.',
    brandName: 'Ola Gustafsson',
    brandTag: 'Akvarell',
    footerText: '© 2026 Ola Gustafsson'
  },
  theme: {
    background: '#f3efe6',
    surface: '#fcf8f1',
    ink: '#10131b',
    softInk: '#4f5766',
    primary: '#123a62',
    accent: '#b98c56',
    border: 'rgba(16, 19, 27, 0.12)',
    fontDisplay: 'fraunces',
    fontBody: 'jakarta',
    fontDisplayWeight: 700,
    fontBodyWeight: 400
  },
  hero: {
    eyebrow: 'Akvarellmåleri',
    title: 'Nordiska landskap i ljus, stämning och rörelse.',
    intro: 'Jag är Ola Gustafsson, akvarellmålare och visuell kommunikatör.',
    line: 'Landskap, natur och min plats i dem.',
    ctaPrimaryLabel: 'Se målningar',
    ctaSecondaryLabel: 'Läs om processen',
    mode: 'still',
    slideDurationMs: 8000,
    slides: [],
    overlayEnabled: true,
    overlayOpacity: 55,
    copyPanelOpacity: 40,
    image: 'images/ola-01.jpg',
    imageAlt: 'Akvarellmålning med nordiskt ljus.'
  },
  studioAccess: {
    mode: 'secure-auth',
    password: ''
  },
  analytics: {
    gaMeasurementId: '',
    anonymizeIp: true,
    trackStudio: false
  },
  gallery: {
    heading: 'Galleri',
    pageHeading: 'Hela galleriet',
    categoryLabels: {
      all: 'Alla',
      sea: 'Hav',
      portrait: 'Porträtt',
      city: 'Stad',
      nature: 'Natur'
    },
    sortOptions: [
      { value: 'manual', label: 'Standard' },
      { value: 'title-asc', label: 'Titel A-Ö' },
      { value: 'title-desc', label: 'Titel Ö-A' },
      { value: 'newest', label: 'Nyast först' },
      { value: 'oldest', label: 'Äldst först' }
    ],
    autoDiscover: {
      enabled: false,
      path: 'images',
      prefix: 'ola-',
      extension: 'jpg',
      start: 1,
      pad: 2,
      max: 120,
      stopAfterMisses: 20,
      defaultFormat: '',
      defaultMedium: 'Akvarell på papper',
      defaultCategory: 'nature',
      titlePrefix: 'Verk'
    },
    removedSrcs: [],
    artworks: []
  },
  about: {
    portraitImage: '',
    portraitAlt: '',
    materialImage: '',
    materialImageAlt: '',
    featureImage: '',
    featureImageAlt: '',
    paragraphs: [],
    dayJobLine: '',
    materialsHeading: '',
    materialsBody: '',
    inspirationHeading: '',
    inspirationBody: '',
    ambitionsHeading: '',
    ambitions: [],
    recognitionHeading: 'Utmärkelser & utställningar',
    recognitionItems: [],
    sideNote: ''
  },
  project: {
    eyebrow: 'Projekt',
    heading: '',
    description: '',
    collageImage: 'images/monterade-solar.jpg',
    collageAlt: '',
    sampleHeading: '',
    samples: [
      { src: 'images/sol1.jpg', alt: '' },
      { src: 'images/sol2.jpg', alt: '' },
      { src: 'images/sol3.jpg', alt: '' },
      { src: 'images/sol4.jpg', alt: '' }
    ]
  },
  contact: {
    eyebrow: 'Kontakt',
    heading: 'Original, uppdrag och samarbeten',
    body: 'För tillgängliga verk, prislista och uppdrag: kontakta mig via e-post eller sociala kanaler.',
    email: 'ola@example.com',
    emailPublic: true,
    emailLabel: 'Skicka e-post',
    form: {
      enabled: true,
      turnstileSiteKey: ''
    },
    socialLinks: []
  },
  ui: {
    menuButton: 'Meny',
    menuAriaLabel: 'Öppna meny',
    navAriaLabel: 'Huvudmeny',
    navHome: 'Hem',
    navGallery: 'Galleri',
    navAbout: 'Om',
    navContact: 'Kontakt',
    homeToGallery: 'Till galleriet',
    galleryBackHome: 'Tillbaka till startsidan',
    scrollTop: 'Till toppen',
    languageSwitcherAria: 'Välj språk',
    languageOptionSv: 'Svenska',
    languageOptionEn: 'English',
    themeSwitcherAria: 'Välj färgläge',
    themeOptionLight: 'Ljus',
    themeOptionDark: 'Mörk',
    lightboxAriaLabel: 'Bildvisning',
    lightboxClose: 'Stäng',
    lightboxCloseAria: 'Stäng bildvisning',
    lightboxPrevAria: 'Föregående bild',
    lightboxNextAria: 'Nästa bild',
    galleryControlsAria: 'Filtrera och sortera galleri',
    categoryFilterAria: 'Kategorifilter',
    sortLabel: 'Sortera',
    galleryEmpty: 'Inga verk matchar filtret.',
    galleryLoadError: 'Något gick fel vid inläsning av galleriet.',
    openInLightbox: 'Öppna i stor bild.',
    openArtworkPage: 'Öppna verk-sida',
    copyArtworkLink: 'Kopiera länk',
    linkCopied: 'Länk kopierad.',
    missingImage: 'Kunde inte ladda',
    heroImageFallbackAlt: 'Hero-bild',
    portraitFallbackAlt: 'Porträtt av Ola Gustafsson',
    emailButtonFallback: 'Skicka e-post',
    studioLogin: 'Studio-login',
    studioLogout: 'Logga ut Studio',
    studioPasswordMissing: 'Studio-lösenord saknas i content.js',
    studioPasswordPrompt: 'Ange Studio-lösenord:',
    studioPasswordWrong: 'Fel lösenord.',
    mediumDefault: 'Akvarell på papper',
    artworkDefaultPrefix: 'Verk',
    watercolorDefaultAltPrefix: 'Akvarellverk',
    slideLabel: 'Bild',
    captchaVerifyError: 'Captcha kunde inte verifieras. Försök igen.',
    captchaLoadError: 'Captcha kunde inte laddas. Ladda om sidan och försök igen.',
    formSlowDown: 'Vänta en kort stund innan du skickar formuläret.',
    formCaptchaRequired: 'Verifiera captcha innan du skickar formuläret.',
    formSending: 'Skickar meddelande...',
    formSendFailed: 'Kunde inte skicka meddelandet. Försök igen.',
    formSendSuccess: 'Tack, ditt meddelande är skickat.',
    formNetworkError: 'Nätverksfel. Försök igen om en stund.'
  }
};

const deepMerge = (base, override) => {
  const output = Array.isArray(base) ? base.slice() : Object.assign({}, base);

  if (!override || typeof override !== 'object') {
    return output;
  }

  Object.keys(override).forEach((key) => {
    const value = override[key];
    const baseValue = output[key];

    if (Array.isArray(value)) {
      output[key] = value.slice();
      return;
    }

    if (value && typeof value === 'object' && baseValue && typeof baseValue === 'object' && !Array.isArray(baseValue)) {
      output[key] = deepMerge(baseValue, value);
      return;
    }

    output[key] = value;
  });

  return output;
};

const DISPLAY_FONT_STACKS = {
  fraunces: '"Fraunces", "Iowan Old Style", "Times New Roman", serif',
  playfair: '"Playfair Display", "Times New Roman", serif',
  cormorant: '"Cormorant Garamond", "Times New Roman", serif',
  georgia: 'Georgia, "Times New Roman", serif',
  baskerville: '"Baskerville", "Palatino Linotype", Palatino, serif',
  times: '"Times New Roman", Times, serif'
};

const BODY_FONT_STACKS = {
  jakarta: '"Plus Jakarta Sans", "Avenir Next", "Segoe UI", sans-serif',
  sourcesans: '"Source Sans 3", "Segoe UI", sans-serif',
  lora: '"Lora", "Avenir Next", serif',
  avenir: '"Avenir Next", "Segoe UI", sans-serif',
  system: 'system-ui, -apple-system, "Segoe UI", sans-serif',
  helvetica: '"Helvetica Neue", Helvetica, Arial, sans-serif'
};

const FONT_WEIGHT_VALUES = [300, 400, 500, 600, 700, 800];

const STORAGE_KEY = 'olaPortfolioOverridesV1';
const LANGUAGE_STORAGE_KEY = 'olaSiteLanguageV1';
const SUPPORTED_LANGUAGES = ['sv', 'en'];
const COLOR_MODE_STORAGE_KEY = 'olaSiteColorModeV1';
const SUPPORTED_COLOR_MODES = ['light', 'dark'];
const STUDIO_AUTH_KEY = 'olaStudioUnlockedV1';
const ASSET_REV = '20260219-04';
const LEGACY_CACHE_CLEANUP_KEY = 'olaLegacyCleanupDoneV1';
const CONTACT_FORM_MIN_DELAY_MS = 3000;
const TURNSTILE_SCRIPT_ID = 'cf-turnstile-script';

let contactTurnstileReadyPromise = null;
let contactTurnstileWidgetId = null;

const normalizeLanguageCode = (value) => {
  if (typeof value !== 'string') {
    return null;
  }
  const normalized = value.trim().toLowerCase();
  return SUPPORTED_LANGUAGES.includes(normalized) ? normalized : null;
};

const readStoredLanguage = () => {
  try {
    return normalizeLanguageCode(window.localStorage.getItem(LANGUAGE_STORAGE_KEY));
  } catch (error) {
    return null;
  }
};

const storeLanguage = (language) => {
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch (error) {
    // ignore storage errors
  }
};

const readLanguageFromQuery = () => {
  try {
    const params = new URLSearchParams(window.location.search);
    return normalizeLanguageCode(params.get('lang'));
  } catch (error) {
    return null;
  }
};

const normalizeColorMode = (value) => {
  if (typeof value !== 'string') {
    return null;
  }
  const normalized = value.trim().toLowerCase();
  return SUPPORTED_COLOR_MODES.includes(normalized) ? normalized : null;
};

const readStoredColorMode = () => {
  try {
    return normalizeColorMode(window.localStorage.getItem(COLOR_MODE_STORAGE_KEY));
  } catch (error) {
    return null;
  }
};

const storeColorMode = (mode) => {
  try {
    window.localStorage.setItem(COLOR_MODE_STORAGE_KEY, mode);
  } catch (error) {
    // ignore storage errors
  }
};

const resolveActiveColorMode = () => {
  const storedMode = readStoredColorMode();
  if (storedMode) {
    return storedMode;
  }
  try {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  } catch (error) {
    // ignore media query errors
  }
  return 'light';
};

const loadTurnstileScript = () => {
  if (window.turnstile && typeof window.turnstile.render === 'function') {
    return Promise.resolve(window.turnstile);
  }

  if (contactTurnstileReadyPromise) {
    return contactTurnstileReadyPromise;
  }

  contactTurnstileReadyPromise = new Promise((resolve, reject) => {
    const resolveIfReady = () => {
      if (window.turnstile && typeof window.turnstile.render === 'function') {
        resolve(window.turnstile);
        return true;
      }
      return false;
    };

    if (resolveIfReady()) {
      return;
    }

    let script = document.getElementById(TURNSTILE_SCRIPT_ID);
    if (!script) {
      script = document.createElement('script');
      script.id = TURNSTILE_SCRIPT_ID;
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    const onLoad = () => {
      cleanup();
      if (!resolveIfReady()) {
        reject(new Error('Turnstile API saknas efter inläsning.'));
      }
    };
    const onError = () => {
      cleanup();
      reject(new Error('Kunde inte ladda Turnstile.'));
    };
    const cleanup = () => {
      script.removeEventListener('load', onLoad);
      script.removeEventListener('error', onError);
      window.clearInterval(readyPoll);
      window.clearTimeout(readyTimeout);
    };

    script.addEventListener('load', onLoad);
    script.addEventListener('error', onError);

    const readyPoll = window.setInterval(() => {
      if (resolveIfReady()) {
        cleanup();
      }
    }, 120);
    const readyTimeout = window.setTimeout(() => {
      cleanup();
      reject(new Error('Timeout vid inläsning av Turnstile.'));
    }, 8000);
  });

  return contactTurnstileReadyPromise;
};

const loadStoredContent = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch (error) {
    return null;
  }
};

const mergeMissingGalleryItems = (storedGallery, fileGallery) => {
  if (!storedGallery || !fileGallery) {
    return;
  }

  const storedArtworks = Array.isArray(storedGallery.artworks) ? storedGallery.artworks : null;
  const fileArtworks = Array.isArray(fileGallery.artworks) ? fileGallery.artworks : null;

  if (!storedArtworks || !fileArtworks || fileArtworks.length === 0) {
    return;
  }

  const removedSet = new Set(
    (Array.isArray(storedGallery.removedSrcs) ? storedGallery.removedSrcs : [])
      .map((src) => (typeof src === 'string' ? src.trim() : ''))
      .filter(Boolean)
  );

  const knownSrc = new Set(
    storedArtworks
      .map((item) => (item && typeof item.src === 'string' ? item.src.trim() : ''))
      .filter(Boolean)
  );

  const missing = fileArtworks
    .filter((item) => item && typeof item.src === 'string')
    .filter((item) => {
      const src = item.src.trim();
      return src !== '' && !knownSrc.has(src) && !removedSet.has(src);
    })
    .map((item) => deepMerge({}, item));

  if (missing.length > 0) {
    storedGallery.artworks = storedArtworks.concat(missing);
  }
};

const migrateStoredContent = (stored, currentFileContent) => {
  if (!stored || typeof stored !== 'object') {
    return stored;
  }

  const next = deepMerge({}, stored);
  const storedHero = next.hero && typeof next.hero === 'object' ? next.hero : null;
  const fileHero = currentFileContent && currentFileContent.hero ? currentFileContent.hero : null;

  // Migration: old saved payloads could pin hero.mode to "still" even after slideshow was configured in content.js.
  // If saved data has no own slides but file content has slideshow slides, ignore the stale mode override.
  if (
    storedHero &&
    storedHero.mode === 'still' &&
    !storedHero.modeUpdatedAt &&
    fileHero &&
    fileHero.mode === 'slideshow' &&
    Array.isArray(fileHero.slides) &&
    fileHero.slides.length > 1
  ) {
    delete storedHero.mode;
  }

  const storedGallery = next.gallery && typeof next.gallery === 'object' ? next.gallery : null;
  const fileGallery = currentFileContent && currentFileContent.gallery ? currentFileContent.gallery : null;
  if (storedGallery) {
    storedGallery.removedSrcs = (Array.isArray(storedGallery.removedSrcs) ? storedGallery.removedSrcs : [])
      .map((src) => (typeof src === 'string' ? src.trim() : ''))
      .filter(Boolean);
  }
  mergeMissingGalleryItems(storedGallery, fileGallery);

  return next;
};

const resolveActiveLanguage = () => {
  const queryLanguage = readLanguageFromQuery();
  if (queryLanguage) {
    storeLanguage(queryLanguage);
    return queryLanguage;
  }

  const storedLanguage = readStoredLanguage();
  if (storedLanguage) {
    return storedLanguage;
  }

  return 'sv';
};

const fileContent = deepMerge(DEFAULT_CONTENT, window.PORTFOLIO_CONTENT || {});
const liveOverrides =
  window.PORTFOLIO_OVERRIDES && typeof window.PORTFOLIO_OVERRIDES === 'object' ? window.PORTFOLIO_OVERRIDES : null;
const publishedContent = deepMerge(fileContent, liveOverrides || {});
const pageType = (document.body && document.body.dataset && document.body.dataset.page) || 'home';
const colorModeEnabled = pageType !== 'studio';
const storedContent =
  pageType === 'studio' ? migrateStoredContent(loadStoredContent(), publishedContent) : null;
const baseContent = deepMerge(publishedContent, storedContent || {});
const activeLanguage = resolveActiveLanguage();
let activeColorMode = resolveActiveColorMode();
const fileLanguagePacks =
  window.PORTFOLIO_TRANSLATIONS && typeof window.PORTFOLIO_TRANSLATIONS === 'object'
    ? window.PORTFOLIO_TRANSLATIONS
    : {};
const overrideLanguagePacks =
  liveOverrides && liveOverrides.translations && typeof liveOverrides.translations === 'object'
    ? liveOverrides.translations
    : {};
const languagePacks = deepMerge(fileLanguagePacks, overrideLanguagePacks);
const activeLanguagePack =
  languagePacks[activeLanguage] && typeof languagePacks[activeLanguage] === 'object'
    ? languagePacks[activeLanguage]
    : null;
const content = deepMerge(baseContent, activeLanguagePack || {});

document.documentElement.lang = activeLanguage;

const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
const navLinks = document.querySelectorAll('.main-nav a');

const galleryState = {
  allItems: [],
  baseItems: [],
  filteredItems: [],
  activeCategory: 'all',
  activeSort: 'newest'
};

const lightboxState = {
  elements: null,
  currentIndex: 0,
  lastFocused: null,
  items: []
};

const heroSlideshowState = {
  timerId: null,
  currentIndex: 0,
  slides: []
};

const warmCacheRefs = [];

const getPath = (obj, path) => {
  if (!obj || !path) {
    return undefined;
  }

  return path.split('.').reduce((acc, key) => {
    if (acc && Object.prototype.hasOwnProperty.call(acc, key)) {
      return acc[key];
    }
    return undefined;
  }, obj);
};

const getBoundString = (path, fallback = '') => {
  const value = getPath(content, path);
  return typeof value === 'string' && value.trim() !== '' ? value : fallback;
};

const getUiText = (key, fallback = '') => getBoundString(`ui.${key}`, fallback);

const DARK_THEME_OVERRIDES = {
  '--color-ink': '#e7edf8',
  '--color-soft-ink': '#b7c2d8',
  '--color-bg': '#0f141d',
  '--color-surface': '#161d28',
  '--color-border': 'rgba(224, 233, 247, 0.18)',
  '--color-primary': '#7ea9dc',
  '--color-primary-soft': '#21364f',
  '--color-accent': '#d0ab77',
  '--shadow-sm': '0 14px 28px rgba(0, 0, 0, 0.28)',
  '--shadow-md': '0 26px 62px rgba(0, 0, 0, 0.44)'
};

const bindTextContent = () => {
  document.querySelectorAll('[data-bind]').forEach((node) => {
    const key = node.getAttribute('data-bind');
    const value = getBoundString(key);
    if (value !== '') {
      node.textContent = value;
    }
  });
};

const bindAttributeContent = () => {
  document.querySelectorAll('[data-bind-aria]').forEach((node) => {
    const key = node.getAttribute('data-bind-aria');
    const value = getBoundString(key);
    if (value !== '') {
      node.setAttribute('aria-label', value);
    }
  });
};

const bindLanguageAwareLinks = () => {
  document.querySelectorAll('a[data-lang-link]').forEach((link) => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#')) {
      return;
    }

    let url;
    try {
      url = new URL(href, window.location.href);
    } catch (error) {
      return;
    }

    if (url.origin !== window.location.origin) {
      return;
    }

    url.searchParams.set('lang', activeLanguage);
    link.setAttribute('href', `${url.pathname}${url.search}${url.hash}`);
  });
};

const initLanguageSwitcher = () => {
  const buttons = Array.from(document.querySelectorAll('[data-lang-option]'));
  if (buttons.length === 0) {
    return;
  }

  buttons.forEach((button) => {
    const buttonLanguage = normalizeLanguageCode(button.getAttribute('data-lang-option'));
    const isActive = buttonLanguage === activeLanguage;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
    if (buttonLanguage === 'sv') {
      button.setAttribute('aria-label', getUiText('languageOptionSv', 'Svenska'));
    } else if (buttonLanguage === 'en') {
      button.setAttribute('aria-label', getUiText('languageOptionEn', 'English'));
    }
  });

  bindLanguageAwareLinks();

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const nextLanguage = normalizeLanguageCode(button.getAttribute('data-lang-option'));
      if (!nextLanguage || nextLanguage === activeLanguage) {
        return;
      }

      storeLanguage(nextLanguage);
      const nextUrl = new URL(window.location.href);
      nextUrl.searchParams.set('lang', nextLanguage);
      window.location.href = nextUrl.toString();
    });
  });
};

const applyColorMode = () => {
  if (!colorModeEnabled) {
    return;
  }

  const root = document.documentElement;
  const mode = activeColorMode === 'dark' ? 'dark' : 'light';
  // Restore configured light theme first. Dark mode then overrides selected tokens below.
  applyTheme();
  root.setAttribute('data-color-mode', mode);
  root.style.setProperty('color-scheme', mode);

  if (mode === 'dark') {
    Object.entries(DARK_THEME_OVERRIDES).forEach(([cssVar, value]) => {
      root.style.setProperty(cssVar, value);
    });
  }

  const fallbackLightLabel = activeLanguage === 'en' ? 'Light' : 'Ljus';
  const fallbackDarkLabel = activeLanguage === 'en' ? 'Dark' : 'Mörk';
  const lightLabel = getUiText('themeOptionLight', fallbackLightLabel);
  const darkLabel = getUiText('themeOptionDark', fallbackDarkLabel);

  document.querySelectorAll('[data-theme-option]').forEach((button) => {
    const buttonMode = normalizeColorMode(button.getAttribute('data-theme-option'));
    const isActive = buttonMode === mode;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
    if (buttonMode === 'light') {
      button.setAttribute('aria-label', lightLabel);
      button.setAttribute('title', lightLabel);
    } else if (buttonMode === 'dark') {
      button.setAttribute('aria-label', darkLabel);
      button.setAttribute('title', darkLabel);
    }
  });

  const themeColorMeta = document.querySelector('meta[name="theme-color"]');
  if (themeColorMeta) {
    const color = getComputedStyle(root).getPropertyValue('--color-bg').trim() || (mode === 'dark' ? '#0f141d' : '#f3efe6');
    themeColorMeta.setAttribute('content', color);
  }
};

const initColorModeSwitcher = () => {
  if (!colorModeEnabled) {
    return;
  }

  const buttons = Array.from(document.querySelectorAll('[data-theme-option]'));
  if (buttons.length === 0) {
    applyColorMode();
    return;
  }

  buttons.forEach((button) => {
    if (button.dataset.themeModeInit === '1') {
      return;
    }
    button.dataset.themeModeInit = '1';
    button.addEventListener('click', () => {
      const nextMode = normalizeColorMode(button.getAttribute('data-theme-option'));
      if (!nextMode || nextMode === activeColorMode) {
        return;
      }
      activeColorMode = nextMode;
      storeColorMode(nextMode);
      applyColorMode();
    });
  });

  applyColorMode();
};

const bindSiteMeta = () => {
  // For server-rendered SEO pages (e.g. per-artwork URLs) keep the SSR <title>/<meta> intact.
  // Home/gallery/studio still get hydrated from content.
  if (pageType !== 'home' && pageType !== 'gallery' && pageType !== 'studio') {
    return;
  }

  const brandName = getBoundString('site.brandName', 'Ola Gustafsson');
  const brandTag = getBoundString('site.brandTag', '');
  const brandTitle = [brandName, brandTag].filter(Boolean).join(' ');
  const baseTitle = getBoundString('site.title', brandTitle);
  const isEnglish = activeLanguage === 'en';

  let title = baseTitle;
  let description = getBoundString('site.metaDescription', '');

  if (pageType === 'gallery') {
    const galleryLabel = getUiText('navGallery', isEnglish ? 'Gallery' : 'Galleri');
    title = `${galleryLabel} | ${brandTitle}`;
    description = isEnglish
      ? "Complete gallery of Ola Gustafsson's watercolor paintings."
      : 'Hela galleriet med akvareller av Ola Gustafsson.';
  }

  if (pageType === 'studio') {
    title = `Studio | ${brandTitle}`;
  }

  if (title.trim() !== '') {
    document.title = title;
  }

  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription && description.trim() !== '') {
    metaDescription.setAttribute('content', description);
  }
};

const applyTheme = () => {
  const theme = content.theme || {};
  const root = document.documentElement;

  const map = {
    '--color-bg': theme.background,
    '--color-surface': theme.surface,
    '--color-ink': theme.ink,
    '--color-soft-ink': theme.softInk,
    '--color-primary': theme.primary,
    '--color-accent': theme.accent,
    '--color-border': theme.border
  };

  Object.entries(map).forEach(([cssVar, value]) => {
    if (typeof value === 'string' && value.trim() !== '') {
      root.style.setProperty(cssVar, value);
    }
  });

  const displayKey = typeof theme.fontDisplay === 'string' ? theme.fontDisplay.trim().toLowerCase() : 'fraunces';
  const bodyKey = typeof theme.fontBody === 'string' ? theme.fontBody.trim().toLowerCase() : 'jakarta';
  root.style.setProperty('--font-display', DISPLAY_FONT_STACKS[displayKey] || DISPLAY_FONT_STACKS.fraunces);
  root.style.setProperty('--font-body', BODY_FONT_STACKS[bodyKey] || BODY_FONT_STACKS.jakarta);

  const normalizeWeight = (value, fallback) => {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
      return fallback;
    }
    const rounded = Math.round(numeric);
    return FONT_WEIGHT_VALUES.includes(rounded) ? rounded : fallback;
  };

  const displayWeight = normalizeWeight(theme.fontDisplayWeight, 700);
  const bodyWeight = normalizeWeight(theme.fontBodyWeight, 400);
  const bodyStrongWeight = Math.max(500, Math.min(800, bodyWeight + 200));
  root.style.setProperty('--font-display-weight', String(displayWeight));
  root.style.setProperty('--font-body-weight', String(bodyWeight));
  root.style.setProperty('--font-body-strong-weight', String(bodyStrongWeight));
};

const addImageFallback = (img) => {
  if (!(img instanceof HTMLImageElement)) {
    return;
  }

  img.addEventListener('error', () => {
    // Some image flows intentionally trigger one error first (e.g. missing thumb)
    // and then swap to full-size image in the same tick.
    if (img.dataset.suppressErrorFallback === '1') {
      return;
    }
    const frame = img.closest('[data-fallback]');
    if (!frame) {
      return;
    }
    img.remove();
    frame.classList.add('image-missing');
  });
};

const isLikelyBlackPreview = (img) => {
  try {
    const sample = document.createElement('canvas');
    sample.width = 24;
    sample.height = 24;
    const ctx = sample.getContext('2d');
    if (!ctx) {
      return false;
    }

    ctx.drawImage(img, 0, 0, sample.width, sample.height);
    const { data } = ctx.getImageData(0, 0, sample.width, sample.height);
    let luminanceSum = 0;
    let nonBlackPixels = 0;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      luminanceSum += luminance;
      if (luminance > 18) {
        nonBlackPixels += 1;
      }
    }

    const totalPixels = sample.width * sample.height;
    const avgLuminance = luminanceSum / totalPixels;
    const nonBlackRatio = nonBlackPixels / totalPixels;

    return avgLuminance < 10 && nonBlackRatio < 0.02;
  } catch (error) {
    return false;
  }
};

const imageExists = async (src) => {
  try {
    const response = await fetch(src, { method: 'HEAD', cache: 'no-store' });
    return response.ok;
  } catch (error) {
    return false;
  }
};

const addRevToSrc = (src) => {
  if (typeof src !== 'string' || src.trim() === '' || src.startsWith('data:')) {
    return src;
  }

  const separator = src.includes('?') ? '&' : '?';
  return `${src}${separator}v=${ASSET_REV}`;
};

const copyTextToClipboard = async (value) => {
  if (typeof value !== 'string' || value.trim() === '') {
    return false;
  }
  const text = value.trim();

  if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      // fallback below
    }
  }

  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.top = '-2000px';
    textarea.style.left = '-2000px';
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand('copy');
    textarea.remove();
    return ok;
  } catch (error) {
    return false;
  }
};

const initCopyLinkButtons = () => {
  document.querySelectorAll('[data-copy-link]').forEach((node) => {
    const button = node;
    if (!(button instanceof HTMLElement)) {
      return;
    }
    if (button.dataset.copyInit === '1') {
      return;
    }
    button.dataset.copyInit = '1';

    button.addEventListener('click', async (event) => {
      // Don't steal clicks from anchors that navigate.
      if (button instanceof HTMLAnchorElement) {
        event.preventDefault();
      }

      const link = String(button.getAttribute('data-copy-link') || '').trim();
      if (!link || link === '#') {
        return;
      }

      const originalLabel = button.dataset.copyOriginalLabel || button.textContent || '';
      if (!button.dataset.copyOriginalLabel) {
        button.dataset.copyOriginalLabel = originalLabel;
      }

      const ok = await copyTextToClipboard(link);
      const copiedLabel = ok ? getUiText('linkCopied', 'Länk kopierad.') : '';

      const statusSelector = button.getAttribute('data-copy-status-target');
      const statusEl =
        statusSelector && typeof statusSelector === 'string' ? document.querySelector(statusSelector) : null;
      if (statusEl instanceof HTMLElement) {
        statusEl.textContent = copiedLabel;
        window.setTimeout(() => {
          statusEl.textContent = '';
        }, 1600);
      }

      if (ok && originalLabel.trim() !== '') {
        button.textContent = copiedLabel;
        window.setTimeout(() => {
          button.textContent = button.dataset.copyOriginalLabel || originalLabel;
        }, 1200);
      }
    });
  });
};

const getThumbCandidateSrc = (src) => {
  if (typeof src !== 'string') {
    return '';
  }

  const trimmed = src.trim();
  if (
    !trimmed ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:') ||
    !trimmed.startsWith('images/') ||
    trimmed.includes('/thumbs/')
  ) {
    return '';
  }

  const clean = trimmed.split('?')[0].split('#')[0];
  const fileName = clean.split('/').pop() || '';
  if (!fileName) {
    return '';
  }

  return `images/thumbs/${fileName}`;
};

const slugifyArtworkValue = (value) => {
  if (typeof value !== 'string') {
    return 'verk';
  }

  let slug = value.trim().toLowerCase();
  if (!slug) {
    return 'verk';
  }

  const map = {
    å: 'a',
    ä: 'a',
    ö: 'o',
    é: 'e',
    è: 'e',
    ê: 'e',
    ü: 'u',
    í: 'i',
    á: 'a',
    à: 'a',
    ô: 'o',
    ó: 'o',
    ñ: 'n'
  };

  Object.entries(map).forEach(([from, to]) => {
    slug = slug.split(from).join(to);
  });

  slug = slug.replace(/[^a-z0-9]+/g, '-');
  slug = slug.replace(/^-+|-+$/g, '');
  slug = slug.replace(/-+/g, '-');

  return slug || 'verk';
};

const getArtworkTextOverride = (src) => {
  if (typeof src !== 'string' || src.trim() === '') {
    return null;
  }
  const translationMap =
    content.gallery && content.gallery.artworkTextBySrc && typeof content.gallery.artworkTextBySrc === 'object'
      ? content.gallery.artworkTextBySrc
      : null;
  if (!translationMap) {
    return null;
  }
  const override = translationMap[src.trim()];
  return override && typeof override === 'object' ? override : null;
};

const localizeGenericArtworkTitle = (value) => {
  if (typeof value !== 'string' || value.trim() === '') {
    return '';
  }
  const trimmed = value.trim();
  const match = trimmed.match(/^Verk\s+(\d+)$/i);
  if (!match) {
    return trimmed;
  }
  return `${getUiText('artworkDefaultPrefix', 'Verk')} ${match[1]}`;
};

const localizeGenericArtworkAlt = (value) => {
  if (typeof value !== 'string' || value.trim() === '') {
    return '';
  }
  const trimmed = value.trim();
  const match = trimmed.match(/^Akvarell(?:\s+verk)?\s+(\d+)$/i);
  if (!match) {
    return trimmed;
  }
  return `${getUiText('watercolorDefaultAltPrefix', 'Akvarellverk')} ${match[1]}`;
};

const localizeGenericArtworkMedium = (value) => {
  if (typeof value !== 'string' || value.trim() === '') {
    return '';
  }
  const trimmed = value.trim();
  if (/^Akvarell på papper$/i.test(trimmed)) {
    return getUiText('mediumDefault', 'Akvarell på papper');
  }
  return trimmed;
};

const normalizeArtwork = (item, index) => {
  const textOverride = getArtworkTextOverride(item.src);
  const defaultTitle = `${getUiText('artworkDefaultPrefix', 'Verk')} ${index + 1}`;
  const rawTitle = (textOverride && textOverride.title) || item.title || '';
  const title = localizeGenericArtworkTitle(rawTitle) || defaultTitle;
  const rawMedium = (textOverride && textOverride.medium) || item.medium || '';
  const medium = localizeGenericArtworkMedium(rawMedium) || getUiText('mediumDefault', 'Akvarell på papper');
  const rawAlt = (textOverride && textOverride.alt) || item.alt || item.title || '';
  const alt = localizeGenericArtworkAlt(rawAlt) || localizeGenericArtworkTitle(rawAlt) || title;
  const baseTitle = typeof item.title === 'string' ? item.title.trim() : '';
  const rawSlug = typeof item.slug === 'string' ? item.slug.trim() : '';
  let slug = rawSlug ? slugifyArtworkValue(rawSlug) : '';
  if (!slug && baseTitle) {
    slug = slugifyArtworkValue(baseTitle);
  }
  if (!slug) {
    const src = typeof item.src === 'string' ? item.src.trim() : '';
    const clean = src.split('?')[0].split('#')[0];
    const fileName = clean.split('/').pop() || '';
    const baseName = fileName.replace(/\.[a-z0-9]+$/i, '');
    slug = slugifyArtworkValue(baseName);
  }

  const normalizeCategory = (value) => {
    const normalized = String(value || '')
      .trim()
      .toLowerCase();
    if (!normalized || normalized === 'all') {
      return 'nature';
    }
    // Legacy merge: "forest" is now part of "nature".
    if (normalized === 'forest') {
      return 'nature';
    }
    return normalized;
  };

  return {
    id: item.id || String(index + 1),
    slug,
    src: item.src,
    previewSrc:
      (typeof item.previewSrc === 'string' && item.previewSrc.trim() !== '' ? item.previewSrc : getThumbCandidateSrc(item.src)) || '',
    title,
    format: (textOverride && textOverride.format) || item.format || '',
    medium,
    alt,
    featured: Boolean(item.featured),
    category: normalizeCategory(item.category),
    year: Number(item.year || 0),
    order: Number(item.order || index + 1),
    // Keep gallery rendering stable: ignore stale per-slot crop values from old local overrides.
    zoom: 1,
    objectPosition: 'center center'
  };
};

const getArtworkPreviewSrc = (item) => {
  const preview = typeof item.previewSrc === 'string' ? item.previewSrc.trim() : '';
  return preview || item.src;
};

const buildArtworkPageUrl = (item) => {
  if (!item || typeof item !== 'object') {
    return window.location.origin;
  }

  const rawSlug = typeof item.slug === 'string' ? item.slug.trim() : '';
  const slug = slugifyArtworkValue(rawSlug || 'verk');
  const url = new URL(`/verk/${encodeURIComponent(slug)}`, window.location.origin);
  url.searchParams.set('lang', activeLanguage);
  return url.toString();
};

const getHighestManualSequenceId = (manualItems, config) => {
  const path = String(config.path || 'images').replace(/\/+$/, '');
  const prefix = String(config.prefix || 'ola-');
  const extension = String(config.extension || 'jpg').replace(/^\./, '');
  const startToken = `${path}/${prefix}`;
  const endToken = `.${extension}`;

  let highest = 0;
  manualItems.forEach((item) => {
    const src = typeof item.src === 'string' ? item.src : '';
    if (!src.startsWith(startToken) || !src.endsWith(endToken)) {
      return;
    }

    const middle = src.slice(startToken.length, src.length - endToken.length);
    const value = Number(middle);
    if (!Number.isNaN(value)) {
      highest = Math.max(highest, value);
    }
  });

  return highest;
};

const autoDiscoverArtworks = async (manualItems) => {
  const gallery = content.gallery || {};
  const config = gallery.autoDiscover || {};

  if (!config.enabled) {
    return [];
  }

  const path = config.path || 'images';
  const prefix = config.prefix || 'ola-';
  const extension = config.extension || 'jpg';
  const start = Number(config.start || 1);
  const pad = Number(config.pad || 2);
  const max = Number(config.max || 120);
  const stopAfterMisses = Number(config.stopAfterMisses || 20);
  const removedSet = new Set(
    (Array.isArray(gallery.removedSrcs) ? gallery.removedSrcs : [])
      .map((src) => (typeof src === 'string' ? src.trim() : ''))
      .filter(Boolean)
  );

  const knownSrc = new Set(manualItems.map((item) => item.src));
  const highestManualId = getHighestManualSequenceId(manualItems, config);
  const startFrom = Math.max(start, highestManualId + 1);
  const discovered = [];
  let misses = 0;

  for (let i = startFrom; i <= max; i += 1) {
    const id = String(i).padStart(pad, '0');
    const src = `${path}/${prefix}${id}.${extension}`;

    if (knownSrc.has(src) || removedSet.has(src)) {
      misses = 0;
      continue;
    }

    // We probe sequential filenames and stop after enough misses.
    // This lets you upload new images and have them appear automatically.
    // Naming pattern is configured in content.js -> gallery.autoDiscover.
    // Example: images/ola-11.jpg, images/ola-12.jpg ...
    // No additional code changes needed when adding those files.
    // If titles/categories are not set manually, defaults are used.
    // You can still override per image in gallery.artworks.
    // This keeps uploads fast while preserving editorial control.
    const exists = await imageExists(src);
    if (exists) {
      discovered.push({
        src,
        title: `${config.titlePrefix || getUiText('artworkDefaultPrefix', 'Verk')} ${id}`,
        format: config.defaultFormat || '',
        medium: config.defaultMedium || getUiText('mediumDefault', 'Akvarell på papper'),
        alt: `${getUiText('watercolorDefaultAltPrefix', 'Akvarellverk')} ${id}`,
        category:
          String(config.defaultCategory || 'nature')
            .trim()
            .toLowerCase() === 'forest'
            ? 'nature'
            : config.defaultCategory || 'nature',
        featured: false,
        order: i
      });
      misses = 0;
    } else {
      misses += 1;
      if (misses >= stopAfterMisses) {
        break;
      }
    }
  }

  return discovered;
};

const buildManualGalleryItems = () => {
  const gallery = content.gallery || {};
  const manualRaw = Array.isArray(gallery.artworks) ? gallery.artworks : [];

  return manualRaw
    .filter((item) => item && typeof item === 'object' && typeof item.src === 'string' && item.src.trim() !== '')
    .map((item, index) => normalizeArtwork(item, index))
    .sort((a, b) => a.order - b.order);
};

const clearHeroSlideshow = () => {
  if (heroSlideshowState.timerId) {
    window.clearTimeout(heroSlideshowState.timerId);
    heroSlideshowState.timerId = null;
  }
  heroSlideshowState.currentIndex = 0;
  heroSlideshowState.slides = [];

  const oldWrap = document.querySelector('.hero-slides');
  if (oldWrap) {
    oldWrap.remove();
  }

  const heroImage = document.getElementById('hero-image');
  if (heroImage) {
    heroImage.style.display = '';
    heroImage.style.opacity = '';
  }
};

const clearHeroPreloadArtifacts = () => {
  document.querySelectorAll('[data-hero-preload="1"]').forEach((node) => node.remove());
};

const normalizeHeroSlideDuration = (value, fallback) => {
  const parsed = Number(value || fallback || 8000);
  if (Number.isNaN(parsed)) {
    return 8000;
  }
  return Math.max(1200, parsed);
};

const dedupeSlidesBySrc = (slides) => {
  const seen = new Set();
  const output = [];

  slides.forEach((slide) => {
    if (!slide || typeof slide.src !== 'string') {
      return;
    }
    const key = slide.src.trim();
    if (!key || seen.has(key)) {
      return;
    }
    seen.add(key);
    output.push(slide);
  });

  return output;
};

const runHeroSlideshow = (slides, defaultDurationMs, options = {}) => {
  const heroMedia = document.querySelector('.hero-media');
  if (!heroMedia || slides.length === 0) {
    return;
  }
  const fallbackImage = options.fallbackImage instanceof HTMLImageElement ? options.fallbackImage : null;
  heroSlideshowState.slides = slides.slice();

  const wrap = document.createElement('div');
  wrap.className = 'hero-slides';

  const markReady = () => {
    if (wrap.classList.contains('is-ready')) {
      return;
    }
    clearHeroPreloadArtifacts();
    wrap.classList.add('is-ready');
    if (fallbackImage) {
      fallbackImage.style.opacity = '0';
      window.setTimeout(() => {
        fallbackImage.style.display = 'none';
        fallbackImage.style.opacity = '';
      }, 260);
    }
  };

  slides.forEach((slide, index) => {
    const image = document.createElement('img');
    image.className = 'artwork-photo hero-slide';
    image.src = addRevToSrc(slide.src);
    image.alt = slide.alt || `${getUiText('slideLabel', 'Bild')} ${index + 1}`;
    image.loading = 'eager';
    image.fetchPriority = index < 2 ? 'high' : 'auto';
    image.decoding = 'async';
    image.style.setProperty('--slide-duration', `${Number(slide.durationMs || defaultDurationMs)}ms`);
    if (index === 0) {
      image.classList.add('is-active');
      image.addEventListener('load', markReady, { once: true });
      image.addEventListener('error', markReady, { once: true });
    }
    addImageFallback(image);
    wrap.appendChild(image);
  });

  const overlay = heroMedia.querySelector('.hero-overlay');
  if (overlay) {
    heroMedia.insertBefore(wrap, overlay);
  } else {
    heroMedia.appendChild(wrap);
  }

  const elements = Array.from(wrap.querySelectorAll('.hero-slide'));
  const first = elements[0];
  if (first && first.complete) {
    window.requestAnimationFrame(markReady);
  }

  if (elements.length <= 1) {
    markReady();
    return;
  }

  // Preload all slides to avoid stalled transitions on slow connections.
  slides.forEach((slide) => {
    const pre = new Image();
    pre.decoding = 'async';
    pre.src = addRevToSrc(slide.src);
  });

  const variants = ['kb-in', 'kb-out', 'kb-pan-left', 'kb-pan-right'];
  const applyKenBurnsVariant = (element) => {
    if (!element) {
      return;
    }

    const variant = variants[Math.floor(Math.random() * variants.length)];
    element.classList.remove('kb-in', 'kb-out', 'kb-pan-left', 'kb-pan-right');
    element.classList.add(variant);

    // Restart animation so each slide entry gets a fresh Ken Burns motion.
    element.style.animation = 'none';
    element.offsetHeight;
    element.style.removeProperty('animation');
  };

  const showSlide = (nextIndex) => {
    elements.forEach((el, i) => {
      el.classList.toggle('is-active', i === nextIndex);
    });
    applyKenBurnsVariant(elements[nextIndex]);
    heroSlideshowState.currentIndex = nextIndex;
  };

  showSlide(0);

  const tick = () => {
    const durationMs = normalizeHeroSlideDuration(slides[heroSlideshowState.currentIndex].durationMs, defaultDurationMs);
    heroSlideshowState.timerId = window.setTimeout(() => {
      const nextIndex = (heroSlideshowState.currentIndex + 1) % elements.length;
      showSlide(nextIndex);
      tick();
    }, durationMs);
  };

  tick();
};

const renderHeroImage = () => {
  const heroImage = document.getElementById('hero-image');
  if (!heroImage || !content.hero) {
    return;
  }

  clearHeroSlideshow();

  const heroMode = content.hero.mode || 'still';
  const slideDurationMs = normalizeHeroSlideDuration(content.hero.slideDurationMs, 8000);
  const configuredSlides = Array.isArray(content.hero.slides)
    ? content.hero.slides.filter((item) => item && item.src).map((item) => ({
        src: item.src,
        alt: item.alt || '',
        durationMs: normalizeHeroSlideDuration(item.durationMs, slideDurationMs)
      }))
    : [];

  let slides = dedupeSlidesBySrc(configuredSlides);

  if (heroMode === 'slideshow' && slides.length === 0) {
    const fallbackSlides = (Array.isArray(content.gallery?.artworks) ? content.gallery.artworks : [])
      .filter((item) => item && item.src)
      .slice(0, 8)
      .map((item) => ({
        src: item.src,
        alt: item.alt || item.title || '',
        durationMs: slideDurationMs
      }));
    slides = dedupeSlidesBySrc([...slides, ...fallbackSlides]);
  }

  if (heroMode === 'slideshow' && slides.length > 0) {
    const firstSlide = slides[0];
    const firstPreviewSrc = getThumbCandidateSrc(firstSlide.src) || firstSlide.src;
    heroImage.style.display = '';
    heroImage.style.opacity = '1';
    heroImage.src = addRevToSrc(firstPreviewSrc);
    heroImage.alt = firstSlide.alt || getUiText('heroImageFallbackAlt', 'Hero-bild');
    addImageFallback(heroImage);
    if (firstPreviewSrc !== firstSlide.src) {
      const pre = new Image();
      pre.decoding = 'async';
      pre.src = addRevToSrc(firstSlide.src);
    }
    heroSlideshowState.currentIndex = 0;
    runHeroSlideshow(slides, slideDurationMs, { fallbackImage: heroImage });
    return;
  }

  heroImage.style.display = '';
  if (content.hero.image) {
    heroImage.src = addRevToSrc(content.hero.image);
  }
  heroImage.alt = content.hero.imageAlt || getUiText('heroImageFallbackAlt', 'Hero-bild');
  heroImage.addEventListener('load', clearHeroPreloadArtifacts, { once: true });
  heroImage.addEventListener('error', clearHeroPreloadArtifacts, { once: true });
  if (heroImage.complete) {
    window.requestAnimationFrame(clearHeroPreloadArtifacts);
  }
  addImageFallback(heroImage);
};

const renderHeroOverlay = () => {
  const overlay = document.querySelector('.hero-overlay');
  const panel = document.getElementById('hero-copy-panel');
  if (!overlay || !content.hero) {
    return;
  }

  const enabled = content.hero.overlayEnabled !== false;
  const opacityNumber = Number(content.hero.overlayOpacity);
  const opacity = Number.isNaN(opacityNumber) ? 55 : Math.max(0, Math.min(100, opacityNumber));
  const panelDarknessNumber = Number(content.hero.copyPanelOpacity);
  const panelDarkness = Number.isNaN(panelDarknessNumber) ? 40 : Math.max(0, Math.min(100, panelDarknessNumber));
  const strongAlpha = 0.06 + (panelDarkness / 100) * 0.64;
  const softAlpha = 0.02 + (panelDarkness / 100) * 0.32;
  overlay.style.display = enabled ? 'block' : 'none';
  overlay.style.opacity = String(opacity / 100);

  if (panel) {
    panel.style.background = `linear-gradient(148deg, rgba(6, 11, 20, ${strongAlpha.toFixed(3)}), rgba(6, 11, 20, ${softAlpha.toFixed(3)}))`;
  }
};

const renderAboutParagraphs = () => {
  const container = document.getElementById('about-main-paragraphs');
  const paragraphs = content.about && Array.isArray(content.about.paragraphs) ? content.about.paragraphs : [];

  if (!container) {
    return;
  }

  container.innerHTML = '';
  paragraphs.forEach((text) => {
    const p = document.createElement('p');
    p.textContent = text;
    container.appendChild(p);
  });
};

const getImageEntries = (value) => {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .filter((item) => item && typeof item === 'object')
    .map((item) => ({
      src: typeof item.src === 'string' ? item.src.trim() : '',
      alt: typeof item.alt === 'string' ? item.alt.trim() : ''
    }))
    .filter((item) => item.src !== '');
};

const renderAboutMaterialImage = () => {
  const wrap = document.getElementById('about-material-image-wrap');
  const image = document.getElementById('about-material-image');
  if (!wrap || !image) {
    return;
  }
  const about = content.about && typeof content.about === 'object' ? content.about : {};
  const baseAbout = baseContent.about && typeof baseContent.about === 'object' ? baseContent.about : {};
  let src = typeof baseAbout.materialImage === 'string' ? baseAbout.materialImage.trim() : '';
  let alt = typeof about.materialImageAlt === 'string' ? about.materialImageAlt.trim() : '';
  const processImages = getImageEntries(baseAbout.processImages);
  if (!src && processImages.length > 0) {
    const fallback = processImages[Math.min(2, processImages.length - 1)];
    src = fallback.src;
    if (!alt) {
      const localizedProcessImages = getImageEntries(about.processImages);
      const localizedFallback = localizedProcessImages.find((entry) => entry.src === fallback.src);
      alt = (localizedFallback && localizedFallback.alt) || fallback.alt || '';
    }
  }

  if (!src) {
    wrap.hidden = true;
    return;
  }

  image.src = addRevToSrc(src);
  image.alt = alt || getUiText('heroImageFallbackAlt', 'Bild');
  addImageFallback(image);
  wrap.hidden = false;
};

const renderFeatureImage = () => {
  const wrap = document.getElementById('about-feature-image-wrap');
  const image = document.getElementById('about-feature-image');
  if (!wrap || !image) {
    return;
  }
  const about = content.about && typeof content.about === 'object' ? content.about : {};
  const baseAbout = baseContent.about && typeof baseContent.about === 'object' ? baseContent.about : {};
  let src = typeof baseAbout.featureImage === 'string' ? baseAbout.featureImage.trim() : '';
  let alt = typeof about.featureImageAlt === 'string' ? about.featureImageAlt.trim() : '';
  const processImages = getImageEntries(baseAbout.processImages);
  if (!src && processImages.length > 0) {
    src = processImages[0].src;
    if (!alt) {
      const localizedProcessImages = getImageEntries(about.processImages);
      const localizedFallback = localizedProcessImages.find((entry) => entry.src === processImages[0].src);
      alt = (localizedFallback && localizedFallback.alt) || processImages[0].alt || '';
    }
  }

  if (!src) {
    wrap.hidden = true;
    return;
  }

  image.src = addRevToSrc(src);
  image.alt = alt || getUiText('heroImageFallbackAlt', 'Bild');
  addImageFallback(image);
  wrap.hidden = false;
};

const renderAboutPortrait = () => {
  const figure = document.getElementById('about-portrait');
  const image = document.getElementById('about-portrait-image');

  if (!figure || !image) {
    return;
  }

  const src =
    baseContent.about && typeof baseContent.about.portraitImage === 'string' ? baseContent.about.portraitImage.trim() : '';
  const alt = content.about && typeof content.about.portraitAlt === 'string' ? content.about.portraitAlt.trim() : '';

  if (!src) {
    figure.hidden = true;
    return;
  }

  image.src = addRevToSrc(src);
  image.alt = alt || getUiText('portraitFallbackAlt', 'Porträtt av Ola Gustafsson');
  addImageFallback(image);
  figure.hidden = false;
};

const renderAmbitions = () => {
  const list = document.getElementById('about-ambitions');
  const ambitions = content.about && Array.isArray(content.about.ambitions) ? content.about.ambitions : [];

  if (!list) {
    return;
  }

  list.innerHTML = '';
  ambitions.forEach((text) => {
    const li = document.createElement('li');
    li.textContent = text;
    list.appendChild(li);
  });
};

const renderRecognition = () => {
  const list = document.getElementById('about-recognition');
  const recognitionItems = content.about && Array.isArray(content.about.recognitionItems) ? content.about.recognitionItems : [];

  if (!list) {
    return;
  }

  list.innerHTML = '';
  recognitionItems.forEach((text) => {
    const li = document.createElement('li');
    li.textContent = text;
    list.appendChild(li);
  });
};

const renderSunProject = () => {
  const section = document.getElementById('projekt');
  const collageWrap = document.getElementById('sun-project-collage-wrap');
  const collage = document.getElementById('sun-project-collage');
  const samples = document.getElementById('sun-project-samples');
  const project = content.project && typeof content.project === 'object' ? content.project : {};
  const baseProject = baseContent.project && typeof baseContent.project === 'object' ? baseContent.project : {};

  if (!section || !samples) {
    return;
  }

  const hasProjectContent =
    (typeof project.heading === 'string' && project.heading.trim() !== '') ||
    (typeof project.description === 'string' && project.description.trim() !== '') ||
    (typeof baseProject.collageImage === 'string' && baseProject.collageImage.trim() !== '') ||
    (Array.isArray(baseProject.samples) && baseProject.samples.length > 0);

  section.hidden = !hasProjectContent;
  if (!hasProjectContent) {
    return;
  }

  const projectTitle = typeof project.heading === 'string' && project.heading.trim() !== '' ? project.heading.trim() : 'Projekt';
  const collageLabel = activeLanguage === 'en' ? 'Collage' : 'Kollage';
  const sampleLabel = activeLanguage === 'en' ? 'Example' : 'Exempel';
  const lightboxItems = [];

  const setLightboxTrigger = (node, itemIndex) => {
    if (!node || !Number.isFinite(itemIndex)) {
      return;
    }
    node.classList.add('is-lightbox-trigger');
    node.setAttribute('role', 'button');
    node.setAttribute('tabindex', '0');
    node.setAttribute('aria-label', getUiText('openInLightbox', 'Öppna i stor bild.'));
    node.onclick = (event) => {
      event.preventDefault();
      openLightboxWithItems(lightboxItems, itemIndex, node);
    };
    node.onkeydown = (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') {
        return;
      }
      event.preventDefault();
      openLightboxWithItems(lightboxItems, itemIndex, node);
    };
  };

  const clearLightboxTrigger = (node) => {
    if (!node) {
      return;
    }
    node.classList.remove('is-lightbox-trigger');
    node.removeAttribute('role');
    node.removeAttribute('tabindex');
    node.removeAttribute('aria-label');
    node.onclick = null;
    node.onkeydown = null;
  };

  if (collageWrap && collage) {
    clearLightboxTrigger(collageWrap);
    const src = typeof baseProject.collageImage === 'string' ? baseProject.collageImage.trim() : '';
    if (src) {
      const altText =
        (typeof project.collageAlt === 'string' && project.collageAlt.trim() !== '')
          ? project.collageAlt.trim()
          : getUiText('heroImageFallbackAlt', 'Bild');
      collage.src = addRevToSrc(src);
      collage.alt = altText;
      addImageFallback(collage);
      collageWrap.hidden = false;

      const collageIndex = lightboxItems.push({
        src,
        alt: altText,
        title: projectTitle,
        caption: `${projectTitle} · ${collageLabel}`,
        disableShareActions: true
      }) - 1;
      setLightboxTrigger(collageWrap, collageIndex);
    } else {
      collageWrap.hidden = true;
    }
  }

  const baseEntries = getImageEntries(baseProject.samples);
  const localizedEntries = getImageEntries(project.samples);
  const localizedAltBySrc = new Map(
    localizedEntries.map((entry) => [String(entry.src || '').trim(), String(entry.alt || '').trim()])
  );
  const entries = baseEntries.map((entry) => ({
    src: entry.src,
    alt: localizedAltBySrc.get(entry.src) || entry.alt || ''
  }));
  samples.innerHTML = '';
  entries.forEach((item, index) => {
    const figure = document.createElement('figure');
    figure.className = 'sun-project-sample surface-soft';
    figure.setAttribute('data-fallback', getUiText('missingImage', 'Kunde inte ladda'));
    const img = document.createElement('img');
    img.className = 'artwork-photo';
    img.src = addRevToSrc(item.src);
    img.alt = item.alt || `${getUiText('slideLabel', 'Bild')} ${index + 1}`;
    img.loading = 'lazy';
    img.decoding = 'async';
    addImageFallback(img);
    figure.appendChild(img);
    samples.appendChild(figure);

    const sampleIndex = lightboxItems.push({
      src: item.src,
      alt: img.alt,
      title: projectTitle,
      caption: `${projectTitle} · ${sampleLabel} ${index + 1}`,
      disableShareActions: true
    }) - 1;
    setLightboxTrigger(figure, sampleIndex);
  });
};

const getBaseItemsForPage = () => {
  if (pageType !== 'home') {
    return galleryState.allItems.slice();
  }

  const featured = galleryState.allItems.filter((item) => item.featured);
  if (featured.length > 0) {
    return featured;
  }

  return galleryState.allItems.slice(0, 6);
};

const getCategoryLabel = (category) => {
  const normalized = String(category || '')
    .trim()
    .toLowerCase();
  const key = normalized === 'forest' ? 'nature' : normalized;
  const labels = (content.gallery && content.gallery.categoryLabels) || {};
  return labels[key] || key || category;
};

const getSortableArtworkYear = (item) => {
  const value = Number(item && item.year);
  if (Number.isFinite(value) && value > 0) {
    return value;
  }
  return 0;
};

const applyGalleryFilterAndSort = () => {
  const filtered =
    galleryState.activeCategory === 'all'
      ? galleryState.baseItems.slice()
      : galleryState.baseItems.filter((item) => item.category === galleryState.activeCategory);

  const sorted = filtered.slice();
  switch (galleryState.activeSort) {
    case 'title-asc':
      sorted.sort((a, b) => a.title.localeCompare(b.title, activeLanguage));
      break;
    case 'title-desc':
      sorted.sort((a, b) => b.title.localeCompare(a.title, activeLanguage));
      break;
    case 'newest':
      sorted.sort((a, b) => {
        const yearDiff = getSortableArtworkYear(b) - getSortableArtworkYear(a);
        if (yearDiff !== 0) {
          return yearDiff;
        }
        const orderDiff = Number(a.order || 0) - Number(b.order || 0);
        if (orderDiff !== 0) {
          return orderDiff;
        }
        return a.title.localeCompare(b.title, activeLanguage);
      });
      break;
    case 'oldest':
      sorted.sort((a, b) => {
        const yearDiff = getSortableArtworkYear(a) - getSortableArtworkYear(b);
        if (yearDiff !== 0) {
          return yearDiff;
        }
        const orderDiff = Number(a.order || 0) - Number(b.order || 0);
        if (orderDiff !== 0) {
          return orderDiff;
        }
        return a.title.localeCompare(b.title, activeLanguage);
      });
      break;
    default:
      sorted.sort((a, b) => a.order - b.order);
      break;
  }

  galleryState.filteredItems = sorted;
};

const renderGallery = () => {
  const grid = document.getElementById('gallery-grid');
  if (!grid) {
    return;
  }

  const items = galleryState.filteredItems;
  if (!Array.isArray(items) || items.length === 0) {
    grid.innerHTML = `<p class="gallery-empty">${getUiText('galleryEmpty', 'Inga verk matchar filtret.')}</p>`;
    return;
  }

  const fragment = document.createDocumentFragment();

  items.forEach((item, index) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'work-card';
    card.dataset.galleryIndex = String(index);
    card.setAttribute('aria-label', `${item.title}. ${getUiText('openInLightbox', 'Öppna i stor bild.')}`);

    const figure = document.createElement('figure');
    figure.className = 'work-image';
    figure.dataset.fallback = `${getUiText('missingImage', 'Kunde inte ladda')} ${item.src}`;

    const image = document.createElement('img');
    image.className = 'artwork-photo';
    const previewSrc = getArtworkPreviewSrc(item);
    image.src = addRevToSrc(previewSrc);
    image.dataset.fullSrc = item.src;
    image.alt = item.alt;
    image.style.objectPosition = item.objectPosition;
    image.style.setProperty('--hover-scale', String((item.zoom > 1 ? item.zoom : 1) + 0.03));
    image.decoding = 'async';
    const eagerLimit = pageType === 'home' ? 8 : 12;
    if (index < eagerLimit) {
      image.loading = 'eager';
      image.fetchPriority = 'high';
    } else {
      image.loading = 'lazy';
      image.fetchPriority = 'auto';
    }

    if (previewSrc !== item.src) {
      let retriedWithFull = false;
      image.addEventListener('load', () => {
        if (!retriedWithFull && isLikelyBlackPreview(image)) {
          retriedWithFull = true;
          image.src = addRevToSrc(item.src);
        }
      });
      image.addEventListener('error', () => {
        if (retriedWithFull) {
          return;
        }
        retriedWithFull = true;
        image.dataset.suppressErrorFallback = '1';
        window.setTimeout(() => {
          delete image.dataset.suppressErrorFallback;
        }, 0);
        image.src = addRevToSrc(item.src);
      });
    }

    addImageFallback(image);

    figure.appendChild(image);

    const meta = document.createElement('div');
    meta.className = 'work-meta';

    const title = document.createElement('h3');
    title.textContent = item.title;

    const metaLine = document.createElement('p');
    const categoryLabel = getCategoryLabel(item.category);
    const formatLabel = typeof item.format === 'string' ? item.format.trim() : '';
    const yearLabel = item.year ? String(item.year) : '';
    const metaParts = [formatLabel, categoryLabel, yearLabel].filter((part) => typeof part === 'string' && part.trim() !== '');
    metaLine.textContent = metaParts.join(' · ');

    meta.append(title, metaLine);
    card.append(figure, meta);

    card.addEventListener('click', () => openLightbox(index, card));

    fragment.appendChild(card);
  });

  grid.innerHTML = '';
  grid.appendChild(fragment);
};

const renderGalleryControls = () => {
  const container = document.getElementById('gallery-controls');
  if (!container) {
    return;
  }

  if (pageType !== 'gallery') {
    container.hidden = true;
    container.innerHTML = '';
    return;
  }
  container.hidden = false;

  const categories = ['all', ...new Set(galleryState.baseItems.map((item) => item.category))];
  const sortOptions =
    content.gallery && Array.isArray(content.gallery.sortOptions) && content.gallery.sortOptions.length > 0
      ? content.gallery.sortOptions
      : DEFAULT_CONTENT.gallery.sortOptions;
  const availableSortValues = new Set(sortOptions.map((option) => String(option.value || '').trim()).filter(Boolean));
  if (!availableSortValues.has(galleryState.activeSort)) {
    galleryState.activeSort = availableSortValues.has('newest') ? 'newest' : sortOptions[0].value;
  }

  const filterButtons = categories
    .map((category) => {
      const isActive = category === galleryState.activeCategory;
      return `<button type="button" class="filter-chip${isActive ? ' is-active' : ''}" data-category="${category}">${getCategoryLabel(category)}</button>`;
    })
    .join('');

  const sortOptionMarkup = sortOptions
    .map((option) => {
      const selected = option.value === galleryState.activeSort ? 'selected' : '';
      return `<option value="${option.value}" ${selected}>${option.label}</option>`;
    })
    .join('');

  container.innerHTML = `
    <div class="filter-group" role="group" aria-label="${getUiText('categoryFilterAria', 'Kategorifilter')}">
      ${filterButtons}
    </div>
    <label class="sort-control">
      <span>${getUiText('sortLabel', 'Sortera')}</span>
      <select id="gallery-sort-select">${sortOptionMarkup}</select>
    </label>
  `;

  container.querySelectorAll('.filter-chip').forEach((button) => {
    button.addEventListener('click', () => {
      const category = button.getAttribute('data-category') || 'all';
      galleryState.activeCategory = category;
      applyGalleryFilterAndSort();
      renderGalleryControls();
      renderGallery();
    });
  });

  const sortSelect = document.getElementById('gallery-sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      galleryState.activeSort = sortSelect.value;
      applyGalleryFilterAndSort();
      renderGallery();
    });
  }
};

const renderContact = () => {
  const emailLink = document.getElementById('contact-email-link');
  const socialLinksWrap = document.getElementById('contact-social-links');
  const contact = content.contact || {};

  if (emailLink) {
    const email = typeof contact.email === 'string' ? contact.email.trim() : '';
    const emailPublic = contact.emailPublic !== false;
    if (email && emailPublic) {
      emailLink.href = `mailto:${email}`;
      emailLink.textContent = contact.emailLabel || getUiText('emailButtonFallback', 'Skicka e-post');
      emailLink.hidden = false;
    } else {
      emailLink.hidden = true;
    }
  }

  if (socialLinksWrap) {
    const fromArray = Array.isArray(contact.socialLinks)
      ? contact.socialLinks.filter((item) => item && item.label && item.url)
      : [];
    const legacy = [];
    if (contact.instagramUrl) {
      legacy.push({ label: 'Instagram', url: contact.instagramUrl });
    }
    if (contact.facebookUrl) {
      legacy.push({ label: 'Facebook', url: contact.facebookUrl });
    }
    const links = fromArray.length > 0 ? fromArray : legacy;

    socialLinksWrap.innerHTML = '';
    links.forEach((item) => {
      const anchor = document.createElement('a');
      anchor.className = 'btn btn-ghost';
      anchor.href = item.url;
      anchor.target = '_blank';
      anchor.rel = 'noreferrer';
      anchor.textContent = item.label;
      socialLinksWrap.appendChild(anchor);
    });
    socialLinksWrap.hidden = links.length === 0;
  }
};

const setContactFormStatus = (message, kind = 'info') => {
  const statusNode = document.getElementById('contact-form-status');
  if (!statusNode) {
    return;
  }
  statusNode.textContent = message;
  statusNode.dataset.kind = kind;
};

const initContactForm = () => {
  const form = document.getElementById('contact-form');
  if (!form) {
    return;
  }

  const contactConfig = content.contact && typeof content.contact === 'object' ? content.contact : {};
  const formConfig = contactConfig.form && typeof contactConfig.form === 'object' ? contactConfig.form : {};
  if (formConfig.enabled === false) {
    form.hidden = true;
    return;
  }
  form.hidden = false;

  const formMountedAt = Date.now();
  let isSubmitting = false;
  const turnstileSiteKey = typeof formConfig.turnstileSiteKey === 'string' ? formConfig.turnstileSiteKey.trim() : '';
  const turnstileField = form.querySelector('input[name="turnstileToken"]');
  const turnstileHost = document.getElementById('contact-turnstile-widget');

  const setTurnstileToken = (token = '') => {
    if (turnstileField) {
      turnstileField.value = token;
    }
  };

  const resetTurnstile = () => {
    setTurnstileToken('');
    if (!turnstileSiteKey) {
      return;
    }
    if (window.turnstile && contactTurnstileWidgetId !== null) {
      try {
        window.turnstile.reset(contactTurnstileWidgetId);
      } catch (error) {
        // Ignore Turnstile reset errors and continue.
      }
    }
  };

  if (turnstileHost) {
    turnstileHost.hidden = true;
  }
  setTurnstileToken('');

  if (turnstileSiteKey !== '' && turnstileHost) {
    loadTurnstileScript()
      .then((turnstile) => {
        turnstileHost.hidden = false;
        contactTurnstileWidgetId = turnstile.render(turnstileHost, {
          sitekey: turnstileSiteKey,
          callback: (token) => {
            setTurnstileToken(typeof token === 'string' ? token : '');
          },
          'expired-callback': () => {
            setTurnstileToken('');
          },
          'error-callback': () => {
            setTurnstileToken('');
            setContactFormStatus(getUiText('captchaVerifyError', 'Captcha kunde inte verifieras. Försök igen.'), 'error');
          }
        });
      })
      .catch(() => {
        setContactFormStatus(
          getUiText('captchaLoadError', 'Captcha kunde inte laddas. Ladda om sidan och försök igen.'),
          'error'
        );
      });
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }

    const formData = new FormData(form);
    const payload = {
      name: String(formData.get('name') || '').trim(),
      email: String(formData.get('email') || '').trim(),
      message: String(formData.get('message') || '').trim(),
      website: String(formData.get('website') || '').trim(),
      turnstileToken: String(formData.get('turnstileToken') || '').trim(),
      elapsedMs: Date.now() - formMountedAt
    };

    if (payload.elapsedMs < CONTACT_FORM_MIN_DELAY_MS) {
      setContactFormStatus(getUiText('formSlowDown', 'Vänta en kort stund innan du skickar formuläret.'), 'error');
      return;
    }
    if (turnstileSiteKey !== '' && payload.turnstileToken === '') {
      setContactFormStatus(getUiText('formCaptchaRequired', 'Verifiera captcha innan du skickar formuläret.'), 'error');
      return;
    }

    isSubmitting = true;
    setContactFormStatus(getUiText('formSending', 'Skickar meddelande...'), 'info');

    try {
      const response = await fetch(`api/contact.php?v=${ASSET_REV}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      let result = null;
      try {
        result = await response.json();
      } catch (error) {
        result = null;
      }

      if (!response.ok || !result || result.ok !== true) {
        const message =
          result && typeof result.message === 'string' && result.message.trim() !== ''
            ? result.message.trim()
            : getUiText('formSendFailed', 'Kunde inte skicka meddelandet. Försök igen.');
        setContactFormStatus(message, 'error');
        return;
      }

      setContactFormStatus(result.message || getUiText('formSendSuccess', 'Tack, ditt meddelande är skickat.'), 'success');
      form.reset();
      setTurnstileToken('');
    } catch (error) {
      setContactFormStatus(getUiText('formNetworkError', 'Nätverksfel. Försök igen om en stund.'), 'error');
    } finally {
      if (turnstileSiteKey !== '') {
        resetTurnstile();
      }
      isSubmitting = false;
    }
  });
};

const initMenu = () => {
  if (!menuButton || !nav) {
    return;
  }

  menuButton.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
    });
  });
};

const initReveal = () => {
  const revealItems = document.querySelectorAll('.reveal');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    },
    // Use a low threshold so very tall sections (e.g. the mobile gallery) still reveal.
    { threshold: 0 }
  );

  revealItems.forEach((item) => observer.observe(item));
};

const normalizePathForCompare = (path) => {
  if (typeof path !== 'string') {
    return '/';
  }
  const normalized = path.replace(/\/+$/, '');
  return normalized === '' ? '/' : normalized;
};

const getAnchorFromHref = (href) => {
  if (typeof href !== 'string' || href.trim() === '') {
    return '';
  }

  if (href.startsWith('#')) {
    return href;
  }

  try {
    return new URL(href, window.location.href).hash || '';
  } catch (error) {
    return '';
  }
};

const scrollToElementWithHeaderOffset = (element, behavior = 'smooth') => {
  if (!element) {
    return;
  }
  const header = document.querySelector('.site-header');
  const headerOffset = header ? header.getBoundingClientRect().height + 8 : 0;
  const top = window.scrollY + element.getBoundingClientRect().top - headerOffset;
  window.scrollTo({ top: Math.max(top, 0), behavior });
};

const initHashLinkNavigation = () => {
  document.querySelectorAll('a[href*="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') {
        return;
      }

      let targetUrl;
      try {
        targetUrl = new URL(href, window.location.href);
      } catch (error) {
        return;
      }

      if (!targetUrl.hash) {
        return;
      }

      const targetPath = normalizePathForCompare(targetUrl.pathname);
      const currentPath = normalizePathForCompare(window.location.pathname);
      if (targetPath !== currentPath) {
        return;
      }

      const targetId = decodeURIComponent(targetUrl.hash.slice(1));
      const target = document.getElementById(targetId);
      if (!target) {
        return;
      }

      event.preventDefault();
      if (targetId === 'top' || targetId === 'page-top') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        scrollToElementWithHeaderOffset(target, 'smooth');
      }
      if (window.location.hash !== `#${targetId}`) {
        window.history.replaceState(null, '', `#${targetId}`);
      }
    });
  });
};

const initActiveSectionHighlight = () => {
  const sections = [...document.querySelectorAll('main section[id]')];
  if (sections.length === 0) {
    return;
  }

  const onScroll = () => {
    const marker = window.scrollY + 140;
    let current = sections[0].id;

    sections.forEach((section) => {
      if (section.offsetTop <= marker) {
        current = section.id;
      }
    });

    navLinks.forEach((link) => {
      const href = link.getAttribute('href') || '';
      const anchor = getAnchorFromHref(href);
      const active = anchor === `#${current}`;
      link.classList.toggle('active', active);
      if (active) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
};

const initScrollTop = () => {
  document.querySelectorAll('[data-scroll-top]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
};

const initStudioAuth = () => {
  const studioLink = document.getElementById('studio-footer-link');
  const legacyAuthButton = document.getElementById('studio-auth-btn');
  if (!studioLink && !legacyAuthButton) {
    return;
  }

  // Prefer the single Studio link. If older markup still includes the old button, remove it.
  if (studioLink && legacyAuthButton) {
    legacyAuthButton.remove();
  }

  const control = studioLink || legacyAuthButton;
  if (!control) {
    return;
  }

  const targetHref =
    studioLink && typeof studioLink.getAttribute === 'function' && (studioLink.getAttribute('href') || '').trim() !== ''
      ? studioLink.getAttribute('href')
      : '/studio.html';

  const studioAccess = content.studioAccess && typeof content.studioAccess === 'object' ? content.studioAccess : {};
  const mode = studioAccess.mode || 'local-password';
  const password = studioAccess.password || '';

  if (mode === 'server-auth' || mode === 'secure-auth') {
    control.hidden = false;
    control.textContent = 'Studio';
    if (control.tagName !== 'A') {
      control.addEventListener('click', () => {
        window.location.href = targetHref;
      });
    } else if ((control.getAttribute('href') || '').trim() === '') {
      control.setAttribute('href', targetHref);
    }
    return;
  }

  // Legacy local-password mode: allow unlocking via a password prompt, but keep one single "Studio" control.
  control.hidden = false;
  control.textContent = 'Studio';
  control.addEventListener('click', (event) => {
    if (!password) {
      event.preventDefault();
      alert(getUiText('studioPasswordMissing', 'Studio-lösenord saknas i content.js'));
      return;
    }

    const unlocked = window.localStorage.getItem(STUDIO_AUTH_KEY) === '1';
    if (unlocked) {
      // Already unlocked, just go to Studio.
      if (control.tagName !== 'A') {
        event.preventDefault();
        window.location.href = targetHref;
      }
      return;
    }

    event.preventDefault();
    const attempt = window.prompt(getUiText('studioPasswordPrompt', 'Ange Studio-lösenord:'));
    if (attempt === null) {
      return;
    }
    if (attempt === password) {
      window.localStorage.setItem(STUDIO_AUTH_KEY, '1');
      window.location.href = targetHref;
    } else {
      alert(getUiText('studioPasswordWrong', 'Fel lösenord.'));
    }
  });
};

const initAnalytics = () => {
  const analytics = content.analytics && typeof content.analytics === 'object' ? content.analytics : {};
  const measurementId = typeof analytics.gaMeasurementId === 'string' ? analytics.gaMeasurementId.trim().toUpperCase() : '';
  if (!/^G-[A-Z0-9]+$/.test(measurementId)) {
    return;
  }

  if (pageType === 'studio' && analytics.trackStudio !== true) {
    return;
  }

  if (window.__olaGaInitialized === measurementId) {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag() {
      window.dataLayer.push(arguments);
    };

  if (!document.querySelector(`script[data-ga-loader="${measurementId}"]`)) {
    const loader = document.createElement('script');
    loader.async = true;
    loader.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    loader.dataset.gaLoader = measurementId;
    document.head.appendChild(loader);
  }

  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    anonymize_ip: analytics.anonymizeIp !== false
  });
  window.__olaGaInitialized = measurementId;
};

const warmImageCache = () => {
  const srcSet = new Set();
  const hero = content.hero || {};
  if (hero.image) {
    srcSet.add(hero.image);
  }
  if (Array.isArray(hero.slides)) {
    hero.slides
      .filter((slide) => slide && slide.src)
      .slice(0, 4)
      .forEach((slide) => srcSet.add(slide.src));
  }

  const eagerCount = pageType === 'home' ? 8 : 10;
  galleryState.allItems.slice(0, eagerCount).forEach((item) => {
    const previewSrc = getArtworkPreviewSrc(item);
    if (previewSrc) {
      srcSet.add(previewSrc);
    }
  });

  Array.from(srcSet).forEach((src, index) => {
    const img = new Image();
    img.decoding = 'async';
    img.loading = 'eager';
    if (index < 4) {
      img.fetchPriority = 'high';
    }
    img.src = addRevToSrc(src);
    warmCacheRefs.push(img);
  });
};

const clearLegacyCaches = async () => {
  if (!('caches' in window)) {
    return;
  }

  try {
    const keys = await window.caches.keys();
    await Promise.all(
      keys
        .filter((key) => key.startsWith('core-ola-portfolio-') || key.startsWith('asset-ola-portfolio-'))
        .map((key) => window.caches.delete(key))
    );
  } catch (error) {
    // ignore cache cleanup errors
  }
};

const disableLegacyServiceWorkers = async () => {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  try {
    const regs = await navigator.serviceWorker.getRegistrations();
    await Promise.all(regs.map((reg) => reg.unregister()));
  } catch (error) {
    // ignore unregister errors
  }
};

const cleanupLegacyCachingOnce = async () => {
  try {
    if (window.sessionStorage.getItem(LEGACY_CACHE_CLEANUP_KEY) === '1') {
      return;
    }
    window.sessionStorage.setItem(LEGACY_CACHE_CLEANUP_KEY, '1');
  } catch (error) {
    // continue without session marker
  }

  await disableLegacyServiceWorkers();
  await clearLegacyCaches();
};

const updateLightboxView = () => {
  const { elements, items, currentIndex } = lightboxState;
  if (!elements || items.length === 0 || !items[currentIndex]) {
    return;
  }

  const item = items[currentIndex];
  elements.image.src = addRevToSrc(item.src);
  elements.image.alt = item.alt;
  const title = typeof item.title === 'string' && item.title.trim() !== '' ? item.title.trim() : getUiText('slideLabel', 'Bild');
  const captionParts = [];
  const formatLabel = typeof item.format === 'string' ? item.format.trim() : '';
  if (formatLabel) {
    captionParts.push(formatLabel);
  }
  if (item.year) {
    captionParts.push(String(item.year));
  }
  if (captionParts.length === 0 && typeof item.category === 'string' && item.category.trim() !== '') {
    captionParts.push(getCategoryLabel(item.category));
  }

  const explicitCaption = typeof item.caption === 'string' ? item.caption.trim() : '';
  elements.captionText.textContent = explicitCaption || (captionParts.length > 0 ? `${title} · ${captionParts.join(' · ')}` : title);

  let shareUrl = '';
  if (typeof item.shareUrl === 'string' && item.shareUrl.trim() !== '') {
    shareUrl = item.shareUrl.trim();
  } else if (item.disableShareActions !== true && typeof item.slug === 'string' && item.slug.trim() !== '') {
    shareUrl = buildArtworkPageUrl(item);
  }

  const showShareActions = shareUrl !== '';
  elements.openArtwork.hidden = !showShareActions;
  elements.copyLink.hidden = !showShareActions;
  if (showShareActions) {
    elements.openArtwork.href = shareUrl;
    elements.copyLink.setAttribute('data-copy-link', shareUrl);
  } else {
    elements.openArtwork.removeAttribute('href');
    elements.copyLink.removeAttribute('data-copy-link');
  }
  if (elements.copyStatus) {
    elements.copyStatus.textContent = '';
  }
};

const openLightboxWithItems = (items, index, triggerEl) => {
  const { elements } = lightboxState;
  if (!elements || !Array.isArray(items) || items.length === 0) {
    return;
  }

  const boundedIndex = Number.isFinite(index) ? Math.max(0, Math.min(items.length - 1, Number(index))) : 0;
  lightboxState.items = items.slice();
  lightboxState.currentIndex = boundedIndex;
  lightboxState.lastFocused = triggerEl || null;

  updateLightboxView();
  elements.wrap.classList.add('is-open');
  elements.wrap.setAttribute('aria-hidden', 'false');
  document.body.classList.add('no-scroll');
  elements.close.focus();
};

const openLightbox = (index, triggerEl) => {
  openLightboxWithItems(galleryState.filteredItems, index, triggerEl);
};

const closeLightbox = () => {
  const { elements, lastFocused } = lightboxState;
  if (!elements) {
    return;
  }

  elements.wrap.classList.remove('is-open');
  elements.wrap.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('no-scroll');

  if (lastFocused && typeof lastFocused.focus === 'function') {
    lastFocused.focus();
  }
};

const nextLightbox = () => {
  if (lightboxState.items.length === 0) {
    return;
  }

  lightboxState.currentIndex = (lightboxState.currentIndex + 1) % lightboxState.items.length;
  updateLightboxView();
};

const prevLightbox = () => {
  if (lightboxState.items.length === 0) {
    return;
  }

  lightboxState.currentIndex = (lightboxState.currentIndex - 1 + lightboxState.items.length) % lightboxState.items.length;
  updateLightboxView();
};

const initLightbox = () => {
  const wrap = document.getElementById('lightbox');
  const image = document.getElementById('lightbox-image');
  const captionText = document.getElementById('lightbox-caption-text');
  const openArtwork = document.getElementById('lightbox-open-artwork');
  const copyLink = document.getElementById('lightbox-copy-artwork-link');
  const copyStatus = document.getElementById('lightbox-copy-status');
  const close = document.getElementById('lightbox-close');
  const prev = document.getElementById('lightbox-prev');
  const next = document.getElementById('lightbox-next');

  if (!wrap || !image || !captionText || !openArtwork || !copyLink || !close || !prev || !next) {
    return;
  }

  lightboxState.elements = { wrap, image, captionText, openArtwork, copyLink, copyStatus, close, prev, next };

  close.addEventListener('click', closeLightbox);
  prev.addEventListener('click', prevLightbox);
  next.addEventListener('click', nextLightbox);

  wrap.addEventListener('click', (event) => {
    if (event.target === wrap) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (!wrap.classList.contains('is-open')) {
      return;
    }

    if (event.key === 'Escape') {
      closeLightbox();
    } else if (event.key === 'ArrowRight') {
      nextLightbox();
    } else if (event.key === 'ArrowLeft') {
      prevLightbox();
    }
  });
};

const initializeGallery = async () => {
  const manualItems = buildManualGalleryItems();
  galleryState.allItems = manualItems;
  galleryState.baseItems = getBaseItemsForPage();
  applyGalleryFilterAndSort();
  renderGalleryControls();
  renderGallery();
  warmImageCache();

  const autoConfig = content.gallery && content.gallery.autoDiscover;
  if (!autoConfig || !autoConfig.enabled) {
    return;
  }

  autoDiscoverArtworks(manualItems)
    .then((discovered) => {
      if (!Array.isArray(discovered) || discovered.length === 0) {
        return;
      }

      galleryState.allItems = [...manualItems, ...discovered]
        .map((item, index) => normalizeArtwork(item, index))
        .sort((a, b) => a.order - b.order);
      galleryState.baseItems = getBaseItemsForPage();
      applyGalleryFilterAndSort();
      renderGalleryControls();
      renderGallery();
      warmImageCache();
    })
    .catch(() => {});
};

const bootstrap = async () => {
  await cleanupLegacyCachingOnce();

  bindTextContent();
  bindAttributeContent();
  bindSiteMeta();
  applyTheme();
  applyColorMode();
  initLanguageSwitcher();
  initColorModeSwitcher();
  renderHeroImage();
  renderHeroOverlay();
  renderAboutPortrait();
  renderAboutMaterialImage();
  renderFeatureImage();
  renderAboutParagraphs();
  renderAmbitions();
  renderRecognition();
  renderSunProject();
  renderContact();
  initContactForm();

  initMenu();
  initHashLinkNavigation();
  initReveal();
  initActiveSectionHighlight();
  initScrollTop();
  initStudioAuth();
  initAnalytics();
  initCopyLinkButtons();
  initLightbox();

  await initializeGallery();
};

const rehydrateHeroAfterPageRestore = () => {
  if (!content.hero || content.hero.mode !== 'slideshow') {
    return;
  }
  renderHeroImage();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    bootstrap().catch(() => {
      const grid = document.getElementById('gallery-grid');
      if (grid) {
        grid.innerHTML = `<p class="gallery-empty">${getUiText(
          'galleryLoadError',
          'Något gick fel vid inläsning av galleriet.'
        )}</p>`;
      }
    });
  });
} else {
  bootstrap().catch(() => {
    const grid = document.getElementById('gallery-grid');
    if (grid) {
      grid.innerHTML = `<p class="gallery-empty">${getUiText(
        'galleryLoadError',
        'Något gick fel vid inläsning av galleriet.'
      )}</p>`;
    }
  });
}

window.addEventListener('pageshow', rehydrateHeroAfterPageRestore);
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    rehydrateHeroAfterPageRestore();
  }
});
