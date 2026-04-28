const STORAGE_KEY = 'olaPortfolioOverridesV1';
const STUDIO_AUTH_KEY = 'olaStudioUnlockedV1';
const STUDIO_LANGUAGE_STORAGE_KEY = 'olaStudioEditLanguageV1';
const STUDIO_SECTION_COLLAPSE_STORAGE_KEY = 'olaStudioSectionCollapseV1';
const STUDIO_VIEW_STORAGE_KEY = 'olaStudioActiveViewV1';
const STUDIO_EDIT_LANGUAGES = ['sv', 'en'];
const ASSET_REV = '20260321-01';

const STUDIO_VIEW_META = {
  overview: {
    title: 'Översikt',
    subtitle: 'Senaste läget för sajten, verken och publiceringen.'
  },
  works: {
    title: 'Verk',
    subtitle: 'Ladda upp, redigera och ordna målningarna i galleriet.'
  },
  text: {
    title: 'Textredigering',
    subtitle: 'Hero, artist statement och ambitioner.'
  },
  projects: {
    title: 'Projekt',
    subtitle: 'Projektsektion, kollage och exempelbilder.'
  },
  contact: {
    title: 'Kontakt',
    subtitle: 'Kontakttext, e-postknapp och sociala kanaler.'
  },
  inquiries: {
    title: 'Förfrågningar',
    subtitle: 'Inkomna meddelanden och intresseanmälningar.'
  },
  seo: {
    title: 'SEO & sida',
    subtitle: 'Metadata, delningsbild och mätning.'
  },
  settings: {
    title: 'Inställningar',
    subtitle: 'Färger, typsnitt, publicering och tekniska verktyg.'
  }
};

const DEFAULT_CONTENT = {
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
    title: '',
    intro: '',
    line: '',
    mode: 'still',
    slideDurationMs: 8000,
    autoSlides: {
      enabled: false,
      count: 4,
      periodDays: 7,
      landscapeOnly: true,
      excludeSrcs: [],
      seedNonce: '',
      lastForcedAt: ''
    },
    slides: [],
    overlayEnabled: true,
    overlayOpacity: 55,
    copyPanelOpacity: 40,
    image: '',
    imageAlt: ''
  },
  gallery: {
    heading: 'Galleri',
    pageHeading: 'Hela galleriet',
    subheading: '',
    autoDiscover: {
      enabled: true,
      defaultCategory: 'nature'
    },
    removedSrcs: [],
    artworks: []
  },
  about: {
    heading: '',
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
    eyebrow: '',
    heading: '',
    body: '',
    email: '',
    emailPublic: true,
    emailLabel: 'Skicka e-post',
    form: {
      enabled: true,
      turnstileSiteKey: ''
    },
    socialLinks: [],
    instagramUrl: '',
    facebookUrl: ''
  },
  analytics: {
    gaMeasurementId: '',
    anonymizeIp: true,
    trackStudio: false,
    allowedHosts: ['olagustafsson.com', 'www.olagustafsson.com']
  },
  seo: {
    home: {
      title: '',
      description: '',
      image: '',
      imageAlt: ''
    }
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

const DISPLAY_FONT_KEYS = ['fraunces', 'playfair', 'cormorant', 'georgia', 'baskerville', 'times'];
const BODY_FONT_KEYS = ['jakarta', 'plexmono', 'sourcesans', 'lora', 'avenir', 'system', 'helvetica'];
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

const normalizePercentageValue = (value, fallback = null) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return fallback;
  }
  return Math.max(0, Math.min(100, numeric));
};

const normalizeStudioLanguage = (value) => {
  if (typeof value !== 'string') {
    return null;
  }
  const normalized = value.trim().toLowerCase();
  return STUDIO_EDIT_LANGUAGES.includes(normalized) ? normalized : null;
};

const readStoredStudioLanguage = () => {
  try {
    return normalizeStudioLanguage(window.localStorage.getItem(STUDIO_LANGUAGE_STORAGE_KEY));
  } catch (error) {
    return null;
  }
};

const storeStudioLanguage = (language) => {
  try {
    window.localStorage.setItem(STUDIO_LANGUAGE_STORAGE_KEY, language);
  } catch (error) {
    // ignore storage errors
  }
};

const normalizeStudioView = (value) => {
  const normalized = typeof value === 'string' ? value.trim().toLowerCase() : '';
  if (normalized === 'appearance') {
    return 'settings';
  }
  return Object.prototype.hasOwnProperty.call(STUDIO_VIEW_META, normalized) ? normalized : 'overview';
};

const readStoredStudioView = () => {
  try {
    return normalizeStudioView(window.localStorage.getItem(STUDIO_VIEW_STORAGE_KEY));
  } catch (error) {
    return 'overview';
  }
};

const storeStudioView = (view) => {
  try {
    window.localStorage.setItem(STUDIO_VIEW_STORAGE_KEY, normalizeStudioView(view));
  } catch (error) {
    // ignore storage errors
  }
};

const readStoredSectionCollapseMap = () => {
  try {
    const raw = window.localStorage.getItem(STUDIO_SECTION_COLLAPSE_STORAGE_KEY);
    if (!raw) {
      return {};
    }
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return {};
    }
    const next = {};
    Object.keys(parsed).forEach((key) => {
      if (typeof key === 'string' && key.trim() !== '') {
        next[key.trim()] = Boolean(parsed[key]);
      }
    });
    return next;
  } catch (error) {
    return {};
  }
};

const storeSectionCollapseMap = (map) => {
  try {
    window.localStorage.setItem(STUDIO_SECTION_COLLAPSE_STORAGE_KEY, JSON.stringify(map || {}));
  } catch (error) {
    // ignore storage errors
  }
};

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
    reader.onerror = () => reject(new Error('Kunde inte läsa filen.'));
    reader.readAsDataURL(file);
  });

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Kunde inte läsa bild.'));
    img.src = src;
  });

const isDataImageUrl = (value) => typeof value === 'string' && value.startsWith('data:image/');

const resizeDataUrl = async (src, options = {}) => {
  if (!isDataImageUrl(src)) {
    return src;
  }

  const maxWidth = Number(options.maxWidth || 1800);
  const maxHeight = Number(options.maxHeight || 1800);
  const initialQuality = Number(options.quality || 0.82);
  const minQuality = Number(options.minQuality || 0.6);
  const maxBytes = Number(options.maxBytes || 950 * 1024);

  const img = await loadImage(src);
  const ratio = Math.min(maxWidth / img.width, maxHeight / img.height, 1);
  const width = Math.max(1, Math.round(img.width * ratio));
  const height = Math.max(1, Math.round(img.height * ratio));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return src;
  }

  ctx.drawImage(img, 0, 0, width, height);

  const preferredMimeType = typeof options.outputMimeType === 'string' && options.outputMimeType.trim() !== ''
    ? options.outputMimeType.trim()
    : 'image/webp';
  const encodeCanvas = (mimeType, quality) => {
    const encoded = canvas.toDataURL(mimeType, quality);
    return typeof encoded === 'string' && encoded.startsWith(`data:${mimeType}`)
      ? encoded
      : '';
  };

  let quality = initialQuality;
  let output = encodeCanvas(preferredMimeType, quality);
  if (!output) {
    output = canvas.toDataURL('image/jpeg', quality);
  }
  while (output.length > maxBytes && quality > minQuality) {
    quality -= 0.08;
    output = encodeCanvas(preferredMimeType, quality) || canvas.toDataURL('image/jpeg', quality);
  }

  return output;
};

const optimizeImageFile = async (file, options = {}) => {
  const rawDataUrl = await readFileAsDataUrl(file);

  if (!file.type.startsWith('image/')) {
    return rawDataUrl;
  }

  // SVG should remain as-is; raster compression pipeline is for bitmap images.
  if (file.type === 'image/svg+xml') {
    return rawDataUrl;
  }

  return resizeDataUrl(rawDataUrl, options);
};

const dataUrlToUploadFile = async (dataUrl, filenameHint = 'bild') => {
  if (!isDataImageUrl(dataUrl)) {
    throw new Error('Ogiltig inbäddad bild.');
  }

  const match = dataUrl.match(/^data:([^;,]+)?(?:;(base64))?,(.*)$/s);
  if (!match) {
    throw new Error('Kunde inte tolka inbäddad bilddata.');
  }

  const mimeTypeRaw = typeof match[1] === 'string' ? match[1].trim().toLowerCase() : '';
  const mimeType = mimeTypeRaw || 'image/jpeg';
  const isBase64 = match[2] === 'base64';
  const payloadRaw = typeof match[3] === 'string' ? match[3] : '';

  let blob;
  try {
    if (isBase64) {
      const binary = window.atob(payloadRaw.replace(/\s+/g, ''));
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i += 1) {
        bytes[i] = binary.charCodeAt(i);
      }
      blob = new Blob([bytes], { type: mimeType });
    } else {
      const decoded = decodeURIComponent(payloadRaw.replace(/\+/g, '%20'));
      blob = new Blob([decoded], { type: mimeType });
    }
  } catch (error) {
    throw new Error('Kunde inte avkoda inbäddad bilddata.');
  }

  if (!(blob instanceof Blob) || blob.size <= 0) {
    throw new Error('Inbäddad bilddata var tom.');
  }

  const extByMime = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'image/avif': 'avif',
    'image/svg+xml': 'svg'
  };
  const extension = extByMime[mimeType] || 'jpg';
  const base = slugFromName(filenameHint || 'bild') || 'bild';
  return new File([blob], `${base}.${extension}`, { type: mimeType });
};

const optimizeImageFileForUpload = async (file, options = {}) => {
  if (!(file instanceof File)) {
    return file;
  }
  if (!file.type || !file.type.startsWith('image/')) {
    return file;
  }

  // Preserve vector/animated formats as-is.
  if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
    return file;
  }

  const optimizedDataUrl = await optimizeImageFile(file, options);
  if (!isDataImageUrl(optimizedDataUrl)) {
    return file;
  }

  const optimizedFile = await dataUrlToUploadFile(optimizedDataUrl, file.name || 'bild');
  if (!(optimizedFile instanceof File) || optimizedFile.size <= 0) {
    return file;
  }
  return optimizedFile;
};

const uploadOptimizedImageFile = async (file, options = {}) => {
  const prepared = await optimizeImageFileForUpload(file, {
    maxWidth: Number(options.maxWidth || 2200),
    maxHeight: Number(options.maxHeight || 2200),
    quality: Number(options.quality || 0.82),
    minQuality: Number(options.minQuality || 0.58),
    maxBytes: Number(options.maxBytes || 1200 * 1024)
  });
  const filenameHint = typeof options.filenameHint === 'string' ? options.filenameHint : slugFromName(file.name || 'bild');
  return apiUploadImage(prepared, { filenameHint });
};

const toHex = (value, fallback = '#000000') => {
  if (typeof value !== 'string') {
    return fallback;
  }

  const hexMatch = value.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hexMatch) {
    if (hexMatch[1].length === 3) {
      const [r, g, b] = hexMatch[1].split('');
      return `#${r}${r}${g}${g}${b}${b}`;
    }
    return value;
  }

  return fallback;
};

const slugFromName = (name) =>
  name
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/i, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const linesToArray = (value) =>
  String(value || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

const paragraphsToArray = (value) =>
  String(value || '')
    .split(/\n\s*\n/g)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

const arrayToParagraphText = (items) => (Array.isArray(items) ? items.join('\n\n') : '');
const arrayToLineText = (items) => (Array.isArray(items) ? items.join('\n') : '');
const normalizeFontKey = (value, allowed, fallback) => {
  const normalized = String(value || '').trim().toLowerCase();
  return allowed.includes(normalized) ? normalized : fallback;
};

const normalizeFontWeight = (value, fallback) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return fallback;
  }
  const rounded = Math.round(numeric);
  return FONT_WEIGHT_VALUES.includes(rounded) ? rounded : fallback;
};

const normalizeFontStyle = (value, fallback = 'normal') => {
  const normalized = String(value || '').trim().toLowerCase();
  return FONT_STYLE_VALUES.includes(normalized) ? normalized : fallback;
};

const normalizeImageEntries = (entries = []) =>
  (Array.isArray(entries) ? entries : [])
    .filter((entry) => entry && typeof entry === 'object')
    .map((entry) => ({
      src: typeof entry.src === 'string' ? entry.src.trim() : '',
      alt: typeof entry.alt === 'string' ? entry.alt.trim() : ''
    }))
    .filter((entry) => entry.src);

const readImageEntriesFromSlots = (slots = []) =>
  normalizeImageEntries(
    (Array.isArray(slots) ? slots : []).map((slot) => ({
      src: slot && slot.src && typeof slot.src.value === 'string' ? slot.src.value : '',
      alt: slot && slot.alt && typeof slot.alt.value === 'string' ? slot.alt.value : ''
    }))
  );

const writeImageEntriesToSlots = (slots = [], entries = []) => {
  const normalizedSlots = Array.isArray(slots) ? slots : [];
  const normalizedEntries = normalizeImageEntries(entries);
  normalizedSlots.forEach((slot, index) => {
    const entry = normalizedEntries[index] || { src: '', alt: '' };
    if (slot && slot.src) {
      slot.src.value = entry.src || '';
    }
    if (slot && slot.alt) {
      slot.alt.value = entry.alt || '';
    }
  });
};

const mergeImageEntriesByBaseOrder = (baseEntries = [], localizedEntries = []) => {
  const normalizedBase = normalizeImageEntries(baseEntries);
  const normalizedLocalized = normalizeImageEntries(localizedEntries);
  if (normalizedBase.length === 0) {
    return [];
  }
  if (normalizedLocalized.length === 0) {
    return normalizedBase;
  }

  const localizedAltBySrc = new Map();
  normalizedLocalized.forEach((entry) => {
    localizedAltBySrc.set(normalizeComparableImageSrc(entry.src), entry.alt || '');
  });

  return normalizedBase.map((entry) => {
    const key = normalizeComparableImageSrc(entry.src);
    const localizedAlt = localizedAltBySrc.get(key);
    return {
      src: entry.src,
      alt: typeof localizedAlt === 'string' && localizedAlt.trim() !== '' ? localizedAlt.trim() : entry.alt
    };
  });
};

const syncProjectSampleOrderAcrossLanguages = () => {
  if (!state.translations || typeof state.translations !== 'object') {
    return;
  }

  const baseSamples = normalizeImageEntries(state.content.project && state.content.project.samples);
  if (baseSamples.length === 0) {
    return;
  }

  Object.keys(state.translations).forEach((language) => {
    const pack = state.translations[language];
    if (!pack || typeof pack !== 'object') {
      return;
    }
    const localizedSamples = getPath(pack, 'project.samples');
    if (!Array.isArray(localizedSamples) || localizedSamples.length === 0) {
      return;
    }

    const aligned = mergeImageEntriesByBaseOrder(baseSamples, localizedSamples);
    setPath(pack, 'project.samples', aligned);
  });
};

const DEFAULT_SECTION_IMAGE_CANDIDATES = [
  'images/ola-portrait.jpg',
  'images/ola-plein-air-sandemar.jpg',
  'images/monterade-solar.jpg',
  'images/sol1.jpg',
  'images/sol2.jpg',
  'images/sol3.jpg',
  'images/sol4.jpg'
];
let serverImageCandidates = [];

const escapeHtml = (value) =>
  String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

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

const renderInlineFormattedText = (node, value) => {
  if (!node) {
    return;
  }
  const fragment = document.createDocumentFragment();
  appendInlineFormattedText(fragment, value);
  node.textContent = '';
  node.appendChild(fragment);
};

const sanitizeStudioSameOriginUrl = (value) => {
  const raw = typeof value === 'string' ? value.trim() : '';
  if (!raw) {
    return '';
  }

  try {
    const url = new URL(raw, window.location.origin);
    if (!['http:', 'https:'].includes(url.protocol)) {
      return '';
    }
    if (url.origin !== window.location.origin) {
      return '';
    }
    return url.href;
  } catch (error) {
    return '';
  }
};

