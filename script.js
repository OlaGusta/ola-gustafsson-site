document.documentElement.classList.add('js-enabled');

const activateDeferredStylesheets = () => {
  document.querySelectorAll('link[data-deferred-stylesheet]').forEach((node) => {
    if (!(node instanceof HTMLLinkElement)) {
      return;
    }
    if (node.media === 'all') {
      return;
    }
    node.media = 'all';
  });
};

activateDeferredStylesheets();

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
    headerBackground: '#f3efe6',
    footerBackground: '#f3efe6',
    headerOpacity: 84,
    buttonGradientStart: '#123a62',
    buttonGradientEnd: '#b98c56',
    fontDisplay: 'fraunces',
    fontBody: 'jakarta',
    fontDisplayWeight: 700,
    fontBodyWeight: 400,
    fontDisplayStyle: 'normal',
    fontBodyStyle: 'normal'
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
    autoSlides: {
      enabled: false,
      count: 4,
      periodDays: 7,
      landscapeOnly: true,
      excludeSrcs: [],
      seedNonce: ''
    },
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
    trackStudio: false,
    allowedHosts: ['olagustafsson.com', 'www.olagustafsson.com']
  },
  gallery: {
    heading: 'Galleri',
    pageHeading: 'Hela galleriet',
    subheading: '',
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
    formNetworkError: 'Nätverksfel. Försök igen om en stund.',
    availabilityLabel: 'Status',
    availabilityAvailable: 'Tillgänglig',
    availabilityReserved: 'Reserverad',
    availabilitySold: 'Såld',
    availabilityNfs: 'Ej till salu',
    priceLabel: 'Pris',
    collectorNoteLabel: 'För samlare',
    inquiryArtworkLink: 'Intresserad av verket',
    inquirySimilarLink: 'Fråga om liknande verk',
    inquiryEyebrow: 'Intresseanmälan',
    inquiryHeading: 'Fråga om detta verk',
    inquiryHeadingSimilar: 'Fråga om liknande verk',
    inquiryBodyAvailable:
      'Skriv gärna om du vill veta mer, reservera verket eller få fler bilder innan beslut.',
    inquiryBodySimilar:
      'Det här verket är inte tillgängligt just nu, men du kan gärna fråga om liknande verk eller kommande målningar.',
    inquiryNameLabel: 'Namn',
    inquiryEmailLabel: 'E-post',
    inquiryMessageLabel: 'Meddelande',
    inquiryMessagePlaceholder:
      'Berätta gärna vad du vill veta mer om: pris, frakt, inramning eller om du vill boka verket.',
    inquirySubmit: 'Skicka förfrågan',
    inquirySubmitSimilar: 'Skicka förfrågan om liknande verk',
    inquirySuccess: 'Tack, din förfrågan är skickad.',
    artworkWatermark: {
      enabled: false,
      text: '',
      opacity: 18
    },
    inquiryFallbackStatus: 'Verksförfrågan kunde inte skickas. Försök igen.',
    inquiryPrefillAvailable:
      'Hej! Jag är intresserad av "{title}" och vill gärna veta mer om verket.',
    inquiryPrefillSimilar:
      'Hej! Jag såg att "{title}" inte längre är tillgänglig. Jag är gärna intresserad av liknande verk.'
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
  plexmono: '"IBM Plex Mono", "SFMono-Regular", Consolas, "Liberation Mono", monospace',
  sourcesans: '"Source Sans 3", "Segoe UI", sans-serif',
  lora: '"Lora", "Avenir Next", serif',
  avenir: '"Avenir Next", "Segoe UI", sans-serif',
  system: 'system-ui, -apple-system, "Segoe UI", sans-serif',
  helvetica: '"Helvetica Neue", Helvetica, Arial, sans-serif'
};

const FONT_WEIGHT_VALUES = [300, 400, 500, 600, 700, 800];
const FONT_STYLE_VALUES = ['normal', 'italic'];

const STORAGE_KEY = 'olaPortfolioOverridesV1';
const LANGUAGE_STORAGE_KEY = 'olaSiteLanguageV1';
const SUPPORTED_LANGUAGES = ['sv', 'en'];
const COLOR_MODE_STORAGE_KEY = 'olaSiteColorModeV1';
const SUPPORTED_COLOR_MODES = ['light', 'dark'];
const STUDIO_AUTH_KEY = 'olaStudioUnlockedV1';
const ASSET_REV = '20260317-07';
const LEGACY_CACHE_CLEANUP_KEY = 'olaLegacyCleanupDoneV1';
const CONTACT_FORM_MIN_DELAY_MS = 3000;
const TURNSTILE_SCRIPT_ID = 'cf-turnstile-script';
const HERO_ROTATION_TIMEZONE = 'Europe/Stockholm';
const FAVICON_THEME_REV = '20260317-14';
const FAVICON_THEME_ASSETS = {
  light: {
    png: `/favicon-light-32x32.png?v=${FAVICON_THEME_REV}`,
    ico: `/favicon-light.ico?v=${FAVICON_THEME_REV}`
  },
  dark: {
    png: `/favicon-dark-32x32.png?v=${FAVICON_THEME_REV}`,
    ico: `/favicon-dark.ico?v=${FAVICON_THEME_REV}`
  }
};

let contactTurnstileReadyPromise = null;
let contactTurnstileWidgetId = null;
let artworkInquiryTurnstileWidgetId = null;

const normalizePercentageValue = (value) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return null;
  }
  return Math.max(0, Math.min(100, numeric));
};

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

const resolveBrowserColorMode = () => {
  try {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  } catch (error) {
    // ignore media query errors
  }
  return 'light';
};

const updateFaviconForColorMode = () => {
  const mode = resolveBrowserColorMode();
  const iconSet = FAVICON_THEME_ASSETS[mode];
  if (!iconSet) {
    return;
  }

  const pngLink = document.getElementById('favicon-png');
  if (pngLink) {
    pngLink.setAttribute('href', iconSet.png);
  }

  const icoLink = document.getElementById('favicon-ico');
  if (icoLink) {
    icoLink.setAttribute('href', iconSet.ico);
  }
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
  const fileBySrc = new Map(
    fileArtworks
      .filter((item) => item && typeof item.src === 'string')
      .map((item) => [item.src.trim(), item])
  );

  storedGallery.artworks = storedArtworks.map((item) => {
    if (!item || typeof item !== 'object') {
      return item;
    }

    const src = typeof item.src === 'string' ? item.src.trim() : '';
    const fileItem = src ? fileBySrc.get(src) : null;
    if (!fileItem) {
      return item;
    }

    const merged = deepMerge(deepMerge({}, fileItem), item);
    ['availability', 'priceLabel', 'collectorNote'].forEach((field) => {
      const mergedValue = typeof merged[field] === 'string' ? merged[field].trim() : merged[field];
      const fileValue = typeof fileItem[field] === 'string' ? fileItem[field].trim() : fileItem[field];
      if ((mergedValue === '' || mergedValue === null || typeof mergedValue === 'undefined') && fileValue) {
        merged[field] = fileItem[field];
      }
    });
    return merged;
  });

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
const DEFAULT_ANALYTICS_ALLOWED_HOSTS = ['olagustafsson.com', 'www.olagustafsson.com'];
const isLocalPreviewHost = (() => {
  const protocol = String(window.location.protocol || '').toLowerCase();
  if (protocol === 'file:') {
    return true;
  }

  const hostname = String(window.location.hostname || '').toLowerCase();
  return hostname === '127.0.0.1' || hostname === 'localhost' || hostname === '::1' || hostname === '[::1]';
})();
const colorModeEnabled = pageType !== 'studio';
const storedContent =
  pageType === 'studio' || isLocalPreviewHost ? migrateStoredContent(loadStoredContent(), publishedContent) : null;
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

const isLocalStaticPreviewHost = () => isLocalPreviewHost;

const shouldUseLocalArtworkPreviewRoutes = () => {
  if (!isLocalStaticPreviewHost()) {
    return false;
  }

  const path = String(window.location.pathname || '').toLowerCase();
  return path.endsWith('.html') || pageType === 'artwork-preview';
};

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
const heroOrientationCache = new Map();
let heroRenderSequence = 0;

const warmCacheRefs = [];
let warmImageCacheQueued = false;
let warmImageCacheComplete = false;
const localDirectoryListingCache = new Map();

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

const appendInlineFormattedText = (fragment, value) => {
  const input = String(value || '');
  const formatPattern = /<(i|em|n|normal)>([\s\S]*?)<\/\1>/gi;
  let lastIndex = 0;
  let match;

  while ((match = formatPattern.exec(input)) !== null) {
    const [fullMatch, tagName, innerText] = match;
    if (match.index > lastIndex) {
      fragment.appendChild(document.createTextNode(input.slice(lastIndex, match.index)));
    }

    const normalizedTagName = tagName.toLowerCase();
    const marker = document.createElement(normalizedTagName === 'em' ? 'em' : normalizedTagName === 'i' ? 'i' : 'span');
    marker.className = normalizedTagName === 'n' || normalizedTagName === 'normal' ? 'inline-normal' : 'inline-italic';
    marker.textContent = innerText;
    fragment.appendChild(marker);
    lastIndex = match.index + fullMatch.length;
  }

  if (lastIndex < input.length) {
    fragment.appendChild(document.createTextNode(input.slice(lastIndex)));
  }
};

const buildInlineFormattedFragment = (value) => {
  const fragment = document.createDocumentFragment();
  appendInlineFormattedText(fragment, value);
  return fragment;
};

const buildInlineFormattedHtml = (value) => {
  const container = document.createElement('span');
  container.appendChild(buildInlineFormattedFragment(value));
  return container.innerHTML;
};

const buildLinkedTextFragment = (value) => {
  const fragment = document.createDocumentFragment();
  const input = String(value || '');
  const linkPattern = /\[([^\]]+)\]\s*\((https?:\/\/[^\s)]+)\)/g;
  let lastIndex = 0;
  let match;

  while ((match = linkPattern.exec(input)) !== null) {
    const [fullMatch, label, href] = match;
    if (match.index > lastIndex) {
      appendInlineFormattedText(fragment, input.slice(lastIndex, match.index));
    }

    let safeHref = '';
    try {
      const url = new URL(href);
      if (url.protocol === 'http:' || url.protocol === 'https:') {
        safeHref = url.href;
      }
    } catch (error) {
      safeHref = '';
    }

    if (safeHref && label.trim() !== '') {
      const link = document.createElement('a');
      link.href = safeHref;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = label.trim();
      fragment.appendChild(link);
    } else {
      fragment.appendChild(document.createTextNode(fullMatch));
    }

    lastIndex = match.index + fullMatch.length;
  }

  if (lastIndex < input.length) {
    appendInlineFormattedText(fragment, input.slice(lastIndex));
  }

  return fragment;
};