const normalizeArtworkPreviewUrlForStudio = (value) => {
  const raw = sanitizeStudioSameOriginUrl(value);
  if (!raw) {
    return '';
  }

  try {
    const url = new URL(raw, window.location.origin);
    const artworkMatch = url.pathname.match(/^\/verk\/([^/]+)\/?$/i);
    if (artworkMatch && artworkMatch[1]) {
      return url.href;
    }

    const previewMatch = url.pathname.match(/^\/artwork-preview\.html$/i);
    const previewSlug = previewMatch ? String(url.searchParams.get('slug') || '').trim() : '';
    if (!previewMatch || !previewSlug) {
      return url.href;
    }

    const canonical = new URL(`/verk/${encodeURIComponent(decodeURIComponent(previewSlug))}`, window.location.origin);
    const lang = String(url.searchParams.get('lang') || 'sv').trim().toLowerCase();
    canonical.searchParams.set('lang', lang === 'en' ? 'en' : 'sv');
    if (url.hash) {
      canonical.hash = url.hash.replace(/^#/, '');
    }
    return canonical.href;
  } catch (error) {
    return raw;
  }
};

const getPath = (obj, path) => {
  if (!obj || typeof obj !== 'object' || typeof path !== 'string' || path.trim() === '') {
    return undefined;
  }

  return path.split('.').reduce((acc, part) => {
    if (acc && typeof acc === 'object' && Object.prototype.hasOwnProperty.call(acc, part)) {
      return acc[part];
    }
    return undefined;
  }, obj);
};

const setPath = (obj, path, value) => {
  if (!obj || typeof obj !== 'object' || typeof path !== 'string' || path.trim() === '') {
    return;
  }

  const keys = path.split('.');
  let cursor = obj;
  for (let i = 0; i < keys.length - 1; i += 1) {
    const key = keys[i];
    if (!cursor[key] || typeof cursor[key] !== 'object' || Array.isArray(cursor[key])) {
      cursor[key] = {};
    }
    cursor = cursor[key];
  }
  cursor[keys[keys.length - 1]] = value;
};

const hasOwnKeys = (value) =>
  Boolean(value && typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length > 0);

const addRevToSrc = (src) => {
  if (typeof src !== 'string' || src.trim() === '' || src.startsWith('data:') || src.startsWith('blob:')) {
    return src;
  }

  const separator = src.includes('?') ? '&' : '?';
  return `${src}${separator}v=${ASSET_REV}`;
};

const getImageVariantCandidateSrc = (src, variant) => {
  if (typeof src !== 'string') {
    return '';
  }

  const trimmed = src.trim();
  const normalizedVariant = typeof variant === 'string' ? variant.trim().replace(/^\/+|\/+$/g, '') : '';
  if (
    !trimmed ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:') ||
    /^https?:\/\//i.test(trimmed) ||
    !trimmed.startsWith('images/') ||
    !normalizedVariant ||
    trimmed.includes(`/${normalizedVariant}/`)
  ) {
    return '';
  }

  const clean = trimmed.split('?')[0].split('#')[0];
  const fileName = clean.split('/').pop() || '';
  if (!fileName) {
    return '';
  }

  return `images/${normalizedVariant}/${fileName}`;
};

const getThumbCandidateSrc = (src) => getImageVariantCandidateSrc(src, 'thumbs');

const getWebCandidateSrc = (src) => getImageVariantCandidateSrc(src, 'web');

const getArtworkPreviewSrc = (item) => {
  if (!item || typeof item !== 'object') {
    return '';
  }

  const manual = typeof item.previewSrc === 'string' ? item.previewSrc.trim() : '';
  if (manual) {
    return manual;
  }

  return getThumbCandidateSrc(item.src) || getWebCandidateSrc(item.src) || (typeof item.src === 'string' ? item.src : '');
};

const normalizeComparableImageSrc = (value) => {
  if (typeof value !== 'string') {
    return '';
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return '';
  }
  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
    return trimmed;
  }
  return trimmed.replace(/^\//, '');
};

const buildHomeShareImageCandidateOptions = () => {
  const heroSrc = typeof state.content?.hero?.image === 'string' ? state.content.hero.image.trim() : '';
  const localizedArtworks = getLocalizedArtworksForEditor();
  const seen = new Set();
  const artworkOptions = [];

  if (heroSrc) {
    seen.add(normalizeComparableImageSrc(heroSrc));
  }

  localizedArtworks.forEach((item, index) => {
    if (!item || typeof item !== 'object') {
      return;
    }
    const src = typeof item.src === 'string' ? item.src.trim() : '';
    if (!src) {
      return;
    }
    const key = normalizeComparableImageSrc(src);
    if (!key || seen.has(key)) {
      return;
    }
    seen.add(key);
    const title = typeof item.title === 'string' && item.title.trim() !== '' ? item.title.trim() : `Verk ${index + 1}`;
    artworkOptions.push({
      value: src,
      label: `Verk ${index + 1}: ${title}`
    });
  });

  return { heroSrc, artworkOptions };
};

const collectSectionImageCandidates = () => {
  const collected = new Set(DEFAULT_SECTION_IMAGE_CANDIDATES);
  const push = (value) => {
    const src = typeof value === 'string' ? value.trim() : '';
    if (!src) {
      return;
    }
    if (/^data:/i.test(src) || /^blob:/i.test(src)) {
      return;
    }
    collected.add(src);
  };

  const artworks = Array.isArray(state.content?.gallery?.artworks) ? state.content.gallery.artworks : [];
  artworks.forEach((item) => {
    push(item && item.src);
  });

  const heroSlides = Array.isArray(state.content?.hero?.slides) ? state.content.hero.slides : [];
  heroSlides.forEach((slide) => {
    push(slide && slide.src);
  });
  push(state.content?.hero?.image);
  push(state.content?.seo?.home?.image);

  const about = state.content && state.content.about && typeof state.content.about === 'object' ? state.content.about : {};
  push(about.portraitImage);
  push(about.materialImage);
  push(about.featureImage);

  const processImages = Array.isArray(about.processImages) ? about.processImages : [];
  processImages.forEach((entry) => push(entry && entry.src));

  const project = state.content && state.content.project && typeof state.content.project === 'object' ? state.content.project : {};
  push(project.collageImage);
  const samples = Array.isArray(project.samples) ? project.samples : [];
  samples.forEach((entry) => push(entry && entry.src));
  const serverList = Array.isArray(serverImageCandidates) ? serverImageCandidates : [];
  serverList.forEach((src) => push(src));

  return Array.from(collected).sort((a, b) => a.localeCompare(b, 'sv'));
};

const loadServerImageCandidates = async () => {
  try {
    const response = await apiJson('api/images.php');
    const list = Array.isArray(response.images) ? response.images : [];
    serverImageCandidates = list
      .map((item) => (typeof item === 'string' ? item.trim() : ''))
      .filter((item) => item !== '');
    renderSectionImagePickers();
  } catch (error) {
    // Keep Studio usable even if listing endpoint is unavailable.
    serverImageCandidates = [];
  }
};

const formatImagePickerOptionLabel = (src) => {
  const raw = typeof src === 'string' ? src.trim() : '';
  if (!raw) {
    return '';
  }
  const clean = raw.split('?')[0].split('#')[0];
  const fileName = clean.split('/').pop() || raw;
  return fileName || raw;
};

const renderImagePickerSelect = (selectNode, inputNode, labelPrefix) => {
  if (!selectNode || !inputNode) {
    return;
  }
  const options = collectSectionImageCandidates();
  const current = typeof inputNode.value === 'string' ? inputNode.value.trim() : '';
  const optionMarkup = [`<option value="">${escapeHtml(labelPrefix)}</option>`];

  if (current && !options.includes(current)) {
    optionMarkup.push(
      `<option value="${escapeHtml(current)}">${escapeHtml(`${formatImagePickerOptionLabel(current)} (nuvarande)`)}</option>`
    );
  }

  options.forEach((src) => {
    optionMarkup.push(`<option value="${escapeHtml(src)}">${escapeHtml(formatImagePickerOptionLabel(src))}</option>`);
  });

  selectNode.innerHTML = optionMarkup.join('');
  if (current && options.includes(current)) {
    selectNode.value = current;
  } else {
    selectNode.value = '';
  }
};

const renderSectionImagePickers = () => {
  renderImagePickerSelect(el.aboutPortraitImagePick, el.aboutPortraitImage, 'Välj porträttbild');
  renderImagePickerSelect(el.materialsImagePick, el.materialsImage, 'Välj materialbild');
  renderImagePickerSelect(el.aboutFeatureImagePick, el.aboutFeatureImage, 'Välj helbild');
  renderImagePickerSelect(el.projectCollageImagePick, el.projectCollageImage, 'Välj kollagebild');
  renderImagePickerSelect(el.projectSample1Pick, el.projectSample1Src, 'Välj exempelbild 1');
  renderImagePickerSelect(el.projectSample2Pick, el.projectSample2Src, 'Välj exempelbild 2');
  renderImagePickerSelect(el.projectSample3Pick, el.projectSample3Src, 'Välj exempelbild 3');
  renderImagePickerSelect(el.projectSample4Pick, el.projectSample4Src, 'Välj exempelbild 4');
  renderSectionImagePreviews();
};

const renderSectionImagePreview = (previewNode, inputNode, emptyMessage) => {
  if (!previewNode || !inputNode) {
    return;
  }
  const src = typeof inputNode.value === 'string' ? inputNode.value.trim() : '';
  if (!src) {
    previewNode.innerHTML = `<span class="artwork-editor-placeholder">${escapeHtml(emptyMessage)}</span>`;
    return;
  }

  const previewSrc = /^https?:\/\//i.test(src) ? src : addRevToSrc(src);
  previewNode.innerHTML = `
    <img src="${escapeHtml(previewSrc)}" alt="Förhandsvisning" loading="lazy" decoding="async" />
    <small>${escapeHtml(src)}</small>
  `;
};

const renderSectionImagePreviews = () => {
  renderSectionImagePreview(el.aboutPortraitImagePreview, el.aboutPortraitImage, 'Ingen porträttbild vald ännu.');
  renderSectionImagePreview(el.materialsImagePreview, el.materialsImage, 'Ingen materialbild vald ännu.');
  renderSectionImagePreview(el.aboutFeatureImagePreview, el.aboutFeatureImage, 'Ingen helbild vald ännu.');
  renderSectionImagePreview(el.projectCollageImagePreview, el.projectCollageImage, 'Ingen kollagebild vald ännu.');
  renderSectionImagePreview(el.projectSample1Preview, el.projectSample1Src, 'Ingen exempelbild 1 vald ännu.');
  renderSectionImagePreview(el.projectSample2Preview, el.projectSample2Src, 'Ingen exempelbild 2 vald ännu.');
  renderSectionImagePreview(el.projectSample3Preview, el.projectSample3Src, 'Ingen exempelbild 3 vald ännu.');
  renderSectionImagePreview(el.projectSample4Preview, el.projectSample4Src, 'Ingen exempelbild 4 vald ännu.');
};

const renderSeoHomeImageControls = () => {
  if (!el.seoHomeImage || !el.seoHomeImageSelect || !el.seoHomeImagePreview) {
    return;
  }

  const { heroSrc, artworkOptions } = buildHomeShareImageCandidateOptions();
  const currentValue = (el.seoHomeImage.value || '').trim();
  const currentKey = normalizeComparableImageSrc(currentValue);
  const heroKey = normalizeComparableImageSrc(heroSrc);

  let selectedValue = SEO_HOME_IMAGE_OPTION_CUSTOM;
  if (heroKey && currentKey && currentKey === heroKey) {
    selectedValue = SEO_HOME_IMAGE_OPTION_HERO;
  } else {
    const match = artworkOptions.find((option) => normalizeComparableImageSrc(option.value) === currentKey);
    if (match) {
      selectedValue = match.value;
    }
  }

  const optionMarkup = [];
  const allowedValues = new Set([SEO_HOME_IMAGE_OPTION_CUSTOM]);
  if (heroSrc) {
    allowedValues.add(SEO_HOME_IMAGE_OPTION_HERO);
    optionMarkup.push(
      `<option value="${SEO_HOME_IMAGE_OPTION_HERO}">Hero-bild (${escapeHtml(heroSrc)})</option>`
    );
  }
  artworkOptions.forEach((option) => {
    allowedValues.add(option.value);
    optionMarkup.push(
      `<option value="${escapeHtml(option.value)}">${escapeHtml(option.label)}</option>`
    );
  });
  optionMarkup.push(`<option value="${SEO_HOME_IMAGE_OPTION_CUSTOM}">Egen bild-URL / src</option>`);

  el.seoHomeImageSelect.innerHTML = optionMarkup.join('');
  if (!allowedValues.has(selectedValue)) {
    selectedValue = SEO_HOME_IMAGE_OPTION_CUSTOM;
  }
  el.seoHomeImageSelect.value = selectedValue;

  let previewSrc = currentValue;
  if (selectedValue === SEO_HOME_IMAGE_OPTION_HERO && heroSrc) {
    previewSrc = heroSrc;
  } else if (selectedValue !== SEO_HOME_IMAGE_OPTION_CUSTOM) {
    previewSrc = selectedValue;
  }
  previewSrc = typeof previewSrc === 'string' ? previewSrc.trim() : '';

  if (!previewSrc) {
    el.seoHomeImagePreview.innerHTML = '<span class="artwork-editor-placeholder">Ingen delningsbild vald ännu.</span>';
    return;
  }

  const previewImageSrc = /^https?:\/\//i.test(previewSrc) ? previewSrc : addRevToSrc(previewSrc);
  el.seoHomeImagePreview.innerHTML = `
    <img src="${escapeHtml(previewImageSrc)}" alt="Förhandsvisning delningsbild" loading="lazy" decoding="async" />
    <small>${escapeHtml(previewSrc)}</small>
  `;
};

const applySeoHomeImageSelection = () => {
  if (!el.seoHomeImageSelect || !el.seoHomeImage) {
    return;
  }

  const selectedValue = (el.seoHomeImageSelect.value || '').trim();
  if (!selectedValue || selectedValue === SEO_HOME_IMAGE_OPTION_CUSTOM) {
    return;
  }

  if (selectedValue === SEO_HOME_IMAGE_OPTION_HERO) {
    el.seoHomeImage.value = (el.heroImage && typeof el.heroImage.value === 'string' ? el.heroImage.value : '').trim();
    return;
  }

  el.seoHomeImage.value = selectedValue;
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

const loadStored = () => {
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

  storedGallery.artworks = storedArtworks.map((item, index) => {
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
    if (Number(item.order) === index + 1 && Number(fileItem.order) && Number(fileItem.order) !== index + 1) {
      merged.order = Number(fileItem.order);
    }
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

const migrateStoredForStudio = (stored, currentBaseContent) => {
  if (!stored || typeof stored !== 'object') {
    return stored;
  }

  const next = deepMerge({}, stored);
  const storedHero = next.hero && typeof next.hero === 'object' ? next.hero : null;
  const baseHero = currentBaseContent && currentBaseContent.hero ? currentBaseContent.hero : null;

  if (
    storedHero &&
    storedHero.mode === 'still' &&
    !storedHero.modeUpdatedAt &&
    baseHero &&
    baseHero.mode === 'slideshow' &&
    Array.isArray(baseHero.slides) &&
    baseHero.slides.length > 1
  ) {
    delete storedHero.mode;
  }

  const storedGallery = next.gallery && typeof next.gallery === 'object' ? next.gallery : null;
  const baseGallery = currentBaseContent && currentBaseContent.gallery ? currentBaseContent.gallery : null;
  if (storedGallery) {
    storedGallery.removedSrcs = (Array.isArray(storedGallery.removedSrcs) ? storedGallery.removedSrcs : [])
      .map((src) => (typeof src === 'string' ? src.trim() : ''))
      .filter(Boolean);
  }
  mergeMissingGalleryItems(storedGallery, baseGallery);

  return next;
};

const fileContent = deepMerge(DEFAULT_CONTENT, window.PORTFOLIO_CONTENT || {});
const liveOverrides =
  window.PORTFOLIO_OVERRIDES && typeof window.PORTFOLIO_OVERRIDES === 'object' ? window.PORTFOLIO_OVERRIDES : null;
const fileTranslations =
  window.PORTFOLIO_TRANSLATIONS && typeof window.PORTFOLIO_TRANSLATIONS === 'object'
    ? window.PORTFOLIO_TRANSLATIONS
    : {};
const liveTranslationOverrides =
  liveOverrides && liveOverrides.translations && typeof liveOverrides.translations === 'object'
    ? liveOverrides.translations
    : {};
const liveContentOverrides = deepMerge({}, liveOverrides || {});
if (Object.prototype.hasOwnProperty.call(liveContentOverrides, 'translations')) {
  delete liveContentOverrides.translations;
}
const baseContent = deepMerge(fileContent, liveContentOverrides);
const storedPayload = migrateStoredForStudio(loadStored(), baseContent) || {};
const storedTranslations =
  storedPayload && storedPayload.translations && typeof storedPayload.translations === 'object'
    ? storedPayload.translations
    : {};
if (storedPayload && Object.prototype.hasOwnProperty.call(storedPayload, 'translations')) {
  delete storedPayload.translations;
}
const baseTranslationOverrides = deepMerge(liveTranslationOverrides, storedTranslations);
const state = {
  content: deepMerge(baseContent, storedPayload),
  translations: deepMerge({}, baseTranslationOverrides)
};
const uiState = {
  selectedArtworkIndex: 0,
  artworkListScrollTop: 0,
  selectedHeroSlideIndex: 0,
  englishSyncSourceSnapshot: {},
  editLanguage: readStoredStudioLanguage() || 'sv',
  collapsedSections: readStoredSectionCollapseMap(),
  analyticsDays: 28,
  analyticsTab: 'channels',
  analyticsData: null,
  inquiriesFilter: 'all',
  inquiriesData: [],
  saveButtonResetTimer: null,
  pendingSectionUploadTarget: '',
  pendingSectionUploadLabel: 'bild'
};

const DEFAULT_STUDIO_CATEGORY_LABELS = Object.freeze({
  all: 'Alla',
  nature: 'Natur',
  sea: 'Hav',
  portrait: 'Porträtt',
  city: 'Stad'
});

const normalizeCategoryKey = (value) =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);

const normalizeArtworkCategoryValue = (value) => {
  const normalized = normalizeCategoryKey(value);
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
    const normalized = normalizeArtworkCategoryValue(entry);
    if (normalized && !categories.includes(normalized)) {
      categories.push(normalized);
    }
  });

  const fallbackKey = normalizeArtworkCategoryValue(fallback);
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
  const primary = normalizeArtworkCategoryValue(item.category);
  if (primary && !categories.includes(primary)) {
    categories.unshift(primary);
  }

  if (categories.length === 0) {
    return normalizeArtworkCategoryList([], fallback);
  }

  return categories;
};

const setArtworkCategoryKeys = (item, values, fallback = 'nature') => {
  if (!item || typeof item !== 'object') {
    return [];
  }
  const categories = normalizeArtworkCategoryList(values, fallback);
  item.categories = categories.slice();
  item.category = categories[0] || normalizeArtworkCategoryValue(fallback) || '';
  return categories;
};

const humanizeCategoryKey = (value) => {
  const key = String(value || '').trim();
  if (!key) {
    return 'Kategori';
  }
  return key
    .split(/[-_]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};
const createSocialChannel = (overrides = {}) => ({
  label: '',
  url: '',
  ...overrides
});

const getEditingLanguage = () => (uiState.editLanguage === 'en' ? 'en' : 'sv');
const isEditingDefaultLanguage = () => getEditingLanguage() === 'sv';
const ARTWORK_TRANSLATABLE_FIELDS = ['title', 'format', 'alt', 'priceLabel', 'collectorNote', 'seoTitle', 'seoDescription'];
const SEO_HOME_IMAGE_OPTION_HERO = '__hero__';
const SEO_HOME_IMAGE_OPTION_CUSTOM = '__custom__';
const ENGLISH_SYNC_METADATA_KEY = '_studioSyncFromSv';
const EN_SYNC_STRING_JOBS = [
  { path: 'site.title', field: 'seotitle' },
  { path: 'site.metaDescription', field: 'seodescription' },
  { path: 'hero.eyebrow', field: 'generic' },
  { path: 'hero.title', field: 'title' },
  { path: 'hero.intro', field: 'generic' },
  { path: 'hero.line', field: 'generic' },
  { path: 'hero.imageAlt', field: 'alt' },
  { path: 'gallery.eyebrow', field: 'generic' },
  { path: 'gallery.heading', field: 'title' },
  { path: 'gallery.pageHeading', field: 'title' },
  { path: 'gallery.subheading', field: 'generic' },
  { path: 'about.heading', field: 'title' },
  { path: 'about.portraitAlt', field: 'alt' },
  { path: 'about.dayJobLine', field: 'generic' },
  { path: 'about.materialsHeading', field: 'title' },
  { path: 'about.materialsBody', field: 'generic' },
  { path: 'about.materialImageAlt', field: 'alt' },
  { path: 'about.inspirationHeading', field: 'title' },
  { path: 'about.inspirationBody', field: 'generic' },
  { path: 'about.featureImageAlt', field: 'alt' },
  { path: 'about.ambitionsHeading', field: 'title' },
  { path: 'about.recognitionHeading', field: 'title' },
  { path: 'project.eyebrow', field: 'generic' },
  { path: 'project.heading', field: 'title' },
  { path: 'project.description', field: 'generic' },
  { path: 'project.collageAlt', field: 'alt' },
  { path: 'project.sampleHeading', field: 'title' },
  { path: 'contact.eyebrow', field: 'generic' },
  { path: 'contact.heading', field: 'title' },
  { path: 'contact.body', field: 'generic' },
  { path: 'contact.emailLabel', field: 'generic' },
  { path: 'seo.home.title', field: 'seotitle' },
  { path: 'seo.home.description', field: 'seodescription' },
  { path: 'seo.home.imageAlt', field: 'alt' }
];
const EN_SYNC_ARRAY_JOBS = [
  { path: 'about.paragraphs', field: 'generic' },
  { path: 'about.ambitions', field: 'generic' },
  { path: 'about.recognitionItems', field: 'generic' }
];
const EN_SYNC_IMAGE_ENTRY_JOBS = [
  { path: 'about.processImages', field: 'alt' },
  { path: 'project.samples', field: 'alt' }
];

const getLanguageLabel = (language) => (language === 'en' ? 'English' : 'Svenska');

const getFileTranslationPack = (language) => {
  const pack = fileTranslations && fileTranslations[language];
  return pack && typeof pack === 'object' ? pack : {};
};

const getLanguageOverridePack = (language) => {
  const pack = state.translations && state.translations[language];
  return pack && typeof pack === 'object' ? pack : {};
};

const ensureLanguageOverridePack = (language) => {
  if (!state.translations || typeof state.translations !== 'object') {
    state.translations = {};
  }
  if (!state.translations[language] || typeof state.translations[language] !== 'object') {
    state.translations[language] = {};
  }
  return state.translations[language];
};

const getLocalizedContentForEditor = (language = getEditingLanguage()) => {
  if (language === 'sv') {
    return state.content;
  }
  return deepMerge(state.content, deepMerge(getFileTranslationPack(language), getLanguageOverridePack(language)));
};

const getBaseCategoryLabels = () => {
  const map = state.content.gallery && state.content.gallery.categoryLabels;
  return map && typeof map === 'object' ? map : {};
};

const getCategoryKeys = () => {
  const keys = new Set();
  const labels = getBaseCategoryLabels();

  Object.keys(labels).forEach((key) => {
    const normalized = normalizeCategoryKey(key);
    if (normalized && normalized !== 'all') {
      keys.add(normalized);
    }
  });

  const artworks = Array.isArray(state.content.gallery?.artworks) ? state.content.gallery.artworks : [];
  artworks.forEach((item) => {
    getArtworkCategoryKeys(item, '').forEach((category) => {
      if (category && category !== 'all') {
        keys.add(category);
      }
    });
  });

  const defaultCategory = normalizeCategoryKey(state.content.gallery?.autoDiscover?.defaultCategory || '');
  if (defaultCategory && defaultCategory !== 'all') {
    keys.add(defaultCategory);
  }

  if (keys.size === 0) {
    keys.add('nature');
  }

  return Array.from(keys);
};

const getFirstGalleryCategoryKey = () => getCategoryKeys()[0] || 'nature';

const getLocalizedCategoryLabelsForEditor = (language = getEditingLanguage()) => {
  const localized = getPath(getLocalizedContentForEditor(language), 'gallery.categoryLabels');
  const localizedMap = localized && typeof localized === 'object' ? localized : {};
  const baseMap = getBaseCategoryLabels();

  const labels = {};
  labels.all =
    typeof localizedMap.all === 'string' && localizedMap.all.trim() !== ''
      ? localizedMap.all.trim()
      : typeof baseMap.all === 'string' && baseMap.all.trim() !== ''
        ? baseMap.all.trim()
        : DEFAULT_STUDIO_CATEGORY_LABELS.all;

  getCategoryKeys().forEach((key) => {
    const localizedLabel = typeof localizedMap[key] === 'string' ? localizedMap[key].trim() : '';
    const baseLabel = typeof baseMap[key] === 'string' ? baseMap[key].trim() : '';
    labels[key] = localizedLabel || baseLabel || humanizeCategoryKey(key);
  });

  return labels;
};

const getLocalizedArtworksForEditor = (language = getEditingLanguage()) => {
  const baseArtworks = Array.isArray(state.content.gallery?.artworks) ? state.content.gallery.artworks : [];
  if (language === 'sv') {
    return baseArtworks;
  }

  const localizedMap = getPath(getLocalizedContentForEditor(language), 'gallery.artworkTextBySrc');
  const textMap = localizedMap && typeof localizedMap === 'object' ? localizedMap : {};

  return baseArtworks.map((item) => {
    const src = item && typeof item.src === 'string' ? item.src.trim() : '';
    const textOverride = src && textMap[src] && typeof textMap[src] === 'object' ? textMap[src] : null;
    if (!textOverride) {
      return item;
    }
    return {
      ...item,
      title: typeof textOverride.title === 'string' ? textOverride.title : item.title,
      format: typeof textOverride.format === 'string' ? textOverride.format : item.format,
      alt: typeof textOverride.alt === 'string' ? textOverride.alt : item.alt,
      priceLabel: typeof textOverride.priceLabel === 'string' ? textOverride.priceLabel : item.priceLabel,
      collectorNote: typeof textOverride.collectorNote === 'string' ? textOverride.collectorNote : item.collectorNote,
      seoTitle: typeof textOverride.seoTitle === 'string' ? textOverride.seoTitle : item.seoTitle,
      seoDescription: typeof textOverride.seoDescription === 'string' ? textOverride.seoDescription : item.seoDescription,
      shareImage: typeof textOverride.shareImage === 'string' ? textOverride.shareImage : item.shareImage
    };
  });
};

const ensureArtworkTranslationEntry = (language, src) => {
  const normalizedSrc = typeof src === 'string' ? src.trim() : '';
  if (!normalizedSrc) {
    return null;
  }

  const pack = ensureLanguageOverridePack(language);
  if (!pack.gallery || typeof pack.gallery !== 'object') {
    pack.gallery = {};
  }
  if (!pack.gallery.artworkTextBySrc || typeof pack.gallery.artworkTextBySrc !== 'object') {
    pack.gallery.artworkTextBySrc = {};
  }
  if (!pack.gallery.artworkTextBySrc[normalizedSrc] || typeof pack.gallery.artworkTextBySrc[normalizedSrc] !== 'object') {
    const localizedMap = getPath(getLocalizedContentForEditor(language), 'gallery.artworkTextBySrc');
    const seed =
      localizedMap && typeof localizedMap === 'object' && localizedMap[normalizedSrc] && typeof localizedMap[normalizedSrc] === 'object'
        ? localizedMap[normalizedSrc]
        : {};
    pack.gallery.artworkTextBySrc[normalizedSrc] = deepMerge({}, seed);
  }
  return pack.gallery.artworkTextBySrc[normalizedSrc];
};

const hashSyncSource = (value) => {
  const input = typeof value === 'string' ? value.trim() : '';
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16);
};

const getEnglishSyncMetadataStore = (language = 'en', create = false) => {
  const pack = create ? ensureLanguageOverridePack(language) : getLanguageOverridePack(language);
  if (!pack || typeof pack !== 'object') {
    return null;
  }
  if (!pack[ENGLISH_SYNC_METADATA_KEY] || typeof pack[ENGLISH_SYNC_METADATA_KEY] !== 'object' || Array.isArray(pack[ENGLISH_SYNC_METADATA_KEY])) {
    if (!create) {
      return null;
    }
    pack[ENGLISH_SYNC_METADATA_KEY] = { entries: {} };
  }
  const meta = pack[ENGLISH_SYNC_METADATA_KEY];
  if (!meta.entries || typeof meta.entries !== 'object' || Array.isArray(meta.entries)) {
    if (!create) {
      return null;
    }
    meta.entries = {};
  }
  return meta.entries;
};

const buildEnglishSyncMetaKey = (entry) => {
  if (!entry || typeof entry !== 'object') {
    return '';
  }
  if (entry.target === 'string' && entry.path) {
    return `string:${entry.path}`;
  }
  if (entry.target === 'array' && entry.arrayPath && Number.isInteger(entry.index)) {
    return `array:${entry.arrayPath}[${entry.index}]`;
  }
  if (entry.target === 'imageEntry' && entry.imagePath && Number.isInteger(entry.index)) {
    return `image:${entry.imagePath}[${entry.index}]`;
  }
  if (entry.target === 'categoryLabel' && entry.categoryKey) {
    return `category:${entry.categoryKey}`;
  }
  if (entry.target === 'artworkField' && entry.artworkSrc && entry.artworkField) {
    return `artwork:${entry.artworkSrc}::${entry.artworkField}`;
  }
  return '';
};

const getEnglishSyncMetaRecord = (key, language = 'en') => {
  const store = getEnglishSyncMetadataStore(language, false);
  if (!store || !key || !Object.prototype.hasOwnProperty.call(store, key)) {
    return null;
  }
  const record = store[key];
  return record && typeof record === 'object' && !Array.isArray(record) ? record : null;
};

const rememberEnglishSyncMetaRecord = (key, sourceSv, translatedEn, language = 'en') => {
  if (!key) {
    return;
  }
  const store = getEnglishSyncMetadataStore(language, true);
  if (!store) {
    return;
  }
  store[key] = {
    sourceHash: hashSyncSource(sourceSv),
    translatedValue: typeof translatedEn === 'string' ? translatedEn.trim() : '',
    updatedAt: new Date().toISOString()
  };
  if (!uiState.englishSyncSourceSnapshot || typeof uiState.englishSyncSourceSnapshot !== 'object') {
    uiState.englishSyncSourceSnapshot = {};
  }
  uiState.englishSyncSourceSnapshot[key] = hashSyncSource(sourceSv);
};

const buildEnglishSyncSourceSnapshot = () => {
  const snapshot = {};
  const sv = state.content || {};

  EN_SYNC_STRING_JOBS.forEach((job) => {
    const source = getPath(sv, job.path);
    if (typeof source !== 'string' || source.trim() === '') {
      return;
    }
    const key = buildEnglishSyncMetaKey({ target: 'string', path: job.path });
    snapshot[key] = hashSyncSource(source);
  });

  EN_SYNC_ARRAY_JOBS.forEach((job) => {
    const sourceItems = getPath(sv, job.path);
    if (!Array.isArray(sourceItems)) {
      return;
    }
    sourceItems.forEach((item, index) => {
      if (typeof item !== 'string' || item.trim() === '') {
        return;
      }
      const key = buildEnglishSyncMetaKey({ target: 'array', arrayPath: job.path, index });
      snapshot[key] = hashSyncSource(item);
    });
  });

  EN_SYNC_IMAGE_ENTRY_JOBS.forEach((job) => {
    const sourceEntries = getPath(sv, job.path);
    if (!Array.isArray(sourceEntries)) {
      return;
    }
    sourceEntries.forEach((item, index) => {
      const alt = item && typeof item.alt === 'string' ? item.alt.trim() : '';
      if (!alt) {
        return;
      }
      const key = buildEnglishSyncMetaKey({ target: 'imageEntry', imagePath: job.path, index });
      snapshot[key] = hashSyncSource(alt);
    });
  });

  const categoryLabels = sv.gallery && sv.gallery.categoryLabels && typeof sv.gallery.categoryLabels === 'object'
    ? sv.gallery.categoryLabels
    : {};
  Object.keys(categoryLabels).forEach((rawKey) => {
    const key = normalizeCategoryKey(rawKey);
    const label = typeof categoryLabels[rawKey] === 'string' ? categoryLabels[rawKey].trim() : '';
    if (!key || !label || key === 'all') {
      return;
    }
    const metaKey = buildEnglishSyncMetaKey({ target: 'categoryLabel', categoryKey: key });
    snapshot[metaKey] = hashSyncSource(label);
  });

  const artworks = Array.isArray(sv.gallery?.artworks) ? sv.gallery.artworks : [];
  artworks.forEach((item) => {
    const src = item && typeof item.src === 'string' ? item.src.trim() : '';
    if (!src) {
      return;
    }
    ARTWORK_TRANSLATABLE_FIELDS.forEach((fieldName) => {
      const source = item && typeof item[fieldName] === 'string' ? item[fieldName].trim() : '';
      if (!source) {
        return;
      }
      const key = buildEnglishSyncMetaKey({
        target: 'artworkField',
        artworkSrc: src,
        artworkField: fieldName
      });
      snapshot[key] = hashSyncSource(source);
    });
  });

  return snapshot;
};

const captureEnglishSyncSourceSnapshot = () => {
  uiState.englishSyncSourceSnapshot = buildEnglishSyncSourceSnapshot();
};

const autoTranslateSvToEn = (value, field) => {
  if (typeof value !== 'string') {
    return '';
  }

  let out = value.trim();
  if (!out) {
    return '';
  }

  // Handle common gallery defaults and patterns.
  out = out.replace(/^Verk\s+(\d+)$/i, 'Work $1');
  out = out.replace(/^Akvarell(?:\s+verk)?\s+(\d+)$/i, 'Watercolor work $1');

  if (field === 'medium' && /^Akvarell på papper$/i.test(out)) {
    return 'Watercolor on paper';
  }
  if (field === 'priceLabel') {
    if (/^Pris på förfrågan$/i.test(out)) {
      return 'Price on request';
    }
    if (/^Såld$/i.test(out)) {
      return 'Sold';
    }
    if (/^Ej till salu$/i.test(out)) {
      return 'Not for sale';
    }
  }

  out = out.replace(/\bAkvarell på papper\b/gi, 'Watercolor on paper');
  out = out.replace(/\bAkvarellverk\b/gi, 'Watercolor work');
  out = out.replace(/\bAkvarell\b/gi, 'Watercolor');

  // Month names commonly used in titles.
  const monthMap = {
    januari: 'January',
    februari: 'February',
    mars: 'March',
    april: 'April',
    maj: 'May',
    juni: 'June',
    juli: 'July',
    augusti: 'August',
    september: 'September',
    oktober: 'October',
    november: 'November',
    december: 'December'
  };
  out = out.replace(
    /\b(januari|februari|mars|april|maj|juni|juli|augusti|september|oktober|november|december)\b/gi,
    (match) => monthMap[match.toLowerCase()] || match
  );

  return out;
};

const OPENAI_TRANSLATION_DEBOUNCE_MS = 650;
const OPENAI_TRANSLATION_MAX_CONCURRENCY = 1;
const openAiArtworkTranslationJobs = new Map();
const openAiArtworkTranslationQueue = [];
const openAiArtworkTranslationQueueKeys = new Set();
let openAiArtworkTranslationActive = 0;
let openAiArtworkTranslationSeq = 0;
let openAiTranslationErrorShown = false;

const stopOpenAiArtworkTranslations = () => {
  // Prevent repeated failing requests (for example, invalid key/scopes).
  openAiArtworkTranslationQueue.length = 0;
  openAiArtworkTranslationQueueKeys.clear();
  openAiArtworkTranslationJobs.forEach((job) => {
    if (job && job.timer) {
      clearTimeout(job.timer);
      job.timer = null;
    }
  });
};

const updateArtworkThumbTitleForSrc = (src, title) => {
  if (!el.artworksEditor) {
    return;
  }
  const normalizedSrc = typeof src === 'string' ? src.trim() : '';
  if (!normalizedSrc) {
    return;
  }
  const nextTitle = typeof title === 'string' ? title : '';
  el.artworksEditor.querySelectorAll('.artwork-thumb[data-src]').forEach((button) => {
    const buttonSrc = (button.getAttribute('data-src') || '').trim();
    if (buttonSrc !== normalizedSrc) {
      return;
    }
    const strong = button.querySelector('strong');
    if (strong) {
      strong.textContent = nextTitle;
    }
    const img = button.querySelector('.artwork-thumb-image img');
    if (img && nextTitle.trim()) {
      img.alt = `Miniatyr ${nextTitle}`;
    }
  });
};

const applyArtworkEnglishTranslationToUi = (src, field, translation) => {
  if (getEditingLanguage() !== 'en' || !el.artworksEditor) {
    return;
  }
  const normalizedSrc = typeof src === 'string' ? src.trim() : '';
  if (!normalizedSrc) {
    return;
  }
  if (field === 'title') {
    updateArtworkThumbTitleForSrc(normalizedSrc, translation);
  }

  const baseItems = Array.isArray(state.content.gallery?.artworks) ? state.content.gallery.artworks : [];
  const baseItem = baseItems[uiState.selectedArtworkIndex];
  const currentSrc = baseItem && typeof baseItem.src === 'string' ? baseItem.src.trim() : '';
  if (currentSrc !== normalizedSrc) {
    return;
  }

  const detail = el.artworksEditor.querySelector('.artwork-detail');
  if (!detail) {
    return;
  }

  const input = detail.querySelector(`[data-field="${field}"]`);
  if (input && document.activeElement !== input) {
    input.value = translation;
  }

  if (field === 'title') {
    const headTitle = el.artworksEditor.querySelector('.artwork-detail-head h3');
    if (headTitle && document.activeElement !== input) {
      headTitle.textContent = `Redigerar: ${translation.trim() ? translation : headTitle.textContent.replace(/^Redigerar:\s*/i, '')}`;
    }
  }
};

const openAiArtworkTranslationRunningKeys = new Set();

const drainOpenAiArtworkTranslationQueue = () => {
  if (openAiArtworkTranslationActive >= OPENAI_TRANSLATION_MAX_CONCURRENCY) {
    return;
  }

  let attempts = 0;
  const maxAttempts = openAiArtworkTranslationQueue.length;

  while (
    openAiArtworkTranslationActive < OPENAI_TRANSLATION_MAX_CONCURRENCY &&
    openAiArtworkTranslationQueue.length > 0 &&
    attempts < maxAttempts
  ) {
    const key = openAiArtworkTranslationQueue.shift();
    if (typeof key !== 'string') {
      attempts += 1;
      continue;
    }

    const job = openAiArtworkTranslationJobs.get(key);
    if (!job) {
      openAiArtworkTranslationQueueKeys.delete(key);
      attempts += 1;
      continue;
    }

    if (openAiArtworkTranslationRunningKeys.has(key)) {
      openAiArtworkTranslationQueue.push(key);
      attempts += 1;
      continue;
    }

    openAiArtworkTranslationQueueKeys.delete(key);
    openAiArtworkTranslationRunningKeys.add(key);
    openAiArtworkTranslationActive += 1;

    void (async () => {
      const requestId = job.requestId;
      const src = job.src || '';
      const field = job.field || '';
      const svValue = job.svValue || '';
      try {
        const result = await apiJson('api/translate.php', {
          method: 'POST',
          withCsrf: true,
          body: {
            from: 'sv',
            to: 'en',
            field,
            text: svValue
          }
        });

        const translated = typeof result.translation === 'string' ? result.translation.trim() : '';
        if (!translated) {
          return;
        }

        const latest = openAiArtworkTranslationJobs.get(key);
        if (!latest || latest.requestId !== requestId) {
          return;
        }

        const entry = ensureArtworkTranslationEntry('en', src);
        if (!entry) {
          return;
        }
        const manual = entry._manual && typeof entry._manual === 'object' ? entry._manual : null;
        if (manual && manual[field]) {
          return;
        }

        entry[field] = translated;
        applyArtworkEnglishTranslationToUi(src, field, translated);
      } catch (error) {
        const message = error instanceof Error && error.message ? error.message : 'Kunde inte autoöversätta via OpenAI.';
        if (!openAiTranslationErrorShown) {
          openAiTranslationErrorShown = true;
          setStatus(
            /för många översättningsförsök/i.test(message)
              ? 'Autoöversättning pausad tillfälligt för att inte slå i gränsen. Vänta en stund och försök igen.'
              : `Autoöversättning: ${message}`,
            /för många översättningsförsök/i.test(message) ? 'info' : 'error'
          );
        }
        stopOpenAiArtworkTranslations();
      } finally {
        openAiArtworkTranslationRunningKeys.delete(key);
        openAiArtworkTranslationActive = Math.max(0, openAiArtworkTranslationActive - 1);
        drainOpenAiArtworkTranslationQueue();
      }
    })();
  }
};

const enqueueOpenAiArtworkTranslation = (key) => {
  if (openAiArtworkTranslationQueueKeys.has(key)) {
    return;
  }
  const job = openAiArtworkTranslationJobs.get(key);
  if (!job) {
    return;
  }
  openAiArtworkTranslationQueueKeys.add(key);
  openAiArtworkTranslationQueue.push(key);
  drainOpenAiArtworkTranslationQueue();
};

const scheduleArtworkOpenAiTranslation = (src, field, svValue) => {
  if (openAiTranslationErrorShown) {
    return;
  }
  const normalizedSrc = typeof src === 'string' ? src.trim() : '';
  if (!normalizedSrc || typeof svValue !== 'string' || svValue.trim() === '') {
    return;
  }

  const key = `${normalizedSrc}::${field}`;
  const existing = openAiArtworkTranslationJobs.get(key);
  if (existing && existing.timer) {
    clearTimeout(existing.timer);
  }

  const requestId = (openAiArtworkTranslationSeq += 1);
  const job = {
    requestId,
    src: normalizedSrc,
    field,
    svValue,
    timer: window.setTimeout(() => {
      const latest = openAiArtworkTranslationJobs.get(key);
      if (!latest || latest.requestId !== requestId) {
        return;
      }
      latest.timer = null;
      enqueueOpenAiArtworkTranslation(key);
    }, OPENAI_TRANSLATION_DEBOUNCE_MS)
  };

  openAiArtworkTranslationJobs.set(key, job);
};

const shouldQueueArtworkFieldTranslation = (field, svValue, currentEn) => {
  const source = typeof svValue === 'string' ? svValue.trim() : '';
  const current = typeof currentEn === 'string' ? currentEn.trim() : '';
  if (!source) {
    return false;
  }

  if (!current) {
    return true;
  }
  if (current === source) {
    return true;
  }
  if (looksLikeSwedishSeedText(current)) {
    return true;
  }

  if (field === 'title') {
    if (isGenericSwedishArtworkTitle(current)) {
      return true;
    }
    if (/^Work\s+\d+$/i.test(current)) {
      return true;
    }
  }

  return false;
};

const queueArtworkEnglishTranslationsFromSwedish = (options = {}) => {
  const titlesOnly = options.titlesOnly === true;
  const fields = titlesOnly ? ['title'] : ['title', 'format', 'medium', 'alt', 'priceLabel', 'collectorNote'];
  const baseItems = Array.isArray(state.content.gallery?.artworks) ? state.content.gallery.artworks : [];
  if (!Array.isArray(baseItems) || baseItems.length === 0) {
    return 0;
  }

  let queued = 0;
  baseItems.forEach((item) => {
    const src = item && typeof item.src === 'string' ? item.src.trim() : '';
    if (!src) {
      return;
    }

    const entry = ensureArtworkTranslationEntry('en', src);
    if (!entry) {
      return;
    }

    const manual = entry._manual && typeof entry._manual === 'object' ? entry._manual : null;
    fields.forEach((field) => {
      const svValue = item && typeof item[field] === 'string' ? item[field].trim() : '';
      if (!svValue) {
        return;
      }
      if (manual && manual[field]) {
        return;
      }

      const currentEn = typeof entry[field] === 'string' ? entry[field].trim() : '';
      if (!shouldQueueArtworkFieldTranslation(field, svValue, currentEn)) {
        return;
      }

      const seeded = autoTranslateSvToEn(svValue, field);
      if (seeded && (!entry[field] || entry[field].trim() === '' || shouldQueueArtworkFieldTranslation(field, svValue, entry[field]))) {
        entry[field] = seeded;
        applyArtworkEnglishTranslationToUi(src, field, seeded);
      }

      scheduleArtworkOpenAiTranslation(src, field, svValue);
      queued += 1;
    });
  });

  return queued;
};

const translateMissingArtworkEnglishTitlesViaApi = async () => {
  const baseItems = Array.isArray(state.content.gallery?.artworks) ? state.content.gallery.artworks : [];
  if (!Array.isArray(baseItems) || baseItems.length === 0) {
    setStatus('Hittade inga verk att översätta.', 'info');
    return;
  }

  if (!authState.csrfToken) {
    setStatus('Saknar säkerhetstoken. Ladda om sidan och logga in igen.', 'error');
    return;
  }

  const jobs = [];
  baseItems.forEach((item) => {
    const src = item && typeof item.src === 'string' ? item.src.trim() : '';
    const svTitle = item && typeof item.title === 'string' ? item.title.trim() : '';
    if (!src || !svTitle) {
      return;
    }

    const entry = ensureArtworkTranslationEntry('en', src);
    if (!entry) {
      return;
    }

    const manual = entry._manual && typeof entry._manual === 'object' ? entry._manual : null;
    if (manual && manual.title) {
      return;
    }

    const currentEn = typeof entry.title === 'string' ? entry.title.trim() : '';
    if (!shouldQueueArtworkFieldTranslation('title', svTitle, currentEn)) {
      return;
    }

    jobs.push({
      src,
      field: 'title',
      source: svTitle,
      fallback: autoTranslateSvToEn(svTitle, 'title') || svTitle
    });
  });

  if (jobs.length === 0) {
    setStatus('Inga saknade titlar att autoöversätta (eller titlarna är manuellt låsta).', 'success');
    return;
  }

  setStatus(`Översätter ${jobs.length} titel/titlar till engelska...`, 'info');

  let translatedCount = 0;
  let failedCount = 0;
  await processSvEntriesToEnInBatches(jobs, {
    onSuccess(job, translated) {
      const entry = ensureArtworkTranslationEntry('en', job.src);
      if (!entry) {
        failedCount += 1;
        return;
      }
      entry.title = translated;
      translatedCount += 1;
      applyArtworkEnglishTranslationToUi(job.src, 'title', translated);
    },
    onError(job) {
      const entry = ensureArtworkTranslationEntry('en', job.src);
      if (entry && (!entry.title || entry.title.trim() === '' || shouldQueueArtworkFieldTranslation('title', job.source, entry.title))) {
        entry.title = job.fallback;
        applyArtworkEnglishTranslationToUi(job.src, 'title', job.fallback);
      }
      failedCount += 1;
    }
  });

  renderArtworksEditor();
  if (translatedCount === 0 && failedCount > 0) {
    setStatus('Kunde inte autoöversätta titlarna just nu. Vänta en stund och försök igen.', 'error');
    return;
  }

  const failureSuffix = failedCount > 0 ? ` ${failedCount} titel/titlar behöll tidigare eller preliminärt värde.` : '';
  setStatus(
    `Översatte ${translatedCount} titel/titlar till engelska.${failureSuffix} Klicka "Spara ändringar" för att publicera.`,
    failedCount > 0 ? 'info' : 'success'
  );
};

const syncArtworkTextToEnglish = (src, field, previousSvValue, nextSvValue) => {
  const normalizedSrc = typeof src === 'string' ? src.trim() : '';
  if (!normalizedSrc) {
    return;
  }

  if (!nextSvValue || typeof nextSvValue !== 'string' || nextSvValue.trim() === '') {
    return;
  }

  const entry = ensureArtworkTranslationEntry('en', normalizedSrc);
  if (!entry) {
    return;
  }

  const manual = entry._manual && typeof entry._manual === 'object' ? entry._manual : null;
  if (manual && manual[field]) {
    return;
  }

  const nextAuto = autoTranslateSvToEn(nextSvValue, field);
  if (nextAuto) {
    entry[field] = nextAuto;
  }
  scheduleArtworkOpenAiTranslation(normalizedSrc, field, nextSvValue);
};

const maybeAutoTranslateSelectedArtwork = (baseItem) => {
  if (getEditingLanguage() !== 'en') {
    return;
  }
  const src = baseItem && typeof baseItem.src === 'string' ? baseItem.src.trim() : '';
  if (!src) {
    return;
  }

  const entry = ensureArtworkTranslationEntry('en', src);
  if (!entry) {
    return;
  }
  const manual = entry._manual && typeof entry._manual === 'object' ? entry._manual : null;
  ARTWORK_TRANSLATABLE_FIELDS.forEach((field) => {
    if (manual && manual[field]) {
      return;
    }
    const svValue = baseItem && typeof baseItem[field] === 'string' ? baseItem[field].trim() : '';
    if (!svValue) {
      return;
    }
    const currentEn = typeof entry[field] === 'string' ? entry[field].trim() : '';
    if (currentEn === '' || currentEn === svValue) {
      scheduleArtworkOpenAiTranslation(src, field, svValue);
    }
  });
};

const updateArtworkSourceAcrossTranslations = (fromSrc, toSrc) => {
  const from = typeof fromSrc === 'string' ? fromSrc.trim() : '';
  const to = typeof toSrc === 'string' ? toSrc.trim() : '';
  if (!from || from === to || !state.translations || typeof state.translations !== 'object') {
    return;
  }

  Object.keys(state.translations).forEach((language) => {
    const pack = state.translations[language];
    if (!pack || typeof pack !== 'object') {
      return;
    }

    const map = getPath(pack, 'gallery.artworkTextBySrc');
    if (map && typeof map === 'object' && Object.prototype.hasOwnProperty.call(map, from)) {
      const existing = map[from];
      delete map[from];
      if (to) {
        map[to] = existing;
      }
    }

    const slides = getPath(pack, 'hero.slides');
    if (Array.isArray(slides)) {
      slides.forEach((slide) => {
        if (slide && typeof slide === 'object' && typeof slide.src === 'string' && slide.src.trim() === from) {
          slide.src = to;
        }
      });
    }
  });
};

const sanitizeArtworkTranslationMaps = () => {
  if (!state.translations || typeof state.translations !== 'object') {
    return { pruned: 0, remapped: 0 };
  }

  const activeSrcs = (Array.isArray(state.content.gallery?.artworks) ? state.content.gallery.artworks : [])
    .map((item) => (item && typeof item.src === 'string' ? item.src.trim() : ''))
    .filter(Boolean);
  if (activeSrcs.length === 0) {
    return { pruned: 0, remapped: 0 };
  }

  const activeSet = new Set(activeSrcs);
  const lookup = buildServerImageLookup(activeSrcs);
  let pruned = 0;
  let remapped = 0;

  Object.keys(state.translations).forEach((language) => {
    const pack = state.translations[language];
    const map = getPath(pack, 'gallery.artworkTextBySrc');
    if (!pack || typeof pack !== 'object' || !map || typeof map !== 'object' || Array.isArray(map)) {
      return;
    }

    const nextMap = {};
    Object.keys(map).forEach((rawSrc) => {
      const entry = map[rawSrc];
      if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
        pruned += 1;
        return;
      }

      const src = typeof rawSrc === 'string' ? rawSrc.trim() : '';
      if (!src) {
        pruned += 1;
        return;
      }

      const targetSrc = activeSet.has(src)
        ? src
        : /^(data:|blob:)/i.test(src)
          ? ''
          : chooseClosestServerImage(src, lookup);
      if (!targetSrc) {
        pruned += 1;
        return;
      }

      if (targetSrc !== src) {
        remapped += 1;
      }

      nextMap[targetSrc] =
        nextMap[targetSrc] && typeof nextMap[targetSrc] === 'object'
          ? { ...nextMap[targetSrc], ...entry }
          : entry;
    });

    pack.gallery.artworkTextBySrc = nextMap;
  });

  return { pruned, remapped };
};

const removeArtworkFromTranslations = (src) => {
  const normalizedSrc = typeof src === 'string' ? src.trim() : '';
  if (!normalizedSrc || !state.translations || typeof state.translations !== 'object') {
    return;
  }

  Object.keys(state.translations).forEach((language) => {
    const pack = state.translations[language];
    if (!pack || typeof pack !== 'object') {
      return;
    }

    const map = getPath(pack, 'gallery.artworkTextBySrc');
    if (map && typeof map === 'object' && Object.prototype.hasOwnProperty.call(map, normalizedSrc)) {
      delete map[normalizedSrc];
    }

    const slides = getPath(pack, 'hero.slides');
    if (Array.isArray(slides)) {
      pack.hero.slides = slides.filter((slide) => !slide || slide.src !== normalizedSrc);
    }
  });
};

const cloneSlides = (slides) =>
  (Array.isArray(slides) ? slides : [])
    .filter((slide) => slide && typeof slide === 'object')
    .map((slide) => ({
      src: typeof slide.src === 'string' ? slide.src : '',
      alt: typeof slide.alt === 'string' ? slide.alt : '',
      durationMs: Number(slide.durationMs || 0) || undefined
    }));

const getHeroSlidesForEditor = (language = getEditingLanguage()) => {
  if (language === 'sv') {
    return Array.isArray(state.content.hero?.slides) ? state.content.hero.slides : [];
  }

  const pack = ensureLanguageOverridePack(language);
  if (!pack.hero || typeof pack.hero !== 'object') {
    pack.hero = {};
  }
  if (!Array.isArray(pack.hero.slides)) {
    const localizedSlides = getPath(getLocalizedContentForEditor(language), 'hero.slides');
    pack.hero.slides = cloneSlides(localizedSlides);
  }
  return pack.hero.slides;
};

const getContactSocialLinksForEditor = (language = getEditingLanguage()) => {
  if (language === 'sv') {
    return Array.isArray(state.content.contact?.socialLinks) ? state.content.contact.socialLinks : [];
  }
  const links = getPath(getLocalizedContentForEditor(language), 'contact.socialLinks');
  return Array.isArray(links) ? links : [];
};

const ensureEditableContactSocialLinks = (language = getEditingLanguage()) => {
  if (language === 'sv') {
    if (!Array.isArray(state.content.contact.socialLinks)) {
      state.content.contact.socialLinks = [];
    }
    return state.content.contact.socialLinks;
  }

  const pack = ensureLanguageOverridePack(language);
  if (!pack.contact || typeof pack.contact !== 'object') {
    pack.contact = {};
  }
  if (!Array.isArray(pack.contact.socialLinks)) {
    const seed = getContactSocialLinksForEditor(language).map((item) =>
      createSocialChannel({
        label: item && typeof item.label === 'string' ? item.label : '',
        url: item && typeof item.url === 'string' ? item.url : ''
      })
    );
    pack.contact.socialLinks = seed;
  }
  return pack.contact.socialLinks;
};

const getStudioAccessMode = () => {
  const studioAccess =
    state.content && state.content.studioAccess && typeof state.content.studioAccess === 'object'
      ? state.content.studioAccess
      : {};
  return studioAccess.mode || 'local-password';
};

const isLocalStaticStudioPreview = () => {
  const protocol = String(window.location.protocol || '').toLowerCase();
  if (protocol === 'file:') {
    return true;
  }

  const hostname = String(window.location.hostname || '').toLowerCase();
  return hostname === '127.0.0.1' || hostname === 'localhost' || hostname === '::1' || hostname === '[::1]';
};

const isSecureAuthStudio = () => getStudioAccessMode() === 'secure-auth';
const isServerProtectedStudio = () => getStudioAccessMode() === 'server-auth';
const canPublishToServer = () =>
  !isLocalStaticStudioPreview() &&
  (isServerProtectedStudio() || isSecureAuthStudio()) &&
  (window.location.protocol === 'https:' || window.location.protocol === 'http:');

const el = {
  studioAuth: document.getElementById('studio-auth'),
  studioApp: document.getElementById('studio-app'),
  studioAuthStatus: document.getElementById('studio-auth-status'),
  authViewLogin: document.getElementById('studio-auth-view-login'),
  authViewBootstrap: document.getElementById('studio-auth-view-bootstrap'),
  authViewReset: document.getElementById('studio-auth-view-reset'),
  loginForm: document.getElementById('studio-login-form'),
  loginEmail: document.getElementById('studio-login-email'),
  loginPassword: document.getElementById('studio-login-password'),
  loginTotp: document.getElementById('studio-login-totp'),
  loginRecovery: document.getElementById('studio-login-recovery'),
  showResetBtn: document.getElementById('studio-show-reset'),
  backLoginBtn: document.getElementById('studio-back-login'),
  backLoginBtn2: document.getElementById('studio-back-login-2'),
  bootstrapStartForm: document.getElementById('studio-bootstrap-start-form'),
  bootstrapEmail: document.getElementById('studio-bootstrap-email'),
  bootstrapPassword: document.getElementById('studio-bootstrap-password'),
  bootstrapKeyWrap: document.getElementById('studio-bootstrap-key-wrap'),
  bootstrapKey: document.getElementById('studio-bootstrap-key'),
  bootstrapFinishForm: document.getElementById('studio-bootstrap-finish-form'),
  bootstrapSecret: document.getElementById('studio-bootstrap-secret'),
  bootstrapQrWrap: document.getElementById('studio-bootstrap-qr-wrap'),
  bootstrapQr: document.getElementById('studio-bootstrap-qr'),
  bootstrapTotp: document.getElementById('studio-bootstrap-totp'),
  bootstrapRecovery: document.getElementById('studio-bootstrap-recovery'),
  resetRequestForm: document.getElementById('studio-reset-request-form'),
  resetEmail: document.getElementById('studio-reset-email'),
  resetPasswordForm: document.getElementById('studio-reset-password-form'),
  resetPassword: document.getElementById('studio-reset-password'),
  status: document.getElementById('studio-status'),
  studioNavButtons: Array.from(document.querySelectorAll('[data-studio-tab]')),
  studioViews: Array.from(document.querySelectorAll('[data-studio-view]')),
  studioPageTitle: document.getElementById('studio-page-title'),
  studioPageSubtitle: document.getElementById('studio-page-subtitle'),
  studioTopSave: document.getElementById('studio-top-save'),
  studioLangPanel: document.querySelector('.studio-lang-panel'),
  studioLangButtons: Array.from(document.querySelectorAll('[data-studio-lang]')),
  studioLangNote: document.getElementById('studio-lang-note'),
  studioLangTools: document.getElementById('studio-lang-tools'),
  translateMissingEnTitles: document.getElementById('translate-missing-en-titles'),
  translateEnFromSv: document.getElementById('translate-en-from-sv'),
  translateEnFromSvForce: document.getElementById('translate-en-from-sv-force'),
  themeBackground: document.getElementById('theme-background'),
  themeSurface: document.getElementById('theme-surface'),
  themeInk: document.getElementById('theme-ink'),
  themeSoftInk: document.getElementById('theme-soft-ink'),
  themePrimary: document.getElementById('theme-primary'),
  themeAccent: document.getElementById('theme-accent'),
  themeHeaderBackground: document.getElementById('theme-header-background'),
  themeHeaderOpacity: document.getElementById('theme-header-opacity'),
  themeButtonGradientStart: document.getElementById('theme-button-gradient-start'),
  themeButtonGradientEnd: document.getElementById('theme-button-gradient-end'),
  themeFooterBackground: document.getElementById('theme-footer-background'),
  themeFontDisplay: document.getElementById('theme-font-display'),
  themeFontBody: document.getElementById('theme-font-body'),
  themeFontDisplayWeight: document.getElementById('theme-font-display-weight'),
  themeFontBodyWeight: document.getElementById('theme-font-body-weight'),
  themeFontDisplayStyle: document.getElementById('theme-font-display-style'),
  themeFontBodyStyle: document.getElementById('theme-font-body-style'),
  studioThemePreviewEyebrow: document.getElementById('studio-theme-preview-eyebrow'),
  studioThemePreviewTitle: document.getElementById('studio-theme-preview-title'),
  studioThemePreviewBody: document.getElementById('studio-theme-preview-body'),
  analyticsGaId: document.getElementById('analytics-ga-id'),
  analyticsAnonymizeIp: document.getElementById('analytics-anonymize-ip'),
  analyticsPanelDays: document.getElementById('analytics-panel-days'),
  analyticsPanelRefresh: document.getElementById('analytics-panel-refresh'),
  analyticsPanelStatus: document.getElementById('analytics-panel-status'),
  analyticsVisitorsValue: document.getElementById('analytics-visitors-value'),
  analyticsVisitorsDelta: document.getElementById('analytics-visitors-delta'),
  analyticsTrendSvg: document.getElementById('analytics-trend-chart'),
  analyticsTrendPath: document.getElementById('analytics-trend-path'),
  analyticsTrendAxis: document.getElementById('analytics-trend-axis'),
  analyticsTabs: Array.from(document.querySelectorAll('[data-analytics-tab]')),
  analyticsDonut: document.getElementById('analytics-donut'),
  analyticsDonutTotal: document.getElementById('analytics-donut-total'),
  analyticsDonutLabel: document.getElementById('analytics-donut-label'),
  analyticsBreakdownLegend: document.getElementById('analytics-breakdown-legend'),
  analyticsKpiSessions: document.getElementById('analytics-kpi-sessions'),
  analyticsKpiSessionsDelta: document.getElementById('analytics-kpi-sessions-delta'),
  analyticsKpiActiveUsers: document.getElementById('analytics-kpi-active-users'),
  analyticsKpiActiveUsersDelta: document.getElementById('analytics-kpi-active-users-delta'),
  analyticsKpiEngaged: document.getElementById('analytics-kpi-engaged'),
  analyticsKpiEngagedDelta: document.getElementById('analytics-kpi-engaged-delta'),
  analyticsKpiEvents: document.getElementById('analytics-kpi-events'),
  analyticsKpiEventsDelta: document.getElementById('analytics-kpi-events-delta'),
  inquiriesPanelFilter: document.getElementById('inquiries-panel-filter'),
  inquiriesPanelRefresh: document.getElementById('inquiries-panel-refresh'),
  inquiriesPanelStatus: document.getElementById('inquiries-panel-status'),
  inquiriesPanelList: document.getElementById('inquiries-panel-list'),
  heroTitle: document.getElementById('hero-title'),
  heroIntro: document.getElementById('hero-intro'),
  heroLine: document.getElementById('hero-line'),
  heroMode: document.getElementById('hero-mode'),
  heroSlideDuration: document.getElementById('hero-slide-duration'),
  heroAutoSlidesEnabled: document.getElementById('hero-auto-slides-enabled'),
  heroAutoSlidesForceRefresh: document.getElementById('hero-auto-slides-force-refresh'),
  heroAutoSlidesForceMeta: document.getElementById('hero-auto-slides-force-meta'),
  heroOverlayEnabled: document.getElementById('hero-overlay-enabled'),
  heroOverlayOpacity: document.getElementById('hero-overlay-opacity'),
  heroCopyPanelOpacity: document.getElementById('hero-copy-panel-opacity'),
  heroImage: document.getElementById('hero-image'),
  heroImageAlt: document.getElementById('hero-image-alt'),
  heroImageUpload: document.getElementById('hero-image-upload'),
  seoHomeTitle: document.getElementById('seo-home-title'),
  seoHomeDescription: document.getElementById('seo-home-description'),
  seoHomeImageSelect: document.getElementById('seo-home-image-select'),
  seoHomeImage: document.getElementById('seo-home-image'),
  seoHomeImagePreview: document.getElementById('seo-home-image-preview'),
  seoHomeImageAlt: document.getElementById('seo-home-image-alt'),
  heroSlidesEditor: document.getElementById('hero-slides-editor'),
  heroSlideFromArtwork: document.getElementById('hero-slide-from-artwork'),
  addHeroSlide: document.getElementById('add-hero-slide'),
  addHeroSlideFromArtwork: document.getElementById('add-hero-slide-from-artwork'),
  galleryHeading: document.getElementById('gallery-heading'),
  galleryPageHeading: document.getElementById('gallery-page-heading'),
  gallerySubheading: document.getElementById('gallery-subheading'),
  autoDiscoverEnabled: document.getElementById('auto-discover-enabled'),
  autoDefaultCategory: document.getElementById('auto-default-category'),
  categoryEditorHint: document.getElementById('category-editor-hint'),
  categoryAllLabel: document.getElementById('category-all-label'),
  categoryEditor: document.getElementById('category-editor'),
  addCategoryKey: document.getElementById('add-category-key'),
  addCategoryLabel: document.getElementById('add-category-label'),
  addCategoryButton: document.getElementById('add-category-button'),
  aboutHeading: document.getElementById('about-heading'),
  aboutParagraphs: document.getElementById('about-paragraphs'),
  aboutPortraitImage: document.getElementById('about-portrait-image'),
  aboutPortraitImagePick: document.getElementById('about-portrait-image-pick'),
  aboutPortraitImagePreview: document.getElementById('about-portrait-image-preview'),
  aboutPortraitAlt: document.getElementById('about-portrait-alt'),
  aboutDayJobLine: document.getElementById('about-dayjob-line'),
  aboutSideNote: document.getElementById('about-side-note'),
  materialsHeading: document.getElementById('materials-heading'),
  materialsBody: document.getElementById('materials-body'),
  materialsImage: document.getElementById('materials-image'),
  materialsImagePick: document.getElementById('materials-image-pick'),
  materialsImagePreview: document.getElementById('materials-image-preview'),
  materialsImageAlt: document.getElementById('materials-image-alt'),
  inspirationHeading: document.getElementById('inspiration-heading'),
  inspirationBody: document.getElementById('inspiration-body'),
  aboutFeatureImage: document.getElementById('about-feature-image'),
  aboutFeatureImagePick: document.getElementById('about-feature-image-pick'),
  aboutFeatureImagePreview: document.getElementById('about-feature-image-preview'),
  aboutFeatureAlt: document.getElementById('about-feature-alt'),
  projectEyebrow: document.getElementById('project-eyebrow'),
  projectHeading: document.getElementById('project-heading'),
  projectDescription: document.getElementById('project-description'),
  projectCollageImage: document.getElementById('project-collage-image'),
  projectCollageImagePick: document.getElementById('project-collage-image-pick'),
  projectCollageImagePreview: document.getElementById('project-collage-image-preview'),
  projectCollageAlt: document.getElementById('project-collage-alt'),
  projectSampleHeading: document.getElementById('project-sample-heading'),
  projectSample1Src: document.getElementById('project-sample-1-src'),
  projectSample1Pick: document.getElementById('project-sample-1-pick'),
  projectSample1Preview: document.getElementById('project-sample-1-preview'),
  projectSample1Alt: document.getElementById('project-sample-1-alt'),
  projectSample2Src: document.getElementById('project-sample-2-src'),
  projectSample2Pick: document.getElementById('project-sample-2-pick'),
  projectSample2Preview: document.getElementById('project-sample-2-preview'),
  projectSample2Alt: document.getElementById('project-sample-2-alt'),
  projectSample3Src: document.getElementById('project-sample-3-src'),
  projectSample3Pick: document.getElementById('project-sample-3-pick'),
  projectSample3Preview: document.getElementById('project-sample-3-preview'),
  projectSample3Alt: document.getElementById('project-sample-3-alt'),
  projectSample4Src: document.getElementById('project-sample-4-src'),
  projectSample4Pick: document.getElementById('project-sample-4-pick'),
  projectSample4Preview: document.getElementById('project-sample-4-preview'),
  projectSample4Alt: document.getElementById('project-sample-4-alt'),
  ambitionsHeading: document.getElementById('ambitions-heading'),
  ambitionsLines: document.getElementById('ambitions-lines'),
  recognitionHeading: document.getElementById('recognition-heading'),
  recognitionLines: document.getElementById('recognition-lines'),
  contactEyebrow: document.getElementById('contact-eyebrow'),
  contactHeading: document.getElementById('contact-heading'),
  contactBody: document.getElementById('contact-body'),
  contactEmail: document.getElementById('contact-email'),
  contactEmailLabel: document.getElementById('contact-email-label'),
  contactEmailPublic: document.getElementById('contact-email-public'),
  contactSocialEditor: document.getElementById('contact-social-editor'),
  addContactSocial: document.getElementById('add-contact-social'),
  galleryUpload: document.getElementById('gallery-upload'),
  uploadCategory: document.getElementById('upload-category'),
  artworksEditor: document.getElementById('artworks-editor'),
  saveStudio: document.getElementById('save-studio'),
  restoreFromServer: document.getElementById('restore-from-server'),
  restoreSvFromEn: document.getElementById('restore-sv-from-en'),
  resetStudio: document.getElementById('reset-studio'),
  exportOverridesJs: document.getElementById('export-overrides-js'),
  exportJson: document.getElementById('export-json'),
  importJson: document.getElementById('import-json'),
  importJsonTrigger: document.getElementById('import-json-trigger'),
  sectionImageUpload: document.getElementById('section-image-upload'),
  studioLogoutBtn: document.getElementById('studio-logout-btn')
};

const authState = {
  csrfToken: '',
  authenticated: false,
  adminExists: true,
  bootstrapKeyRequired: false,
  bootstrapPending: null
};

const setStatus = (text, kind = 'info', options = {}) => {
  if (!el.status) {
    return;
  }
  const shouldFlash = options.flash !== false;
  el.status.textContent = text;
  el.status.dataset.kind = kind;
  el.status.classList.remove('is-flash');
  if (shouldFlash) {
    void el.status.offsetWidth;
    el.status.classList.add('is-flash');
  }
};

const setStudioView = (view, options = {}) => {
  const nextView = normalizeStudioView(view);
  const meta = STUDIO_VIEW_META[nextView] || STUDIO_VIEW_META.overview;

  if (el.studioPageTitle) {
    el.studioPageTitle.textContent = meta.title;
  }
  if (el.studioPageSubtitle) {
    el.studioPageSubtitle.textContent = meta.subtitle;
  }
  if (el.studioLangPanel) {
    el.studioLangPanel.hidden = !['works', 'text', 'projects', 'contact', 'seo'].includes(nextView);
  }

  el.studioViews.forEach((node) => {
    const nodeView = normalizeStudioView(node.getAttribute('data-studio-view'));
    node.hidden = nodeView !== nextView;
  });

  el.studioNavButtons.forEach((button) => {
    const isActive = normalizeStudioView(button.getAttribute('data-studio-tab')) === nextView;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });

  document.body.dataset.studioView = nextView;
  storeStudioView(nextView);

  if (options.scroll !== false) {
    const main = el.studioApp ? el.studioApp.querySelector('.studio-main') : null;
    if (main && typeof main.scrollTo === 'function') {
      main.scrollTo({ top: 0, behavior: options.instant ? 'auto' : 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: options.instant ? 'auto' : 'smooth' });
    }
  }
};

const initStudioNavigation = () => {
  el.studioNavButtons.forEach((button) => {
    button.addEventListener('click', () => {
      setStudioView(button.getAttribute('data-studio-tab'));
    });
  });
  setStudioView(readStoredStudioView(), { instant: true, scroll: false });
};

const setAuthStatus = (text, kind = 'info') => {
  if (!el.studioAuthStatus) {
    return;
  }
  el.studioAuthStatus.textContent = text;
  el.studioAuthStatus.dataset.kind = kind;
};

const numberOrFallback = (value, fallback) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
};

const refreshStudioLanguageUi = () => {
  const activeLanguage = getEditingLanguage();
  if (Array.isArray(el.studioLangButtons)) {
    el.studioLangButtons.forEach((button) => {
      const buttonLanguage = normalizeStudioLanguage(button.getAttribute('data-studio-lang')) || 'sv';
      const isActive = buttonLanguage === activeLanguage;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });
  }

  if (el.studioLangNote) {
    el.studioLangNote.textContent =
      activeLanguage === 'en'
        ? 'Du redigerar engelska texter. Design, bilder och struktur är gemensamma mellan språk.'
        : 'Du redigerar svenska grundtexter.';
  }

  if (el.studioLangTools) {
    el.studioLangTools.hidden = false;
  }
};

const ANALYTICS_COLORS = ['#e6b75f', '#8f78d1', '#8db5e7', '#d87ac4', '#f09a61', '#77b18b', '#9aa3b5'];

const formatNumber = (value) => {
  const numeric = Number(value || 0);
  return new Intl.NumberFormat('sv-SE').format(Number.isFinite(numeric) ? numeric : 0);
};

const formatCompactNumber = (value) => {
  const numeric = Number(value || 0);
  return new Intl.NumberFormat('sv-SE', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1
  }).format(Number.isFinite(numeric) ? numeric : 0);
};

const calculateChangePct = (currentValue, previousValue) => {
  const current = Number(currentValue || 0);
  const previous = Number(previousValue || 0);
  if (!Number.isFinite(current) || !Number.isFinite(previous)) {
    return null;
  }
  if (previous <= 0) {
    if (current <= 0) {
      return 0;
    }
    return 100;
  }
  return ((current - previous) / previous) * 100;
};

const formatChangePct = (changePct) => {
  if (typeof changePct !== 'number' || !Number.isFinite(changePct)) {
    return 'Ingen jämförelsedata';
  }
  const rounded = Math.round(changePct * 10) / 10;
  const sign = rounded > 0 ? '+' : '';
  return `${sign}${rounded}% jämfört med föregående period`;
};

const applyDeltaClass = (node, changePct) => {
  if (!node) {
    return;
  }
  node.classList.remove('is-positive', 'is-negative');
  if (typeof changePct !== 'number' || !Number.isFinite(changePct)) {
    return;
  }
  if (changePct > 0) {
    node.classList.add('is-positive');
  } else if (changePct < 0) {
    node.classList.add('is-negative');
  }
};

const setAnalyticsPanelStatus = (text, kind = 'info') => {
  if (!el.analyticsPanelStatus) {
    return;
  }
  el.analyticsPanelStatus.textContent = text;
  el.analyticsPanelStatus.dataset.kind = kind;
};

const parseIsoDateUtc = (value) => {
  if (typeof value !== 'string') {
    return null;
  }
  const match = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) {
    return null;
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) {
    return null;
  }
  return new Date(Date.UTC(year, month - 1, day));
};

const formatTrendAxisDate = (value) => {
  const date = parseIsoDateUtc(value);
  if (!date) {
    return String(value || '');
  }
  return date.toLocaleDateString('sv-SE', { timeZone: 'UTC', month: 'short', day: 'numeric' }).replace(/\./g, '');
};

const formatTrendTooltipDate = (value) => {
  const date = parseIsoDateUtc(value);
  if (!date) {
    return String(value || '');
  }
  return date
    .toLocaleDateString('sv-SE', { timeZone: 'UTC', year: 'numeric', month: 'short', day: 'numeric' })
    .replace(/\./g, '');
};

const isoDateInTimeZone = (timeZone) => {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: timeZone || 'Europe/Stockholm',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  return formatter.format(new Date());
};

const analyticsFreshnessLabel = (dashboard) => {
  const period = dashboard && dashboard.period && typeof dashboard.period === 'object' ? dashboard.period : null;
  const latestIso = period && typeof period.latestTrendDate === 'string' ? period.latestTrendDate.trim() : '';
  if (latestIso === '') {
    return '';
  }

  const latestDate = parseIsoDateUtc(latestIso);
  if (!latestDate) {
    return `Senaste datapunkt: ${latestIso}`;
  }

  const tz = period && typeof period.timezone === 'string' && period.timezone.trim() !== '' ? period.timezone.trim() : 'Europe/Stockholm';
  const todayIso = isoDateInTimeZone(tz);
  const todayDate = parseIsoDateUtc(todayIso);
  if (!todayDate) {
    return `Senaste datapunkt: ${latestIso}`;
  }

  const diffDays = Math.round((todayDate.getTime() - latestDate.getTime()) / 86400000);
  if (diffDays <= 1) {
    return `Senaste datapunkt: ${latestIso}`;
  }
  return `Senaste datapunkt: ${latestIso} (GA4-data kan vara 24-72 h fördröjd)`;
};

let analyticsTrendHover = null;

const ensureAnalyticsTrendHover = () => {
  const svg = el.analyticsTrendSvg;
  if (!svg) {
    return null;
  }

  if (analyticsTrendHover && analyticsTrendHover.svg === svg) {
    return analyticsTrendHover;
  }

  const ns = 'http://www.w3.org/2000/svg';
  const create = (tag) => document.createElementNS(ns, tag);

  const hoverGroup = create('g');
  hoverGroup.setAttribute('id', 'analytics-trend-hover');
  hoverGroup.setAttribute('pointer-events', 'none');

  const hoverLine = create('line');
  hoverLine.setAttribute('id', 'analytics-trend-hover-line');
  hoverLine.setAttribute('class', 'analytics-trend-hover-line');
  hoverLine.setAttribute('visibility', 'hidden');

  const hoverDot = create('circle');
  hoverDot.setAttribute('id', 'analytics-trend-hover-dot');
  hoverDot.setAttribute('class', 'analytics-trend-hover-dot');
  hoverDot.setAttribute('r', '4.5');
  hoverDot.setAttribute('visibility', 'hidden');

  const tooltipGroup = create('g');
  tooltipGroup.setAttribute('id', 'analytics-trend-tooltip');
  tooltipGroup.setAttribute('class', 'analytics-trend-tooltip');
  tooltipGroup.setAttribute('visibility', 'hidden');

  const tooltipBox = create('rect');
  tooltipBox.setAttribute('class', 'analytics-tooltip-box');
  tooltipBox.setAttribute('rx', '6');
  tooltipBox.setAttribute('ry', '6');

  const tooltipText = create('text');
  tooltipText.setAttribute('class', 'analytics-tooltip-text');
  tooltipText.setAttribute('x', '8');
  tooltipText.setAttribute('y', '16');

  tooltipGroup.appendChild(tooltipBox);
  tooltipGroup.appendChild(tooltipText);

  hoverGroup.appendChild(hoverLine);
  hoverGroup.appendChild(hoverDot);
  hoverGroup.appendChild(tooltipGroup);
  svg.appendChild(hoverGroup);

  const hitRect = create('rect');
  hitRect.setAttribute('id', 'analytics-trend-hit');
  hitRect.setAttribute('class', 'analytics-trend-hit');
  hitRect.setAttribute('fill', 'transparent');
  hitRect.setAttribute('pointer-events', 'all');
  svg.appendChild(hitRect);

  const hoverState = {
    svg,
    hitRect,
    hoverLine,
    hoverDot,
    tooltipGroup,
    tooltipBox,
    tooltipText,
    layout: null,
    coords: null,
    points: null
  };

  const hide = () => {
    hoverLine.setAttribute('visibility', 'hidden');
    hoverDot.setAttribute('visibility', 'hidden');
    tooltipGroup.setAttribute('visibility', 'hidden');
  };

  const showIndex = (index) => {
    const { coords, points, layout } = hoverState;
    if (!coords || !points || !layout) {
      return;
    }
    if (index < 0 || index >= coords.length) {
      hide();
      return;
    }

    const coord = coords[index];
    const point = points[index];
    const x = coord.x;
    const y = coord.y;

    hoverLine.setAttribute('x1', x.toFixed(2));
    hoverLine.setAttribute('x2', x.toFixed(2));
    hoverLine.setAttribute('y1', String(layout.top));
    hoverLine.setAttribute('y2', String(layout.bottom));
    hoverLine.setAttribute('visibility', 'visible');

    hoverDot.setAttribute('cx', x.toFixed(2));
    hoverDot.setAttribute('cy', y.toFixed(2));
    hoverDot.setAttribute('visibility', 'visible');

    const dateLabel = formatTrendTooltipDate(point.date || '');
    const valueLabel = formatNumber(point.value || 0);
    tooltipText.textContent = `${dateLabel} · ${valueLabel}`;

    // Compute tooltip size in SVG user units.
    const textLength =
      typeof tooltipText.getComputedTextLength === 'function' ? tooltipText.getComputedTextLength() : 120;
    const paddingX = 8;
    const boxWidth = Math.max(40, textLength + paddingX * 2);
    const boxHeight = 24;
    tooltipBox.setAttribute('width', boxWidth.toFixed(2));
    tooltipBox.setAttribute('height', String(boxHeight));

    let tooltipX = x + 12;
    if (tooltipX + boxWidth > layout.right) {
      tooltipX = x - 12 - boxWidth;
    }
    tooltipX = Math.max(layout.left, Math.min(tooltipX, layout.right - boxWidth));

    let tooltipY = y - boxHeight - 12;
    if (tooltipY < layout.top) {
      tooltipY = y + 12;
    }
    tooltipY = Math.max(layout.top, Math.min(tooltipY, layout.bottom - boxHeight));

    tooltipGroup.setAttribute('transform', `translate(${tooltipX.toFixed(2)} ${tooltipY.toFixed(2)})`);
    tooltipGroup.setAttribute('visibility', 'visible');
  };

  hitRect.addEventListener('pointerleave', hide);
  hitRect.addEventListener('pointerdown', (event) => {
    // Make hover work on touch as well.
    hitRect.setPointerCapture(event.pointerId);
  });
  hitRect.addEventListener('pointermove', (event) => {
    const { layout, coords } = hoverState;
    if (!layout || !coords || coords.length === 0) {
      return;
    }

    const rect = svg.getBoundingClientRect();
    if (!rect.width) {
      return;
    }
    const viewBox = svg.viewBox && svg.viewBox.baseVal ? svg.viewBox.baseVal : { x: 0, y: 0, width: 640, height: 240 };
    const localX = ((event.clientX - rect.left) / rect.width) * viewBox.width + viewBox.x;
    const clampedX = Math.max(layout.left, Math.min(localX, layout.right));
    const stepX = layout.stepX || 0;
    const idx = stepX > 0 ? Math.round((clampedX - layout.left) / stepX) : 0;
    showIndex(Math.max(0, Math.min(coords.length - 1, idx)));
  });

  analyticsTrendHover = hoverState;
  return hoverState;
};

const renderAnalyticsTrend = (points) => {
  if (!el.analyticsTrendPath) {
    return;
  }
  if (!Array.isArray(points) || points.length === 0) {
    el.analyticsTrendPath.setAttribute('d', '');
    if (el.analyticsTrendAxis) {
      el.analyticsTrendAxis.innerHTML = '';
    }
    return;
  }

  const values = points.map((point) => Number(point.value || 0)).filter((value) => Number.isFinite(value));
  if (values.length === 0) {
    el.analyticsTrendPath.setAttribute('d', '');
    if (el.analyticsTrendAxis) {
      el.analyticsTrendAxis.innerHTML = '';
    }
    return;
  }

  const width = 640;
  const height = 240;
  const left = 20;
  const right = width - 20;
  const top = 20;
  const bottom = 200;
  const axisLabelY = 232;

  const maxValue = Math.max(...values, 1);
  const minValue = 0;
  const valueRange = Math.max(1, maxValue - minValue);
  const stepX = points.length > 1 ? (right - left) / (points.length - 1) : 0;

  const coords = points.map((point, index) => {
    const value = Number(point.value || 0);
    const normalized = (value - minValue) / valueRange;
    const x = left + stepX * index;
    const y = bottom - normalized * (bottom - top);
    return { x, y };
  });

  const path = coords
    .map((coord, index) => `${index === 0 ? 'M' : 'L'}${coord.x.toFixed(2)} ${coord.y.toFixed(2)}`)
    .join(' ');
  el.analyticsTrendPath.setAttribute('d', path);

  if (el.analyticsTrendAxis) {
    const axis = el.analyticsTrendAxis;
    axis.innerHTML = '';
    const tickCount = Math.min(5, points.length);
    const indices = new Set();
    if (tickCount === 1) {
      indices.add(0);
    } else {
      for (let i = 0; i < tickCount; i += 1) {
        const idx = Math.round((i / (tickCount - 1)) * (points.length - 1));
        indices.add(Math.max(0, Math.min(points.length - 1, idx)));
      }
    }

	    Array.from(indices)
	      .sort((a, b) => a - b)
	      .forEach((idx) => {
	        const label = formatTrendAxisDate(points[idx] && points[idx].date ? points[idx].date : '');
	        const ns = 'http://www.w3.org/2000/svg';
	        const x = coords[idx].x;
	        const tick = document.createElementNS(ns, 'line');
	        tick.setAttribute('x1', x.toFixed(2));
	        tick.setAttribute('x2', x.toFixed(2));
	        tick.setAttribute('y1', String(bottom));
	        tick.setAttribute('y2', String(bottom + 6));
	        axis.appendChild(tick);

	        const text = document.createElementNS(ns, 'text');
	        text.setAttribute('x', x.toFixed(2));
	        text.setAttribute('y', String(axisLabelY));
	        const anchor = idx === 0 ? 'start' : idx === points.length - 1 ? 'end' : 'middle';
	        text.setAttribute('text-anchor', anchor);
	        text.textContent = label;
	        axis.appendChild(text);
	      });
	  }

  const hover = ensureAnalyticsTrendHover();
  if (hover) {
    hover.layout = { left, right, top, bottom, stepX };
    hover.coords = coords;
    hover.points = points;
    hover.hitRect.setAttribute('x', String(left));
    hover.hitRect.setAttribute('y', String(top));
    hover.hitRect.setAttribute('width', String(right - left));
    hover.hitRect.setAttribute('height', String(bottom - top));
  }
};

const renderAnalyticsBreakdown = () => {
  const data = uiState.analyticsData;
  const tab = uiState.analyticsTab;
  const key = tab === 'locations' ? 'locations' : tab === 'devices' ? 'devices' : 'channels';

  if (Array.isArray(el.analyticsTabs)) {
    el.analyticsTabs.forEach((button) => {
      const buttonTab = button.getAttribute('data-analytics-tab');
      const isActive = buttonTab === key;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-selected', String(isActive));
    });
  }

  const itemsRaw =
    data && data.breakdowns && Array.isArray(data.breakdowns[key]) ? data.breakdowns[key].slice(0, 7) : [];
  const items = itemsRaw
    .map((item) => ({
      label: typeof item.label === 'string' && item.label.trim() !== '' ? item.label.trim() : 'Okänd',
      value: Number(item.value || 0),
      previousValue: Number(item.previousValue || 0),
      changePct:
        typeof item.changePct === 'number' && Number.isFinite(item.changePct)
          ? item.changePct
          : calculateChangePct(item.value || 0, item.previousValue || 0)
    }))
    .filter((item) => Number.isFinite(item.value) && item.value >= 0);

  const totalValue = items.reduce((sum, item) => sum + item.value, 0);
  const breakdownLabel = key === 'locations' ? 'Länder' : key === 'devices' ? 'Enheter' : 'Kanaler';

  if (el.analyticsDonutTotal) {
    el.analyticsDonutTotal.textContent = formatCompactNumber(totalValue);
  }
  if (el.analyticsDonutLabel) {
    el.analyticsDonutLabel.textContent = breakdownLabel;
  }

  if (el.analyticsDonut) {
    if (items.length === 0 || totalValue <= 0) {
      el.analyticsDonut.style.background = 'conic-gradient(#d6c9b4 0deg 360deg)';
    } else {
      let cursor = 0;
      const segments = items.map((item, index) => {
        const percent = (item.value / totalValue) * 100;
        const from = cursor;
        cursor += percent;
        const color = ANALYTICS_COLORS[index % ANALYTICS_COLORS.length];
        return `${color} ${from.toFixed(2)}% ${cursor.toFixed(2)}%`;
      });
      if (cursor < 100) {
        segments.push(`#d6c9b4 ${cursor.toFixed(2)}% 100%`);
      }
      el.analyticsDonut.style.background = `conic-gradient(${segments.join(', ')})`;
    }
  }

  if (!el.analyticsBreakdownLegend) {
    return;
  }

  if (items.length === 0 || totalValue <= 0) {
    el.analyticsBreakdownLegend.innerHTML = '<li class="analytics-legend-item">Ingen data för vald period.</li>';
    return;
  }

  el.analyticsBreakdownLegend.innerHTML = items
    .map((item, index) => {
      const color = ANALYTICS_COLORS[index % ANALYTICS_COLORS.length];
      const share = totalValue > 0 ? (item.value / totalValue) * 100 : 0;
      const changeText =
        typeof item.changePct === 'number' && Number.isFinite(item.changePct)
          ? `${item.changePct >= 0 ? '+' : ''}${(Math.round(item.changePct * 10) / 10).toFixed(1)}%`
          : 'n/a';
      return `<li class="analytics-legend-item">
        <span class="analytics-legend-swatch" style="background:${color}"></span>
        <span>${escapeHtml(item.label)} <span class="analytics-legend-change">(${share.toFixed(1)}%)</span></span>
        <span class="analytics-legend-value">${formatCompactNumber(item.value)} <span class="analytics-legend-change">${changeText}</span></span>
      </li>`;
    })
    .join('');
};

const renderAnalyticsKpiMetric = (valueNode, deltaNode, metric) => {
  const value = metric && typeof metric.value === 'number' ? metric.value : 0;
  const previous = metric && typeof metric.previous === 'number' ? metric.previous : 0;
  const changePct =
    metric && typeof metric.changePct === 'number' && Number.isFinite(metric.changePct)
      ? metric.changePct
      : calculateChangePct(value, previous);

  if (valueNode) {
    valueNode.textContent = formatCompactNumber(value);
  }
  if (deltaNode) {
    deltaNode.textContent = formatChangePct(changePct);
    applyDeltaClass(deltaNode, changePct);
  }
};