const DARK_THEME_OVERRIDES = {
  '--color-ink': '#e7edf8',
  '--color-soft-ink': '#b7c2d8',
  '--color-bg': '#0f141d',
  '--color-surface': '#161d28',
  '--color-border': 'rgba(224, 233, 247, 0.18)',
  '--color-primary': '#7ea9dc',
  '--color-primary-soft': '#21364f',
  '--color-accent': '#d0ab77',
  '--color-header-bg': '#0f141d',
  '--color-footer-bg': '#0f141d',
  '--shadow-sm': '0 14px 28px rgba(0, 0, 0, 0.28)',
  '--shadow-md': '0 26px 62px rgba(0, 0, 0, 0.44)'
};

const bindTextContent = () => {
  document.querySelectorAll('[data-bind]').forEach((node) => {
    const key = node.getAttribute('data-bind');
    const value = getBoundString(key);
    if (value !== '') {
      node.textContent = '';
      node.appendChild(buildInlineFormattedFragment(value));
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

  document.querySelectorAll('[data-bind-placeholder]').forEach((node) => {
    const key = node.getAttribute('data-bind-placeholder');
    const value = getBoundString(key);
    if (value !== '') {
      node.setAttribute('placeholder', value);
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

  updateFaviconForColorMode();
};

const initSystemColorModeObserver = () => {
  if (!window.matchMedia) {
    updateFaviconForColorMode();
    return;
  }

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handleChange = (event) => {
    updateFaviconForColorMode();
    if (!colorModeEnabled) {
      return;
    }
    if (readStoredColorMode()) {
      return;
    }
    activeColorMode = event.matches ? 'dark' : 'light';
    applyColorMode();
  };

  if (typeof mediaQuery.addEventListener === 'function') {
    mediaQuery.addEventListener('change', handleChange);
  } else if (typeof mediaQuery.addListener === 'function') {
    mediaQuery.addListener(handleChange);
  }

  updateFaviconForColorMode();
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
    title = getBoundString('seo.gallery.title', `${galleryLabel} | ${brandTitle}`);
    description = getBoundString(
      'seo.gallery.description',
      isEnglish
        ? "Complete gallery of Ola Gustafsson's watercolor paintings."
        : 'Hela galleriet med akvareller av Ola Gustafsson.'
    );
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
  const overridesTheme =
    window.PORTFOLIO_OVERRIDES && typeof window.PORTFOLIO_OVERRIDES === 'object' && window.PORTFOLIO_OVERRIDES.theme
      ? window.PORTFOLIO_OVERRIDES.theme
      : {};
  const root = document.documentElement;
  const sharedHeaderFooterColor =
    (typeof theme.headerBackground === 'string' && theme.headerBackground.trim() !== ''
      ? theme.headerBackground
      : typeof theme.footerBackground === 'string' && theme.footerBackground.trim() !== ''
        ? theme.footerBackground
        : theme.background);

  const map = {
    '--color-bg': theme.background,
    '--color-surface': theme.surface,
    '--color-ink': theme.ink,
    '--color-soft-ink': theme.softInk,
    '--color-primary': theme.primary,
    '--color-accent': theme.accent,
    '--color-border': theme.border,
    '--color-header-bg': sharedHeaderFooterColor,
    '--color-footer-bg': sharedHeaderFooterColor
  };

  Object.entries(map).forEach(([cssVar, value]) => {
    if (typeof value === 'string' && value.trim() !== '') {
      root.style.setProperty(cssVar, value);
    }
  });

  const optionalThemeVarMap = {
    '--button-gradient-start':
      typeof overridesTheme.buttonGradientStart === 'string' && overridesTheme.buttonGradientStart.trim() !== ''
        ? overridesTheme.buttonGradientStart
        : typeof theme.buttonGradientStart === 'string' &&
            theme.buttonGradientStart.trim() !== '' &&
            theme.buttonGradientStart.trim().toLowerCase() !== DEFAULT_CONTENT.theme.buttonGradientStart.toLowerCase()
          ? theme.buttonGradientStart
        : theme.primary,
    '--button-gradient-end':
      typeof overridesTheme.buttonGradientEnd === 'string' && overridesTheme.buttonGradientEnd.trim() !== ''
        ? overridesTheme.buttonGradientEnd
        : typeof theme.buttonGradientEnd === 'string' &&
            theme.buttonGradientEnd.trim() !== '' &&
            theme.buttonGradientEnd.trim().toLowerCase() !== DEFAULT_CONTENT.theme.buttonGradientEnd.toLowerCase()
          ? theme.buttonGradientEnd
        : theme.accent
  };

  Object.entries(optionalThemeVarMap).forEach(([cssVar, value]) => {
    if (typeof value === 'string' && value.trim() !== '') {
      root.style.setProperty(cssVar, value);
    } else {
      root.style.removeProperty(cssVar);
    }
  });

  const headerOpacity = normalizePercentageValue(theme.headerOpacity);
  if (headerOpacity === null) {
    root.style.removeProperty('--header-bg-opacity');
  } else {
    root.style.setProperty('--header-bg-opacity', String(headerOpacity));
  }

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

  const displayStyle = FONT_STYLE_VALUES.includes(theme.fontDisplayStyle) ? theme.fontDisplayStyle : 'normal';
  const bodyStyle = FONT_STYLE_VALUES.includes(theme.fontBodyStyle) ? theme.fontBodyStyle : 'normal';
  root.style.setProperty('--font-display-style', displayStyle);
  root.style.setProperty('--font-body-style', bodyStyle);
};

const addImageFallback = (img) => {
  if (!(img instanceof HTMLImageElement)) {
    return;
  }

  img.addEventListener('error', () => {
    const fallbackSrcs = String(img.dataset.fallbackSrcs || '')
      .split('\n')
      .map((value) => value.trim())
      .filter(Boolean);
    if (fallbackSrcs.length > 0) {
      const currentIndex = Number(img.dataset.fallbackIndex || 0);
      const nextIndex = Number.isFinite(currentIndex) ? currentIndex + 1 : 1;
      const nextSrc = fallbackSrcs[nextIndex] || '';
      if (nextSrc) {
        img.dataset.fallbackIndex = String(nextIndex);
        img.src = addRevToSrc(nextSrc);
        return;
      }
    }

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
  const normalizedSrc = typeof src === 'string' ? src.trim() : '';
  const probeCandidates = isLocalPreviewHost
    ? [normalizedSrc]
    : getImageFallbackSources(normalizedSrc, { preferThumb: true });

  for (const candidate of probeCandidates) {
    if (!candidate) {
      continue;
    }

    try {
      const response = await fetch(candidate, { method: 'HEAD', cache: 'no-store' });
      if (response.ok) {
        return true;
      }
    } catch (error) {
      // try the next candidate
    }
  }

  return false;
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

const getBaseImageFileName = (src) => {
  if (typeof src !== 'string') {
    return '';
  }

  const trimmed = src.trim();
  if (
    !trimmed ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:') ||
    /^https?:\/\//i.test(trimmed) ||
    !trimmed.startsWith('images/')
  ) {
    return '';
  }

  const clean = trimmed.split('?')[0].split('#')[0];
  const fileName = (clean.split('/').pop() || '').replace(/-hero(?=\.[^.]+$)/i, '');
  if (!fileName) {
    return '';
  }

  return fileName;
};

const getImageVariantCandidateSrc = (src, variant) => {
  const normalizedVariant = typeof variant === 'string' ? variant.trim().replace(/^\/+|\/+$/g, '') : '';
  if (!normalizedVariant) {
    return '';
  }

  const fileName = getBaseImageFileName(src);
  if (!fileName) {
    return '';
  }

  return `images/${normalizedVariant}/${fileName}`;
};

const getThumbCandidateSrc = (src) => getImageVariantCandidateSrc(src, 'thumbs');

const getHeroCandidateSrc = (src) => {
  const fileName = getBaseImageFileName(src);
  if (!fileName) {
    return '';
  }

  const extensionIndex = fileName.lastIndexOf('.');
  if (extensionIndex <= 0) {
    return '';
  }

  const stem = fileName.slice(0, extensionIndex);
  const extension = fileName.slice(extensionIndex);
  return `images/web/${stem}-hero${extension}`;
};

const getWebCandidateSrc = (src) => getImageVariantCandidateSrc(src, 'web');

const getHeroResponsiveSources = (src) => {
  if (typeof src !== 'string') {
    return [];
  }

  const trimmed = src.trim();
  if (
    !trimmed ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:') ||
    /^https?:\/\//i.test(trimmed) ||
    !trimmed.startsWith('images/')
  ) {
    return [];
  }

  const seen = new Set();
  return [
    { src: getThumbCandidateSrc(trimmed), width: 900 },
    { src: getHeroCandidateSrc(trimmed), width: 1280 },
    { src: getWebCandidateSrc(trimmed), width: 1800 }
  ].filter((entry) => {
    if (!entry.src || seen.has(entry.src)) {
      return false;
    }
    seen.add(entry.src);
    return true;
  });
};

const getHeroDisplaySrc = (src) => {
  if (typeof src !== 'string') {
    return '';
  }

  const trimmed = src.trim();
  if (!trimmed) {
    return '';
  }

  if (
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:') ||
    /^https?:\/\//i.test(trimmed) ||
    !trimmed.startsWith('images/')
  ) {
    return trimmed;
  }

  const orderedCandidates = shouldUseStaticHeroOnMobile()
    ? [getHeroCandidateSrc(trimmed), getWebCandidateSrc(trimmed), getThumbCandidateSrc(trimmed), trimmed]
    : [getWebCandidateSrc(trimmed), getHeroCandidateSrc(trimmed), getThumbCandidateSrc(trimmed), trimmed];

  return orderedCandidates.find(Boolean) || trimmed;
};

const applyHeroImageSource = (image, src) => {
  if (!image || typeof src !== 'string' || src.trim() === '') {
    return;
  }

  const fallbackSrc = getHeroDisplaySrc(src);
  if (fallbackSrc) {
    image.src = addRevToSrc(fallbackSrc);
  }

  const responsiveSources = getHeroResponsiveSources(src);
  if (responsiveSources.length === 0) {
    image.removeAttribute('srcset');
    image.removeAttribute('sizes');
    return;
  }

  image.srcset = responsiveSources.map((entry) => `${addRevToSrc(entry.src)} ${entry.width}w`).join(', ');
  image.sizes = '100vw';
};

const getImageFallbackSources = (src, options = {}) => {
  if (typeof src !== 'string') {
    return [];
  }

  const trimmed = src.trim();
  if (!trimmed) {
    return [];
  }

  if (
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:') ||
    /^https?:\/\//i.test(trimmed) ||
    !trimmed.startsWith('images/')
  ) {
    return [trimmed];
  }

  if (trimmed.includes('/thumbs/') || trimmed.includes('/web/')) {
    return [trimmed];
  }

  if (isLocalPreviewHost) {
    return [trimmed];
  }

  const preferThumb = options && options.preferThumb === true;
  const orderedCandidates = preferThumb
    ? [getThumbCandidateSrc(trimmed), getWebCandidateSrc(trimmed), trimmed]
    : [getWebCandidateSrc(trimmed), getThumbCandidateSrc(trimmed), trimmed];

  return orderedCandidates.filter((value, index, array) => value && array.indexOf(value) === index);
};

const getDisplayImageSrc = (src, options = {}) => {
  return getImageFallbackSources(src, options)[0] || '';
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

const escapeHtml = (value) =>
  String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const normalizeArtworkAvailability = (value) => {
  const normalized = String(value || '')
    .trim()
    .toLowerCase();
  if (['available', 'reserved', 'sold', 'nfs'].includes(normalized)) {
    return normalized;
  }
  return '';
};

const getArtworkAvailabilityConfig = (item) => {
  const key = normalizeArtworkAvailability(item && item.availability);
  switch (key) {
    case 'available':
      return {
        key,
        label: getUiText('availabilityAvailable', 'Tillgänglig'),
        tone: 'available',
        canInquire: true,
        inquiryMode: 'artwork',
        inquiryLabel: getUiText('inquiryArtworkLink', 'Intresserad av verket')
      };
    case 'reserved':
      return {
        key,
        label: getUiText('availabilityReserved', 'Reserverad'),
        tone: 'reserved',
        canInquire: true,
        inquiryMode: 'artwork',
        inquiryLabel: getUiText('inquiryArtworkLink', 'Intresserad av verket')
      };
    case 'sold':
      return {
        key,
        label: getUiText('availabilitySold', 'Såld'),
        tone: 'sold',
        canInquire: true,
        inquiryMode: 'similar',
        inquiryLabel: getUiText('inquirySimilarLink', 'Fråga om liknande verk')
      };
    case 'nfs':
      return {
        key,
        label: getUiText('availabilityNfs', 'Ej till salu'),
        tone: 'nfs',
        canInquire: true,
        inquiryMode: 'similar',
        inquiryLabel: getUiText('inquirySimilarLink', 'Fråga om liknande verk')
      };
    default:
      return {
        key: '',
        label: '',
        tone: '',
        canInquire: true,
        inquiryMode: 'artwork',
        inquiryLabel: getUiText('inquiryArtworkLink', 'Intresserad av verket')
      };
  }
};

const getArtworkPriceLabel = (item, availability = getArtworkAvailabilityConfig(item)) => {
  const priceLabel = typeof item?.priceLabel === 'string' ? item.priceLabel.trim() : '';
  if (!priceLabel) {
    return '';
  }
  if (availability && availability.label && priceLabel.localeCompare(availability.label, activeLanguage, { sensitivity: 'accent' }) === 0) {
    return '';
  }
  return priceLabel;
};

const getArtworkCollectorNote = (item) =>
  typeof item?.collectorNote === 'string' && item.collectorNote.trim() !== '' ? item.collectorNote.trim() : '';

const normalizeArtworkWatermarkOpacity = (value, fallback = 12) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return fallback;
  }
  if (numeric <= 0) {
    return 0;
  }
  return Math.max(4, Math.min(100, Math.round(numeric)));
};

const getArtworkWatermarkConfig = () => {
  const ui = content.ui && typeof content.ui === 'object' ? content.ui : {};
  const watermark = ui.artworkWatermark && typeof ui.artworkWatermark === 'object' ? ui.artworkWatermark : {};
  const site = content.site && typeof content.site === 'object' ? content.site : {};
  const fallbackText =
    typeof site.brandName === 'string' && site.brandName.trim() !== '' ? site.brandName.trim() : 'Ola Gustafsson';
  const text = typeof watermark.text === 'string' && watermark.text.trim() !== '' ? watermark.text.trim() : fallbackText;
  return {
    enabled: watermark.enabled === true,
    text,
    opacity: normalizeArtworkWatermarkOpacity(watermark.opacity, 12)
  };
};

const upsertArtworkWatermark = (host) => {
  if (!(host instanceof HTMLElement)) {
    return;
  }

  const config = getArtworkWatermarkConfig();
  const existing = Array.from(host.children).find(
    (node) => node instanceof HTMLElement && node.classList.contains('artwork-watermark-overlay')
  );

  if (!config.enabled) {
    host.classList.remove('artwork-watermark-host');
    host.style.removeProperty('--artwork-watermark-opacity');
    if (existing) {
      existing.remove();
    }
    return;
  }

  let overlay = existing;
  if (!(overlay instanceof HTMLElement)) {
    overlay = document.createElement('span');
    overlay.className = 'artwork-watermark-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    host.appendChild(overlay);
  }

  overlay.textContent = '';
  overlay.dataset.watermarkLabel = config.text;
  host.classList.add('artwork-watermark-host');
  host.style.setProperty('--artwork-watermark-opacity', String(config.opacity / 100));
};

const applyArtworkWatermarks = (root = document) => {
  const selector = '.work-image, .artwork-media, .lightbox-media';
  const nodes = [];
  if (root instanceof HTMLElement && root.matches(selector)) {
    nodes.push(root);
  }
  if (root && typeof root.querySelectorAll === 'function') {
    nodes.push(...Array.from(root.querySelectorAll(selector)));
  }
  nodes.forEach((node) => upsertArtworkWatermark(node));
};

const buildInquiryPrefillMessage = (item, availability = getArtworkAvailabilityConfig(item)) => {
  const title =
    item && typeof item.title === 'string' && item.title.trim() !== ''
      ? item.title.trim()
      : getUiText('artworkDefaultPrefix', 'Verk');
  const templateKey = availability.inquiryMode === 'similar' ? 'inquiryPrefillSimilar' : 'inquiryPrefillAvailable';
  const fallback =
    availability.inquiryMode === 'similar'
      ? 'Hej! Jag såg att "{title}" inte längre är tillgänglig. Jag är gärna intresserad av liknande verk.'
      : 'Hej! Jag är intresserad av "{title}" och vill gärna veta mer om verket.';
  return getUiText(templateKey, fallback).replaceAll('{title}', title);
};

const normalizeArtworkCategoryKey = (value) => {
  const normalized = String(value || '')
    .trim()
    .toLowerCase();
  if (!normalized || normalized === 'all') {
    return '';
  }
  if (normalized === 'forest') {
    return 'nature';
  }
  return normalized;
};

const normalizeArtworkCategoryList = (value, fallback = '') => {
  const rawValues = Array.isArray(value)
    ? value
    : typeof value === 'string'
      ? value.split(',')
      : value != null
        ? [value]
        : [];

  const categories = [];
  rawValues.forEach((entry) => {
    const normalized = normalizeArtworkCategoryKey(entry);
    if (normalized && !categories.includes(normalized)) {
      categories.push(normalized);
    }
  });

  const fallbackKey = normalizeArtworkCategoryKey(fallback);
  if (categories.length === 0 && fallbackKey) {
    categories.push(fallbackKey);
  }

  return categories;
};

const getArtworkCategoryKeys = (item, fallback = 'nature') => {
  if (!item || typeof item !== 'object') {
    return normalizeArtworkCategoryList([], fallback);
  }

  const categories = normalizeArtworkCategoryList(item.categories, '');
  const primary = normalizeArtworkCategoryKey(item.category);
  if (primary && !categories.includes(primary)) {
    categories.unshift(primary);
  }

  if (categories.length === 0) {
    return normalizeArtworkCategoryList([], fallback);
  }

  return categories;
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

  const categories = getArtworkCategoryKeys(item, 'nature');

  return {
    id: item.id || String(index + 1),
    slug,
    src: item.src,
    previewSrc:
      (typeof item.previewSrc === 'string' && item.previewSrc.trim() !== ''
        ? item.previewSrc
        : getDisplayImageSrc(item.src, { preferThumb: true })) || '',
    title,
    format: (textOverride && textOverride.format) || item.format || '',
    medium,
    alt,
    availability: normalizeArtworkAvailability(item.availability),
    priceLabel: (textOverride && textOverride.priceLabel) || item.priceLabel || '',
    collectorNote: (textOverride && textOverride.collectorNote) || item.collectorNote || '',
    featured: Boolean(item.featured),
    category: categories[0] || 'nature',
    categories,
    year: Number(item.year || 0),
    order: Number(item.order || index + 1),
    // Keep gallery rendering stable: ignore stale per-slot crop values from old local overrides.
    zoom: 1,
    objectPosition: 'center center'
  };
};

const getArtworkPreviewSrc = (item) => {
  const preview = typeof item.previewSrc === 'string' ? item.previewSrc.trim() : '';
  return preview || getDisplayImageSrc(item && item.src, { preferThumb: true });
};

const getArtworkPreviewFallbackSources = (item) => {
  const preview = typeof item?.previewSrc === 'string' ? item.previewSrc.trim() : '';
  const baseSrc = typeof item?.src === 'string' ? item.src.trim() : '';
  const candidates = [
    preview,
    ...getImageFallbackSources(baseSrc, { preferThumb: true })
  ];
  return candidates.filter((value, index, array) => value && array.indexOf(value) === index);
};

const getArtworkDisplaySrc = (src) => getDisplayImageSrc(src, { preferThumb: false });

const buildArtworkPageUrl = (item, hash = '') => {
  if (!item || typeof item !== 'object') {
    return window.location.origin;
  }

  const rawSlug = typeof item.slug === 'string' ? item.slug.trim() : '';
  const slug = slugifyArtworkValue(rawSlug || 'verk');
  const usePreviewRoute = shouldUseLocalArtworkPreviewRoutes();
  const url = usePreviewRoute
    ? new URL('./artwork-preview.html', window.location.href)
    : new URL(`/verk/${encodeURIComponent(slug)}`, window.location.origin);
  if (usePreviewRoute) {
    url.searchParams.set('slug', slug);
  }
  url.searchParams.set('lang', activeLanguage);
  if (typeof hash === 'string' && hash.trim() !== '') {
    url.hash = hash.trim().replace(/^#/, '');
  }
  return url.toString();
};

const buildArtworkInquiryUrl = (item) => buildArtworkPageUrl(item, 'artwork-inquiry');

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

const listLocalDirectoryFiles = async (path) => {
  if (!isLocalPreviewHost || typeof DOMParser === 'undefined') {
    return [];
  }

  const normalizedPath = String(path || '').trim().replace(/^\/+|\/+$/g, '');
  if (!normalizedPath) {
    return [];
  }

  if (localDirectoryListingCache.has(normalizedPath)) {
    return localDirectoryListingCache.get(normalizedPath);
  }

  const request = (async () => {
    try {
      const response = await fetch(`${normalizedPath}/`, { cache: 'no-store' });
      if (!response.ok) {
        return [];
      }

      const html = await response.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      return Array.from(doc.querySelectorAll('a'))
        .map((link) => String(link.getAttribute('href') || '').split('?')[0].split('#')[0])
        .map((href) => href.replace(/\/+$/, '').split('/').pop() || '')
        .map((name) => {
          try {
            return decodeURIComponent(name);
          } catch (error) {
            return name;
          }
        })
        .filter((name) => name && name !== '.' && name !== '..');
    } catch (error) {
      return [];
    }
  })();

  localDirectoryListingCache.set(normalizedPath, request);
  return request;
};

const autoDiscoverArtworks = async (manualItems) => {
  const gallery = content.gallery || {};
  const config = gallery.autoDiscover || {};

  if (!config.enabled) {
    return [];
  }

  if (!isLocalPreviewHost && pageType !== 'studio') {
    return [];
  }

  const path = String(config.path || 'images').replace(/\/+$/, '');
  const prefix = config.prefix || 'ola-';
  const extension = String(config.extension || 'jpg').replace(/^\./, '');
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
  const buildDiscoveredItem = (id, src, order) => ({
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
    order
  });

  if (isLocalPreviewHost) {
    const escapedPrefix = String(prefix).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const escapedExtension = String(extension).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const listingPattern = new RegExp(`^${escapedPrefix}(\\d+)\\.${escapedExtension}$`, 'i');
    const files = await listLocalDirectoryFiles(path);
    if (files.length > 0) {
      const sortedMatches = files
        .map((file) => {
          const match = file.match(listingPattern);
          if (!match) {
            return null;
          }
          const value = Number(match[1]);
          if (!Number.isFinite(value)) {
            return null;
          }
          return { file, value };
        })
        .filter(Boolean)
        .sort((a, b) => a.value - b.value);

      sortedMatches.forEach(({ file, value }) => {
        if (value < startFrom || value > max) {
          return;
        }

        const id = String(value).padStart(pad, '0');
        const src = `${path}/${file}`;
        if (knownSrc.has(src) || removedSet.has(src)) {
          return;
        }

        discovered.push(buildDiscoveredItem(id, src, value));
      });

      return discovered;
    }
  }

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
      discovered.push(buildDiscoveredItem(id, src, i));
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

const normalizeSrcValue = (value) => (typeof value === 'string' ? value.trim() : '');

const normalizeComparableSrcKey = (value) => {
  const raw = normalizeSrcValue(value);
  if (!raw) {
    return '';
  }
  if (raw.startsWith('data:') || raw.startsWith('blob:')) {
    return raw;
  }

  let candidate = raw;
  try {
    const url = new URL(raw, window.location.origin);
    if (url.origin === window.location.origin) {
      candidate = `${url.pathname}${url.search}` || url.pathname;
    } else {
      candidate = url.toString();
    }
  } catch (error) {
    candidate = raw;
  }

  if (/^https?:\/\//i.test(candidate)) {
    return candidate;
  }

  return candidate.replace(/^\/+/, '');
};

const isTruthyFlag = (value) => {
  if (value === true || value === 1) {
    return true;
  }
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    return normalized === 'true' || normalized === '1' || normalized === 'yes';
  }
  return false;
};

const isHeroExcludedArtwork = (item) =>
  isTruthyFlag(item?.heroExclude) || isTruthyFlag(item?.excludeFromHero) || isTruthyFlag(item?.excludeFromHeroAuto);

const getHeroExcludedSrcSet = (heroConfig) => {
  const set = new Set();
  const autoSlides = heroConfig && typeof heroConfig.autoSlides === 'object' ? heroConfig.autoSlides : null;
  const byConfig = Array.isArray(autoSlides?.excludeSrcs) ? autoSlides.excludeSrcs : [];
  byConfig.map(normalizeComparableSrcKey).filter(Boolean).forEach((srcKey) => set.add(srcKey));

  const artworks = Array.isArray(content.gallery?.artworks) ? content.gallery.artworks : [];
  artworks.forEach((item) => {
    if (!item || typeof item !== 'object' || !isHeroExcludedArtwork(item)) {
      return;
    }
    const srcKey = normalizeComparableSrcKey(item.src);
    if (srcKey) {
      set.add(srcKey);
    }
  });

  return set;
};

const normalizeHeroAutoSlidesConfig = (heroConfig) => {
  const raw = heroConfig && typeof heroConfig.autoSlides === 'object' ? heroConfig.autoSlides : null;
  if (!raw || raw.enabled !== true) {
    return {
      enabled: false,
      count: 4,
      periodDays: 7,
      landscapeOnly: true,
      excludeSrcs: [],
      seedNonce: ''
    };
  }

  const count = Number(raw.count);
  const periodDays = Number(raw.periodDays);
  const seedNonce = typeof raw.seedNonce === 'string' ? raw.seedNonce.trim() : '';
  const excludeSrcs = (Array.isArray(raw.excludeSrcs) ? raw.excludeSrcs : [])
    .map((src) => (typeof src === 'string' ? src.trim() : ''))
    .filter(Boolean);

  return {
    enabled: true,
    count: Number.isFinite(count) ? Math.max(1, Math.min(24, Math.round(count))) : 4,
    periodDays: Number.isFinite(periodDays) ? Math.max(1, Math.min(365, Math.round(periodDays))) : 7,
    landscapeOnly: raw.landscapeOnly !== false,
    excludeSrcs: Array.from(new Set(excludeSrcs)),
    seedNonce
  };
};

const hashStringToUint32 = (value) => {
  const input = String(value || '');
  let hash = 2166136261;

  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
};

const createSeededRandom = (seed) => {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let next = state;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
};

const shuffleSlidesDeterministically = (slides, seed) => {
  const random = createSeededRandom(seed);
  const tagged = slides.map((slide, index) => ({
    slide,
    index,
    score: random()
  }));

  tagged.sort((a, b) => {
    if (a.score === b.score) {
      return a.index - b.index;
    }
    return a.score - b.score;
  });

  return tagged.map((entry) => entry.slide);
};

const parseArtworkFormatOrientation = (formatValue) => {
  const format = typeof formatValue === 'string' ? formatValue.trim() : '';
  if (!format) {
    return 'unknown';
  }

  const match = format.match(/(\d+(?:[.,]\d+)?)\s*[x×]\s*(\d+(?:[.,]\d+)?)/i);
  if (!match) {
    return 'unknown';
  }

  const first = Number(String(match[1]).replace(',', '.'));
  const second = Number(String(match[2]).replace(',', '.'));
  if (!Number.isFinite(first) || !Number.isFinite(second)) {
    return 'unknown';
  }
  if (first > second) {
    return 'landscape';
  }
  if (first < second) {
    return 'portrait';
  }
  return 'square';
};

const getDatePartsInTimeZone = (timestamp, timeZone) => {
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    const parts = formatter.formatToParts(new Date(timestamp));
    const year = Number(parts.find((part) => part.type === 'year')?.value || '');
    const month = Number(parts.find((part) => part.type === 'month')?.value || '');
    const day = Number(parts.find((part) => part.type === 'day')?.value || '');
    if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) {
      return null;
    }
    return { year, month, day };
  } catch (error) {
    return null;
  }
};

const getWeeklyRotationKeyForStockholm = (timestamp = Date.now()) => {
  const dateParts = getDatePartsInTimeZone(timestamp, HERO_ROTATION_TIMEZONE);
  if (!dateParts) {
    return '';
  }

  // Use Stockholm civil date, then snap to that week's Monday.
  const stockholmMidnightUtcMs = Date.UTC(dateParts.year, dateParts.month - 1, dateParts.day);
  const stockholmWeekday = new Date(stockholmMidnightUtcMs).getUTCDay();
  const daysSinceMonday = stockholmWeekday === 0 ? 6 : stockholmWeekday - 1;
  const mondayUtcMs = stockholmMidnightUtcMs - daysSinceMonday * 24 * 60 * 60 * 1000;
  const mondayDate = new Date(mondayUtcMs);
  const year = mondayDate.getUTCFullYear();
  const month = String(mondayDate.getUTCMonth() + 1).padStart(2, '0');
  const day = String(mondayDate.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getHeroImageOrientation = async (src) => {
  const normalized = typeof src === 'string' ? src.trim() : '';
  if (!normalized) {
    return 'unknown';
  }

  if (heroOrientationCache.has(normalized)) {
    return heroOrientationCache.get(normalized);
  }

  const orientationPromise = new Promise((resolve) => {
    const image = new Image();
    const probeSrc = addRevToSrc(getArtworkDisplaySrc(normalized) || normalized);
    let done = false;

    const finish = (value) => {
      if (done) {
        return;
      }
      done = true;
      resolve(value);
    };

    const timeoutId = window.setTimeout(() => finish('unknown'), 8000);
    image.decoding = 'async';
    image.onload = () => {
      window.clearTimeout(timeoutId);
      if (image.naturalWidth > image.naturalHeight) {
        finish('landscape');
        return;
      }
      if (image.naturalWidth < image.naturalHeight) {
        finish('portrait');
        return;
      }
      finish('square');
    };
    image.onerror = () => {
      window.clearTimeout(timeoutId);
      finish('unknown');
    };
    image.src = probeSrc;
  });

  heroOrientationCache.set(normalized, orientationPromise);
  return orientationPromise;
};

const buildAutoHeroSlidesFromGallery = (defaultDurationMs, config) => {
  const rawItems = Array.isArray(content.gallery?.artworks) ? content.gallery.artworks : [];
  const excludedSrcs = getHeroExcludedSrcSet(content.hero);
  const candidates = dedupeSlidesBySrc(
    rawItems
      .filter((item) => item && normalizeSrcValue(item.src) !== '')
      .filter((item) => {
        const src = normalizeSrcValue(item.src);
        const srcKey = normalizeComparableSrcKey(src);
        if (isHeroExcludedArtwork(item) || excludedSrcs.has(srcKey)) {
          return false;
        }

        if (config.landscapeOnly) {
          const orientation = parseArtworkFormatOrientation(item.format);
          if (orientation === 'portrait') {
            return false;
          }
        }

        return true;
      })
      .map((item) => ({
        src: normalizeSrcValue(item.src),
        alt: item.alt || item.title || '',
        durationMs: defaultDurationMs
      }))
  );

  if (candidates.length === 0) {
    return [];
  }

  const pool = candidates;

  const now = Date.now();
  const stockholmWeekKey = config.periodDays === 7 ? getWeeklyRotationKeyForStockholm(now) : '';
  const periodMs = config.periodDays * 24 * 60 * 60 * 1000;
  const periodKey = Math.floor(now / periodMs);
  const rotationKey = stockholmWeekKey !== '' ? `week:${stockholmWeekKey}` : `period:${periodKey}`;
  const seedNonce = typeof config.seedNonce === 'string' ? config.seedNonce : '';
  const seedInput = `${rotationKey}|seed:${seedNonce}|${pool.length}|${pool.map((slide) => slide.src).join('|')}`;
  const seed = hashStringToUint32(seedInput);
  const shuffled = shuffleSlidesDeterministically(pool, seed);
  return shuffled.slice(0, Math.min(config.count, shuffled.length));
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
    image.src = addRevToSrc(getArtworkDisplaySrc(slide.src));
    image.alt = slide.alt || `${getUiText('slideLabel', 'Bild')} ${index + 1}`;
    image.loading = index < 2 ? 'eager' : 'lazy';
    image.fetchPriority = index === 0 ? 'high' : 'auto';
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
    pre.src = addRevToSrc(getArtworkDisplaySrc(slide.src));
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
  const renderSequence = ++heroRenderSequence;
  const heroImage = document.getElementById('hero-image');
  if (!heroImage || !content.hero) {
    return;
  }

  clearHeroSlideshow();

  const heroMode = content.hero.mode || 'still';
  const slideDurationMs = normalizeHeroSlideDuration(content.hero.slideDurationMs, 8000);
  const heroExcludedSrcs = getHeroExcludedSrcSet(content.hero);
  const configuredSlides = Array.isArray(content.hero.slides)
    ? content.hero.slides
        .filter((item) => item && normalizeSrcValue(item.src) !== '')
        .filter((item) => !heroExcludedSrcs.has(normalizeComparableSrcKey(item.src)))
        .map((item) => ({
        src: normalizeSrcValue(item.src),
        alt: item.alt || '',
        durationMs: normalizeHeroSlideDuration(item.durationMs, slideDurationMs)
      }))
    : [];

  const autoSlidesConfig = normalizeHeroAutoSlidesConfig(content.hero);
  let slides = autoSlidesConfig.enabled ? [] : dedupeSlidesBySrc(configuredSlides);
  if (heroMode === 'slideshow' && autoSlidesConfig.enabled) {
    try {
      const autoSlides = buildAutoHeroSlidesFromGallery(slideDurationMs, autoSlidesConfig);
      if (renderSequence !== heroRenderSequence) {
        return;
      }
      if (autoSlides.length > 0) {
        slides = autoSlides;
      }
    } catch (error) {
      // Keep manual slideshow config as fallback.
    }
  }

  if (heroMode === 'slideshow' && slides.length === 0) {
    const fallbackSlides = (Array.isArray(content.gallery?.artworks) ? content.gallery.artworks : [])
      .filter((item) => item && normalizeSrcValue(item.src) !== '')
      .filter((item) => !isHeroExcludedArtwork(item))
      .filter((item) => !heroExcludedSrcs.has(normalizeComparableSrcKey(item.src)))
      .slice(0, 8)
      .map((item) => ({
        src: normalizeSrcValue(item.src),
        alt: item.alt || item.title || '',
        durationMs: slideDurationMs
      }));
    slides = dedupeSlidesBySrc([...slides, ...fallbackSlides]);
  }

  if (heroMode === 'slideshow' && slides.length > 0) {
    const firstSlide = slides[0];
    heroImage.style.display = '';
    heroImage.style.opacity = '1';
    applyHeroImageSource(heroImage, firstSlide.src);
    heroImage.alt = firstSlide.alt || getUiText('heroImageFallbackAlt', 'Hero-bild');
    addImageFallback(heroImage);
    if (shouldUseStaticHeroOnMobile()) {
      heroImage.addEventListener('load', clearHeroPreloadArtifacts, { once: true });
      heroImage.addEventListener('error', clearHeroPreloadArtifacts, { once: true });
      if (heroImage.complete) {
        window.requestAnimationFrame(clearHeroPreloadArtifacts);
      }
      return;
    }
    heroSlideshowState.currentIndex = 0;
    runHeroSlideshow(slides, slideDurationMs, { fallbackImage: heroImage });
    return;
  }

  heroImage.style.display = '';
  if (content.hero.image) {
    applyHeroImageSource(heroImage, content.hero.image);
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

  image.src = addRevToSrc(getArtworkDisplaySrc(src));
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

  image.src = addRevToSrc(getArtworkDisplaySrc(src));
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

  image.src = addRevToSrc(getArtworkDisplaySrc(src));
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

const renderInspiration = () => {
  const nodes = document.querySelectorAll('[data-bind="about.inspirationBody"]');
  const text = getBoundString('about.inspirationBody', '');

  nodes.forEach((node) => {
    node.textContent = '';
    if (text !== '') {
      node.appendChild(buildLinkedTextFragment(text));
    }
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
    const line = typeof text === 'string' ? text.trim() : '';
    if (line === '') {
      return;
    }
    const li = document.createElement('li');
    li.appendChild(buildLinkedTextFragment(line));
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
      collage.src = addRevToSrc(getArtworkDisplaySrc(src));
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
    img.src = addRevToSrc(getArtworkDisplaySrc(item.src));
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
  const raw = String(category || '')
    .trim()
    .toLowerCase();
  const key = raw === 'all' ? 'all' : normalizeArtworkCategoryKey(category);
  const labels = (content.gallery && content.gallery.categoryLabels) || {};
  return labels[key] || key || category;
};

const getArtworkCategoryText = (item) =>
  getArtworkCategoryKeys(item, '')
    .map((category) => getCategoryLabel(category))
    .filter(Boolean)
    .join(', ');

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
      : galleryState.baseItems.filter((item) => getArtworkCategoryKeys(item, '').includes(galleryState.activeCategory));

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
    const availability = getArtworkAvailabilityConfig(item);
    const priceLabel = getArtworkPriceLabel(item, availability);
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
    const previewFallbackSources = getArtworkPreviewFallbackSources(item);
    const previewSrc = previewFallbackSources[0] || getArtworkPreviewSrc(item);
    image.src = addRevToSrc(previewSrc);
    image.dataset.fallbackSrcs = previewFallbackSources.join('\n');
    image.dataset.fallbackIndex = '0';
    image.dataset.fullSrc = getArtworkDisplaySrc(item.src);
    image.alt = item.alt;
    image.style.objectPosition = item.objectPosition;
    image.style.setProperty('--hover-scale', String((item.zoom > 1 ? item.zoom : 1) + 0.03));
    image.decoding = 'async';
    const eagerLimit = pageType === 'home' ? 0 : 2;
    if (index < eagerLimit) {
      image.loading = 'eager';
      image.fetchPriority = index === 0 ? 'high' : 'auto';
    } else {
      image.loading = 'lazy';
      image.fetchPriority = 'auto';
    }

    addImageFallback(image);

    figure.appendChild(image);
    if (availability.label) {
      const badge = document.createElement('span');
      badge.className = `artwork-status-badge is-${availability.tone || 'default'}`;
      badge.textContent = availability.label;
      figure.appendChild(badge);
    }

    const meta = document.createElement('div');
    meta.className = 'work-meta';

    const title = document.createElement('h3');
    title.textContent = item.title;

    const metaLine = document.createElement('p');
    const categoryLabel = getArtworkCategoryText(item);
    const formatLabel = typeof item.format === 'string' ? item.format.trim() : '';
    const yearLabel = item.year ? String(item.year) : '';
    const metaParts = [formatLabel, categoryLabel, yearLabel].filter((part) => typeof part === 'string' && part.trim() !== '');
    metaLine.textContent = metaParts.join(' · ');

    meta.append(title, metaLine);
    if (priceLabel) {
      const priceLine = document.createElement('p');
      priceLine.className = 'work-price';
      priceLine.textContent = `${getUiText('priceLabel', 'Pris')}: ${priceLabel}`;
      meta.appendChild(priceLine);
    }
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

  const categories = [
    'all',
    ...new Set(galleryState.baseItems.flatMap((item) => getArtworkCategoryKeys(item, '')))
  ];
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

const initArtworkPreviewPage = () => {
  if (pageType !== 'artwork-preview') {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const slugParam = slugifyArtworkValue(params.get('slug') || '');
  const items = buildManualGalleryItems();
  const item =
    items.find((entry) => entry && typeof entry.slug === 'string' && entry.slug === slugParam) ||
    items.find((entry) => normalizeArtworkAvailability(entry && entry.availability) !== '') ||
    items[0];

  if (!item) {
    return;
  }

  const availability = getArtworkAvailabilityConfig(item);
  const priceLabel = getArtworkPriceLabel(item, availability);
  const collectorNote = getArtworkCollectorNote(item);
  const categoryLabel = getArtworkCategoryText(item);

  const setText = (id, value) => {
    const node = document.getElementById(id);
    if (node) {
      node.textContent = value;
    }
  };
  const setHidden = (id, hidden) => {
    const node = document.getElementById(id);
    if (node) {
      node.hidden = hidden;
    }
  };

  const previewImage = document.getElementById('artwork-preview-image');
  if (previewImage instanceof HTMLImageElement) {
    previewImage.src = addRevToSrc(getArtworkDisplaySrc(item.src));
    previewImage.alt = item.alt || item.title;
    addImageFallback(previewImage);
  }

  setText('artwork-preview-breadcrumb', item.title);
  setText('artwork-preview-title', item.title);
  setText(
    'artwork-preview-lead',
    [item.medium, item.format, item.year ? String(item.year) : '', categoryLabel].filter(Boolean).join(' · ')
  );

  const statusBadge = document.getElementById('artwork-preview-status');
  if (statusBadge) {
    statusBadge.textContent = availability.label;
    statusBadge.className = `artwork-status-badge is-${availability.tone || 'default'}`;
  }
  setHidden('artwork-preview-status-wrap', !availability.label);
  setText('artwork-preview-price', priceLabel);
  setHidden('artwork-preview-price-wrap', !priceLabel);
  setText('artwork-preview-medium', item.medium || '');
  setHidden('artwork-preview-medium-row', !item.medium);
  setText('artwork-preview-format', item.format || '');
  setHidden('artwork-preview-format-row', !item.format);
  setText('artwork-preview-year', item.year ? String(item.year) : '');
  setHidden('artwork-preview-year-row', !item.year);
  setText('artwork-preview-category', categoryLabel || '');
  setHidden('artwork-preview-category-row', !categoryLabel);
  setText('artwork-preview-collector-text', collectorNote);
  setHidden('artwork-preview-collector', !collectorNote);

  const inquiryHeading = document.getElementById('artwork-preview-inquiry-heading');
  if (inquiryHeading) {
    inquiryHeading.textContent =
      availability.inquiryMode === 'similar'
        ? getUiText('inquiryHeadingSimilar', 'Fråga om liknande verk')
        : getUiText('inquiryHeading', 'Fråga om detta verk');
  }
  const inquiryBody = document.getElementById('artwork-preview-inquiry-body');
  if (inquiryBody) {
    inquiryBody.textContent =
      availability.inquiryMode === 'similar'
        ? getUiText(
            'inquiryBodySimilar',
            'Det här verket är inte tillgängligt just nu, men du kan gärna fråga om liknande verk eller kommande målningar.'
          )
        : getUiText(
            'inquiryBodyAvailable',
            'Skriv gärna om du vill veta mer, reservera verket eller få fler bilder innan beslut.'
          );
  }
  const inquiryButton = document.getElementById('artwork-preview-inquiry-button');
  if (inquiryButton) {
    inquiryButton.textContent = availability.inquiryLabel;
  }
  const submitButton = document.getElementById('artwork-preview-submit');
  if (submitButton) {
    submitButton.textContent =
      availability.inquiryMode === 'similar'
        ? getUiText('inquirySubmitSimilar', 'Skicka förfrågan om liknande verk')
        : getUiText('inquirySubmit', 'Skicka förfrågan');
  }

  const copyLink = document.getElementById('artwork-preview-copy-link');
  if (copyLink) {
    copyLink.setAttribute('data-copy-link', window.location.href);
  }

  const inquiryForm = document.getElementById('artwork-inquiry-form');
  if (inquiryForm instanceof HTMLFormElement) {
    inquiryForm.dataset.artworkTitle = item.title;
    inquiryForm.dataset.inquiryMode = availability.inquiryMode;
    const assignField = (name, value) => {
      const field = inquiryForm.querySelector(`[name="${name}"]`);
      if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) {
        field.value = value;
        field.defaultValue = value;
      }
    };
    assignField('inquirySlug', item.slug || '');
    assignField('inquiryTitle', item.title || '');
    assignField('inquiryAvailability', availability.key || '');
    assignField('inquiryPriceLabel', priceLabel || '');
    assignField('inquirySourceUrl', window.location.href);
  }

  document.title = `${item.title} | ${content.site && content.site.title ? content.site.title : 'Artwork preview'}`;
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

const setArtworkInquiryStatus = (message, kind = 'info') => {
  const statusNode = document.getElementById('artwork-inquiry-status');
  if (!statusNode) {
    return;
  }
  statusNode.textContent = message;
  statusNode.dataset.kind = kind;
};

const initArtworkInquiryForm = () => {
  const form = document.getElementById('artwork-inquiry-form');
  if (!form) {
    return;
  }

  const messageField = form.querySelector('textarea[name="message"]');
  const submitButton = form.querySelector('button[type="submit"]');
  const turnstileField = form.querySelector('input[name="turnstileToken"]');
  const turnstileHost = document.getElementById('artwork-inquiry-turnstile');
  const title = String(form.getAttribute('data-artwork-title') || '').trim();
  const inquiryMode = String(form.getAttribute('data-inquiry-mode') || 'artwork').trim() === 'similar' ? 'similar' : 'artwork';
  const formEnabledOverride = String(form.getAttribute('data-form-enabled') || '').trim().toLowerCase();
  const turnstileSiteKeyOverride = String(form.getAttribute('data-turnstile-site-key') || '').trim();
  const contactConfig = content.contact && typeof content.contact === 'object' ? content.contact : {};
  const formConfig = contactConfig.form && typeof contactConfig.form === 'object' ? contactConfig.form : {};
  const formEnabled = formEnabledOverride ? formEnabledOverride !== 'false' : formConfig.enabled !== false;
  if (!formEnabled) {
    const section = document.getElementById('artwork-inquiry');
    if (section) {
      section.hidden = true;
    }
    return;
  }
  const turnstileSiteKey =
    turnstileSiteKeyOverride !== ''
      ? turnstileSiteKeyOverride
      : typeof formConfig.turnstileSiteKey === 'string'
        ? formConfig.turnstileSiteKey.trim()
        : '';
  const prefillTemplate =
    inquiryMode === 'similar'
      ? getUiText(
          'inquiryPrefillSimilar',
          'Hej! Jag såg att "{title}" inte längre är tillgänglig. Jag är gärna intresserad av liknande verk.'
        )
      : getUiText('inquiryPrefillAvailable', 'Hej! Jag är intresserad av "{title}" och vill gärna veta mer om verket.');
  const prefillMessage = prefillTemplate.replaceAll('{title}', title || getUiText('artworkDefaultPrefix', 'Verk'));

  if (messageField && messageField.value.trim() === '') {
    messageField.value = prefillMessage;
  }

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
    if (window.turnstile && artworkInquiryTurnstileWidgetId !== null) {
      try {
        window.turnstile.reset(artworkInquiryTurnstileWidgetId);
      } catch (error) {
        // Ignore reset errors and allow retry.
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
        artworkInquiryTurnstileWidgetId = turnstile.render(turnstileHost, {
          sitekey: turnstileSiteKey,
          callback: (token) => {
            setTurnstileToken(typeof token === 'string' ? token : '');
          },
          'expired-callback': () => {
            setTurnstileToken('');
          },
          'error-callback': () => {
            setTurnstileToken('');
            setArtworkInquiryStatus(
              getUiText('captchaVerifyError', 'Captcha kunde inte verifieras. Försök igen.'),
              'error'
            );
          }
        });
      })
      .catch(() => {
        setArtworkInquiryStatus(
          getUiText('captchaLoadError', 'Captcha kunde inte laddas. Ladda om sidan och försök igen.'),
          'error'
        );
      });
  }

  const formMountedAt = Date.now();
  let isSubmitting = false;
  const isPreviewSubmission = pageType === 'artwork-preview' && shouldUseLocalArtworkPreviewRoutes();

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
      elapsedMs: Date.now() - formMountedAt,
      inquiry: {
        slug: String(formData.get('inquirySlug') || '').trim(),
        title: String(formData.get('inquiryTitle') || '').trim(),
        availability: String(formData.get('inquiryAvailability') || '').trim(),
        priceLabel: String(formData.get('inquiryPriceLabel') || '').trim(),
        sourceUrl: String(formData.get('inquirySourceUrl') || '').trim(),
        language: activeLanguage,
        mode: inquiryMode
      }
    };

    if (payload.elapsedMs < CONTACT_FORM_MIN_DELAY_MS) {
      setArtworkInquiryStatus(getUiText('formSlowDown', 'Vänta en kort stund innan du skickar formuläret.'), 'error');
      return;
    }
    if (turnstileSiteKey !== '' && payload.turnstileToken === '') {
      setArtworkInquiryStatus(
        getUiText('formCaptchaRequired', 'Verifiera captcha innan du skickar formuläret.'),
        'error'
      );
      return;
    }

    isSubmitting = true;
    if (submitButton) {
      submitButton.disabled = true;
    }
    setArtworkInquiryStatus(getUiText('formSending', 'Skickar meddelande...'), 'info');

    try {
      if (isPreviewSubmission) {
        await new Promise((resolve) => {
          window.setTimeout(resolve, 240);
        });
        setArtworkInquiryStatus(
          getUiText('inquiryPreviewSuccess', 'Previewläge: förfrågan simulerades lokalt. Riktig sändning aktiveras när PHP körs.'),
          'success'
        );
        form.reset();
        if (messageField) {
          messageField.value = prefillMessage;
        }
        setTurnstileToken('');
        return;
      }

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
            : getUiText('inquiryFallbackStatus', 'Verksförfrågan kunde inte skickas. Försök igen.');
        setArtworkInquiryStatus(message, 'error');
        return;
      }

      setArtworkInquiryStatus(result.message || getUiText('inquirySuccess', 'Tack, din förfrågan är skickad.'), 'success');
      form.reset();
      if (messageField) {
        messageField.value = prefillMessage;
      }
      setTurnstileToken('');
    } catch (error) {
      setArtworkInquiryStatus(
        getUiText('inquiryFallbackStatus', 'Verksförfrågan kunde inte skickas. Försök igen.'),
        'error'
      );
    } finally {
      if (turnstileSiteKey !== '') {
        resetTurnstile();
      }
      if (submitButton) {
        submitButton.disabled = false;
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

  const hostname = String(window.location.hostname || '').trim().toLowerCase();
  const allowedHosts = (Array.isArray(analytics.allowedHosts) ? analytics.allowedHosts : DEFAULT_ANALYTICS_ALLOWED_HOSTS)
    .map((host) => (typeof host === 'string' ? host.trim().toLowerCase() : ''))
    .filter(Boolean);
  if (allowedHosts.length === 0 || !allowedHosts.includes(hostname)) {
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

const shouldSkipWarmImageCache = () => {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (!connection || typeof connection !== 'object') {
    return false;
  }

  const effectiveType = typeof connection.effectiveType === 'string' ? connection.effectiveType.trim().toLowerCase() : '';
  return connection.saveData === true || effectiveType === 'slow-2g' || effectiveType === '2g';
};

const shouldUseStaticHeroOnMobile = () => {
  const narrowViewport = typeof window.matchMedia === 'function' && window.matchMedia('(max-width: 767px)').matches;
  return narrowViewport || shouldSkipWarmImageCache();
};

const scheduleDeferredStartupTask = (callback, delayMs = 700) => {
  if (typeof callback !== 'function') {
    return;
  }

  const run = () => {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => callback(), { timeout: 1800 });
      return;
    }
    window.setTimeout(callback, delayMs);
  };

  if (document.readyState === 'complete') {
    run();
    return;
  }

  window.addEventListener('load', run, { once: true });
};

const warmImageCache = (force = false) => {
  if ((warmImageCacheComplete && force !== true) || shouldSkipWarmImageCache()) {
    return;
  }

  warmImageCacheComplete = true;
  if (force === true) {
    warmCacheRefs.length = 0;
  }
  const srcSet = new Set();
  const hero = content.hero || {};
  if (hero.image) {
    const heroSrc = pageType === 'home' ? getHeroDisplaySrc(hero.image) : getArtworkDisplaySrc(hero.image);
    if (heroSrc) {
      srcSet.add(heroSrc);
    }
  }
  if (Array.isArray(hero.slides)) {
    const slideLimit = shouldUseStaticHeroOnMobile() ? 1 : 4;
    hero.slides
      .filter((slide) => slide && slide.src)
      .slice(0, slideLimit)
      .forEach((slide) => {
        const slideSrc = pageType === 'home' ? getHeroDisplaySrc(slide.src) : getArtworkDisplaySrc(slide.src);
        if (slideSrc) {
          srcSet.add(slideSrc);
        }
      });
  }

  const eagerCount = pageType === 'home' ? 0 : 4;
  galleryState.allItems.slice(0, eagerCount).forEach((item) => {
    const previewSrc = getArtworkPreviewSrc(item);
    if (previewSrc) {
      srcSet.add(previewSrc);
    }
  });

  Array.from(srcSet)
    .slice(0, pageType === 'home' ? 4 : 5)
    .forEach((src, index) => {
      const img = new Image();
      img.decoding = 'async';
      img.fetchPriority = index === 0 ? 'high' : 'low';
      img.src = addRevToSrc(src);
      warmCacheRefs.push(img);
    });
};

const scheduleWarmImageCache = (force = false) => {
  if (warmImageCacheQueued && force !== true) {
    return;
  }

  const run = () => {
    warmImageCacheQueued = false;
    warmImageCache(force);
  };

  warmImageCacheQueued = true;
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(run, { timeout: 1500 });
    return;
  }

  window.setTimeout(run, 600);
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

const renderLightboxCaptionHtml = (item) => {
  const title =
    typeof item?.title === 'string' && item.title.trim() !== '' ? item.title.trim() : getUiText('slideLabel', 'Bild');
  const formatLabel = typeof item?.format === 'string' ? item.format.trim() : '';
  const categoryLabel = getArtworkCategoryText(item);
  const yearLabel = item && item.year ? String(item.year) : '';
  const availability = getArtworkAvailabilityConfig(item);
  const priceLabel = getArtworkPriceLabel(item, availability);
  const explicitCaption = typeof item?.caption === 'string' ? item.caption.trim() : '';

  if (explicitCaption) {
    return `<strong>${buildInlineFormattedHtml(explicitCaption)}</strong>`;
  }

  const metaParts = [formatLabel, categoryLabel, yearLabel].filter((part) => typeof part === 'string' && part.trim() !== '');
  const lines = [`<strong>${buildInlineFormattedHtml(title)}</strong>`];
  if (metaParts.length > 0) {
    lines.push(`<span class="lightbox-meta-line">${escapeHtml(metaParts.join(' · '))}</span>`);
  }
  if (availability.label || priceLabel) {
    const detailParts = [];
    if (availability.label) {
      detailParts.push(`${getUiText('availabilityLabel', 'Status')}: ${availability.label}`);
    }
    if (priceLabel) {
      detailParts.push(`${getUiText('priceLabel', 'Pris')}: ${priceLabel}`);
    }
    lines.push(`<span class="lightbox-meta-note">${escapeHtml(detailParts.join(' · '))}</span>`);
  }

  return lines.join('');
};

const updateLightboxView = () => {
  const { elements, items, currentIndex } = lightboxState;
  if (!elements || items.length === 0 || !items[currentIndex]) {
    return;
  }

  const item = items[currentIndex];
  const availability = getArtworkAvailabilityConfig(item);
  elements.image.src = addRevToSrc(getArtworkDisplaySrc(item.src));
  elements.image.alt = item.alt;
  elements.captionText.innerHTML = renderLightboxCaptionHtml(item);

  let shareUrl = '';
  if (typeof item.shareUrl === 'string' && item.shareUrl.trim() !== '') {
    shareUrl = item.shareUrl.trim();
  } else if (item.disableShareActions !== true && typeof item.slug === 'string' && item.slug.trim() !== '') {
    shareUrl = buildArtworkPageUrl(item);
  }

  const showShareActions = shareUrl !== '';
  elements.openArtwork.hidden = !showShareActions;
  elements.copyLink.hidden = !showShareActions;
  elements.inquiryLink.hidden = item.disableShareActions === true || availability.canInquire !== true;
  if (showShareActions) {
    elements.openArtwork.href = shareUrl;
    elements.copyLink.setAttribute('data-copy-link', shareUrl);
  } else {
    elements.openArtwork.removeAttribute('href');
    elements.copyLink.removeAttribute('data-copy-link');
  }
  if (elements.inquiryLink && availability.canInquire === true) {
    elements.inquiryLink.href = buildArtworkInquiryUrl(item);
    elements.inquiryLink.textContent = availability.inquiryLabel;
  } else if (elements.inquiryLink) {
    elements.inquiryLink.removeAttribute('href');
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
  const media = wrap ? wrap.querySelector('.lightbox-media') : null;
  const captionText = document.getElementById('lightbox-caption-text');
  const openArtwork = document.getElementById('lightbox-open-artwork');
  const inquiryLink = document.getElementById('lightbox-artwork-inquiry');
  const copyLink = document.getElementById('lightbox-copy-artwork-link');
  const copyStatus = document.getElementById('lightbox-copy-status');
  const close = document.getElementById('lightbox-close');
  const prev = document.getElementById('lightbox-prev');
  const next = document.getElementById('lightbox-next');

  if (!wrap || !image || !captionText || !openArtwork || !inquiryLink || !copyLink || !close || !prev || !next) {
    return;
  }

  lightboxState.elements = { wrap, media, image, captionText, openArtwork, inquiryLink, copyLink, copyStatus, close, prev, next };

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
  scheduleWarmImageCache();

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
      scheduleWarmImageCache(true);
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
  initSystemColorModeObserver();
  void renderHeroImage();
  renderHeroOverlay();
  renderAboutPortrait();
  renderAboutMaterialImage();
  renderFeatureImage();
  renderAboutParagraphs();
  renderInspiration();
  renderAmbitions();
  renderRecognition();
  renderSunProject();
  renderContact();
  initArtworkPreviewPage();
  initContactForm();
  initArtworkInquiryForm();

  initMenu();
  initHashLinkNavigation();
  initReveal();
  initActiveSectionHighlight();
  initScrollTop();
  initStudioAuth();
  initCopyLinkButtons();
  initLightbox();

  if (pageType === 'home' && !isLocalPreviewHost) {
    scheduleDeferredStartupTask(() => {
      initAnalytics();
      initializeGallery().catch(() => {});
    });
    return;
  }

  initAnalytics();
  await initializeGallery();
};

const rehydrateHeroAfterPageRestore = () => {
  if (!content.hero || content.hero.mode !== 'slideshow') {
    return;
  }
  void renderHeroImage();
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