const renderAnalyticsDashboard = () => {
  const data = uiState.analyticsData;
  const summary = data && data.summary && typeof data.summary === 'object' ? data.summary : {};
  const visitorsMetric = summary.activeUsers || { value: 0, previous: 0, changePct: 0 };

  if (el.analyticsVisitorsValue) {
    el.analyticsVisitorsValue.textContent = formatCompactNumber(visitorsMetric.value || 0);
  }
  if (el.analyticsVisitorsDelta) {
    const change =
      typeof visitorsMetric.changePct === 'number' ? visitorsMetric.changePct : calculateChangePct(visitorsMetric.value, visitorsMetric.previous);
    el.analyticsVisitorsDelta.textContent = formatChangePct(change);
    applyDeltaClass(el.analyticsVisitorsDelta, change);
  }

  const trend = data && Array.isArray(data.trend) ? data.trend : [];
  renderAnalyticsTrend(trend);
  renderAnalyticsBreakdown();

  renderAnalyticsKpiMetric(el.analyticsKpiSessions, el.analyticsKpiSessionsDelta, summary.sessions);
  renderAnalyticsKpiMetric(el.analyticsKpiActiveUsers, el.analyticsKpiActiveUsersDelta, summary.activeUsers);
  renderAnalyticsKpiMetric(el.analyticsKpiEngaged, el.analyticsKpiEngagedDelta, summary.engagedSessions);
  renderAnalyticsKpiMetric(el.analyticsKpiEvents, el.analyticsKpiEventsDelta, summary.eventCount);
};

const fetchAnalyticsDashboard = async () => {
  setAnalyticsPanelStatus('Hämtar data från Google Analytics...', 'info');

  try {
    const response = await apiJson('api/analytics.php', {
      method: 'POST',
      withCsrf: isSecureAuthStudio(),
      body: {
        days: uiState.analyticsDays
      }
    });

    const dashboard = response && response.dashboard && typeof response.dashboard === 'object' ? response.dashboard : null;
    if (!dashboard) {
      throw new Error('Tomt svar från analytics-endpoint.');
    }

    uiState.analyticsData = dashboard;
    renderAnalyticsDashboard();
    const freshness = analyticsFreshnessLabel(dashboard);
    setAnalyticsPanelStatus(
      `Uppdaterad: ${new Date().toLocaleString('sv-SE')} · Property ${response.propertyId || '-'}${
        freshness ? ` · ${freshness}` : ''
      }`,
      'success'
    );
  } catch (error) {
    const message = error instanceof Error && error.message ? error.message : 'Okänt fel vid hämtning av analytics.';
    setAnalyticsPanelStatus(message, 'error');
  }
};

const initAnalyticsDashboard = () => {
  if (!el.analyticsPanelRefresh || !el.analyticsPanelDays) {
    return;
  }

  el.analyticsPanelDays.value = String(uiState.analyticsDays);
  el.analyticsPanelRefresh.addEventListener('click', () => {
    fetchAnalyticsDashboard();
  });
  el.analyticsPanelDays.addEventListener('change', () => {
    uiState.analyticsDays = numberOrFallback(el.analyticsPanelDays.value, 28);
    fetchAnalyticsDashboard();
  });
  if (Array.isArray(el.analyticsTabs)) {
    el.analyticsTabs.forEach((button) => {
      button.addEventListener('click', () => {
        const tab = button.getAttribute('data-analytics-tab');
        if (tab !== 'channels' && tab !== 'locations' && tab !== 'devices') {
          return;
        }
        uiState.analyticsTab = tab;
        renderAnalyticsBreakdown();
      });
    });
  }

  renderAnalyticsDashboard();
  fetchAnalyticsDashboard();
};

const setInquiriesPanelStatus = (text, kind = 'info') => {
  if (!el.inquiriesPanelStatus) {
    return;
  }
  el.inquiriesPanelStatus.textContent = text;
  el.inquiriesPanelStatus.dataset.kind = kind;
};

const getFollowUpStatusLabel = (value) => {
  switch (String(value || '').trim()) {
    case 'replied':
      return 'Besvarad';
    case 'closed':
      return 'Stängd';
    default:
      return 'Ny';
  }
};

const getInquiryAvailabilityLabel = (value) => {
  switch (String(value || '').trim()) {
    case 'available':
      return 'Tillgänglig';
    case 'reserved':
      return 'Reserverad';
    case 'sold':
      return 'Såld';
    case 'nfs':
      return 'Ej till salu';
    default:
      return String(value || '').trim();
  }
};

const formatInquiryTimestamp = (value) => {
  const raw = typeof value === 'string' ? value.trim() : '';
  if (!raw) {
    return '';
  }
  const parsed = new Date(raw.replace(' ', 'T'));
  if (Number.isNaN(parsed.getTime())) {
    return raw;
  }
  return parsed.toLocaleString('sv-SE');
};

const renderInquiriesPanel = () => {
  if (!el.inquiriesPanelList) {
    return;
  }

  const items = Array.isArray(uiState.inquiriesData) ? uiState.inquiriesData : [];
  if (items.length === 0) {
    el.inquiriesPanelList.innerHTML = '<p class="gallery-empty">Inga intresseanmälningar för valt filter ännu.</p>';
    return;
  }

  el.inquiriesPanelList.innerHTML = items
    .map((item) => {
      const id = Number(item && item.id);
      const leadKind = typeof item?.lead_kind === 'string' ? item.lead_kind.trim() : 'general';
      const title = typeof item?.inquiry_title === 'string' && item.inquiry_title.trim() !== '' ? item.inquiry_title.trim() : 'Allmän kontakt';
      const name = typeof item?.name === 'string' ? item.name.trim() : '';
      const email = typeof item?.email === 'string' ? item.email.trim() : '';
      const message = typeof item?.message === 'string' ? item.message.trim() : '';
      const inquiryStatus = typeof item?.inquiry_status === 'string' ? item.inquiry_status.trim() : '';
      const priceLabel = typeof item?.inquiry_price_label === 'string' ? item.inquiry_price_label.trim() : '';
      const sourceUrl = normalizeArtworkPreviewUrlForStudio(
        typeof item?.inquiry_source_url === 'string' ? item.inquiry_source_url : ''
      );
      const followUpStatus = typeof item?.follow_up_status === 'string' ? item.follow_up_status.trim() : 'new';
      const delivered = Number(item?.mail_delivered || 0) === 1;
      const createdAt = formatInquiryTimestamp(item?.created_at);

      return `<article class="inquiry-card" data-id="${id}">
        <div class="inquiry-card-head">
          <div>
            <h3>${escapeHtml(title)}</h3>
            <p class="inquiry-meta">${escapeHtml([name, email, createdAt].filter(Boolean).join(' · '))}</p>
          </div>
          <label class="inquiry-follow-up-select">
            <span>Uppföljning</span>
            <select data-action="follow-up">
              <option value="new" ${followUpStatus === 'new' ? 'selected' : ''}>Ny</option>
              <option value="replied" ${followUpStatus === 'replied' ? 'selected' : ''}>Besvarad</option>
              <option value="closed" ${followUpStatus === 'closed' ? 'selected' : ''}>Stängd</option>
            </select>
          </label>
        </div>
        <div class="inquiry-badges">
          <span class="artwork-status-badge is-${followUpStatus === 'new' ? 'reserved' : followUpStatus === 'closed' ? 'sold' : 'available'}">${escapeHtml(getFollowUpStatusLabel(followUpStatus))}</span>
          <span class="inquiry-chip">${escapeHtml(leadKind === 'artwork' ? 'Verksförfrågan' : 'Kontakt')}</span>
          ${inquiryStatus ? `<span class="inquiry-chip">${escapeHtml(getInquiryAvailabilityLabel(inquiryStatus))}</span>` : ''}
          ${priceLabel ? `<span class="inquiry-chip">${escapeHtml(priceLabel)}</span>` : ''}
          <span class="inquiry-chip">${delivered ? 'Mail skickat' : 'Mail ej skickat'}</span>
        </div>
        ${message ? `<p class="inquiry-message">${escapeHtml(message)}</p>` : ''}
        ${sourceUrl ? `<p class="inquiry-link-row"><a href="${escapeHtml(sourceUrl)}" target="_blank" rel="noopener noreferrer">Öppna verk-sida</a></p>` : ''}
      </article>`;
    })
    .join('');

  el.inquiriesPanelList.querySelectorAll('[data-action="follow-up"]').forEach((selectNode) => {
    selectNode.addEventListener('change', async () => {
      const wrapper = selectNode.closest('.inquiry-card');
      const id = Number(wrapper && wrapper.getAttribute('data-id'));
      const nextStatus = String(selectNode.value || '').trim();
      if (!Number.isFinite(id) || !['new', 'replied', 'closed'].includes(nextStatus)) {
        return;
      }
      try {
        setInquiriesPanelStatus('Uppdaterar uppföljningsstatus...', 'info');
        await apiJson('api/inquiries.php', {
          method: 'POST',
          withCsrf: isSecureAuthStudio(),
          body: {
            id,
            followUpStatus: nextStatus
          }
        });
        uiState.inquiriesData = uiState.inquiriesData.map((item) =>
          Number(item && item.id) === id ? { ...item, follow_up_status: nextStatus } : item
        );
        renderInquiriesPanel();
        setInquiriesPanelStatus('Uppföljningsstatus uppdaterad.', 'success');
      } catch (error) {
        const message = error instanceof Error && error.message ? error.message : 'Kunde inte uppdatera uppföljningsstatus.';
        setInquiriesPanelStatus(message, 'error');
      }
    });
  });
};

const fetchInquiriesPanel = async () => {
  if (!el.inquiriesPanelList) {
    return;
  }

  setInquiriesPanelStatus('Hämtar intresseanmälningar...', 'info');
  try {
    const query =
      uiState.inquiriesFilter && uiState.inquiriesFilter !== 'all'
        ? `?followUpStatus=${encodeURIComponent(uiState.inquiriesFilter)}`
        : '';
    const response = await apiJson(`api/inquiries.php${query}`, {
      method: 'GET',
      withCsrf: isSecureAuthStudio()
    });
    uiState.inquiriesData = Array.isArray(response.inquiries) ? response.inquiries : [];
    renderInquiriesPanel();
    setInquiriesPanelStatus(`Uppdaterad: ${new Date().toLocaleString('sv-SE')}`, 'success');
  } catch (error) {
    const message = error instanceof Error && error.message ? error.message : 'Kunde inte hämta intresseanmälningar.';
    setInquiriesPanelStatus(message, 'error');
  }
};

const initInquiriesPanel = () => {
  if (!el.inquiriesPanelRefresh || !el.inquiriesPanelFilter || !el.inquiriesPanelList) {
    return;
  }
  el.inquiriesPanelFilter.value = uiState.inquiriesFilter;
  el.inquiriesPanelRefresh.addEventListener('click', () => {
    fetchInquiriesPanel();
  });
  el.inquiriesPanelFilter.addEventListener('change', () => {
    uiState.inquiriesFilter = String(el.inquiriesPanelFilter.value || 'all');
    fetchInquiriesPanel();
  });
  fetchInquiriesPanel();
};

const clearBootstrapQr = () => {
  if (el.bootstrapQr) {
    el.bootstrapQr.innerHTML = '';
  }
  if (el.bootstrapQrWrap) {
    el.bootstrapQrWrap.hidden = true;
  }
};

const renderBootstrapQr = (otpauthUrl) => {
  clearBootstrapQr();
  if (!el.bootstrapQr || !el.bootstrapQrWrap) {
    return;
  }
  if (typeof otpauthUrl !== 'string' || otpauthUrl.trim() === '') {
    return;
  }
  if (typeof window.QRCode !== 'function') {
    return;
  }

  try {
    new window.QRCode(el.bootstrapQr, {
      text: otpauthUrl,
      width: 220,
      height: 220,
      colorDark: '#111827',
      colorLight: '#ffffff',
      correctLevel:
        window.QRCode.CorrectLevel && window.QRCode.CorrectLevel.M
          ? window.QRCode.CorrectLevel.M
          : undefined
    });
    el.bootstrapQrWrap.hidden = false;
  } catch (error) {
    clearBootstrapQr();
  }
};

const showAuthView = (view) => {
  const views = [el.authViewLogin, el.authViewBootstrap, el.authViewReset];
  views.forEach((node) => {
    if (!node) {
      return;
    }
    node.hidden = true;
  });

  if (view === 'bootstrap' && el.authViewBootstrap) {
    el.authViewBootstrap.hidden = false;
  } else if (view === 'reset' && el.authViewReset) {
    el.authViewReset.hidden = false;
  } else if (el.authViewLogin) {
    el.authViewLogin.hidden = false;
  }
};

const showStudioApp = () => {
  if (el.studioAuth) {
    el.studioAuth.hidden = true;
  }
  if (el.studioApp) {
    el.studioApp.hidden = false;
  }
};

const showStudioAuthGate = () => {
  if (el.studioApp) {
    el.studioApp.hidden = true;
  }
  if (el.studioAuth) {
    el.studioAuth.hidden = false;
  }
};

const apiJson = async (url, options = {}) => {
  const method = options.method || 'GET';
  const headers = {
    ...(options.headers || {})
  };
  if (!headers['Content-Type'] && method !== 'GET') {
    headers['Content-Type'] = 'application/json';
  }
  if (options.withCsrf && authState.csrfToken) {
    headers['X-CSRF-Token'] = authState.csrfToken;
  }

  const response = await fetch(`${url}${url.includes('?') ? '&' : '?'}v=${ASSET_REV}`, {
    method,
    headers,
    credentials: 'same-origin',
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch (error) {
    payload = null;
  }

  if (!response.ok || !payload || payload.ok !== true) {
    const message =
      payload && typeof payload.message === 'string' && payload.message.trim() !== ''
        ? payload.message.trim()
        : `HTTP ${response.status}`;
    throw new Error(message);
  }

  return payload;
};

const apiUploadImage = async (file, options = {}) => {
  if (!(file instanceof File)) {
    throw new Error('Ingen fil vald.');
  }
  if (!file.type || !file.type.startsWith('image/')) {
    throw new Error('Välj en bildfil (JPG, PNG, WEBP, GIF eller AVIF).');
  }

  const formData = new FormData();
  formData.append('image', file);
  const hint = typeof options.filenameHint === 'string' ? options.filenameHint.trim() : '';
  if (hint) {
    formData.append('filenameHint', hint);
  }

  const headers = {};
  if (authState.csrfToken) {
    headers['X-CSRF-Token'] = authState.csrfToken;
  }

  const response = await fetch(`api/upload-image.php?v=${ASSET_REV}`, {
    method: 'POST',
    headers,
    credentials: 'same-origin',
    body: formData
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch (error) {
    payload = null;
  }

  if (!response.ok || !payload || payload.ok !== true) {
    const message =
      payload && typeof payload.message === 'string' && payload.message.trim() !== ''
        ? payload.message.trim()
        : `HTTP ${response.status}`;
    throw new Error(message);
  }

  const src = typeof payload.src === 'string' ? payload.src.trim() : '';
  if (!src) {
    throw new Error('Servern returnerade ingen bildsökväg.');
  }

  return src;
};

const setImageFieldValue = (fieldId, src) => {
  const input = document.getElementById(fieldId);
  if (!input) {
    return false;
  }
  input.value = src;
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
  return true;
};

const getResetTokenFromUrl = () => {
  try {
    const params = new URLSearchParams(window.location.search);
    return params.get('reset_token') || '';
  } catch (error) {
    return '';
  }
};

let authEventsBound = false;

const bindSecureAuthEvents = () => {
  if (authEventsBound) {
    return;
  }
  authEventsBound = true;

  if (el.loginForm) {
    el.loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      setAuthStatus('Verifierar inloggning...', 'info');

      const payload = {
        email: el.loginEmail ? el.loginEmail.value.trim() : '',
        password: el.loginPassword ? el.loginPassword.value : '',
        totpCode: el.loginTotp ? el.loginTotp.value.trim() : '',
        recoveryCode: el.loginRecovery ? el.loginRecovery.value.trim() : ''
      };

      try {
        const result = await apiJson('api/auth/login.php', {
          method: 'POST',
          body: payload
        });
        authState.csrfToken = result.csrfToken || '';
        setAuthStatus('Inloggning lyckades. Laddar Studio...', 'success');
        window.location.reload();
      } catch (error) {
        const message = error instanceof Error && error.message ? error.message : 'Inloggningen misslyckades.';
        setAuthStatus(message, 'error');
      }
    });
  }

  if (el.bootstrapStartForm) {
    el.bootstrapStartForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      setAuthStatus('Skapar säker setup...', 'info');

      try {
        const result = await apiJson('api/auth/bootstrap.php', {
          method: 'POST',
          body: {
            action: 'start',
            email: el.bootstrapEmail ? el.bootstrapEmail.value.trim() : '',
            password: el.bootstrapPassword ? el.bootstrapPassword.value : '',
            bootstrapKey: el.bootstrapKey ? el.bootstrapKey.value.trim() : ''
          }
        });

        authState.bootstrapPending = result.pending || null;
        const pending = result.pending && typeof result.pending === 'object' ? result.pending : null;
        const totpSecret = pending && typeof pending.totpSecret === 'string' ? pending.totpSecret : '';
        const otpauthUrl = pending && typeof pending.otpauthUrl === 'string' ? pending.otpauthUrl : '';
        if (el.bootstrapSecret) {
          el.bootstrapSecret.value = totpSecret;
        }
        if (el.bootstrapFinishForm) {
          el.bootstrapFinishForm.hidden = false;
        }
        renderBootstrapQr(otpauthUrl);
        if (el.bootstrapRecovery) {
          el.bootstrapRecovery.textContent = otpauthUrl
            ? `Fallback: använd denna setup-URL om QR inte går att skanna: ${otpauthUrl}`
            : '';
        }
        setAuthStatus('Verifiera nu med en 6-siffrig kod från authenticator-appen.', 'success');
      } catch (error) {
        authState.bootstrapPending = null;
        clearBootstrapQr();
        if (el.bootstrapSecret) {
          el.bootstrapSecret.value = '';
        }
        if (el.bootstrapFinishForm) {
          el.bootstrapFinishForm.hidden = true;
        }
        const message = error instanceof Error && error.message ? error.message : 'Kunde inte starta setup.';
        setAuthStatus(message, 'error');
      }
    });
  }

  if (el.bootstrapFinishForm) {
    el.bootstrapFinishForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      if (!authState.bootstrapPending || !authState.bootstrapPending.totpSecret) {
        setAuthStatus('Starta säker setup först så att TOTP secret genereras.', 'error');
        return;
      }

      const totpValue = el.bootstrapTotp ? el.bootstrapTotp.value.trim() : '';
      if (!/^\d{6}$/.test(totpValue)) {
        setAuthStatus('Ange en giltig 6-siffrig verifieringskod från din authenticator-app.', 'error');
        return;
      }

      setAuthStatus('Verifierar 2FA och aktiverar admin...', 'info');

      try {
        const result = await apiJson('api/auth/bootstrap.php', {
          method: 'POST',
          body: {
            action: 'finish',
            totpCode: totpValue
          }
        });

        authState.csrfToken = result.csrfToken || '';
        if (el.bootstrapRecovery) {
          const codes = Array.isArray(result.recoveryCodes) ? result.recoveryCodes : [];
          el.bootstrapRecovery.textContent =
            codes.length > 0
              ? `Viktigt: spara recovery-koder offline nu: ${codes.join(', ')}`
              : 'Konto aktiverat.';
        }
        setAuthStatus('Admin-konto aktiverat. Spara recovery-koderna och ladda om sidan.', 'success');
      } catch (error) {
        const message = error instanceof Error && error.message ? error.message : 'Kunde inte slutföra setup.';
        setAuthStatus(message, 'error');
      }
    });
  }

  const backToLogin = () => {
    if (el.resetRequestForm) {
      el.resetRequestForm.hidden = false;
    }
    if (el.resetPasswordForm) {
      el.resetPasswordForm.hidden = true;
    }
    showAuthView('login');
  };

  if (el.showResetBtn) {
    el.showResetBtn.addEventListener('click', () => {
      showAuthView('reset');
      if (el.resetRequestForm) {
        el.resetRequestForm.hidden = true;
      }
      if (el.resetPasswordForm) {
        el.resetPasswordForm.hidden = false;
      }
      if (!getResetTokenFromUrl()) {
        if (el.resetRequestForm) {
          el.resetRequestForm.hidden = false;
        }
        if (el.resetPasswordForm) {
          el.resetPasswordForm.hidden = true;
        }
      }
    });
  }

  if (el.backLoginBtn) {
    el.backLoginBtn.addEventListener('click', backToLogin);
  }
  if (el.backLoginBtn2) {
    el.backLoginBtn2.addEventListener('click', backToLogin);
  }

  if (el.resetRequestForm) {
    el.resetRequestForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      setAuthStatus('Skickar återställningslänk...', 'info');
      try {
        const result = await apiJson('api/auth/request-reset.php', {
          method: 'POST',
          body: {
            email: el.resetEmail ? el.resetEmail.value.trim() : ''
          }
        });
        setAuthStatus(result.message || 'Om e-postadressen finns skickas en återställningslänk.', 'success');
      } catch (error) {
        const message = error instanceof Error && error.message ? error.message : 'Kunde inte skicka återställning.';
        setAuthStatus(message, 'error');
      }
    });
  }

  if (el.resetPasswordForm) {
    el.resetPasswordForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const token = getResetTokenFromUrl();
      if (!token) {
        setAuthStatus('Återställningstoken saknas i URL.', 'error');
        return;
      }

      setAuthStatus('Uppdaterar lösenord...', 'info');
      try {
        const result = await apiJson('api/auth/reset-password.php', {
          method: 'POST',
          body: {
            token,
            newPassword: el.resetPassword ? el.resetPassword.value : ''
          }
        });
        window.history.replaceState(null, '', window.location.pathname);
        if (el.resetPassword) {
          el.resetPassword.value = '';
        }
        setAuthStatus(result.message || 'Lösenord uppdaterat. Logga in igen.', 'success');
        showAuthView('login');
      } catch (error) {
        const message = error instanceof Error && error.message ? error.message : 'Kunde inte återställa lösenord.';
        setAuthStatus(message, 'error');
      }
    });
  }
};

const initSecureAuthGate = async () => {
  if (!isSecureAuthStudio()) {
    showStudioApp();
    return true;
  }

  if (isLocalStaticStudioPreview()) {
    showStudioApp();
    return true;
  }

  showStudioAuthGate();
  bindSecureAuthEvents();

  try {
    const status = await apiJson('api/auth/status.php');
    authState.authenticated = Boolean(status.authenticated);
    authState.adminExists = Boolean(status.adminExists);
    authState.bootstrapKeyRequired = Boolean(status.bootstrapKeyRequired);
    authState.csrfToken = typeof status.csrfToken === 'string' ? status.csrfToken : '';

    if (el.bootstrapKeyWrap) {
      el.bootstrapKeyWrap.hidden = !authState.bootstrapKeyRequired;
    }
    if (el.bootstrapKey) {
      el.bootstrapKey.required = authState.bootstrapKeyRequired;
    }

    if (authState.authenticated) {
      showStudioApp();
      return true;
    }

    if (!authState.adminExists) {
      showAuthView('bootstrap');
      setAuthStatus(
        authState.bootstrapKeyRequired
          ? 'Ingen admin finns ännu. Ange bootstrap-nyckel och starta säker setup.'
          : 'Ingen admin finns ännu. Starta säker setup nedan.',
        'info'
      );
      authState.bootstrapPending = null;
      if (el.bootstrapFinishForm) {
        el.bootstrapFinishForm.hidden = true;
      }
      if (el.bootstrapSecret) {
        el.bootstrapSecret.value = '';
      }
      if (el.bootstrapTotp) {
        el.bootstrapTotp.value = '';
      }
      clearBootstrapQr();
      return false;
    }

    const resetToken = getResetTokenFromUrl();
    if (resetToken) {
      showAuthView('reset');
      if (el.resetRequestForm) {
        el.resetRequestForm.hidden = true;
      }
      if (el.resetPasswordForm) {
        el.resetPasswordForm.hidden = false;
      }
      setAuthStatus('Sätt ett nytt lösenord för Studio.', 'info');
      return false;
    }

    showAuthView('login');
    setAuthStatus('Logga in med e-post, lösenord och 2FA-kod.', 'info');
    return false;
  } catch (error) {
    showAuthView('login');
    const message = error instanceof Error && error.message ? error.message : 'Kunde inte läsa auth-status.';
    setAuthStatus(`Auth-status misslyckades: ${message}`, 'error');
    return false;
  }
};

const getClockStamp = () =>
  new Date().toLocaleTimeString('sv-SE', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

const flashSaveButtons = () => {
  const buttons = Array.from(document.querySelectorAll('#save-studio, #studio-top-save, [data-action="save-section"]')).filter(
    (node) => node instanceof HTMLButtonElement
  );
  if (buttons.length === 0) {
    return;
  }

  const stamp = getClockStamp();
  buttons.forEach((button) => {
    const baseLabel = button.dataset.baseLabel || button.textContent || 'Spara';
    button.dataset.baseLabel = baseLabel;
    button.textContent = `Sparat ${stamp}`;
    button.classList.add('is-saved');
  });

  if (uiState.saveButtonResetTimer) {
    window.clearTimeout(uiState.saveButtonResetTimer);
  }

  uiState.saveButtonResetTimer = window.setTimeout(() => {
    buttons.forEach((button) => {
      button.textContent = button.dataset.baseLabel || 'Spara';
      button.classList.remove('is-saved');
    });
  }, 2200);
};

const injectSectionSaveButtons = () => {
  document.querySelectorAll('.studio-card').forEach((card) => {
    if (card.querySelector('[data-action="save-section"]')) {
      return;
    }

    // Skip the global actions card; it already has export/import/reset controls.
    if (card.querySelector('.studio-actions')) {
      return;
    }

    let headerRow = Array.from(card.querySelectorAll('.studio-row')).find((row) => row.querySelector(':scope > h2'));
    if (!headerRow) {
      const heading = card.querySelector('h2');
      if (!heading) {
        return;
      }
      headerRow = document.createElement('div');
      headerRow.className = 'studio-row studio-section-head';
      heading.parentNode.insertBefore(headerRow, heading);
      headerRow.appendChild(heading);
    }
    headerRow.classList.add('studio-section-head');

    let controls = headerRow.querySelector('.studio-section-controls');
    if (!(controls instanceof HTMLElement)) {
      controls = document.createElement('div');
      controls.className = 'studio-section-controls';
      headerRow.appendChild(controls);
    }

    const saveButton = document.createElement('button');
    saveButton.type = 'button';
    saveButton.className = 'btn btn-primary studio-section-save';
    saveButton.dataset.action = 'save-section';
    saveButton.textContent = 'Spara';
    controls.appendChild(saveButton);
  });
};

const sectionKeyFromTitle = (value) => {
  const normalized = String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return normalized || '';
};

const shouldDefaultSectionCollapse = (sectionKey) => !['hero', 'verk-i-galleriet'].includes(String(sectionKey || ''));

const ensureSectionBodyWrap = (card, headerRow) => {
  let body = card.querySelector(':scope > .studio-card-body');
  if (body) {
    return body;
  }
  body = document.createElement('div');
  body.className = 'studio-card-body';
  const nodes = Array.from(card.childNodes).filter((node) => node !== headerRow);
  nodes.forEach((node) => body.appendChild(node));
  card.appendChild(body);
  return body;
};

const applySectionCollapsedState = (card, toggleButton, collapsed) => {
  const nextCollapsed = Boolean(collapsed);
  card.classList.toggle('is-collapsed', nextCollapsed);
  if (toggleButton) {
    toggleButton.textContent = nextCollapsed ? 'Visa' : 'Dölj';
    toggleButton.setAttribute('aria-expanded', nextCollapsed ? 'false' : 'true');
  }
};

const injectSectionCollapseControls = () => {
  document.querySelectorAll('.studio-card').forEach((card, index) => {
    if (card.querySelector('.studio-actions')) {
      return;
    }

    const heading =
      card.querySelector(':scope > .studio-row > h2') ||
      card.querySelector(':scope > h2');
    if (!heading) {
      return;
    }

    let headerRow = heading.parentElement;
    if (!headerRow || !headerRow.classList.contains('studio-row')) {
      headerRow = document.createElement('div');
      headerRow.className = 'studio-row studio-section-head';
      heading.parentNode.insertBefore(headerRow, heading);
      headerRow.appendChild(heading);
    }
    headerRow.classList.add('studio-section-head');

    ensureSectionBodyWrap(card, headerRow);

    let controls = headerRow.querySelector('.studio-section-controls');
    if (!(controls instanceof HTMLElement)) {
      controls = document.createElement('div');
      controls.className = 'studio-section-controls';
      headerRow.appendChild(controls);
    }

    if (!card.dataset.sectionKey) {
      const titleKey = sectionKeyFromTitle(heading.textContent);
      card.dataset.sectionKey = titleKey || `section-${index + 1}`;
    }

    const sectionKey = card.dataset.sectionKey;
    let toggleButton = headerRow.querySelector('[data-action="toggle-section"]');
    if (!(toggleButton instanceof HTMLButtonElement)) {
      toggleButton = document.createElement('button');
      toggleButton.type = 'button';
      toggleButton.className = 'btn btn-ghost studio-section-toggle';
      toggleButton.dataset.action = 'toggle-section';
      const saveButton = controls.querySelector('[data-action="save-section"]');
      if (saveButton) {
        controls.insertBefore(toggleButton, saveButton);
      } else {
        controls.appendChild(toggleButton);
      }
    }

    const hasStoredState = Object.prototype.hasOwnProperty.call(uiState.collapsedSections, sectionKey);
    const collapsed = hasStoredState
      ? Boolean(uiState.collapsedSections[sectionKey])
      : shouldDefaultSectionCollapse(sectionKey);
    applySectionCollapsedState(card, toggleButton, collapsed);

    if (toggleButton.dataset.boundToggle === '1') {
      return;
    }
    toggleButton.addEventListener('click', () => {
      const nextCollapsed = !card.classList.contains('is-collapsed');
      applySectionCollapsedState(card, toggleButton, nextCollapsed);
      uiState.collapsedSections[sectionKey] = nextCollapsed;
      storeSectionCollapseMap(uiState.collapsedSections);
    });
    toggleButton.dataset.boundToggle = '1';
  });
};

const ensureGallery = () => {
  if (!state.content.gallery || typeof state.content.gallery !== 'object') {
    state.content.gallery = {};
  }

  if (typeof state.content.gallery.pageHeading !== 'string' || state.content.gallery.pageHeading.trim() === '') {
    state.content.gallery.pageHeading = 'Hela galleriet';
  }
  if (typeof state.content.gallery.heading !== 'string' || state.content.gallery.heading.trim() === '') {
    state.content.gallery.heading = 'Galleri';
  }
  if (typeof state.content.gallery.subheading !== 'string') {
    state.content.gallery.subheading = '';
  }

  if (!Array.isArray(state.content.gallery.artworks)) {
    state.content.gallery.artworks = [];
  }

  const nextLabels = {};
  const currentLabels =
    state.content.gallery.categoryLabels && typeof state.content.gallery.categoryLabels === 'object'
      ? state.content.gallery.categoryLabels
      : {};

  Object.keys(currentLabels).forEach((rawKey) => {
    const key = normalizeCategoryKey(rawKey);
    const label = typeof currentLabels[rawKey] === 'string' ? currentLabels[rawKey].trim() : '';
    if (!key || !label) {
      return;
    }
    if (key === 'forest') {
      return;
    }
    nextLabels[key] = label;
  });

  if (!nextLabels.all) {
    nextLabels.all = DEFAULT_STUDIO_CATEGORY_LABELS.all;
  }
  if (!nextLabels.nature) {
    nextLabels.nature = DEFAULT_STUDIO_CATEGORY_LABELS.nature;
  }

  if (!state.content.gallery.autoDiscover || typeof state.content.gallery.autoDiscover !== 'object') {
    state.content.gallery.autoDiscover = { enabled: true, defaultCategory: 'nature' };
  }

  if (!Array.isArray(state.content.gallery.removedSrcs)) {
    state.content.gallery.removedSrcs = [];
  }
  state.content.gallery.removedSrcs = state.content.gallery.removedSrcs
    .map((src) => (typeof src === 'string' ? src.trim() : ''))
    .filter(Boolean);

  const artworks = state.content.gallery.artworks;
  const fallbackCategory = () => Object.keys(nextLabels).find((key) => key !== 'all') || 'nature';

  artworks.forEach((item) => {
    if (!item || typeof item !== 'object') {
      return;
    }
    item.heroExclude = item.heroExclude === true || item.excludeFromHero === true || item.excludeFromHeroAuto === true;
    const categories = setArtworkCategoryKeys(item, getArtworkCategoryKeys(item, fallbackCategory()), fallbackCategory());
    categories.forEach((category) => {
      if (!nextLabels[category]) {
        nextLabels[category] = humanizeCategoryKey(category);
      }
    });
  });

  const preferredOrder = ['all', 'nature', 'sea', 'portrait', 'city'];
  const orderedLabels = {};
  preferredOrder.forEach((key) => {
    if (nextLabels[key]) {
      orderedLabels[key] = nextLabels[key];
    }
  });
  Object.keys(nextLabels).forEach((key) => {
    if (!orderedLabels[key]) {
      orderedLabels[key] = nextLabels[key];
    }
  });
  state.content.gallery.categoryLabels = orderedLabels;

  let defaultCategory = normalizeArtworkCategoryValue(state.content.gallery.autoDiscover.defaultCategory);
  if (!defaultCategory) {
    defaultCategory = fallbackCategory();
  }
  if (!state.content.gallery.categoryLabels[defaultCategory]) {
    state.content.gallery.categoryLabels[defaultCategory] = humanizeCategoryKey(defaultCategory);
  }
  state.content.gallery.autoDiscover.defaultCategory = defaultCategory;

  if (state.translations && typeof state.translations === 'object') {
    const allowedKeys = new Set(Object.keys(state.content.gallery.categoryLabels));
    Object.keys(state.translations).forEach((language) => {
      const pack = state.translations[language];
      const labels = getPath(pack, 'gallery.categoryLabels');
      if (!labels || typeof labels !== 'object') {
        return;
      }
      Object.keys(labels).forEach((key) => {
        const normalized = normalizeCategoryKey(key);
        if (!normalized || !allowedKeys.has(normalized)) {
          delete labels[key];
        }
      });
    });
  }

  normalizeGalleryArtworkDisplayOrder();
};

const ensureHeroSlides = () => {
  if (!state.content.hero || typeof state.content.hero !== 'object') {
    state.content.hero = {};
  }

  if (!state.content.hero.autoSlides || typeof state.content.hero.autoSlides !== 'object') {
    state.content.hero.autoSlides = {};
  }
  if (typeof state.content.hero.autoSlides.enabled !== 'boolean') {
    state.content.hero.autoSlides.enabled = false;
  }
  if (!Number(state.content.hero.autoSlides.count)) {
    state.content.hero.autoSlides.count = 4;
  }
  if (!Number(state.content.hero.autoSlides.periodDays)) {
    state.content.hero.autoSlides.periodDays = 7;
  }
  if (typeof state.content.hero.autoSlides.landscapeOnly !== 'boolean') {
    state.content.hero.autoSlides.landscapeOnly = true;
  }
  if (!Array.isArray(state.content.hero.autoSlides.excludeSrcs)) {
    state.content.hero.autoSlides.excludeSrcs = [];
  }
  if (typeof state.content.hero.autoSlides.seedNonce !== 'string') {
    state.content.hero.autoSlides.seedNonce = '';
  }
  if (typeof state.content.hero.autoSlides.lastForcedAt !== 'string') {
    state.content.hero.autoSlides.lastForcedAt = '';
  }

  if (!Array.isArray(state.content.hero.slides)) {
    state.content.hero.slides = [];
  }

  if (!state.content.hero.mode) {
    state.content.hero.mode = 'still';
  }

  if (!Number(state.content.hero.slideDurationMs)) {
    state.content.hero.slideDurationMs = 8000;
  }

  if (Number.isNaN(Number(state.content.hero.copyPanelOpacity))) {
    state.content.hero.copyPanelOpacity = 40;
  }
};

const formatStudioDateTime = (value) => {
  if (typeof value !== 'string' || value.trim() === '') {
    return '';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  try {
    return new Intl.DateTimeFormat('sv-SE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  } catch (error) {
    return '';
  }
};

const updateHeroAutoSlidesForceMeta = () => {
  if (!el.heroAutoSlidesForceMeta) {
    return;
  }
  const autoSlides = state.content?.hero?.autoSlides;
  const stamp = autoSlides && typeof autoSlides.lastForcedAt === 'string' ? autoSlides.lastForcedAt.trim() : '';
  const formatted = formatStudioDateTime(stamp);
  el.heroAutoSlidesForceMeta.textContent = formatted ? `Senast force update: ${formatted}` : 'Ingen force update gjord ännu';
};

const ensureAboutContact = () => {
  if (!state.content.about || typeof state.content.about !== 'object') {
    state.content.about = {};
  }
  if (typeof state.content.about.portraitImage !== 'string') {
    state.content.about.portraitImage = '';
  }
  if (typeof state.content.about.portraitAlt !== 'string') {
    state.content.about.portraitAlt = '';
  }
  if (typeof state.content.about.materialImage !== 'string') {
    state.content.about.materialImage = '';
  }
  if (typeof state.content.about.materialImageAlt !== 'string') {
    state.content.about.materialImageAlt = '';
  }
  if (typeof state.content.about.featureImage !== 'string') {
    state.content.about.featureImage = '';
  }
  if (typeof state.content.about.featureImageAlt !== 'string') {
    state.content.about.featureImageAlt = '';
  }
  if (typeof state.content.about.dayJobLine !== 'string') {
    state.content.about.dayJobLine = '';
  }
  if (typeof state.content.about.materialsHeading !== 'string') {
    state.content.about.materialsHeading = 'Material';
  }
  if (typeof state.content.about.materialsBody !== 'string') {
    state.content.about.materialsBody = '';
  }
  if (typeof state.content.about.inspirationHeading !== 'string') {
    state.content.about.inspirationHeading = 'Inspiration';
  }
  if (typeof state.content.about.inspirationBody !== 'string') {
    state.content.about.inspirationBody = '';
  }
  if (!Array.isArray(state.content.about.paragraphs)) {
    state.content.about.paragraphs = [];
  }
  if (!Array.isArray(state.content.about.ambitions)) {
    state.content.about.ambitions = [];
  }
  if (!Array.isArray(state.content.about.recognitionItems)) {
    state.content.about.recognitionItems = [];
  }
  if (typeof state.content.about.recognitionHeading !== 'string' || state.content.about.recognitionHeading.trim() === '') {
    state.content.about.recognitionHeading = 'Utmärkelser & utställningar';
  }
  if (!Array.isArray(state.content.about.processImages)) {
    state.content.about.processImages = [];
  }
  state.content.about.processImages = normalizeImageEntries(state.content.about.processImages);
  if (state.content.about.materialImage.trim() === '' && state.content.about.processImages.length > 0) {
    const fallback = state.content.about.processImages[Math.min(2, state.content.about.processImages.length - 1)];
    state.content.about.materialImage = fallback && typeof fallback.src === 'string' ? fallback.src : '';
    if (state.content.about.materialImageAlt.trim() === '') {
      state.content.about.materialImageAlt = fallback && typeof fallback.alt === 'string' ? fallback.alt : '';
    }
  }
  if (state.content.about.featureImage.trim() === '' && state.content.about.processImages.length > 0) {
    const fallback = state.content.about.processImages[0];
    state.content.about.featureImage = fallback && typeof fallback.src === 'string' ? fallback.src : '';
    if (state.content.about.featureImageAlt.trim() === '') {
      state.content.about.featureImageAlt = fallback && typeof fallback.alt === 'string' ? fallback.alt : '';
    }
  }

  if (!state.content.project || typeof state.content.project !== 'object') {
    state.content.project = {};
  }
  if (typeof state.content.project.eyebrow !== 'string') {
    state.content.project.eyebrow = 'Projekt';
  }
  if (typeof state.content.project.heading !== 'string') {
    state.content.project.heading = '';
  }
  if (typeof state.content.project.description !== 'string') {
    state.content.project.description = '';
  }
  if (typeof state.content.project.collageImage !== 'string') {
    state.content.project.collageImage = '';
  }
  if (typeof state.content.project.collageAlt !== 'string') {
    state.content.project.collageAlt = '';
  }
  if (typeof state.content.project.sampleHeading !== 'string') {
    state.content.project.sampleHeading = '';
  }
  if (!Array.isArray(state.content.project.samples)) {
    state.content.project.samples = [];
  }
  state.content.project.samples = normalizeImageEntries(state.content.project.samples);

  if (!state.content.theme || typeof state.content.theme !== 'object') {
    state.content.theme = {};
  }
  if (typeof state.content.theme.headerBackground !== 'string' || state.content.theme.headerBackground.trim() === '') {
    state.content.theme.headerBackground = state.content.theme.background || '#f3efe6';
  }
  state.content.theme.footerBackground = state.content.theme.headerBackground;
  state.content.theme.headerOpacity = normalizePercentageValue(state.content.theme.headerOpacity, 84);
  if (typeof state.content.theme.buttonGradientStart !== 'string' || state.content.theme.buttonGradientStart.trim() === '') {
    state.content.theme.buttonGradientStart = state.content.theme.primary || '#123a62';
  }
  if (typeof state.content.theme.buttonGradientEnd !== 'string' || state.content.theme.buttonGradientEnd.trim() === '') {
    state.content.theme.buttonGradientEnd = state.content.theme.accent || '#b98c56';
  }
  state.content.theme.fontDisplay = normalizeFontKey(state.content.theme.fontDisplay, DISPLAY_FONT_KEYS, 'fraunces');
  state.content.theme.fontBody = normalizeFontKey(state.content.theme.fontBody, BODY_FONT_KEYS, 'jakarta');
  state.content.theme.fontDisplayWeight = normalizeFontWeight(state.content.theme.fontDisplayWeight, 700);
  state.content.theme.fontBodyWeight = normalizeFontWeight(state.content.theme.fontBodyWeight, 400);
  state.content.theme.fontDisplayStyle = normalizeFontStyle(state.content.theme.fontDisplayStyle);
  state.content.theme.fontBodyStyle = normalizeFontStyle(state.content.theme.fontBodyStyle);

  if (!state.content.contact || typeof state.content.contact !== 'object') {
    state.content.contact = {};
  }

  const contact = state.content.contact;
  if (typeof contact.emailPublic !== 'boolean') {
    contact.emailPublic = true;
  }
  if (!Array.isArray(contact.socialLinks)) {
    contact.socialLinks = [];
  }
  if (contact.socialLinks.length === 0) {
    if (contact.instagramUrl) {
      contact.socialLinks.push(createSocialChannel({ label: 'Instagram', url: contact.instagramUrl }));
    }
    if (contact.facebookUrl) {
      contact.socialLinks.push(createSocialChannel({ label: 'Facebook', url: contact.facebookUrl }));
    }
  }
  contact.socialLinks = contact.socialLinks
    .filter((item) => item && typeof item === 'object')
    .map((item) => createSocialChannel({ label: item.label || '', url: item.url || '' }));
};

const ensureAnalytics = () => {
  if (!state.content.analytics || typeof state.content.analytics !== 'object') {
    state.content.analytics = {};
  }
  if (typeof state.content.analytics.gaMeasurementId !== 'string') {
    state.content.analytics.gaMeasurementId = '';
  }
  if (typeof state.content.analytics.anonymizeIp !== 'boolean') {
    state.content.analytics.anonymizeIp = true;
  }
  if (typeof state.content.analytics.trackStudio !== 'boolean') {
    state.content.analytics.trackStudio = false;
  }
};

const ensureSeo = () => {
  if (!state.content.seo || typeof state.content.seo !== 'object') {
    state.content.seo = {};
  }
  if (!state.content.seo.home || typeof state.content.seo.home !== 'object') {
    state.content.seo.home = {};
  }

  const home = state.content.seo.home;
  const site = state.content.site && typeof state.content.site === 'object' ? state.content.site : {};
  const hero = state.content.hero && typeof state.content.hero === 'object' ? state.content.hero : {};

  if (typeof home.title !== 'string' || home.title.trim() === '') {
    home.title = typeof site.title === 'string' ? site.title : '';
  }
  if (typeof home.description !== 'string' || home.description.trim() === '') {
    home.description = typeof site.metaDescription === 'string' ? site.metaDescription : '';
  }
  if (typeof home.image !== 'string' || home.image.trim() === '') {
    home.image = typeof hero.image === 'string' ? hero.image : '';
  }
  if (typeof home.imageAlt !== 'string' || home.imageAlt.trim() === '') {
    home.imageAlt = typeof hero.imageAlt === 'string' ? hero.imageAlt : '';
  }
};

const applyStudioThemePreview = () => {
  const theme = state.content && state.content.theme && typeof state.content.theme === 'object' ? state.content.theme : {};
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
    '--button-gradient-start': theme.buttonGradientStart,
    '--button-gradient-end': theme.buttonGradientEnd
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

  const displayStyle = normalizeFontStyle(theme.fontDisplayStyle);
  const bodyStyle = normalizeFontStyle(theme.fontBodyStyle);
  root.style.setProperty('--font-display-style', displayStyle);
  root.style.setProperty('--font-body-style', bodyStyle);

  if (el.studioApp) {
    const buttonStart =
      typeof theme.buttonGradientStart === 'string' && theme.buttonGradientStart.trim() !== ''
        ? theme.buttonGradientStart
        : theme.primary;
    const buttonEnd =
      typeof theme.buttonGradientEnd === 'string' && theme.buttonGradientEnd.trim() !== ''
        ? theme.buttonGradientEnd
        : theme.accent;
    const studioVars = {
      '--studio-site-bg': theme.background,
      '--studio-site-surface': theme.surface,
      '--studio-site-ink': theme.ink,
      '--studio-site-soft-ink': theme.softInk,
      '--studio-site-primary': theme.primary,
      '--studio-site-accent': theme.accent,
      '--studio-site-border': theme.border,
      '--studio-site-header-bg': sharedHeaderFooterColor,
      '--studio-site-button-start': buttonStart,
      '--studio-site-button-end': buttonEnd,
      '--studio-gold': theme.accent || theme.primary
    };

    Object.entries(studioVars).forEach(([cssVar, value]) => {
      if (typeof value === 'string' && value.trim() !== '') {
        el.studioApp.style.setProperty(cssVar, value);
      }
    });
  }

  const localized = getLocalizedContentForEditor();
  const hero = localized.hero && typeof localized.hero === 'object' ? localized.hero : {};
  const eyebrow =
    (el.heroEyebrow && el.heroEyebrow.value.trim()) ||
    (typeof hero.eyebrow === 'string' && hero.eyebrow.trim()) ||
    'Akvarell';
  const title =
    (el.heroTitle && el.heroTitle.value.trim()) ||
    (typeof hero.title === 'string' && hero.title.trim()) ||
    'Originalmålningar i <i>akvarell</i>';
  const body =
    (el.heroIntro && el.heroIntro.value.trim()) ||
    (typeof hero.intro === 'string' && hero.intro.trim()) ||
    'Ljus, stämning och närvaro i landskap, natur och stadsvyer.';

  renderInlineFormattedText(el.studioThemePreviewEyebrow, eyebrow);
  renderInlineFormattedText(el.studioThemePreviewTitle, title);
  renderInlineFormattedText(el.studioThemePreviewBody, body);
};

const syncFormFromState = () => {
  const localized = getLocalizedContentForEditor();
  const { theme, hero, gallery, about, project, contact, analytics, seo } = state.content;
  const localizedHero = localized.hero && typeof localized.hero === 'object' ? localized.hero : {};
  const localizedGallery = localized.gallery && typeof localized.gallery === 'object' ? localized.gallery : {};
  const localizedAbout = localized.about && typeof localized.about === 'object' ? localized.about : {};
  const localizedProject = localized.project && typeof localized.project === 'object' ? localized.project : {};
  const localizedContact = localized.contact && typeof localized.contact === 'object' ? localized.contact : {};
  const localizedSeo = localized.seo && typeof localized.seo === 'object' ? localized.seo : {};
  const localizedSeoHome = localizedSeo.home && typeof localizedSeo.home === 'object' ? localizedSeo.home : {};
  const localizedSite = localized.site && typeof localized.site === 'object' ? localized.site : {};
  const seoHome = seo && seo.home && typeof seo.home === 'object' ? seo.home : {};

  el.themeBackground.value = toHex(theme.background, '#f3efe6');
  el.themeSurface.value = toHex(theme.surface, '#fcf8f1');
  el.themeInk.value = toHex(theme.ink, '#10131b');
  el.themeSoftInk.value = toHex(theme.softInk, '#4f5766');
  el.themePrimary.value = toHex(theme.primary, '#123a62');
  el.themeAccent.value = toHex(theme.accent, '#b98c56');
  if (el.themeHeaderBackground) {
    el.themeHeaderBackground.value = toHex(theme.headerBackground || theme.footerBackground || theme.background, '#f3efe6');
  }
  if (el.themeHeaderOpacity) {
    el.themeHeaderOpacity.value = String(normalizePercentageValue(theme.headerOpacity, 84));
  }
  if (el.themeButtonGradientStart) {
    el.themeButtonGradientStart.value = toHex(theme.buttonGradientStart || theme.primary, '#123a62');
  }
  if (el.themeButtonGradientEnd) {
    el.themeButtonGradientEnd.value = toHex(theme.buttonGradientEnd || theme.accent, '#b98c56');
  }
  if (el.themeFontDisplay) {
    el.themeFontDisplay.value = normalizeFontKey(theme.fontDisplay, DISPLAY_FONT_KEYS, 'fraunces');
  }
  if (el.themeFontBody) {
    el.themeFontBody.value = normalizeFontKey(theme.fontBody, BODY_FONT_KEYS, 'jakarta');
  }
  if (el.themeFontDisplayWeight) {
    el.themeFontDisplayWeight.value = String(normalizeFontWeight(theme.fontDisplayWeight, 700));
  }
  if (el.themeFontBodyWeight) {
    el.themeFontBodyWeight.value = String(normalizeFontWeight(theme.fontBodyWeight, 400));
  }
  if (el.themeFontDisplayStyle) {
    el.themeFontDisplayStyle.value = normalizeFontStyle(theme.fontDisplayStyle);
  }
  if (el.themeFontBodyStyle) {
    el.themeFontBodyStyle.value = normalizeFontStyle(theme.fontBodyStyle);
  }
  if (el.analyticsGaId) {
    el.analyticsGaId.value = analytics.gaMeasurementId || '';
  }
  if (el.analyticsAnonymizeIp) {
    el.analyticsAnonymizeIp.checked = analytics.anonymizeIp !== false;
  }

  el.heroTitle.value = localizedHero.title || '';
  el.heroIntro.value = localizedHero.intro || '';
  if (el.heroLine) {
    el.heroLine.value = localizedHero.line || '';
  }
  el.heroMode.value = hero.mode || 'still';
  el.heroSlideDuration.value = String(numberOrFallback(hero.slideDurationMs, 8000));
  if (el.heroAutoSlidesEnabled) {
    el.heroAutoSlidesEnabled.checked = Boolean(hero.autoSlides && hero.autoSlides.enabled === true);
  }
  updateHeroAutoSlidesForceMeta();
  el.heroOverlayEnabled.checked = hero.overlayEnabled !== false;
  el.heroOverlayOpacity.value = String(numberOrFallback(hero.overlayOpacity, 55));
  el.heroCopyPanelOpacity.value = String(numberOrFallback(hero.copyPanelOpacity, 40));
  el.heroImage.value = hero.image || '';
  el.heroImageAlt.value = localizedHero.imageAlt || '';
  if (el.seoHomeTitle) {
    el.seoHomeTitle.value = localizedSeoHome.title || localizedSite.title || seoHome.title || '';
  }
  if (el.seoHomeDescription) {
    el.seoHomeDescription.value =
      localizedSeoHome.description || localizedSite.metaDescription || seoHome.description || '';
  }
  if (el.seoHomeImage) {
    el.seoHomeImage.value = localizedSeoHome.image || seoHome.image || '';
  }
  if (el.seoHomeImageAlt) {
    el.seoHomeImageAlt.value = localizedSeoHome.imageAlt || seoHome.imageAlt || localizedHero.imageAlt || '';
  }

  applyStudioThemePreview();
  renderSeoHomeImageControls();

  if (el.galleryHeading) {
    el.galleryHeading.value = localizedGallery.heading || gallery.heading || 'Galleri';
  }
  if (el.galleryPageHeading) {
    el.galleryPageHeading.value = localizedGallery.pageHeading || gallery.pageHeading || 'Hela galleriet';
  }
  if (el.gallerySubheading) {
    el.gallerySubheading.value = localizedGallery.subheading || gallery.subheading || '';
  }
  el.autoDiscoverEnabled.checked = Boolean(gallery.autoDiscover.enabled);
  renderCategoryEditor();
  renderCategorySelects();
  if (el.autoDefaultCategory) {
    const desiredDefault = normalizeCategoryKey(gallery.autoDiscover.defaultCategory || '') || getFirstGalleryCategoryKey();
    el.autoDefaultCategory.value = desiredDefault;
    if (el.autoDefaultCategory.value !== desiredDefault) {
      el.autoDefaultCategory.value = getFirstGalleryCategoryKey();
    }
  }
  if (el.uploadCategory && !el.uploadCategory.value) {
    el.uploadCategory.value = getFirstGalleryCategoryKey();
  }

  el.aboutHeading.value = localizedAbout.heading || '';
  el.aboutParagraphs.value = arrayToParagraphText(localizedAbout.paragraphs);
  if (el.aboutPortraitImage) {
    el.aboutPortraitImage.value = about.portraitImage || '';
  }
  if (el.aboutPortraitAlt) {
    el.aboutPortraitAlt.value = localizedAbout.portraitAlt || about.portraitAlt || '';
  }
  if (el.aboutDayJobLine) {
    el.aboutDayJobLine.value = localizedAbout.dayJobLine || '';
  }
  el.aboutSideNote.value = localizedAbout.sideNote || '';
  if (el.materialsHeading) {
    el.materialsHeading.value = localizedAbout.materialsHeading || '';
  }
  if (el.materialsBody) {
    el.materialsBody.value = localizedAbout.materialsBody || '';
  }
  if (el.materialsImage) {
    el.materialsImage.value = about.materialImage || '';
  }
  if (el.materialsImageAlt) {
    el.materialsImageAlt.value = localizedAbout.materialImageAlt || about.materialImageAlt || '';
  }
  if (el.inspirationHeading) {
    el.inspirationHeading.value = localizedAbout.inspirationHeading || '';
  }
  if (el.inspirationBody) {
    el.inspirationBody.value = localizedAbout.inspirationBody || '';
  }
  if (el.aboutFeatureImage) {
    el.aboutFeatureImage.value = about.featureImage || '';
  }
  if (el.aboutFeatureAlt) {
    el.aboutFeatureAlt.value = localizedAbout.featureImageAlt || about.featureImageAlt || '';
  }
  el.ambitionsHeading.value = localizedAbout.ambitionsHeading || '';
  el.ambitionsLines.value = arrayToLineText(localizedAbout.ambitions);
  if (el.recognitionHeading) {
    el.recognitionHeading.value =
      localizedAbout.recognitionHeading || about.recognitionHeading || 'Utmärkelser & utställningar';
  }
  if (el.recognitionLines) {
    el.recognitionLines.value = arrayToLineText(localizedAbout.recognitionItems);
  }

  if (el.projectEyebrow) {
    el.projectEyebrow.value = localizedProject.eyebrow || project.eyebrow || 'Projekt';
  }
  if (el.projectHeading) {
    el.projectHeading.value = localizedProject.heading || '';
  }
  if (el.projectDescription) {
    el.projectDescription.value = localizedProject.description || '';
  }
  if (el.projectCollageImage) {
    el.projectCollageImage.value = project.collageImage || '';
  }
  if (el.projectCollageAlt) {
    el.projectCollageAlt.value = localizedProject.collageAlt || '';
  }
  if (el.projectSampleHeading) {
    el.projectSampleHeading.value = localizedProject.sampleHeading || '';
  }
  writeImageEntriesToSlots(
    [
      { src: el.projectSample1Src, alt: el.projectSample1Alt },
      { src: el.projectSample2Src, alt: el.projectSample2Alt },
      { src: el.projectSample3Src, alt: el.projectSample3Alt },
      { src: el.projectSample4Src, alt: el.projectSample4Alt }
    ],
    mergeImageEntriesByBaseOrder(project.samples, localizedProject.samples)
  );
  renderSectionImagePickers();

  el.contactEyebrow.value = localizedContact.eyebrow || '';
  el.contactHeading.value = localizedContact.heading || '';
  el.contactBody.value = localizedContact.body || '';
  el.contactEmail.value = contact.email || '';
  el.contactEmailLabel.value = localizedContact.emailLabel || contact.emailLabel || 'Skicka e-post';
  if (el.contactEmailPublic) {
    el.contactEmailPublic.checked = contact.emailPublic !== false;
  }

  refreshStudioLanguageUi();
  renderContactSocialEditor();
};

const renderContactSocialEditor = () => {
  if (!el.contactSocialEditor) {
    return;
  }

  const language = getEditingLanguage();
  const links = getContactSocialLinksForEditor(language);
  if (links.length === 0) {
    el.contactSocialEditor.innerHTML = '<p class="gallery-empty">Inga sociala kanaler ännu.</p>';
    return;
  }

  el.contactSocialEditor.innerHTML = links
    .map(
      (item, index) => `
      <article class="contact-social-item" data-index="${index}">
        <label>Namn på kanal
          <input type="text" data-field="label" value="${escapeHtml(item.label || '')}" />
        </label>
        <label>URL
          <input type="url" data-field="url" value="${escapeHtml(item.url || '')}" placeholder="https://..." />
        </label>
        <button type="button" class="btn btn-ghost" data-action="remove">Ta bort</button>
      </article>
    `
    )
    .join('');

  el.contactSocialEditor.querySelectorAll('.contact-social-item').forEach((node) => {
    const index = Number(node.getAttribute('data-index'));
    const editableLinks = language === 'sv' ? state.content.contact.socialLinks : ensureEditableContactSocialLinks(language);
    const link = editableLinks[index];
    if (!link) {
      return;
    }

    node.querySelectorAll('[data-field]').forEach((fieldNode) => {
      fieldNode.addEventListener('input', () => {
        const field = fieldNode.getAttribute('data-field');
        if (!field) {
          return;
        }
        link[field] = fieldNode.value;
      });
    });

    const removeButton = node.querySelector('[data-action="remove"]');
    if (removeButton) {
      removeButton.addEventListener('click', () => {
        const activeLinks = language === 'sv' ? state.content.contact.socialLinks : ensureEditableContactSocialLinks(language);
        activeLinks.splice(index, 1);
        renderContactSocialEditor();
      });
    }
  });
};

const renderHeroSlideArtworkOptions = () => {
  if (!el.heroSlideFromArtwork) {
    return;
  }

  const artworks = getLocalizedArtworksForEditor();
  const options = artworks
    .filter((item) => item && item.src)
    .map((item, index) => `<option value="${index}">${item.title || item.src}</option>`)
    .join('');

  el.heroSlideFromArtwork.innerHTML = options || '<option value="">Inga verk ännu</option>';
};

const renderHeroSlidesEditor = () => {
  if (!el.heroSlidesEditor) {
    return;
  }

  const slides = getHeroSlidesForEditor();
  if (slides.length === 0) {
    uiState.selectedHeroSlideIndex = -1;
    el.heroSlidesEditor.innerHTML = '<p class="gallery-empty">Inga slides ännu.</p>';
    return;
  }

  const normalized = Number(uiState.selectedHeroSlideIndex);
  if (Number.isNaN(normalized)) {
    uiState.selectedHeroSlideIndex = 0;
  } else {
    uiState.selectedHeroSlideIndex = Math.max(0, Math.min(slides.length - 1, normalized));
  }

  const selectedIndex = uiState.selectedHeroSlideIndex;
  const selectedSlide = slides[selectedIndex];
  const selectedDuration = Number(selectedSlide.durationMs || state.content.hero.slideDurationMs || 8000);
  const disableUp = selectedIndex === 0 ? 'disabled' : '';
  const disableDown = selectedIndex === slides.length - 1 ? 'disabled' : '';

  const thumbMarkup = slides
    .map((slide, index) => {
      const src = typeof slide.src === 'string' ? slide.src.trim() : '';
      const alt = (slide.alt || '').trim();
      const preview = src
        ? `<img src="${escapeHtml(addRevToSrc(src))}" alt="Miniatyr slide ${index + 1}" loading="lazy" decoding="async" />`
        : '<span class="artwork-editor-placeholder">Ingen bild</span>';
      const duration = Number(slide.durationMs || state.content.hero.slideDurationMs || 8000);
      return `
        <button type="button" class="hero-slide-thumb${index === selectedIndex ? ' is-active' : ''}" data-action="select-slide" data-index="${index}" aria-pressed="${index === selectedIndex ? 'true' : 'false'}">
          <span class="hero-slide-thumb-image">${preview}</span>
          <span class="hero-slide-thumb-meta">
            <strong>Slide ${index + 1}</strong>
            <small>${escapeHtml(alt || 'Ingen alt-text')} · ${duration} ms</small>
          </span>
        </button>
      `;
    })
    .join('');

  el.heroSlidesEditor.innerHTML = `
    <div class="hero-slides-compact">
      <div class="hero-slide-thumb-list" role="listbox" aria-label="Välj slide">
        ${thumbMarkup}
      </div>
      <article class="hero-slide-detail" data-index="${selectedIndex}">
        <div class="hero-slide-detail-head">
          <h3>Redigerar slide ${selectedIndex + 1}</h3>
          <p>${slides.length} slides totalt</p>
        </div>
        <div class="hero-slide-detail-layout">
          <figure class="hero-slide-detail-preview">
            ${
              selectedSlide.src
                ? `<img src="${escapeHtml(addRevToSrc(selectedSlide.src))}" alt="Förhandsvisning slide ${selectedIndex + 1}" />`
                : '<div class="artwork-editor-placeholder">Ingen bild</div>'
            }
          </figure>
          <div class="hero-slide-detail-fields">
            <label>Bildkälla (src)
              <input type="text" data-field="src" value="${escapeHtml(selectedSlide.src || '')}" />
            </label>
            <label>Alt-text
              <input type="text" data-field="alt" value="${escapeHtml(selectedSlide.alt || '')}" />
            </label>
            <label>Visningstid (ms)
              <input type="number" data-field="durationMs" min="1000" step="500" value="${selectedDuration}" />
            </label>
          </div>
        </div>
        <div class="hero-slide-item-actions">
          <button type="button" class="btn btn-ghost" data-action="move-up" ${disableUp}>Flytta upp</button>
          <button type="button" class="btn btn-ghost" data-action="move-down" ${disableDown}>Flytta ner</button>
          <button type="button" class="btn btn-ghost" data-action="remove">Ta bort slide</button>
        </div>
      </article>
    </div>
  `;

  el.heroSlidesEditor.querySelectorAll('.hero-slide-thumb[data-action="select-slide"]').forEach((button) => {
    button.addEventListener('click', () => {
      const index = Number(button.getAttribute('data-index'));
      if (Number.isNaN(index)) {
        return;
      }
      uiState.selectedHeroSlideIndex = index;
      renderHeroSlidesEditor();
    });
  });

  const detailNode = el.heroSlidesEditor.querySelector('.hero-slide-detail');
  if (!detailNode) {
    return;
  }

  detailNode.querySelectorAll('input[data-field]').forEach((input) => {
    const applyChange = () => {
      const field = input.getAttribute('data-field');
      if (!field) {
        return;
      }

      const slide = slides[selectedIndex];
      if (!slide) {
        return;
      }

      if (field === 'durationMs') {
        slide.durationMs = Number(input.value || state.content.hero.slideDurationMs || 8000);
        return;
      }

      slide[field] = input.value;
    };

    input.addEventListener('input', applyChange);
    input.addEventListener('change', () => {
      applyChange();
      const field = input.getAttribute('data-field');
      if (field === 'src' || field === 'alt' || field === 'durationMs') {
        renderHeroSlidesEditor();
      }
    });
  });

  const removeButton = detailNode.querySelector('[data-action="remove"]');
  if (removeButton) {
    removeButton.addEventListener('click', () => {
      slides.splice(selectedIndex, 1);
      uiState.selectedHeroSlideIndex = Math.max(0, selectedIndex - 1);
      renderHeroSlidesEditor();
    });
  }

  const moveUpButton = detailNode.querySelector('[data-action="move-up"]');
  if (moveUpButton) {
    moveUpButton.addEventListener('click', () => {
      if (selectedIndex <= 0) {
        return;
      }
      const previous = slides[selectedIndex - 1];
      slides[selectedIndex - 1] = slides[selectedIndex];
      slides[selectedIndex] = previous;
      uiState.selectedHeroSlideIndex = selectedIndex - 1;
      renderHeroSlidesEditor();
    });
  }

  const moveDownButton = detailNode.querySelector('[data-action="move-down"]');
  if (moveDownButton) {
    moveDownButton.addEventListener('click', () => {
      if (selectedIndex >= slides.length - 1) {
        return;
      }
      const next = slides[selectedIndex + 1];
      slides[selectedIndex + 1] = slides[selectedIndex];
      slides[selectedIndex] = next;
      uiState.selectedHeroSlideIndex = selectedIndex + 1;
      renderHeroSlidesEditor();
    });
  }
};

const createArtworkItem = (overrides = {}) => {
  const nextOrder = state.content.gallery.artworks.length + 1;
  const item = {
    src: '',
    title: '',
    format: '',
    medium: 'Akvarell på papper',
    alt: '',
    seoTitle: '',
    seoDescription: '',
    shareImage: '',
    category: 'nature',
    categories: ['nature'],
    featured: false,
    heroExclude: false,
    year: new Date().getFullYear(),
    order: nextOrder,
    zoom: 1,
    objectPosition: 'center center',
    ...overrides
  };
  setArtworkCategoryKeys(item, Array.isArray(item.categories) ? item.categories : item.category, 'nature');
  return item;
};

const syncGalleryArtworkOrderValues = () => {
  const artworks = Array.isArray(state.content.gallery?.artworks) ? state.content.gallery.artworks : [];
  artworks.forEach((item, index) => {
    if (item && typeof item === 'object') {
      item.order = index + 1;
    }
  });
};

const sortGalleryArtworksByOrder = () => {
  const artworks = Array.isArray(state.content.gallery?.artworks) ? state.content.gallery.artworks : [];
  artworks
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      const orderDiff = Number(a.item?.order || a.index + 1) - Number(b.item?.order || b.index + 1);
      if (orderDiff !== 0) {
        return orderDiff;
      }
      return b.index - a.index;
    })
    .forEach((entry, index) => {
      artworks[index] = entry.item;
    });
  syncGalleryArtworkOrderValues();
};

const shouldReverseLegacyAppendedGallery = (artworks) => {
  if (!Array.isArray(artworks) || artworks.length < 20) {
    return false;
  }
  const firstSrc = typeof artworks[0]?.src === 'string' ? artworks[0].src.trim() : '';
  const lastSrc = typeof artworks[artworks.length - 1]?.src === 'string' ? artworks[artworks.length - 1].src.trim() : '';
  const startsWithSeedArtwork = /(^|\/)ola-0?1\.jpe?g$/i.test(firstSrc);
  const endsWithSeedArtwork = /(^|\/)ola-0?1\.jpe?g$/i.test(lastSrc);
  return startsWithSeedArtwork && !endsWithSeedArtwork;
};

const normalizeGalleryArtworkDisplayOrder = () => {
  const artworks = Array.isArray(state.content.gallery?.artworks) ? state.content.gallery.artworks : [];
  if (shouldReverseLegacyAppendedGallery(artworks)) {
    artworks.reverse();
  }
  syncGalleryArtworkOrderValues();
};

const getArtworkCategoryLabel = (value, language = getEditingLanguage()) => {
  const key = normalizeArtworkCategoryValue(value);
  if (!key) {
    return 'Okänd';
  }
  const labels = getLocalizedCategoryLabelsForEditor(language);
  return labels[key] || humanizeCategoryKey(key);
};

const getArtworkCategoryLabelText = (item, language = getEditingLanguage()) =>
  getArtworkCategoryKeys(item, '')
    .map((category) => getArtworkCategoryLabel(category, language))
    .filter(Boolean)
    .join(', ');

const buildCategoryOptionMarkup = (selectedValue, language = getEditingLanguage()) =>
  getCategoryKeys()
    .map((key) => {
      const selected = key === selectedValue ? 'selected' : '';
      const label = getArtworkCategoryLabel(key, language);
      return `<option value="${key}" ${selected}>${escapeHtml(label)}</option>`;
    })
    .join('');

const buildCategoryCheckboxMarkup = (selectedValues, language = getEditingLanguage()) => {
  const selected = new Set(normalizeArtworkCategoryList(selectedValues, ''));
  return getCategoryKeys()
    .map((key) => {
      const label = getArtworkCategoryLabel(key, language);
      const checked = selected.has(key) ? 'checked' : '';
      return `
        <label
          class="artwork-category-option"
          style="display:flex;align-items:center;gap:0.5rem;margin:0;color:var(--color-ink);font-size:0.92rem;"
        >
          <input type="checkbox" data-field="categories" value="${escapeHtml(key)}" ${checked} />
          <span>${escapeHtml(label)}</span>
        </label>
      `;
    })
    .join('');
};

const ensureCategoryLabelsOverrideMap = (language) => {
  if (language === 'sv') {
    return state.content.gallery.categoryLabels;
  }
  const pack = ensureLanguageOverridePack(language);
  if (!pack.gallery || typeof pack.gallery !== 'object') {
    pack.gallery = {};
  }
  if (!pack.gallery.categoryLabels || typeof pack.gallery.categoryLabels !== 'object') {
    const seed = getPath(getLocalizedContentForEditor(language), 'gallery.categoryLabels');
    pack.gallery.categoryLabels = seed && typeof seed === 'object' ? deepMerge({}, seed) : {};
  }
  return pack.gallery.categoryLabels;
};

const renderCategorySelects = () => {
  const language = getEditingLanguage();
  const keys = getCategoryKeys();
  const fallback = keys[0] || 'nature';

  const renderSelect = (selectNode, selectedValue) => {
    if (!selectNode) {
      return;
    }
    const normalizedSelected = normalizeCategoryKey(selectedValue) || fallback;
    selectNode.innerHTML = buildCategoryOptionMarkup(normalizedSelected, language);
    selectNode.value = normalizedSelected;
    if (selectNode.value !== normalizedSelected) {
      selectNode.value = fallback;
    }
  };

  renderSelect(el.autoDefaultCategory, state.content.gallery?.autoDiscover?.defaultCategory);
  renderSelect(el.uploadCategory, el.uploadCategory ? el.uploadCategory.value : fallback);
};

const removeCategoryEverywhere = (rawCategoryKey) => {
  const categoryKey = normalizeArtworkCategoryValue(rawCategoryKey);
  if (!categoryKey || categoryKey === 'all') {
    return false;
  }

  const keys = getCategoryKeys();
  if (keys.length <= 1) {
    setStatus('Det måste finnas minst en kategori kvar.', 'error');
    return false;
  }

  const fallback =
    categoryKey === 'nature'
      ? keys.find((key) => key !== categoryKey) || 'nature'
      : keys.includes('nature')
        ? 'nature'
        : keys.find((key) => key !== categoryKey) || 'nature';

  const labels = state.content.gallery.categoryLabels;
  if (labels && typeof labels === 'object') {
    delete labels[categoryKey];
  }

  const artworks = Array.isArray(state.content.gallery?.artworks) ? state.content.gallery.artworks : [];
  artworks.forEach((item) => {
    if (!item || typeof item !== 'object') {
      return;
    }
    const remainingCategories = getArtworkCategoryKeys(item, '')
      .filter((category) => category !== categoryKey);
    if (remainingCategories.length !== getArtworkCategoryKeys(item, '').length) {
      setArtworkCategoryKeys(item, remainingCategories, fallback);
    }
  });

  if (normalizeArtworkCategoryValue(state.content.gallery?.autoDiscover?.defaultCategory) === categoryKey) {
    state.content.gallery.autoDiscover.defaultCategory = fallback;
  }

  if (state.translations && typeof state.translations === 'object') {
    Object.keys(state.translations).forEach((language) => {
      const map = getPath(state.translations[language], 'gallery.categoryLabels');
      if (map && typeof map === 'object') {
        delete map[categoryKey];
      }
    });
  }

  ensureGallery();
  return true;
};

const addCategoryFromEditor = () => {
  const language = getEditingLanguage();
  const rawLabel = el.addCategoryLabel ? el.addCategoryLabel.value.trim() : '';
  const rawKey = el.addCategoryKey ? el.addCategoryKey.value.trim() : '';
  const key = normalizeCategoryKey(rawKey || rawLabel);
  const label = rawLabel || humanizeCategoryKey(key);

  if (!key || key === 'all') {
    setStatus('Ange ett giltigt kategorinamn (inte "all").', 'error');
    return;
  }

  if (!label) {
    setStatus('Kategori måste ha ett namn.', 'error');
    return;
  }

  if (state.content.gallery.categoryLabels[key]) {
    setStatus(`Kategorin "${label}" finns redan.`, 'error');
    return;
  }

  // Always create the base category key so structure exists in all languages.
  state.content.gallery.categoryLabels[key] = label;

  // If category was created while editing non-default language, keep that label for current language pack too.
  if (language !== 'sv') {
    const currentLanguageLabels = ensureCategoryLabelsOverrideMap(language);
    currentLanguageLabels[key] = label;
  }

  if (language === 'sv') {
    // Seed english label so English mode has a usable default immediately.
    const enLabels = ensureCategoryLabelsOverrideMap('en');
    if (!enLabels[key]) {
      enLabels[key] = label;
    }
  }

  if (el.addCategoryKey) {
    el.addCategoryKey.value = '';
  }
  if (el.addCategoryLabel) {
    el.addCategoryLabel.value = '';
  }

  ensureGallery();
  renderCategoryEditor();
  renderCategorySelects();
  renderArtworksEditor();
  setStatus(`Kategorin "${label}" lades till. Klicka "Spara ändringar".`, 'success');
};

const renderCategoryEditor = () => {
  if (!el.categoryEditor) {
    return;
  }

  const language = getEditingLanguage();
  const labels = getLocalizedCategoryLabelsForEditor(language);
  const keys = getCategoryKeys();
  const canManageStructure = true;

  if (el.categoryEditorHint) {
    el.categoryEditorHint.textContent =
      'Här kan du lägga till/ta bort kategorier. Vid borttagning flyttas verk automatiskt till en kvarvarande kategori.';
  }

  if (el.categoryAllLabel) {
    el.categoryAllLabel.value = labels.all || DEFAULT_STUDIO_CATEGORY_LABELS.all;
    el.categoryAllLabel.oninput = () => {
      const map = ensureCategoryLabelsOverrideMap(language);
      const next = el.categoryAllLabel.value.trim();
      map.all = next || (language === 'en' ? 'All' : DEFAULT_STUDIO_CATEGORY_LABELS.all);
      renderArtworksEditor();
    };
  }

  el.categoryEditor.innerHTML =
    keys.length === 0
      ? '<p class="gallery-empty">Inga kategorier ännu.</p>'
      : keys
          .map((key) => {
            const label = labels[key] || humanizeCategoryKey(key);
            return `
              <article class="contact-social-item category-editor-item" data-key="${escapeHtml(key)}">
                <label>Kategori-id
                  <input type="text" value="${escapeHtml(key)}" disabled />
                </label>
                <label>Namn
                  <input type="text" data-field="label" value="${escapeHtml(label)}" />
                </label>
                <button type="button" class="btn btn-ghost" data-action="remove">Ta bort</button>
              </article>
            `;
          })
          .join('');

  el.categoryEditor.querySelectorAll('[data-field="label"]').forEach((input) => {
    input.addEventListener('input', () => {
      const row = input.closest('[data-key]');
      const key = row ? normalizeCategoryKey(row.getAttribute('data-key')) : '';
      if (!key) {
        return;
      }
      const map = ensureCategoryLabelsOverrideMap(language);
      const value = input.value.trim();
      map[key] = value || humanizeCategoryKey(key);
      renderArtworksEditor();
    });
  });

  el.categoryEditor.querySelectorAll('[data-action="remove"]').forEach((button) => {
    button.addEventListener('click', () => {
      if (!canManageStructure) {
        return;
      }
      const row = button.closest('[data-key]');
      const key = row ? normalizeCategoryKey(row.getAttribute('data-key')) : '';
      if (!key) {
        return;
      }
      const label = state.content.gallery.categoryLabels[key] || humanizeCategoryKey(key);
      const shouldRemove = window.confirm(`Ta bort kategorin "${label}"? Verk i kategorin flyttas automatiskt.`);
      if (!shouldRemove) {
        return;
      }
      const removed = removeCategoryEverywhere(key);
      if (!removed) {
        return;
      }
      renderCategoryEditor();
      renderCategorySelects();
      renderArtworksEditor();
      setStatus(`Kategorin "${label}" togs bort. Klicka "Spara ändringar".`, 'success');
    });
  });

  if (el.addCategoryButton) {
    el.addCategoryButton.disabled = false;
  }
  if (el.addCategoryKey) {
    el.addCategoryKey.disabled = false;
  }
  if (el.addCategoryLabel) {
    el.addCategoryLabel.disabled = false;
  }
};

const clampSelectedArtworkIndex = (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    uiState.selectedArtworkIndex = -1;
    return;
  }

  const normalized = Number(uiState.selectedArtworkIndex);
  if (Number.isNaN(normalized)) {
    uiState.selectedArtworkIndex = 0;
    return;
  }

  uiState.selectedArtworkIndex = Math.max(0, Math.min(items.length - 1, normalized));
};

const renderArtworksEditor = () => {
  const baseItems = Array.isArray(state.content.gallery?.artworks) ? state.content.gallery.artworks : [];
  const language = getEditingLanguage();
  const items = getLocalizedArtworksForEditor(language);
  const existingThumbList = el.artworksEditor ? el.artworksEditor.querySelector('.artwork-thumb-list') : null;

  if (!el.artworksEditor) {
    return;
  }

  if (existingThumbList) {
    uiState.artworkListScrollTop = existingThumbList.scrollTop;
  }

  if (!Array.isArray(baseItems) || baseItems.length === 0) {
    uiState.selectedArtworkIndex = -1;
    el.artworksEditor.innerHTML = '<p class="gallery-empty">Inga verk ännu. Klicka på "Lägg till verk".</p>';
    renderSeoHomeImageControls();
    renderSectionImagePickers();
    return;
  }

  clampSelectedArtworkIndex(baseItems);
  const selectedIndex = uiState.selectedArtworkIndex;
  const selectedItem = items[selectedIndex];
  const selectedPreview = selectedItem.src
    ? `<img src="${escapeHtml(addRevToSrc(selectedItem.src))}" alt="Förhandsvisning av valt verk" />`
    : '<div class="artwork-editor-placeholder">Ingen bild</div>';

  const thumbMarkup = items
    .map((item, index) => {
      const title = (item.title || '').trim() || `Verk ${index + 1}`;
      const isActive = index === selectedIndex;
      const categoryLabel = getArtworkCategoryLabelText(item);
      const featureTag = item.featured ? 'Utvald' : '';
      const heroExcludeTag = item.heroExclude ? 'Ej hero-auto' : '';
      const meta = [categoryLabel, featureTag, heroExcludeTag].filter(Boolean).join(' · ');
      const thumbSrc = getArtworkPreviewSrc(item);
      const fullSrc = typeof item.src === 'string' ? item.src : '';

      return `
        <button type="button" class="artwork-thumb${isActive ? ' is-active' : ''}" data-action="select" data-index="${index}" data-src="${escapeHtml(fullSrc)}" aria-pressed="${isActive ? 'true' : 'false'}">
          <span class="artwork-thumb-image">
            ${thumbSrc ? `<img src="${escapeHtml(addRevToSrc(thumbSrc))}" data-full-src="${escapeHtml(addRevToSrc(fullSrc))}" alt="Miniatyr ${escapeHtml(title)}" />` : '<span class="artwork-editor-placeholder">Ingen bild</span>'}
          </span>
          <span class="artwork-thumb-meta">
            <strong>${escapeHtml(title)}</strong>
            <small>${escapeHtml(meta)}</small>
          </span>
        </button>
      `;
    })
    .join('');

  el.artworksEditor.innerHTML = `
    <div class="artworks-compact">
      <div class="artwork-thumb-list" role="listbox" aria-label="Välj verk">
        ${thumbMarkup}
      </div>

      <article class="artwork-detail" data-index="${selectedIndex}">
        <div class="artwork-detail-head">
          <h3>Redigerar: ${(selectedItem.title || '').trim() ? escapeHtml(selectedItem.title) : `Verk ${selectedIndex + 1}`}</h3>
          <p>Verk ${selectedIndex + 1} av ${items.length}</p>
        </div>

        <div class="artwork-detail-layout">
          <figure class="artwork-detail-preview">
            ${selectedPreview}
          </figure>

	          <div class="artwork-detail-fields">
	            <label>Titel <input type="text" data-field="title" value="${escapeHtml(selectedItem.title || '')}" /></label>
	            <label>Bildkälla (src) <input type="text" data-field="src" value="${escapeHtml(selectedItem.src || '')}" /></label>
	            <label>Format (t.ex. 56 × 76 cm) <input type="text" data-field="format" value="${escapeHtml(selectedItem.format || '')}" /></label>
	            <label>Tillgänglighet
	              <select data-field="availability">
	                <option value="" ${!selectedItem.availability ? 'selected' : ''}>Ingen status</option>
	                <option value="available" ${selectedItem.availability === 'available' ? 'selected' : ''}>Tillgänglig</option>
	                <option value="reserved" ${selectedItem.availability === 'reserved' ? 'selected' : ''}>Reserverad</option>
	                <option value="sold" ${selectedItem.availability === 'sold' ? 'selected' : ''}>Såld</option>
	                <option value="nfs" ${selectedItem.availability === 'nfs' ? 'selected' : ''}>Ej till salu</option>
	              </select>
	            </label>
	            <label>Pris / etikett
	              <input type="text" data-field="priceLabel" value="${escapeHtml(selectedItem.priceLabel || '')}" placeholder="14 500 SEK eller Pris på förfrågan" />
	            </label>
	            <label>Alt-text <input type="text" data-field="alt" value="${escapeHtml(selectedItem.alt || '')}" /></label>
	            <label class="artwork-field-wide">
	              Samlarnotis / inquiry-copy
	              <textarea data-field="collectorNote" rows="3">${escapeHtml(selectedItem.collectorNote || '')}</textarea>
	              <small class="field-hint">Visas på verk-sidan för att ge trygg kontext inför en förfrågan.</small>
	            </label>
	            <label>SEO-titel för delning (valfritt) <input type="text" data-field="seoTitle" value="${escapeHtml(selectedItem.seoTitle || '')}" /></label>
	            <label class="artwork-field-wide">
	              SEO-beskrivning för delning (valfritt)
	              <textarea data-field="seoDescription" rows="3">${escapeHtml(selectedItem.seoDescription || '')}</textarea>
              <small class="field-hint">Visas i länkförhandsvisning på sociala medier och i sökresultat.</small>
            </label>
            <label class="artwork-field-wide">
              Delningsbild / thumbnail (valfritt)
              <input type="text" data-field="shareImage" value="${escapeHtml(selectedItem.shareImage || '')}" />
              <small class="field-hint">Lämna tomt för att använda verkets huvudbild.</small>
            </label>
            <label class="artwork-field-wide">Kategorier
              <div
                class="artwork-category-grid"
                style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:0.5rem 0.75rem;padding:0.7rem 0.8rem;border:1px solid var(--color-border);background:#fff;"
              >
                ${buildCategoryCheckboxMarkup(selectedItem.categories || selectedItem.category)}
              </div>
            </label>
            <label>År <input type="number" data-field="year" value="${Number(selectedItem.year || 0)}" /></label>
            <label>Ordning <input type="number" data-field="order" value="${Number(selectedItem.order || selectedIndex + 1)}" /></label>
            <label
              class="checkbox-row artwork-field-wide"
              style="display:flex;align-items:center;gap:0.56rem;width:100%;max-width:none;line-height:1.22;"
            >
              <input type="checkbox" data-field="featured" ${selectedItem.featured ? 'checked' : ''}/>
              <span>Utvald på startsidan</span>
            </label>
            <label
              class="checkbox-row artwork-field-wide"
              style="display:flex;align-items:center;gap:0.56rem;width:100%;max-width:none;line-height:1.22;"
            >
              <input type="checkbox" data-field="heroExclude" ${selectedItem.heroExclude ? 'checked' : ''}/>
              <span>Exkludera från hero auto-slider</span>
            </label>
            <label class="artwork-field-wide">Byt bildfil
              <input type="file" data-action="replace-image" accept="image/*" />
            </label>
          </div>
        </div>

        <div class="artwork-detail-actions">
          <button type="button" class="btn btn-ghost" data-action="remove">Ta bort valt verk</button>
        </div>
      </article>
    </div>
  `;

  el.artworksEditor.querySelectorAll('.artwork-thumb[data-action="select"]').forEach((button) => {
    button.addEventListener('click', () => {
      const index = Number(button.getAttribute('data-index'));
      if (Number.isNaN(index)) {
        return;
      }
      const thumbList = button.closest('.artwork-thumb-list');
      if (thumbList) {
        uiState.artworkListScrollTop = thumbList.scrollTop;
      }
      uiState.selectedArtworkIndex = index;
      renderArtworksEditor();
    });
  });

  const thumbListNode = el.artworksEditor.querySelector('.artwork-thumb-list');
  if (thumbListNode) {
    const targetScrollTop = Math.max(0, Number(uiState.artworkListScrollTop || 0));
    thumbListNode.scrollTop = targetScrollTop;
    thumbListNode.addEventListener('scroll', () => {
      uiState.artworkListScrollTop = thumbListNode.scrollTop;
    });

    window.requestAnimationFrame(() => {
      thumbListNode.scrollTop = targetScrollTop;
    });
  }

  el.artworksEditor.querySelectorAll('.artwork-thumb-image img[data-full-src]').forEach((img) => {
    img.addEventListener('load', () => {
      if (img.dataset.fallbackDone === '1') {
        return;
      }

      if (!isLikelyBlackPreview(img)) {
        return;
      }

      const fallbackSrc = img.dataset.fullSrc || '';
      if (!fallbackSrc) {
        return;
      }

      img.dataset.fallbackDone = '1';
      img.src = fallbackSrc;
    });

    img.addEventListener('error', () => {
      if (img.dataset.fallbackDone === '1') {
        return;
      }

      const fallbackSrc = img.dataset.fullSrc || '';
      if (!fallbackSrc) {
        return;
      }

      img.dataset.fallbackDone = '1';
      img.src = fallbackSrc;
    });
  });

  const detailNode = el.artworksEditor.querySelector('.artwork-detail');
  if (!detailNode) {
    return;
  }

	  detailNode.querySelectorAll('[data-field]').forEach((fieldNode) => {
	    const field = fieldNode.getAttribute('data-field');
	    if (!field) {
	      return;
	    }

	    const updateField = () => {
	      const item = state.content.gallery.artworks[selectedIndex];
	      if (!item) {
	        return;
	      }

      if (field === 'categories') {
        const selectedCategories = Array.from(detailNode.querySelectorAll('[data-field="categories"]:checked'))
          .map((node) => (node instanceof HTMLInputElement ? node.value : ''))
          .filter(Boolean);
        setArtworkCategoryKeys(item, selectedCategories, getFirstGalleryCategoryKey());
          return;
        }

	      if (!isEditingDefaultLanguage() && ARTWORK_TRANSLATABLE_FIELDS.includes(field)) {
	        const src = typeof item.src === 'string' ? item.src.trim() : '';
	        if (!src) {
	          return;
	        }
	        const entry = ensureArtworkTranslationEntry(language, src);
	        if (!entry) {
	          return;
	        }
	        entry[field] = fieldNode.value;
	        if (!entry._manual || typeof entry._manual !== 'object') {
	          entry._manual = {};
	        }
	        entry._manual[field] = true;
	        return;
	      }

	      if (field === 'featured') {
	        item.featured = fieldNode.checked;
	      } else if (field === 'heroExclude') {
	        item.heroExclude = fieldNode.checked;
	      } else if (field === 'year' || field === 'order') {
	        item[field] = Number(fieldNode.value || 0);
	      } else {
	        const previousSrc = typeof item.src === 'string' ? item.src.trim() : '';
	        const previousValue = item[field];
	        item[field] = fieldNode.value;
	        if (isEditingDefaultLanguage() && ARTWORK_TRANSLATABLE_FIELDS.includes(field)) {
	          syncArtworkTextToEnglish(item.src, field, previousValue, item[field]);
	        }
	        if (field === 'src') {
	          const nextSrc = typeof item.src === 'string' ? item.src.trim() : '';
	          updateArtworkSourceAcrossTranslations(previousSrc, nextSrc);
	          item.previewSrc = '';
	          item.objectPosition = 'center center';
          item.zoom = 1;
        }
      }
    };

    fieldNode.addEventListener('input', updateField);
    fieldNode.addEventListener('change', () => {
      updateField();
      if (field === 'order') {
        const editedItem = state.content.gallery.artworks[selectedIndex];
        sortGalleryArtworksByOrder();
        uiState.selectedArtworkIndex = Math.max(0, state.content.gallery.artworks.indexOf(editedItem));
        renderArtworksEditor();
        return;
      }
      if (
        field === 'title' ||
        field === 'categories' ||
        field === 'featured' ||
        field === 'heroExclude' ||
        field === 'src' ||
        field === 'availability'
      ) {
        renderArtworksEditor();
      } else {
        renderHeroSlideArtworkOptions();
      }
    });
  });

  const replaceImageInput = detailNode.querySelector('[data-action="replace-image"]');
  if (replaceImageInput) {
    replaceImageInput.addEventListener('change', async () => {
      const file = replaceImageInput.files && replaceImageInput.files[0];
      if (!file) {
        return;
      }

      const item = state.content.gallery.artworks[selectedIndex];
      if (!item) {
        return;
      }

      try {
        const previousSrc = typeof item.src === 'string' ? item.src.trim() : '';
        const src = canPublishToServer()
          ? await uploadOptimizedImageFile(file, {
              filenameHint: slugFromName(file.name),
              maxWidth: 2200,
              maxHeight: 2200,
              quality: 0.82,
              minQuality: 0.6,
              maxBytes: 1200 * 1024
            })
          : await optimizeImageFile(file, {
              maxWidth: 1700,
              maxHeight: 1700,
              quality: 0.8,
              minQuality: 0.58,
              maxBytes: 780 * 1024
            });
        item.src = src;
        updateArtworkSourceAcrossTranslations(previousSrc, src);
        item.previewSrc = '';
        item.objectPosition = 'center center';
        item.zoom = 1;
	        if (!item.title) {
	          item.title = slugFromName(file.name) || `Verk ${selectedIndex + 1}`;
	        }
	        if (!item.alt) {
	          item.alt = item.title;
	        }
	        syncArtworkTextToEnglish(item.src, 'title', '', item.title);
	        syncArtworkTextToEnglish(item.src, 'alt', '', item.alt);
	        renderArtworksEditor();
	        setStatus('Bilden för valt verk uppdaterades. Klicka "Spara ändringar".', 'success');
	      } catch (error) {
	        setStatus('Det gick inte att läsa den nya bilden.', 'error');
	      } finally {
        replaceImageInput.value = '';
      }
    });
  }

  const removeButton = detailNode.querySelector('[data-action="remove"]');
  if (removeButton) {
    removeButton.addEventListener('click', () => {
      const item = state.content.gallery.artworks[selectedIndex];
      const src = item && typeof item.src === 'string' ? item.src.trim() : '';

      state.content.gallery.artworks.splice(selectedIndex, 1);
      if (src && !src.startsWith('data:') && !src.startsWith('blob:')) {
        const removed = new Set(state.content.gallery.removedSrcs || []);
        removed.add(src);
        state.content.gallery.removedSrcs = Array.from(removed);
      }
      removeArtworkFromTranslations(src);

      if (Array.isArray(state.content.hero.slides) && src) {
        state.content.hero.slides = state.content.hero.slides.filter((slide) => !slide || slide.src !== src);
      }
      if (state.content.gallery.artworks.length === 0) {
        uiState.selectedArtworkIndex = -1;
      } else {
        uiState.selectedArtworkIndex = Math.max(0, selectedIndex - 1);
      }
      renderArtworksEditor();
      renderHeroSlidesEditor();
      setStatus('Verket togs bort. Klicka "Spara".', 'success');
    });
  }

  if (language === 'en') {
    maybeAutoTranslateSelectedArtwork(baseItems[selectedIndex]);
  }

  renderHeroSlideArtworkOptions();
  renderSeoHomeImageControls();
  renderSectionImagePickers();
};

const pullFormToState = () => {
  const language = getEditingLanguage();
  const localizedBeforeSave = getLocalizedContentForEditor(language);
  const localizedTarget = language === 'sv' ? state.content : ensureLanguageOverridePack(language);

  state.content.theme.background = el.themeBackground.value;
  state.content.theme.surface = el.themeSurface.value;
  state.content.theme.ink = el.themeInk.value;
  state.content.theme.softInk = el.themeSoftInk.value;
  state.content.theme.primary = el.themePrimary.value;
  state.content.theme.accent = el.themeAccent.value;
  if (el.themeHeaderBackground) {
    state.content.theme.headerBackground = el.themeHeaderBackground.value;
  }
  state.content.theme.headerOpacity = normalizePercentageValue(
    el.themeHeaderOpacity ? el.themeHeaderOpacity.value : state.content.theme.headerOpacity,
    84
  );
  if (el.themeButtonGradientStart) {
    state.content.theme.buttonGradientStart = el.themeButtonGradientStart.value;
  }
  if (el.themeButtonGradientEnd) {
    state.content.theme.buttonGradientEnd = el.themeButtonGradientEnd.value;
  }
  state.content.theme.footerBackground = state.content.theme.headerBackground;
  state.content.theme.fontDisplay = normalizeFontKey(
    el.themeFontDisplay ? el.themeFontDisplay.value : state.content.theme.fontDisplay,
    DISPLAY_FONT_KEYS,
    'fraunces'
  );
  state.content.theme.fontBody = normalizeFontKey(
    el.themeFontBody ? el.themeFontBody.value : state.content.theme.fontBody,
    BODY_FONT_KEYS,
    'jakarta'
  );
  state.content.theme.fontDisplayWeight = normalizeFontWeight(
    el.themeFontDisplayWeight ? el.themeFontDisplayWeight.value : state.content.theme.fontDisplayWeight,
    700
  );
  state.content.theme.fontBodyWeight = normalizeFontWeight(
    el.themeFontBodyWeight ? el.themeFontBodyWeight.value : state.content.theme.fontBodyWeight,
    400
  );
  state.content.theme.fontDisplayStyle = normalizeFontStyle(
    el.themeFontDisplayStyle ? el.themeFontDisplayStyle.value : state.content.theme.fontDisplayStyle
  );
  state.content.theme.fontBodyStyle = normalizeFontStyle(
    el.themeFontBodyStyle ? el.themeFontBodyStyle.value : state.content.theme.fontBodyStyle
  );
  if (el.analyticsGaId) {
    state.content.analytics.gaMeasurementId = el.analyticsGaId.value.trim().toUpperCase();
  }
  if (el.analyticsAnonymizeIp) {
    state.content.analytics.anonymizeIp = el.analyticsAnonymizeIp.checked;
  }

  applyStudioThemePreview();

  setPath(localizedTarget, 'hero.title', el.heroTitle.value.trim());
  setPath(localizedTarget, 'hero.intro', el.heroIntro.value.trim());
  if (el.heroLine) {
    setPath(localizedTarget, 'hero.line', el.heroLine.value.trim());
  }
  state.content.hero.mode = el.heroMode.value;
  state.content.hero.modeUpdatedAt = Date.now();
  state.content.hero.slideDurationMs = numberOrFallback(el.heroSlideDuration.value, 8000);
  if (!state.content.hero.autoSlides || typeof state.content.hero.autoSlides !== 'object') {
    state.content.hero.autoSlides = {};
  }
  state.content.hero.autoSlides.enabled = el.heroAutoSlidesEnabled ? el.heroAutoSlidesEnabled.checked : false;
  if (!Number(state.content.hero.autoSlides.count)) {
    state.content.hero.autoSlides.count = 4;
  }
  if (!Number(state.content.hero.autoSlides.periodDays)) {
    state.content.hero.autoSlides.periodDays = 7;
  }
  if (typeof state.content.hero.autoSlides.landscapeOnly !== 'boolean') {
    state.content.hero.autoSlides.landscapeOnly = true;
  }
  if (!Array.isArray(state.content.hero.autoSlides.excludeSrcs)) {
    state.content.hero.autoSlides.excludeSrcs = [];
  }
  if (typeof state.content.hero.autoSlides.seedNonce !== 'string') {
    state.content.hero.autoSlides.seedNonce = '';
  }
  if (typeof state.content.hero.autoSlides.lastForcedAt !== 'string') {
    state.content.hero.autoSlides.lastForcedAt = '';
  }
  state.content.hero.overlayEnabled = el.heroOverlayEnabled.checked;
  state.content.hero.overlayOpacity = numberOrFallback(el.heroOverlayOpacity.value, 55);
  state.content.hero.copyPanelOpacity = numberOrFallback(el.heroCopyPanelOpacity.value, 40);
  state.content.hero.image = el.heroImage.value.trim();
  setPath(localizedTarget, 'hero.imageAlt', el.heroImageAlt.value.trim());
  if (el.seoHomeTitle) {
    setPath(localizedTarget, 'seo.home.title', el.seoHomeTitle.value.trim());
  }
  if (el.seoHomeDescription) {
    setPath(localizedTarget, 'seo.home.description', el.seoHomeDescription.value.trim());
  }
  if (el.seoHomeImage) {
    setPath(localizedTarget, 'seo.home.image', el.seoHomeImage.value.trim());
  }
  if (el.seoHomeImageAlt) {
    setPath(localizedTarget, 'seo.home.imageAlt', el.seoHomeImageAlt.value.trim());
  }

  const fallbackGalleryHeading =
    getPath(localizedBeforeSave, 'gallery.heading') || state.content.gallery.heading || 'Galleri';
  setPath(
    localizedTarget,
    'gallery.heading',
    el.galleryHeading ? el.galleryHeading.value.trim() || fallbackGalleryHeading : fallbackGalleryHeading
  );
  const fallbackPageHeading =
    getPath(localizedBeforeSave, 'gallery.pageHeading') || state.content.gallery.pageHeading || 'Hela galleriet';
  setPath(
    localizedTarget,
    'gallery.pageHeading',
    el.galleryPageHeading ? el.galleryPageHeading.value.trim() || fallbackPageHeading : fallbackPageHeading
  );
  const fallbackGallerySubheading =
    getPath(localizedBeforeSave, 'gallery.subheading') || state.content.gallery.subheading || '';
  setPath(
    localizedTarget,
    'gallery.subheading',
    el.gallerySubheading ? el.gallerySubheading.value.trim() || fallbackGallerySubheading : fallbackGallerySubheading
  );
  state.content.gallery.autoDiscover.enabled = el.autoDiscoverEnabled.checked;
  state.content.gallery.autoDiscover.defaultCategory =
    normalizeCategoryKey(el.autoDefaultCategory && el.autoDefaultCategory.value) || getFirstGalleryCategoryKey();
  const currentSrcSet = new Set(
    (state.content.gallery.artworks || [])
      .map((item) => (item && typeof item.src === 'string' ? item.src.trim() : ''))
      .filter(Boolean)
  );
  state.content.gallery.removedSrcs = (state.content.gallery.removedSrcs || [])
    .map((src) => (typeof src === 'string' ? src.trim() : ''))
    .filter((src) => src && !currentSrcSet.has(src));

  setPath(localizedTarget, 'about.heading', el.aboutHeading.value.trim());
  setPath(localizedTarget, 'about.paragraphs', paragraphsToArray(el.aboutParagraphs.value));
  if (el.aboutPortraitImage) {
    state.content.about.portraitImage = el.aboutPortraitImage.value.trim();
  }
  if (el.aboutPortraitAlt) {
    if (language === 'sv') {
      state.content.about.portraitAlt = el.aboutPortraitAlt.value.trim();
    } else {
      setPath(localizedTarget, 'about.portraitAlt', el.aboutPortraitAlt.value.trim());
    }
  }
  if (el.aboutDayJobLine) {
    setPath(localizedTarget, 'about.dayJobLine', el.aboutDayJobLine.value.trim());
  }
  setPath(localizedTarget, 'about.sideNote', el.aboutSideNote.value.trim());
  if (el.materialsHeading) {
    setPath(localizedTarget, 'about.materialsHeading', el.materialsHeading.value.trim());
  }
  if (el.materialsBody) {
    setPath(localizedTarget, 'about.materialsBody', el.materialsBody.value.trim());
  }
  if (el.materialsImage) {
    state.content.about.materialImage = el.materialsImage.value.trim();
  }
  if (el.materialsImageAlt) {
    if (language === 'sv') {
      state.content.about.materialImageAlt = el.materialsImageAlt.value.trim();
    } else {
      setPath(localizedTarget, 'about.materialImageAlt', el.materialsImageAlt.value.trim());
    }
  }
  if (el.inspirationHeading) {
    setPath(localizedTarget, 'about.inspirationHeading', el.inspirationHeading.value.trim());
  }
  if (el.inspirationBody) {
    setPath(localizedTarget, 'about.inspirationBody', el.inspirationBody.value.trim());
  }
  if (el.aboutFeatureImage) {
    state.content.about.featureImage = el.aboutFeatureImage.value.trim();
  }
  if (el.aboutFeatureAlt) {
    if (language === 'sv') {
      state.content.about.featureImageAlt = el.aboutFeatureAlt.value.trim();
    } else {
      setPath(localizedTarget, 'about.featureImageAlt', el.aboutFeatureAlt.value.trim());
    }
  }
  setPath(localizedTarget, 'about.ambitionsHeading', el.ambitionsHeading.value.trim());
  setPath(localizedTarget, 'about.ambitions', linesToArray(el.ambitionsLines.value));
  if (el.recognitionHeading) {
    const fallbackRecognitionHeading =
      getPath(localizedBeforeSave, 'about.recognitionHeading') || state.content.about.recognitionHeading || 'Utmärkelser & utställningar';
    setPath(localizedTarget, 'about.recognitionHeading', el.recognitionHeading.value.trim() || fallbackRecognitionHeading);
  }
  if (el.recognitionLines) {
    setPath(localizedTarget, 'about.recognitionItems', linesToArray(el.recognitionLines.value));
  }

  if (el.projectEyebrow) {
    setPath(localizedTarget, 'project.eyebrow', el.projectEyebrow.value.trim());
  }
  if (el.projectHeading) {
    setPath(localizedTarget, 'project.heading', el.projectHeading.value.trim());
  }
  if (el.projectDescription) {
    setPath(localizedTarget, 'project.description', el.projectDescription.value.trim());
  }
  if (el.projectCollageImage) {
    state.content.project.collageImage = el.projectCollageImage.value.trim();
  }
  if (el.projectCollageAlt) {
    if (language === 'sv') {
      state.content.project.collageAlt = el.projectCollageAlt.value.trim();
    } else {
      setPath(localizedTarget, 'project.collageAlt', el.projectCollageAlt.value.trim());
    }
  }
  if (el.projectSampleHeading) {
    setPath(localizedTarget, 'project.sampleHeading', el.projectSampleHeading.value.trim());
  }
  const projectSampleEntries = readImageEntriesFromSlots([
    { src: el.projectSample1Src, alt: el.projectSample1Alt },
    { src: el.projectSample2Src, alt: el.projectSample2Alt },
    { src: el.projectSample3Src, alt: el.projectSample3Alt },
    { src: el.projectSample4Src, alt: el.projectSample4Alt }
  ]);
  if (language === 'sv') {
    state.content.project.samples = projectSampleEntries;
  } else {
    const baseSampleAltBySrc = new Map();
    normalizeImageEntries(state.content.project.samples).forEach((entry) => {
      baseSampleAltBySrc.set(normalizeComparableImageSrc(entry.src), entry.alt || '');
    });
    state.content.project.samples = projectSampleEntries.map((entry) => ({
      src: entry.src,
      alt: baseSampleAltBySrc.get(normalizeComparableImageSrc(entry.src)) || ''
    }));
    setPath(localizedTarget, 'project.samples', projectSampleEntries);
  }
  syncProjectSampleOrderAcrossLanguages();

  setPath(localizedTarget, 'contact.eyebrow', el.contactEyebrow.value.trim());
  setPath(localizedTarget, 'contact.heading', el.contactHeading.value.trim());
  setPath(localizedTarget, 'contact.body', el.contactBody.value.trim());
  state.content.contact.email = el.contactEmail.value.trim();
  const fallbackEmailLabel =
    getPath(localizedBeforeSave, 'contact.emailLabel') || state.content.contact.emailLabel || 'Skicka e-post';
  setPath(localizedTarget, 'contact.emailLabel', el.contactEmailLabel.value.trim() || fallbackEmailLabel);
  state.content.contact.emailPublic = el.contactEmailPublic ? el.contactEmailPublic.checked : true;

  const socialLinksSource =
    language === 'sv' ? state.content.contact.socialLinks || [] : ensureEditableContactSocialLinks(language);
  const sanitizedSocialLinks = (socialLinksSource || [])
    .filter((item) => item && typeof item === 'object')
    .map((item) => createSocialChannel({ label: (item.label || '').trim(), url: (item.url || '').trim() }))
    .filter((item) => item.label && item.url);
  if (language === 'sv') {
    state.content.contact.socialLinks = sanitizedSocialLinks;
  } else {
    setPath(localizedTarget, 'contact.socialLinks', sanitizedSocialLinks);
  }

  // Legacy fields kept empty so old rendering paths don't reintroduce duplicates.
  if (language === 'sv') {
    state.content.contact.instagramUrl = '';
    state.content.contact.facebookUrl = '';
  }
};

const getTranslationsPayload = () => {
  if (!state.translations || typeof state.translations !== 'object') {
    return null;
  }

  const payload = {};
  Object.keys(state.translations).forEach((language) => {
    const pack = state.translations[language];
    if (hasOwnKeys(pack)) {
      payload[language] = pack;
    }
  });

  return hasOwnKeys(payload) ? payload : null;
};

const getPayload = () => {
  const payload = {
    theme: state.content.theme,
    analytics: state.content.analytics,
    seo: state.content.seo,
    hero: state.content.hero,
    about: state.content.about,
    project: state.content.project,
    contact: state.content.contact,
    gallery: {
      ...state.content.gallery,
      artworks: (state.content.gallery.artworks || [])
        .filter((item) => item && typeof item.src === 'string' && item.src.trim() !== '')
        .map((item, index) => ({
          ...item,
          order: index + 1
        }))
    }
  };

  const translationsPayload = getTranslationsPayload();
  if (translationsPayload) {
    payload.translations = translationsPayload;
  }

  return payload;
};

const optimizeStateImagesForStorage = async () => {
  let changed = 0;

  if (isDataImageUrl(state.content.hero.image)) {
    const optimizedHero = await resizeDataUrl(state.content.hero.image, {
      maxWidth: 1800,
      maxHeight: 1800,
      quality: 0.72,
      minQuality: 0.5,
      maxBytes: 700 * 1024
    });
    if (optimizedHero !== state.content.hero.image) {
      state.content.hero.image = optimizedHero;
      el.heroImage.value = optimizedHero;
      changed += 1;
    }
  }

  const artworks = Array.isArray(state.content.gallery.artworks) ? state.content.gallery.artworks : [];
  for (let i = 0; i < artworks.length; i += 1) {
    const item = artworks[i];
    if (!item || !isDataImageUrl(item.src)) {
      continue;
    }

    const optimizedSrc = await resizeDataUrl(item.src, {
      maxWidth: 1500,
      maxHeight: 1500,
      quality: 0.68,
      minQuality: 0.5,
      maxBytes: 520 * 1024
    });

    if (optimizedSrc !== item.src) {
      item.src = optimizedSrc;
      changed += 1;
    }
  }

  if (changed > 0) {
    renderArtworksEditor();
  }

  return changed;
};

const publishPayloadToServer = async (payload) => {
  if (isSecureAuthStudio() && !authState.csrfToken) {
    throw new Error('Saknar säkerhetstoken. Ladda om sidan och logga in igen.');
  }

  const response = await fetch(`api/publish.php?v=${ASSET_REV}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(authState.csrfToken ? { 'X-CSRF-Token': authState.csrfToken } : {})
    },
    credentials: 'same-origin',
    body: JSON.stringify({ payload })
  });

  let responseBody = null;
  try {
    responseBody = await response.json();
  } catch (error) {
    responseBody = null;
  }

  if (!response.ok || !responseBody || responseBody.ok !== true) {
    const message =
      responseBody && typeof responseBody.message === 'string' && responseBody.message.trim() !== ''
        ? responseBody.message.trim()
        : `HTTP ${response.status}`;
    throw new Error(message);
  }

  return responseBody;
};

const IMAGE_UPLOAD_FIELD_KEYS = new Set([
  'src',
  'image',
  'shareImage',
  'portraitImage',
  'materialsImage',
  'featureImage',
  'collageImage'
]);

const replaceImageSourceInNode = (node, fromSrc, toSrc) => {
  if (!node || typeof node !== 'object' || !fromSrc || !toSrc || fromSrc === toSrc) {
    return;
  }
  if (Array.isArray(node)) {
    node.forEach((item) => {
      replaceImageSourceInNode(item, fromSrc, toSrc);
    });
    return;
  }

  Object.keys(node).forEach((key) => {
    const value = node[key];
    if (typeof value === 'string' && IMAGE_UPLOAD_FIELD_KEYS.has(key) && value.trim() === fromSrc) {
      node[key] = toSrc;
      return;
    }
    if (value && typeof value === 'object') {
      replaceImageSourceInNode(value, fromSrc, toSrc);
    }
  });
};

const normalizeImageNameForMatch = (value) => {
  if (typeof value !== 'string') {
    return '';
  }
  let next = value.trim().toLowerCase();
  if (!next) {
    return '';
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
    next = next.split(from).join(to);
  });
  next = next.replace(/\.[a-z0-9]+$/i, '');
  next = next.replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '');
  return next;
};

const levenshteinDistance = (a, b) => {
  const left = String(a || '');
  const right = String(b || '');
  if (left === right) {
    return 0;
  }
  if (left.length === 0) {
    return right.length;
  }
  if (right.length === 0) {
    return left.length;
  }

  const prev = new Array(right.length + 1);
  const curr = new Array(right.length + 1);
  for (let j = 0; j <= right.length; j += 1) {
    prev[j] = j;
  }
  for (let i = 1; i <= left.length; i += 1) {
    curr[0] = i;
    const leftChar = left.charCodeAt(i - 1);
    for (let j = 1; j <= right.length; j += 1) {
      const cost = leftChar === right.charCodeAt(j - 1) ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
    }
    for (let j = 0; j <= right.length; j += 1) {
      prev[j] = curr[j];
    }
  }
  return prev[right.length];
};

const buildServerImageLookup = (serverSources) => {
  const byExact = new Set();
  const byNormalized = new Map();
  const byBaseNoNumber = new Map();
  const records = [];

  (Array.isArray(serverSources) ? serverSources : []).forEach((rawSrc) => {
    const src = typeof rawSrc === 'string' ? rawSrc.trim().replace(/^\/+/, '') : '';
    if (!src) {
      return;
    }
    byExact.add(src);

    const clean = src.split('?')[0].split('#')[0];
    const fileName = clean.split('/').pop() || '';
    const normalized = normalizeImageNameForMatch(fileName);
    if (!normalized) {
      return;
    }

    if (!byNormalized.has(normalized)) {
      byNormalized.set(normalized, src);
    }

    const baseNoNumber = normalized.replace(/-\d+$/, '');
    if (!byBaseNoNumber.has(baseNoNumber)) {
      byBaseNoNumber.set(baseNoNumber, []);
    }
    byBaseNoNumber.get(baseNoNumber).push({ src, normalized, baseNoNumber });
    records.push({ src, normalized, baseNoNumber });
  });

  return { byExact, byNormalized, byBaseNoNumber, records };
};

const chooseClosestServerImage = (requestedSrc, lookup) => {
  const src = typeof requestedSrc === 'string' ? requestedSrc.trim().replace(/^\/+/, '') : '';
  if (!src || !lookup) {
    return '';
  }
  if (lookup.byExact.has(src)) {
    return src;
  }

  const clean = src.split('?')[0].split('#')[0];
  const fileName = clean.split('/').pop() || '';
  const normalized = normalizeImageNameForMatch(fileName);
  if (!normalized) {
    return '';
  }

  const direct = lookup.byNormalized.get(normalized);
  if (direct) {
    return direct;
  }

  const baseNoNumber = normalized.replace(/-\d+$/, '');
  const sameBase = lookup.byBaseNoNumber.get(baseNoNumber) || [];
  if (sameBase.length > 0) {
    const exactBase = sameBase.find((entry) => entry.normalized === baseNoNumber);
    if (exactBase) {
      return exactBase.src;
    }
    const numbered = sameBase
      .map((entry) => {
        const m = entry.normalized.match(new RegExp(`^${baseNoNumber}-(\\d+)$`));
        return { src: entry.src, order: m ? Number(m[1]) : Number.POSITIVE_INFINITY };
      })
      .sort((a, b) => a.order - b.order);
    if (numbered.length > 0) {
      return numbered[0].src;
    }
  }

  const compact = normalized.replace(/-/g, '');
  const token = (normalized.split('-')[0] || '').trim();
  let best = null;
  lookup.records.forEach((entry) => {
    if (token && !entry.normalized.startsWith(token)) {
      return;
    }
    const entryCompact = entry.normalized.replace(/-/g, '');
    const distance = levenshteinDistance(compact, entryCompact);
    const maxLen = Math.max(compact.length, entryCompact.length, 1);
    const ratio = distance / maxLen;
    if (ratio > 0.26) {
      return;
    }
    if (!best || distance < best.distance || (distance === best.distance && entry.normalized.length < best.length)) {
      best = { src: entry.src, distance, length: entry.normalized.length };
    }
  });

  return best ? best.src : '';
};

const repairMissingImageReferencesBeforePublish = async () => {
  if (!canPublishToServer()) {
    return { repaired: 0, unresolved: 0 };
  }

  if (!Array.isArray(serverImageCandidates) || serverImageCandidates.length === 0) {
    await loadServerImageCandidates();
  }
  if (!Array.isArray(serverImageCandidates) || serverImageCandidates.length === 0) {
    return { repaired: 0, unresolved: 0 };
  }

  const lookup = buildServerImageLookup(serverImageCandidates);
  let repaired = 0;
  let unresolved = 0;

  const tryRepairSrc = (value) => {
    const current = typeof value === 'string' ? value.trim() : '';
    if (!current || /^data:/i.test(current) || /^blob:/i.test(current) || !/^images\//i.test(current)) {
      return current;
    }
    if (lookup.byExact.has(current)) {
      return current;
    }
    const mapped = chooseClosestServerImage(current, lookup);
    if (mapped && mapped !== current) {
      repaired += 1;
      return mapped;
    }
    unresolved += 1;
    return current;
  };

  const artworks = Array.isArray(state.content.gallery?.artworks) ? state.content.gallery.artworks : [];
  artworks.forEach((item) => {
    if (!item || typeof item !== 'object') {
      return;
    }
    const previousSrc = typeof item.src === 'string' ? item.src.trim() : '';
    const fixedSrc = tryRepairSrc(previousSrc);
    if (fixedSrc && fixedSrc !== previousSrc) {
      item.src = fixedSrc;
      updateArtworkSourceAcrossTranslations(previousSrc, fixedSrc);
      replaceImageSourceInNode(state.content, previousSrc, fixedSrc);
      replaceImageSourceInNode(state.translations, previousSrc, fixedSrc);
    }
  });

  const walk = (node) => {
    if (!node || typeof node !== 'object') {
      return;
    }
    if (Array.isArray(node)) {
      node.forEach((entry) => walk(entry));
      return;
    }
    Object.keys(node).forEach((key) => {
      const value = node[key];
      if (typeof value === 'string' && IMAGE_UPLOAD_FIELD_KEYS.has(key)) {
        node[key] = tryRepairSrc(value);
      } else if (value && typeof value === 'object') {
        walk(value);
      }
    });
  };

  walk(state.content);
  walk(state.translations);

  return { repaired, unresolved };
};

const migrateEmbeddedImageSourcesForPublish = async () => {
  const uploadedByDataUrl = new Map();
  let migrated = 0;

  const uploadEmbedded = async (dataUrl, filenameHint, options = {}) => {
    const existing = uploadedByDataUrl.get(dataUrl);
    if (existing) {
      return existing;
    }

    const uploadFile = await dataUrlToUploadFile(dataUrl, filenameHint || 'bild');
    const uploadedSrc = await uploadOptimizedImageFile(uploadFile, {
      filenameHint: slugFromName(filenameHint || 'bild'),
      maxWidth: Number(options.maxWidth || 2200),
      maxHeight: Number(options.maxHeight || 2200),
      quality: Number(options.quality || 0.82),
      minQuality: Number(options.minQuality || 0.58),
      maxBytes: Number(options.maxBytes || 1200 * 1024)
    });
    uploadedByDataUrl.set(dataUrl, uploadedSrc);
    migrated += 1;
    return uploadedSrc;
  };

  const artworks = Array.isArray(state.content.gallery?.artworks) ? state.content.gallery.artworks : [];
  for (let index = 0; index < artworks.length; index += 1) {
    const item = artworks[index];
    if (!item || typeof item !== 'object' || typeof item.src !== 'string') {
      continue;
    }
    const currentSrc = item.src.trim();
    if (!isDataImageUrl(currentSrc)) {
      continue;
    }

    const hint = item.title || item.alt || `verk-${index + 1}`;
    const uploadedSrc = await uploadEmbedded(currentSrc, hint, {
      maxWidth: 2400,
      maxHeight: 2400,
      quality: 0.84,
      minQuality: 0.62,
      maxBytes: 1400 * 1024
    });

    item.src = uploadedSrc;
    updateArtworkSourceAcrossTranslations(currentSrc, uploadedSrc);
    replaceImageSourceInNode(state.content, currentSrc, uploadedSrc);
    replaceImageSourceInNode(state.translations, currentSrc, uploadedSrc);
  }

  const walkNode = async (node, path = []) => {
    if (!node || typeof node !== 'object') {
      return;
    }
    if (Array.isArray(node)) {
      for (let i = 0; i < node.length; i += 1) {
        await walkNode(node[i], path.concat(String(i + 1)));
      }
      return;
    }

    for (const key of Object.keys(node)) {
      const value = node[key];
      if (typeof value === 'string' && IMAGE_UPLOAD_FIELD_KEYS.has(key) && isDataImageUrl(value)) {
        const hint = path.concat(key).join('-') || 'bild';
        node[key] = await uploadEmbedded(value, hint);
        continue;
      }
      if (value && typeof value === 'object') {
        await walkNode(value, path.concat(key));
      }
    }
  };

  await walkNode(state.content, ['sv']);
  await walkNode(state.translations, ['translations']);

  return migrated;
};

const saveToStorage = async () => {
  const scrollYBeforeSave = Math.max(0, Number(window.scrollY || window.pageYOffset || 0));
  const activeElementBeforeSave = document.activeElement instanceof HTMLElement ? document.activeElement : null;

  try {
  pullFormToState();
  let payload = getPayload();
  let optimizedCount = 0;
  let migratedEmbeddedCount = 0;
  let repairedMissingImageRefs = 0;
  let unresolvedImageRefs = 0;
  let prunedArtworkTranslationKeys = 0;
  let remappedArtworkTranslationKeys = 0;
  const stamp = getClockStamp();

  const translationCleanup = sanitizeArtworkTranslationMaps();
  prunedArtworkTranslationKeys = Number(translationCleanup.pruned || 0);
  remappedArtworkTranslationKeys = Number(translationCleanup.remapped || 0);
  if (prunedArtworkTranslationKeys > 0 || remappedArtworkTranslationKeys > 0) {
    payload = getPayload();
  }

  const saveDraftToLocalStorage = async (required) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      return true;
    } catch (error) {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        return true;
      } catch (retryError) {
        // Continue to optional optimization flow below.
      }
      if (!required) {
        return false;
      }
      try {
        optimizedCount = await optimizeStateImagesForStorage();
        if (optimizedCount > 0) {
          payload = getPayload();
          try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
            return true;
          } catch (optimizeStorageError) {
            window.localStorage.removeItem(STORAGE_KEY);
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
            return true;
          }
        }
      } catch (optimizeError) {
        // Fall through to storage-full return below.
      }
      return false;
    }
  };

  if (canPublishToServer()) {
    try {
      migratedEmbeddedCount = await migrateEmbeddedImageSourcesForPublish();
      if (migratedEmbeddedCount > 0) {
        await loadServerImageCandidates();
        renderSectionImagePickers();
        renderSeoHomeImageControls();
        renderArtworksEditor();
        payload = getPayload();
      }

      const repairResult = await repairMissingImageReferencesBeforePublish();
      repairedMissingImageRefs = Number(repairResult.repaired || 0);
      unresolvedImageRefs = Number(repairResult.unresolved || 0);
      if (repairedMissingImageRefs > 0) {
        payload = getPayload();
      }

      await publishPayloadToServer(payload);
      const localDraftSaved = await saveDraftToLocalStorage(false);
      flashSaveButtons();
      const compressionSuffix = optimizedCount > 0 ? ` efter komprimering av ${optimizedCount} bild(er)` : '';
      const migrationSuffix =
        migratedEmbeddedCount > 0 ? ` Inbäddade bilder migrerade till servern: ${migratedEmbeddedCount}.` : '';
      const repairedSuffix =
        repairedMissingImageRefs > 0 ? ` Lagade bildsökvägar: ${repairedMissingImageRefs}.` : '';
      const unresolvedSuffix =
        unresolvedImageRefs > 0 ? ` Kunde inte matcha ${unresolvedImageRefs} bildsökvägar automatiskt.` : '';
      const translationCleanupSuffix =
        prunedArtworkTranslationKeys > 0 || remappedArtworkTranslationKeys > 0
          ? ` Städade översättningsnycklar: ${prunedArtworkTranslationKeys} borttagna, ${remappedArtworkTranslationKeys} ompekade.`
          : '';
      if (localDraftSaved) {
        setStatus(
          `Sparat ${stamp}${compressionSuffix} och publicerat live för alla besökare.${migrationSuffix}${repairedSuffix}${unresolvedSuffix}${translationCleanupSuffix}`,
          unresolvedImageRefs > 0 ? 'error' : 'success'
        );
      } else {
        setStatus(
          `Sparat ${stamp}${compressionSuffix} och publicerat live för alla besökare.${migrationSuffix}${repairedSuffix}${unresolvedSuffix}${translationCleanupSuffix} Lokal utkast-cache kunde inte sparas (webbläsarens lagring är full).`,
          unresolvedImageRefs > 0 ? 'error' : 'success'
        );
      }
      return;
    } catch (error) {
      const reason = error instanceof Error && error.message ? error.message : 'okänt fel';
      const localDraftSaved = await saveDraftToLocalStorage(true);
      const compressionSuffix = optimizedCount > 0 ? ` efter komprimering av ${optimizedCount} bild(er)` : '';
      if (localDraftSaved) {
        flashSaveButtons();
        setStatus(`Sparat ${stamp}${compressionSuffix}, men live-publicering misslyckades: ${reason}`, 'error');
      } else {
        setStatus(
          `Live-publicering misslyckades: ${reason}. Kunde inte heller spara lokalt eftersom webbläsarens lagring är full.`,
          'error'
        );
      }
      return;
    }
  }

  const localDraftSaved = await saveDraftToLocalStorage(true);
  if (!localDraftSaved) {
    setStatus('Kunde inte spara. Webbläsarens lagring är full. Minska antal/storlek på inbäddade bilder.', 'error');
    return;
  }

  flashSaveButtons();
  const compressionSuffix = optimizedCount > 0 ? ` efter komprimering av ${optimizedCount} bild(er)` : '';
  const translationCleanupSuffix =
    prunedArtworkTranslationKeys > 0 || remappedArtworkTranslationKeys > 0
      ? ` Städade översättningsnycklar: ${prunedArtworkTranslationKeys} borttagna, ${remappedArtworkTranslationKeys} ompekade.`
      : '';
  setStatus(`Sparat ${stamp}${compressionSuffix}.${translationCleanupSuffix} Ändringarna är lagrade i Studio.`, 'success');
  } finally {
    window.requestAnimationFrame(() => {
      const maxScrollTop = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      const targetScrollTop = Math.min(scrollYBeforeSave, maxScrollTop);
      window.scrollTo({ top: targetScrollTop, left: 0, behavior: 'auto' });

      if (activeElementBeforeSave && document.contains(activeElementBeforeSave)) {
        try {
          activeElementBeforeSave.focus({ preventScroll: true });
        } catch (error) {
          // Ignore focus errors (e.g. non-focusable element after rerender).
        }
      }
    });
  }
};

const resetStorage = () => {
  window.localStorage.removeItem(STORAGE_KEY);
  state.content = deepMerge(baseContent, {});
  state.translations = deepMerge({}, baseTranslationOverrides);
  ensureGallery();
  ensureSeo();
  captureEnglishSyncSourceSnapshot();
  clampSelectedArtworkIndex(state.content.gallery.artworks);
  syncFormFromState();
  renderArtworksEditor();
  setStatus('Lokala ändringar rensade. Sajten använder nu content.js igen.', 'info');
};

const exportJson = () => {
  pullFormToState();
  const payload = getPayload();

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'ola-portfolio-overrides.json';
  a.click();
  URL.revokeObjectURL(url);
};

const exportOverridesJs = () => {
  pullFormToState();
  const payload = getPayload();
  const body = `window.PORTFOLIO_OVERRIDES = ${JSON.stringify(payload, null, 2)};\n`;

  const blob = new Blob([body], { type: 'application/javascript' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'overrides.js';
  a.click();
  URL.revokeObjectURL(url);
  setStatus('overrides.js exporterad. Ladda upp filen till servern för att publicera ändringarna.', 'success');
};

const importJson = async (file) => {
  try {
    const text = await file.text();
    const parsedRaw = JSON.parse(text);
    const parsed = parsedRaw && typeof parsedRaw === 'object' ? parsedRaw : {};
    const parsedContent = deepMerge({}, parsed);
    const parsedTranslations =
      parsedContent.translations && typeof parsedContent.translations === 'object' ? parsedContent.translations : {};
    if (Object.prototype.hasOwnProperty.call(parsedContent, 'translations')) {
      delete parsedContent.translations;
    }

    state.content = deepMerge(baseContent, parsedContent);
    state.translations = deepMerge(baseTranslationOverrides, parsedTranslations);
    ensureGallery();
    ensureSeo();
    captureEnglishSyncSourceSnapshot();
    syncFormFromState();
    renderArtworksEditor();
    setStatus('JSON importerad. Klicka "Spara ändringar" för att tillämpa.', 'success');
  } catch (error) {
    setStatus('Ogiltig JSON-fil.', 'error');
  }
};

const isGenericSwedishArtworkTitle = (value) => {
  if (typeof value !== 'string') {
    return false;
  }
  return /^Verk\s+\d+$/i.test(value.trim());
};

const looksLikeSwedishSeedText = (value) => {
  if (typeof value !== 'string') {
    return false;
  }
  const text = value.trim().toLowerCase();
  if (!text) {
    return false;
  }
  if (/[åäö]/.test(text)) {
    return true;
  }
  const hints = [
    'pappa',
    'vinter',
    'sommar',
    'skymning',
    'morgon',
    'kväll',
    'hemma',
    'februari',
    'januari',
    'mars',
    'april',
    'maj',
    'juni',
    'juli',
    'augusti',
    'september',
    'oktober',
    'november',
    'december',
    'stadshus',
    'julimorgon',
    'utklippan'
  ];
  return hints.some((hint) => text.includes(hint));
};

const translationUtf8ByteLength = (value) => {
  const input = typeof value === 'string' ? value : String(value || '');
  if (typeof TextEncoder !== 'undefined') {
    return new TextEncoder().encode(input).length;
  }
  try {
    return unescape(encodeURIComponent(input)).length;
  } catch (error) {
    return input.length;
  }
};

const waitForTranslationMs = (ms) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });

const TRANSLATE_BATCH_MAX_ITEMS = 12;
const TRANSLATE_BATCH_MAX_BYTES = 4200;

const splitTranslationEntriesIntoBatches = (entries, options = {}) => {
  const maxItems = Math.max(1, Number(options.maxItems || TRANSLATE_BATCH_MAX_ITEMS));
  const maxBytes = Math.max(400, Number(options.maxBytes || TRANSLATE_BATCH_MAX_BYTES));
  const batches = [];
  let currentBatch = [];
  let currentBytes = 0;

  entries.forEach((entry) => {
    const source = typeof entry.source === 'string' ? entry.source.trim() : '';
    if (!source) {
      return;
    }

    const entryBytes = translationUtf8ByteLength(source);
    const wouldOverflowItems = currentBatch.length >= maxItems;
    const wouldOverflowBytes = currentBatch.length > 0 && (currentBytes + entryBytes) > maxBytes;
    if (wouldOverflowItems || wouldOverflowBytes) {
      batches.push(currentBatch);
      currentBatch = [];
      currentBytes = 0;
    }

    currentBatch.push(entry);
    currentBytes += entryBytes;
  });

  if (currentBatch.length > 0) {
    batches.push(currentBatch);
  }

  return batches;
};

const translateSvEntriesBatchToEnViaApi = async (entries) => {
  const normalizedEntries = entries
    .map((entry) => ({
      text: typeof entry.source === 'string' ? entry.source.trim() : '',
      field: typeof entry.field === 'string' ? entry.field.trim() : 'generic'
    }))
    .filter((entry) => entry.text);

  if (normalizedEntries.length === 0) {
    return [];
  }

  const MAX_RETRIES = 2;
  let lastError = null;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      const result = await apiJson('api/translate.php', {
        method: 'POST',
        withCsrf: true,
        body: {
          from: 'sv',
          to: 'en',
          items: normalizedEntries
        }
      });

      const translations = Array.isArray(result.translations) ? result.translations : [];
      if (translations.length !== normalizedEntries.length) {
        throw new Error('OpenAI returnerade ofullständiga översättningar.');
      }

      return translations.map((translation) => (typeof translation === 'string' ? translation.trim() : ''));
    } catch (error) {
      lastError = error;
      if (attempt >= MAX_RETRIES) {
        break;
      }
      await waitForTranslationMs((attempt + 1) * 450);
    }
  }

  throw lastError instanceof Error ? lastError : new Error('Kunde inte översätta texterna via OpenAI.');
};

const processSvEntriesToEnInBatches = async (entries, handlers = {}) => {
  const batches = splitTranslationEntriesIntoBatches(entries);
  for (let batchIndex = 0; batchIndex < batches.length; batchIndex += 1) {
    const batch = batches[batchIndex];
    try {
      const translations = await translateSvEntriesBatchToEnViaApi(batch);
      batch.forEach((entry, index) => {
        const translated = typeof translations[index] === 'string' ? translations[index].trim() : '';
        if (!translated) {
          if (typeof handlers.onError === 'function') {
            handlers.onError(entry, 'tom översättning');
          }
          return;
        }
        if (typeof handlers.onSuccess === 'function') {
          handlers.onSuccess(entry, translated);
        }
      });
    } catch (error) {
      const reason = error instanceof Error && error.message ? error.message : 'okänt fel';
      batch.forEach((entry) => {
        if (typeof handlers.onError === 'function') {
          handlers.onError(entry, reason);
        }
      });
    }

    if (batchIndex < batches.length - 1) {
      await waitForTranslationMs(120);
    }
  }
};

const translateSvTextToEnViaApi = async (text, field = 'generic') => {
  const source = typeof text === 'string' ? text.trim() : '';
  if (!source) {
    return '';
  }

  const MAX_DIRECT_BYTES = 760;
  const MAX_RETRIES = 2;
  const requestTranslate = async (chunk) => {
    let lastError = null;
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
      try {
        const result = await apiJson('api/translate.php', {
          method: 'POST',
          withCsrf: true,
          body: {
            from: 'sv',
            to: 'en',
            field,
            text: chunk
          }
        });
        const translated = typeof result.translation === 'string' ? result.translation.trim() : '';
        if (!translated) {
          throw new Error('OpenAI returnerade tom översättning.');
        }
        return translated;
      } catch (error) {
        lastError = error;
        if (attempt >= MAX_RETRIES) {
          break;
        }
        await waitForTranslationMs((attempt + 1) * 400);
      }
    }
    throw lastError instanceof Error ? lastError : new Error('Kunde inte översätta texten via OpenAI.');
  };

  if (translationUtf8ByteLength(source) <= MAX_DIRECT_BYTES) {
    return requestTranslate(source);
  }

  const splitLongSegmentByBytes = (input, maxBytes) => {
    const segments = [];
    const raw = String(input || '').trim();
    if (!raw) {
      return segments;
    }
    if (translationUtf8ByteLength(raw) <= maxBytes) {
      segments.push(raw);
      return segments;
    }

    let current = '';
    for (const char of raw) {
      const candidate = current + char;
      if (translationUtf8ByteLength(candidate) <= maxBytes) {
        current = candidate;
        continue;
      }
      if (current.trim()) {
        segments.push(current.trim());
      }
      current = char;
    }
    if (current.trim()) {
      segments.push(current.trim());
    }
    return segments;
  };

  const splitIntoChunks = (input) => {
    const chunks = [];
    const pushChunk = (value) => {
      const trimmed = String(value || '').trim();
      if (trimmed) {
        chunks.push(trimmed);
      }
    };

    const paragraphParts = input
      .split(/\n\s*\n/g)
      .map((part) => part.trim())
      .filter(Boolean);

    if (paragraphParts.length > 1) {
      paragraphParts.forEach((part) => {
        splitLongSegmentByBytes(part, MAX_DIRECT_BYTES).forEach(pushChunk);
      });
      return chunks;
    }

    const sentenceParts = input
      .replace(/\n+/g, ' ')
      .split(/(?<=[.!?])\s+/)
      .map((part) => part.trim())
      .filter(Boolean);

    if (sentenceParts.length > 0) {
      let current = '';
      sentenceParts.forEach((part) => {
        if (translationUtf8ByteLength(part) > MAX_DIRECT_BYTES) {
          if (current) {
            pushChunk(current);
            current = '';
          }
          splitLongSegmentByBytes(part, MAX_DIRECT_BYTES).forEach(pushChunk);
          return;
        }
        const candidate = current ? `${current} ${part}` : part;
        if (translationUtf8ByteLength(candidate) > MAX_DIRECT_BYTES) {
          pushChunk(current);
          current = part;
        } else {
          current = candidate;
        }
      });
      if (current) {
        pushChunk(current);
      }
    }

    if (chunks.length === 0) {
      splitLongSegmentByBytes(input, MAX_DIRECT_BYTES).forEach(pushChunk);
    }

    return chunks;
  };

  const chunks = splitIntoChunks(source);
  if (chunks.length === 0) {
    return '';
  }

  const translatedChunks = [];
  for (const chunk of chunks) {
    const translated = await requestTranslate(chunk);
    translatedChunks.push(translated || chunk);
    if (chunks.length > 1) {
      await waitForTranslationMs(80);
    }
  }
  return translatedChunks.join('\n\n').trim();
};

let englishTextSyncInFlight = false;

const shouldSyncEnglishField = (currentEn, sourceSv, field, syncMode = 'smart', metaRecord = null, metaKey = '') => {
  const current = typeof currentEn === 'string' ? currentEn.trim() : '';
  const source = typeof sourceSv === 'string' ? sourceSv.trim() : '';
  if (!source) {
    return false;
  }
  if (syncMode === 'force') {
    return true;
  }
  if (!current) {
    return true;
  }
  if (current === source) {
    return true;
  }
  if (looksLikeSwedishSeedText(current)) {
    return true;
  }
  if (field === 'title' && (/^Work\s+\d+$/i.test(current) || isGenericSwedishArtworkTitle(current))) {
    return true;
  }
  if (syncMode === 'missing') {
    return false;
  }

  const record = metaRecord && typeof metaRecord === 'object' ? metaRecord : null;
  if (!record) {
    const snapshot = uiState.englishSyncSourceSnapshot && typeof uiState.englishSyncSourceSnapshot === 'object'
      ? uiState.englishSyncSourceSnapshot
      : null;
    const currentSourceHash = hashSyncSource(source);
    const previousSessionHash =
      snapshot && typeof snapshot[metaKey] === 'string' ? snapshot[metaKey].trim() : '';
    return Boolean(previousSessionHash && previousSessionHash !== currentSourceHash);
  }

  const currentSourceHash = hashSyncSource(source);
  const previousSourceHash = typeof record.sourceHash === 'string' ? record.sourceHash.trim() : '';
  if (!previousSourceHash || previousSourceHash === currentSourceHash) {
    return false;
  }

  const lastTranslated = typeof record.translatedValue === 'string' ? record.translatedValue.trim() : '';
  if (!lastTranslated) {
    return false;
  }
  if (current === lastTranslated) {
    return true;
  }
  return false;
};

const shouldRespectManualEnglishValue = (currentEn, sourceSv, field, syncMode = 'smart', metaRecord = null) => {
  const current = typeof currentEn === 'string' ? currentEn.trim() : '';
  const source = typeof sourceSv === 'string' ? sourceSv.trim() : '';
  if (!current) {
    return false;
  }
  if (syncMode === 'force') {
    return false;
  }

  // If the current EN value still looks like seed text, let sync overwrite it
  // even when the field was manually touched earlier.
  if (current === source) {
    return false;
  }
  if (looksLikeSwedishSeedText(current)) {
    return false;
  }
  if (field === 'title' && (/^Work\s+\d+$/i.test(current) || isGenericSwedishArtworkTitle(current))) {
    return false;
  }

  if (syncMode === 'missing') {
    return true;
  }

  const record = metaRecord && typeof metaRecord === 'object' ? metaRecord : null;
  const lastTranslated = record && typeof record.translatedValue === 'string' ? record.translatedValue.trim() : '';
  if (lastTranslated && current === lastTranslated) {
    return false;
  }

  return true;
};

const syncEnglishTextsFromSwedish = async (options = {}) => {
  const askConfirmation = options.askConfirmation === true;
  const syncMode =
    options.syncMode === 'force' ? 'force' : options.syncMode === 'missing' ? 'missing' : 'smart';
  const flashStatus = options.flash !== false;
  const statusPrefix =
    syncMode === 'force'
      ? 'Synkar om alla EN-texter från svenska via AI...'
      : syncMode === 'missing'
        ? 'Synkar saknade EN-texter från svenska via AI...'
        : 'Synkar EN-texter från svenska (nya + ändrade) via AI...';

  if (englishTextSyncInFlight) {
    setStatus('EN-synk pågår redan. Vänta tills den är klar.', 'info', { flash: flashStatus });
    return;
  }

  if (askConfirmation) {
    const proceed = window.confirm(
      syncMode === 'force'
        ? 'Synka om alla engelska texter från svenska via AI?\n\nDetta skriver om engelska texter för hero, galleri, om, kontakt, SEO, kategorinamn och verkfält, även om de redan har engelskt innehåll. Du kan granska resultatet innan du klickar "Spara ändringar".'
        : 'Synka engelska texter från svenska via AI?\n\nDetta uppdaterar engelska texter för hero, galleri, om, kontakt, SEO och kategorinamn när de saknas eller när svenskan ändrats sedan senaste synk. Du kan granska resultatet innan du klickar "Spara ändringar".'
    );
    if (!proceed) {
      return;
    }
  }

  pullFormToState();
  ensureGallery();
  ensureAboutContact();
  ensureSeo();

  if (!authState.csrfToken) {
    setStatus('Saknar säkerhetstoken. Ladda om sidan och logga in igen.', 'error', { flash: flashStatus });
    return;
  }

  const enPack = ensureLanguageOverridePack('en');
  const sv = state.content;

  const stringJobs = EN_SYNC_STRING_JOBS;
  const arrayJobs = EN_SYNC_ARRAY_JOBS;
  const imageEntryJobs = EN_SYNC_IMAGE_ENTRY_JOBS;

  setStatus(statusPrefix, 'info', { flash: flashStatus });

  englishTextSyncInFlight = true;
  let translatedFields = 0;
  let translatedArrayItems = 0;
  let translatedArtworkFields = 0;
  let failedFields = 0;
  const failedDetails = [];
  const pendingEntries = [];
  const translatedArrayBuffers = new Map();
  const translatedImageEntryBuffers = new Map();
  const translatedCategoryLabels = {};

  try {
    for (const job of stringJobs) {
      const source = getPath(sv, job.path);
      if (typeof source !== 'string' || source.trim() === '') {
        continue;
      }
      const currentEn = getPath(enPack, job.path);
      const metaKey = buildEnglishSyncMetaKey({ target: 'string', path: job.path });
      const metaRecord = getEnglishSyncMetaRecord(metaKey, 'en');
      if (!shouldSyncEnglishField(currentEn, source, job.field, syncMode, metaRecord, metaKey)) {
        continue;
      }
      pendingEntries.push({
        target: 'string',
        label: job.path,
        path: job.path,
        field: job.field,
        source,
        metaKey,
        metaRecord
      });
    }

    for (const job of arrayJobs) {
      const sourceItems = getPath(sv, job.path);
      if (!Array.isArray(sourceItems) || sourceItems.length === 0) {
        continue;
      }
      const currentEnItems = getPath(enPack, job.path);
      const currentArray = Array.isArray(currentEnItems) ? currentEnItems : [];
      const translatedItems = [];
      translatedArrayBuffers.set(job.path, translatedItems);
      for (let index = 0; index < sourceItems.length; index += 1) {
        const item = sourceItems[index];
        if (typeof item !== 'string' || item.trim() === '') {
          continue;
        }
        const currentEnItem = typeof currentArray[index] === 'string' ? currentArray[index] : '';
        const metaKey = buildEnglishSyncMetaKey({ target: 'array', arrayPath: job.path, index });
        const metaRecord = getEnglishSyncMetaRecord(metaKey, 'en');
        if (!shouldSyncEnglishField(currentEnItem, item, job.field, syncMode, metaRecord, metaKey)) {
          translatedItems.push(currentEnItem || item);
          continue;
        }
        translatedItems.push(item);
        pendingEntries.push({
          target: 'array',
          label: `${job.path}[${index + 1}]`,
          arrayPath: job.path,
          index,
          field: job.field,
          source: item,
          fallback: item,
          metaKey,
          metaRecord
        });
      }
    }

    for (const job of imageEntryJobs) {
      const sourceEntries = getPath(sv, job.path);
      if (!Array.isArray(sourceEntries) || sourceEntries.length === 0) {
        continue;
      }
      const currentEnEntries = getPath(enPack, job.path);
      const currentEntries = Array.isArray(currentEnEntries) ? currentEnEntries : [];
      const translatedEntries = [];
      translatedImageEntryBuffers.set(job.path, translatedEntries);
      for (let index = 0; index < sourceEntries.length; index += 1) {
        const item = sourceEntries[index];
        if (!item || typeof item !== 'object') {
          continue;
        }
        const src = typeof item.src === 'string' ? item.src.trim() : '';
        const alt = typeof item.alt === 'string' ? item.alt.trim() : '';
        const currentEntry =
          currentEntries[index] && typeof currentEntries[index] === 'object' ? currentEntries[index] : null;
        const currentAlt = currentEntry && typeof currentEntry.alt === 'string' ? currentEntry.alt.trim() : '';
        if (!src) {
          continue;
        }
        if (!alt) {
          translatedEntries.push({ src, alt: '' });
          continue;
        }
        const metaKey = buildEnglishSyncMetaKey({ target: 'imageEntry', imagePath: job.path, index });
        const metaRecord = getEnglishSyncMetaRecord(metaKey, 'en');
        if (!shouldSyncEnglishField(currentAlt, alt, job.field, syncMode, metaRecord, metaKey)) {
          translatedEntries.push({ src, alt: currentAlt || alt });
          continue;
        }
        translatedEntries.push({ src, alt });
        pendingEntries.push({
          target: 'imageEntry',
          label: `${job.path}[${index + 1}]`,
          imagePath: job.path,
          index,
          field: job.field,
          source: alt,
          fallback: alt,
          metaKey,
          metaRecord
        });
      }
    }

    const categoryLabels = sv.gallery && sv.gallery.categoryLabels && typeof sv.gallery.categoryLabels === 'object'
      ? sv.gallery.categoryLabels
      : {};
    for (const rawKey of Object.keys(categoryLabels)) {
      const key = normalizeCategoryKey(rawKey);
      const label = typeof categoryLabels[rawKey] === 'string' ? categoryLabels[rawKey].trim() : '';
      if (!key || !label) {
        continue;
      }
      if (key === 'all') {
        translatedCategoryLabels[key] = 'All';
        continue;
      }
      pendingEntries.push({
        target: 'categoryLabel',
        label: `gallery.categoryLabels.${key}`,
        categoryKey: key,
        field: 'generic',
        source: label,
        fallback: humanizeCategoryKey(key),
        metaKey: buildEnglishSyncMetaKey({ target: 'categoryLabel', categoryKey: key }),
        metaRecord: getEnglishSyncMetaRecord(buildEnglishSyncMetaKey({ target: 'categoryLabel', categoryKey: key }), 'en')
      });
    }

    const artworkFields = ARTWORK_TRANSLATABLE_FIELDS.slice();
    const artworkItems = Array.isArray(sv.gallery?.artworks) ? sv.gallery.artworks : [];
    for (const item of artworkItems) {
      const src = item && typeof item.src === 'string' ? item.src.trim() : '';
      if (!src) {
        continue;
      }

      const entry = ensureArtworkTranslationEntry('en', src);
      if (!entry) {
        continue;
      }

      const manual = entry._manual && typeof entry._manual === 'object' ? entry._manual : null;
      for (const fieldName of artworkFields) {
        const source = item && typeof item[fieldName] === 'string' ? item[fieldName].trim() : '';
        if (!source) {
          continue;
        }

        const currentEn = typeof entry[fieldName] === 'string' ? entry[fieldName].trim() : '';
        const metaKey = buildEnglishSyncMetaKey({
          target: 'artworkField',
          artworkSrc: src,
          artworkField: fieldName
        });
        const metaRecord = getEnglishSyncMetaRecord(metaKey, 'en');
        if (manual && manual[fieldName] && shouldRespectManualEnglishValue(currentEn, source, fieldName, syncMode, metaRecord)) {
          continue;
        }
        if (!shouldSyncEnglishField(currentEn, source, fieldName, syncMode, metaRecord, metaKey)) {
          continue;
        }

        pendingEntries.push({
          target: 'artworkField',
          label: `artwork.${src}.${fieldName}`,
          artworkSrc: src,
          artworkField: fieldName,
          field: fieldName,
          source,
          previous: currentEn,
          metaKey,
          metaRecord
        });
      }
    }

    await processSvEntriesToEnInBatches(pendingEntries, {
      onSuccess(entry, translated) {
        if (entry.target === 'string' && entry.path) {
          setPath(enPack, entry.path, translated);
          rememberEnglishSyncMetaRecord(entry.metaKey, entry.source, translated, 'en');
          translatedFields += 1;
          return;
        }
        if (entry.target === 'array' && entry.arrayPath && Number.isInteger(entry.index)) {
          const buffer = translatedArrayBuffers.get(entry.arrayPath);
          if (Array.isArray(buffer)) {
            buffer[entry.index] = translated;
          }
          rememberEnglishSyncMetaRecord(entry.metaKey, entry.source, translated, 'en');
          translatedArrayItems += 1;
          return;
        }
        if (entry.target === 'imageEntry' && entry.imagePath && Number.isInteger(entry.index)) {
          const buffer = translatedImageEntryBuffers.get(entry.imagePath);
          if (Array.isArray(buffer)) {
            const current = buffer[entry.index] && typeof buffer[entry.index] === 'object' ? buffer[entry.index] : {};
            buffer[entry.index] = {
              ...current,
              src: current.src || '',
              alt: translated
            };
          }
          rememberEnglishSyncMetaRecord(entry.metaKey, entry.source, translated, 'en');
          translatedArrayItems += 1;
          return;
        }
        if (entry.target === 'categoryLabel' && entry.categoryKey) {
          translatedCategoryLabels[entry.categoryKey] = translated || entry.fallback || humanizeCategoryKey(entry.categoryKey);
          rememberEnglishSyncMetaRecord(entry.metaKey, entry.source, translated || entry.fallback || humanizeCategoryKey(entry.categoryKey), 'en');
          translatedFields += 1;
          return;
        }
        if (entry.target === 'artworkField' && entry.artworkSrc && entry.artworkField) {
          const artworkEntry = ensureArtworkTranslationEntry('en', entry.artworkSrc);
          if (!artworkEntry) {
            return;
          }
          artworkEntry[entry.artworkField] = translated;
          applyArtworkEnglishTranslationToUi(entry.artworkSrc, entry.artworkField, translated);
          rememberEnglishSyncMetaRecord(entry.metaKey, entry.source, translated, 'en');
          translatedArtworkFields += 1;
        }
      },
      onError(entry, reason) {
        failedFields += 1;
        failedDetails.push(`${entry.label} (${reason})`);
        if (entry.target === 'array' && entry.arrayPath && Number.isInteger(entry.index)) {
          const buffer = translatedArrayBuffers.get(entry.arrayPath);
          if (Array.isArray(buffer)) {
            buffer[entry.index] = entry.fallback || entry.source || '';
          }
          return;
        }
        if (entry.target === 'imageEntry' && entry.imagePath && Number.isInteger(entry.index)) {
          const buffer = translatedImageEntryBuffers.get(entry.imagePath);
          if (Array.isArray(buffer)) {
            const current = buffer[entry.index] && typeof buffer[entry.index] === 'object' ? buffer[entry.index] : {};
            buffer[entry.index] = {
              ...current,
              src: current.src || '',
              alt: entry.fallback || entry.source || ''
            };
          }
          return;
        }
        if (entry.target === 'categoryLabel' && entry.categoryKey) {
          translatedCategoryLabels[entry.categoryKey] = entry.fallback || humanizeCategoryKey(entry.categoryKey);
          return;
        }
        if (entry.target === 'artworkField' && entry.artworkSrc && entry.artworkField) {
          const artworkEntry = ensureArtworkTranslationEntry('en', entry.artworkSrc);
          if (!artworkEntry) {
            return;
          }
          if (typeof entry.previous === 'string' && entry.previous.trim() !== '') {
            artworkEntry[entry.artworkField] = entry.previous;
            applyArtworkEnglishTranslationToUi(entry.artworkSrc, entry.artworkField, entry.previous);
          }
        }
      }
    });

    translatedArrayBuffers.forEach((items, path) => {
      setPath(enPack, path, items);
    });
    translatedImageEntryBuffers.forEach((items, path) => {
      setPath(enPack, path, items);
    });

    if (Object.keys(translatedCategoryLabels).length > 0) {
      setPath(enPack, 'gallery.categoryLabels', translatedCategoryLabels);
    }

    syncFormFromState();
    renderCategoryEditor();
    renderCategorySelects();
    renderArtworksEditor();
    renderHeroSlideArtworkOptions();
    renderHeroSlidesEditor();

    const totalTranslated = translatedFields + translatedArrayItems + translatedArtworkFields;
    const noChangeNote =
      totalTranslated === 0 && failedFields === 0
        ? ' Inga fält behövde uppdateras.'
        : '';
    const failureNote =
      failedFields > 0 ? ` ${failedFields} fält kunde inte översättas automatiskt och behöll tidigare värde.` : '';
    const failureDetailsNote =
      failedDetails.length > 0
        ? ` Misslyckade fält: ${failedDetails.slice(0, 3).join('; ')}${failedDetails.length > 3 ? ' ...' : ''}`
        : '';
    const hasOnlyFailures = totalTranslated === 0 && failedFields > 0;
    setStatus(
      `Synkade EN-texter: ${translatedFields} fält, ${translatedArrayItems} listpunkter och ${translatedArtworkFields} verkfält.${noChangeNote}${failureNote}${failureDetailsNote} Klicka "Spara ändringar" för att publicera.`,
      hasOnlyFailures ? 'error' : 'success',
      { flash: flashStatus }
    );
  } catch (error) {
    const reason = error instanceof Error && error.message ? error.message : 'okänt fel';
    setStatus(`Kunde inte synka engelska texter: ${reason}`, 'error', { flash: flashStatus });
  } finally {
    englishTextSyncInFlight = false;
  }
};

const restoreSwedishTitlesFromEnglish = async () => {
  const proceed = window.confirm(
    'Återskapa svenska titlar från engelska?\n\nDetta försöker fylla i titlar som fortfarande heter "Verk 12" etc genom att använda dina engelska titlar (och ev. sparade svenska frön i EN-fälten). Du kan granska resultatet innan du klickar "Spara ändringar".'
  );
  if (!proceed) {
    return;
  }

  pullFormToState();
  ensureGallery();

  const artworks = Array.isArray(state.content.gallery?.artworks) ? state.content.gallery.artworks : [];
  if (!Array.isArray(artworks) || artworks.length === 0) {
    setStatus('Hittade inga verk att återskapa.', 'info');
    return;
  }

  const localizedEnMap = getPath(getLocalizedContentForEditor('en'), 'gallery.artworkTextBySrc');
  const enMap = localizedEnMap && typeof localizedEnMap === 'object' ? localizedEnMap : {};

  const translateQueue = [];
  let restoredDirect = 0;
  let restoredTranslated = 0;
  let copiedFormat = 0;

  artworks.forEach((item, index) => {
    if (!item || typeof item !== 'object') {
      return;
    }
    const src = typeof item.src === 'string' ? item.src.trim() : '';
    if (!src) {
      return;
    }
    const svTitle = typeof item.title === 'string' ? item.title.trim() : '';
    if (!isGenericSwedishArtworkTitle(svTitle)) {
      return;
    }

    const enEntry = enMap[src];
    if (!enEntry || typeof enEntry !== 'object') {
      return;
    }

    const enTitle = typeof enEntry.title === 'string' ? enEntry.title.trim() : '';
    const enAlt = typeof enEntry.alt === 'string' ? enEntry.alt.trim() : '';
    const enFormat = typeof enEntry.format === 'string' ? enEntry.format.trim() : '';

    if (enFormat && (!item.format || (typeof item.format === 'string' && item.format.trim() === ''))) {
      item.format = enFormat;
      copiedFormat += 1;
    }

    if (enAlt && looksLikeSwedishSeedText(enAlt)) {
      item.title = enAlt;
      restoredDirect += 1;
      updateArtworkThumbTitleForSrc(src, enAlt);
      return;
    }

    if (enTitle && !/^Work\s+\d+$/i.test(enTitle)) {
      translateQueue.push({ index, src, enTitle });
    }
  });

  if (translateQueue.length === 0 && restoredDirect === 0 && copiedFormat === 0) {
    setStatus('Hittade inget att återskapa (eller allt är redan ifyllt).', 'info');
    return;
  }

  if (!authState.csrfToken) {
    setStatus('Saknar säkerhetstoken. Ladda om sidan och logga in igen.', 'error');
    return;
  }

  if (translateQueue.length > 0) {
    setStatus(`Översätter ${translateQueue.length} titel/titlar från engelska till svenska...`, 'info');
  } else {
    setStatus('Återskapar titlar...', 'info');
  }

  for (let i = 0; i < translateQueue.length; i += 1) {
    const job = translateQueue[i];
    const item = artworks[job.index];
    if (!item || typeof item !== 'object') {
      continue;
    }
    if (!isGenericSwedishArtworkTitle(typeof item.title === 'string' ? item.title : '')) {
      continue;
    }
    try {
      const result = await apiJson('api/translate.php', {
        method: 'POST',
        withCsrf: true,
        body: {
          from: 'en',
          to: 'sv',
          field: 'title',
          text: job.enTitle
        }
      });
      const translated = typeof result.translation === 'string' ? result.translation.trim() : '';
      if (!translated) {
        continue;
      }
      item.title = translated;
      restoredTranslated += 1;
      updateArtworkThumbTitleForSrc(job.src, translated);
    } catch (error) {
      const reason = error instanceof Error && error.message ? error.message : 'okänt fel';
      setStatus(`Kunde inte översätta "${job.enTitle}": ${reason}`, 'error');
      break;
    }
  }

  renderArtworksEditor();
  const totalRestored = restoredDirect + restoredTranslated;
  const formatSuffix = copiedFormat > 0 ? ` + ${copiedFormat} format` : '';
  setStatus(
    `Återskapat ${totalRestored} svenska titlar${formatSuffix}. Kontrollera och klicka sedan "Spara ändringar" för att publicera.`,
    'success'
  );
};

const restoreFromServer = async () => {
  const proceed = window.confirm(
    'Hämta den senaste publicerade versionen från servern?\n\nDetta ersätter det du ser i Studio just nu. Du kan fortfarande ångra genom att ladda om sidan utan att spara.'
  );
  if (!proceed) {
    return;
  }

  setStatus('Hämtar publicerad version från servern...', 'info');

  try {
    const response = await fetch(`api/content.php?v=${ASSET_REV}`, { credentials: 'same-origin' });
    const body = await response.json().catch(() => null);
    if (!response.ok || !body || body.ok !== true) {
      const reason = body && typeof body.message === 'string' && body.message.trim() !== '' ? body.message.trim() : `HTTP ${response.status}`;
      throw new Error(reason);
    }

    const payload = body.payload && typeof body.payload === 'object' ? body.payload : {};
    const parsedContent = deepMerge({}, payload);
    const parsedTranslations =
      parsedContent.translations && typeof parsedContent.translations === 'object' ? parsedContent.translations : {};
    if (Object.prototype.hasOwnProperty.call(parsedContent, 'translations')) {
      delete parsedContent.translations;
    }

    state.content = deepMerge(baseContent, parsedContent);
    state.translations = deepMerge(baseTranslationOverrides, parsedTranslations);
    ensureGallery();
    ensureSeo();
    syncFormFromState();
    renderArtworksEditor();

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (error) {
      // Ignore storage errors; user can still publish.
    }

    setStatus('Hämtat från servern. Klicka "Spara ändringar" för att publicera om.', 'success');
  } catch (error) {
    const reason = error instanceof Error && error.message ? error.message : 'okänt fel';
    setStatus(`Kunde inte hämta från servern: ${reason}`, 'error');
  }
};

const handleGalleryUpload = async (files) => {
  const category =
    normalizeCategoryKey(el.uploadCategory && el.uploadCategory.value) || getFirstGalleryCategoryKey();
  const existingCount = state.content.gallery.artworks.length;
  const newItems = [];
  const shouldUploadToServer = canPublishToServer();

  for (const file of files) {
    const src = shouldUploadToServer
      ? await uploadOptimizedImageFile(file, {
          filenameHint: slugFromName(file.name),
          maxWidth: 2200,
          maxHeight: 2200,
          quality: 0.82,
          minQuality: 0.6,
          maxBytes: 1200 * 1024
        })
      : await optimizeImageFile(file, {
          maxWidth: 1700,
          maxHeight: 1700,
          quality: 0.8,
          minQuality: 0.58,
          maxBytes: 780 * 1024
        });
    const itemNumber = existingCount + newItems.length + 1;
    const title = slugFromName(file.name) || `Verk ${itemNumber}`;

    newItems.push(
      createArtworkItem({
        src,
        title,
        alt: title,
        category,
        featured: false,
        year: new Date().getFullYear(),
        order: itemNumber
      })
    );
  }

  if (newItems.length > 0) {
    state.content.gallery.artworks.unshift(...newItems);
    syncGalleryArtworkOrderValues();
    uiState.selectedArtworkIndex = 0;
    uiState.artworkListScrollTop = 0;
  }

  if (shouldUploadToServer) {
    await loadServerImageCandidates();
  }
  renderArtworksEditor();
  setStatus(`${files.length} bild(er) tillagda. Klicka "Spara".`, 'success');
};

const bindMarkdownLinkHelpers = () => {
  document.querySelectorAll('[data-link-target]').forEach((helper) => {
    const button = helper.querySelector('[data-link-insert]');
    const labelInput = helper.querySelector('[data-link-label]');
    const urlInput = helper.querySelector('[data-link-url]');
    if (!button) {
      return;
    }

    button.addEventListener('click', () => {
      const targetId = helper.getAttribute('data-link-target') || '';
      const target = targetId ? document.getElementById(targetId) : null;
      if (!(target instanceof HTMLTextAreaElement)) {
        return;
      }

      const selectionStart = target.selectionStart || 0;
      const selectionEnd = target.selectionEnd || selectionStart;
      const selectedText = target.value.slice(selectionStart, selectionEnd).trim();
      const label = (labelInput && labelInput.value.trim()) || selectedText;
      if (!label) {
        if (labelInput) {
          labelInput.focus();
        }
        return;
      }
      let url = urlInput && typeof urlInput.value === 'string' ? urlInput.value.trim() : '';
      if (!url) {
        if (urlInput) {
          urlInput.focus();
        }
        return;
      }
      if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(url) && !url.startsWith('mailto:')) {
        url = `https://${url.replace(/^\/+/, '')}`;
      }

      const insert = `[${label}](${url})`;
      target.value = `${target.value.slice(0, selectionStart)}${insert}${target.value.slice(selectionEnd)}`;
      target.focus();
      target.setSelectionRange(selectionStart + insert.length, selectionStart + insert.length);
      target.dispatchEvent(new Event('input', { bubbles: true }));
      if (labelInput) {
        labelInput.value = '';
      }
      if (urlInput) {
        urlInput.value = '';
      }
    });
  });
};

const bindEvents = () => {
  if (el.saveStudio) {
    el.saveStudio.addEventListener('click', saveToStorage);
  }
  if (el.studioTopSave) {
    el.studioTopSave.addEventListener('click', saveToStorage);
  }
  if (el.restoreFromServer) {
    el.restoreFromServer.addEventListener('click', () => {
      restoreFromServer();
    });
  }
  if (el.restoreSvFromEn) {
    el.restoreSvFromEn.addEventListener('click', () => {
      restoreSwedishTitlesFromEnglish();
    });
  }
  if (el.resetStudio) {
    el.resetStudio.addEventListener('click', resetStorage);
  }
  if (el.exportJson) {
    el.exportJson.addEventListener('click', exportJson);
  }
  if (el.exportOverridesJs) {
    el.exportOverridesJs.addEventListener('click', exportOverridesJs);
  }
  if (el.addCategoryButton) {
    el.addCategoryButton.addEventListener('click', () => {
      addCategoryFromEditor();
    });
  }

  if (el.heroAutoSlidesForceRefresh) {
    el.heroAutoSlidesForceRefresh.addEventListener('click', () => {
      if (!state.content.hero.autoSlides || typeof state.content.hero.autoSlides !== 'object') {
        state.content.hero.autoSlides = {};
      }
      const stamp = new Date().toISOString();
      state.content.hero.autoSlides.seedNonce = stamp;
      state.content.hero.autoSlides.lastForcedAt = stamp;
      updateHeroAutoSlidesForceMeta();
      setStatus(
        'Force update förberedd. Klicka "Spara ändringar" för att publicera nytt auto-urval direkt.',
        'success'
      );
    });
  }
  if (el.addCategoryKey) {
    el.addCategoryKey.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        addCategoryFromEditor();
      }
    });
  }
  if (el.addCategoryLabel) {
    el.addCategoryLabel.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        addCategoryFromEditor();
      }
    });
  }

  document.querySelectorAll('[data-action="save-section"]').forEach((button) => {
    button.addEventListener('click', () => {
      saveToStorage();
    });
  });

  if (Array.isArray(el.studioLangButtons) && el.studioLangButtons.length > 0) {
    el.studioLangButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const nextLanguage = normalizeStudioLanguage(button.getAttribute('data-studio-lang')) || 'sv';
        if (nextLanguage === getEditingLanguage()) {
          return;
        }

        pullFormToState();
        uiState.editLanguage = nextLanguage;
        storeStudioLanguage(nextLanguage);
        syncFormFromState();
        renderArtworksEditor();
        renderHeroSlideArtworkOptions();
        renderHeroSlidesEditor();
        if (nextLanguage === 'en') {
          setStatus(
            `Bytte textredigering till ${getLanguageLabel(nextLanguage)}. Använd "Synka EN från SV" om du vill autofylla eller uppdatera engelska texter.`,
            'info'
          );
        } else {
          setStatus(`Bytte textredigering till ${getLanguageLabel(nextLanguage)}.`, 'info');
        }
      });
    });
  }

  if (el.translateMissingEnTitles) {
    el.translateMissingEnTitles.addEventListener('click', () => {
      if (getEditingLanguage() !== 'en') {
        setStatus('Växla till engelska texter för att autoöversätta.', 'info');
        return;
      }

      void translateMissingArtworkEnglishTitlesViaApi();
    });
  }

  if (el.translateEnFromSv) {
    el.translateEnFromSv.addEventListener('click', () => {
      void syncEnglishTextsFromSwedish({ askConfirmation: false, syncMode: 'smart', flash: true });
    });
  }

  if (el.translateEnFromSvForce) {
    el.translateEnFromSvForce.addEventListener('click', () => {
      void syncEnglishTextsFromSwedish({ askConfirmation: true, syncMode: 'force', flash: true });
    });
  }

  if (el.seoHomeImageSelect) {
    el.seoHomeImageSelect.addEventListener('change', () => {
      applySeoHomeImageSelection();
      renderSeoHomeImageControls();
    });
  }

  if (el.seoHomeImage) {
    el.seoHomeImage.addEventListener('input', () => {
      renderSeoHomeImageControls();
    });
    el.seoHomeImage.addEventListener('change', () => {
      renderSeoHomeImageControls();
    });
  }

  [
    el.themeBackground,
    el.themeSurface,
    el.themeInk,
    el.themeSoftInk,
    el.themePrimary,
    el.themeAccent,
    el.themeHeaderBackground,
    el.themeHeaderOpacity,
    el.themeButtonGradientStart,
    el.themeButtonGradientEnd,
    el.themeFooterBackground,
    el.themeFontDisplay,
    el.themeFontBody,
    el.themeFontDisplayWeight,
    el.themeFontBodyWeight,
    el.themeFontDisplayStyle,
    el.themeFontBodyStyle
  ]
    .filter(Boolean)
    .forEach((node) => {
      node.addEventListener('input', () => {
        pullFormToState();
      });
      node.addEventListener('change', () => {
        pullFormToState();
      });
    });

  const sectionImagePickerPairs = [
    { select: el.aboutPortraitImagePick, input: el.aboutPortraitImage },
    { select: el.materialsImagePick, input: el.materialsImage },
    { select: el.aboutFeatureImagePick, input: el.aboutFeatureImage },
    { select: el.projectCollageImagePick, input: el.projectCollageImage },
    { select: el.projectSample1Pick, input: el.projectSample1Src },
    { select: el.projectSample2Pick, input: el.projectSample2Src },
    { select: el.projectSample3Pick, input: el.projectSample3Src },
    { select: el.projectSample4Pick, input: el.projectSample4Src }
  ];

  sectionImagePickerPairs.forEach(({ select, input }) => {
    if (!select || !input) {
      return;
    }
    select.addEventListener('change', () => {
      const picked = typeof select.value === 'string' ? select.value.trim() : '';
      if (!picked) {
        return;
      }
      input.value = picked;
      renderSectionImagePickers();
    });
    input.addEventListener('input', () => {
      renderSectionImagePickers();
    });
    input.addEventListener('change', () => {
      renderSectionImagePickers();
    });
  });

  document.querySelectorAll('[data-upload-target]').forEach((button) => {
    button.addEventListener('click', () => {
      if (!el.sectionImageUpload) {
        setStatus('Uppladdning är inte tillgänglig i den här Studio-versionen.', 'error');
        return;
      }
      const target = typeof button.dataset.uploadTarget === 'string' ? button.dataset.uploadTarget.trim() : '';
      if (!target) {
        return;
      }
      const label = typeof button.dataset.uploadLabel === 'string' ? button.dataset.uploadLabel.trim() : 'bild';
      uiState.pendingSectionUploadTarget = target;
      uiState.pendingSectionUploadLabel = label || 'bild';
      el.sectionImageUpload.click();
    });
  });

  if (el.sectionImageUpload) {
    el.sectionImageUpload.addEventListener('change', async () => {
      const file = el.sectionImageUpload.files && el.sectionImageUpload.files[0];
      const target = uiState.pendingSectionUploadTarget;
      const label = uiState.pendingSectionUploadLabel || 'bild';

      uiState.pendingSectionUploadTarget = '';
      uiState.pendingSectionUploadLabel = 'bild';

      if (!file || !target) {
        el.sectionImageUpload.value = '';
        return;
      }

      setStatus(`Laddar upp ${label}...`, 'info');
      try {
        const src = await uploadOptimizedImageFile(file, {
          filenameHint: slugFromName(file.name),
          maxWidth: 2200,
          maxHeight: 2200,
          quality: 0.82,
          minQuality: 0.6,
          maxBytes: 1200 * 1024
        });
        if (!setImageFieldValue(target, src)) {
          throw new Error(`Kunde inte hitta fältet ${target}.`);
        }

        if (target === 'hero-image' && el.heroImageAlt && !el.heroImageAlt.value.trim()) {
          el.heroImageAlt.value = slugFromName(file.name) || 'Hero-bild';
        }

        await loadServerImageCandidates();
        renderSectionImagePickers();
        renderSeoHomeImageControls();
        setStatus(`${label.charAt(0).toUpperCase()}${label.slice(1)} uppladdad: ${src}`, 'success');
      } catch (error) {
        const reason = error instanceof Error && error.message ? error.message : 'okänt fel';
        setStatus(`Uppladdning misslyckades (${label}): ${reason}`, 'error');
      } finally {
        el.sectionImageUpload.value = '';
      }
    });
  }

  if (el.heroImage) {
    const handleHeroImageChange = () => {
      if (el.seoHomeImageSelect && el.seoHomeImageSelect.value === SEO_HOME_IMAGE_OPTION_HERO && el.seoHomeImage) {
        el.seoHomeImage.value = (el.heroImage.value || '').trim();
      }
      renderSeoHomeImageControls();
    };

    el.heroImage.addEventListener('input', handleHeroImageChange);
    el.heroImage.addEventListener('change', handleHeroImageChange);
  }

  el.addHeroSlide.addEventListener('click', () => {
    const slides = getHeroSlidesForEditor();
    slides.push({
      src: '',
      alt: '',
      durationMs: Number(el.heroSlideDuration.value || 8000)
    });
    uiState.selectedHeroSlideIndex = slides.length - 1;
    renderHeroSlidesEditor();
  });

  el.addHeroSlideFromArtwork.addEventListener('click', () => {
    const index = Number(el.heroSlideFromArtwork.value);
    const artworkBase = state.content.gallery.artworks[index];
    const artworkLocalized = getLocalizedArtworksForEditor()[index];
    if (!artworkBase || !artworkBase.src) {
      return;
    }

    const slides = getHeroSlidesForEditor();
    slides.push({
      src: artworkBase.src,
      alt:
        (artworkLocalized && (artworkLocalized.alt || artworkLocalized.title)) ||
        artworkBase.alt ||
        artworkBase.title ||
        '',
      durationMs: Number(el.heroSlideDuration.value || 8000)
    });
    uiState.selectedHeroSlideIndex = slides.length - 1;
    renderHeroSlidesEditor();
  });

  if (el.importJsonTrigger && el.importJson) {
    el.importJsonTrigger.addEventListener('click', () => {
      el.importJson.click();
    });

    el.importJson.addEventListener('change', async () => {
      const file = el.importJson.files && el.importJson.files[0];
      if (!file) {
        return;
      }
      await importJson(file);
      el.importJson.value = '';
    });
  }

  if (el.addContactSocial) {
    el.addContactSocial.addEventListener('click', () => {
      const links = ensureEditableContactSocialLinks(getEditingLanguage());
      links.push(createSocialChannel());
      renderContactSocialEditor();
    });
  }

  if (el.galleryUpload) {
    el.galleryUpload.addEventListener('change', async () => {
      const files = Array.from(el.galleryUpload.files || []);
      if (files.length === 0) {
        return;
      }

      try {
        await handleGalleryUpload(files);
      } catch (error) {
        setStatus('Det gick inte att läsa alla uppladdade filer.', 'error');
      } finally {
        el.galleryUpload.value = '';
      }
    });
  }

  el.heroImageUpload.addEventListener('change', async () => {
    const file = el.heroImageUpload.files && el.heroImageUpload.files[0];
    if (!file) {
      return;
    }

    try {
      const src = await uploadOptimizedImageFile(file, {
        filenameHint: slugFromName(file.name),
        maxWidth: 2600,
        maxHeight: 2600,
        quality: 0.84,
        minQuality: 0.62,
        maxBytes: 1500 * 1024
      });
      el.heroImage.value = src;
      state.content.hero.image = src;
      state.content.hero.imageAlt = state.content.hero.imageAlt || slugFromName(file.name);
      el.heroImageAlt.value = state.content.hero.imageAlt;
      if (el.seoHomeImageSelect && el.seoHomeImageSelect.value === SEO_HOME_IMAGE_OPTION_HERO && el.seoHomeImage) {
        el.seoHomeImage.value = src;
      }
      await loadServerImageCandidates();
      renderSectionImagePickers();
      renderSeoHomeImageControls();
      setStatus('Hero-bilden är uppladdad. Klicka "Spara ändringar".', 'success');
    } catch (error) {
      const reason = error instanceof Error && error.message ? error.message : 'okänt fel';
      setStatus(`Det gick inte att ladda upp hero-bilden: ${reason}`, 'error');
    } finally {
      el.heroImageUpload.value = '';
    }
  });

  if (el.studioLogoutBtn) {
    if (isLocalStaticStudioPreview()) {
      el.studioLogoutBtn.hidden = true;
    } else if (isSecureAuthStudio()) {
      el.studioLogoutBtn.hidden = false;
      el.studioLogoutBtn.addEventListener('click', async () => {
        try {
          await apiJson('api/auth/logout.php', {
            method: 'POST',
            withCsrf: true,
            body: {}
          });
        } catch (error) {
          // Ignore logout errors and continue redirecting away.
        }
        window.location.href = 'studio.html';
      });
    } else if (isServerProtectedStudio()) {
      el.studioLogoutBtn.hidden = true;
    } else {
      el.studioLogoutBtn.hidden = false;
      el.studioLogoutBtn.addEventListener('click', () => {
        window.localStorage.removeItem(STUDIO_AUTH_KEY);
        window.location.href = 'index.html';
      });
    }
  }

  document.querySelectorAll('[data-scroll-top]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
};

const init = async () => {
  if (isSecureAuthStudio()) {
    const accessGranted = await initSecureAuthGate();
    if (!accessGranted) {
      return;
    }
  } else if (!isServerProtectedStudio() && window.localStorage.getItem(STUDIO_AUTH_KEY) !== '1') {
    window.location.href = 'index.html';
    return;
  } else {
    showStudioApp();
  }

  ensureGallery();
  ensureHeroSlides();
  ensureAboutContact();
  ensureAnalytics();
  ensureSeo();
  captureEnglishSyncSourceSnapshot();
  syncFormFromState();
  initStudioNavigation();
  renderArtworksEditor();
  renderHeroSlideArtworkOptions();
  renderHeroSlidesEditor();
  bindMarkdownLinkHelpers();
  bindEvents();
  await loadServerImageCandidates();
  if (!isLocalStaticStudioPreview()) {
    initAnalyticsDashboard();
    initInquiriesPanel();
  } else {
    if (typeof setAnalyticsPanelStatus === 'function') {
      setAnalyticsPanelStatus('Lokalt previewläge: analytics kräver PHP-backend.', 'info');
    }
    if (typeof setInquiriesPanelStatus === 'function') {
      setInquiriesPanelStatus('Lokalt previewläge: inbox kräver PHP-backend.', 'info');
    }
  }
  if (isLocalStaticStudioPreview()) {
    setStatus(
      'Studio laddad i previewläge. Ändringar visas lokalt tills du publicerar.',
      'info',
      { flash: false }
    );
  } else if (canPublishToServer()) {
    setStatus('Studio laddad. Spara publicerar direkt till live.', 'info', { flash: false });
  } else {
    setStatus(
      'Studio laddad. Exportera filen för att publicera ändringarna.',
      'info',
      { flash: false }
    );
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    init().catch((error) => {
      setAuthStatus('Kunde inte starta Studio. Kontrollera serverloggen.', 'error');
      setStatus('Kunde inte starta Studio.', 'error');
      console.error(error);
    });
  });
} else {
  init().catch((error) => {
    setAuthStatus('Kunde inte starta Studio. Kontrollera serverloggen.', 'error');
    setStatus('Kunde inte starta Studio.', 'error');
    console.error(error);
  });
}
