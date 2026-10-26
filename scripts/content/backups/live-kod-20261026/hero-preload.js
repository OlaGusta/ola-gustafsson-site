(function heroPreloadBootstrap() {
  const STORAGE_KEY = 'olaPortfolioOverridesV1';
  const DEFAULT_SRC = 'images/thumbs/ola-02.jpg';

  const toThumbCandidate = (src) => {
    if (typeof src !== 'string') {
      return '';
    }
    const trimmed = src.trim();
    if (!trimmed || trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
      return '';
    }
    if (trimmed.startsWith('images/') && !trimmed.includes('/thumbs/')) {
      const clean = trimmed.split('?')[0].split('#')[0];
      const file = clean.split('/').pop() || '';
      if (file) {
        return `images/thumbs/${file}`;
      }
    }
    return trimmed;
  };

  let preferredSrc = DEFAULT_SRC;
  try {
    const liveHero =
      window.PORTFOLIO_OVERRIDES &&
      typeof window.PORTFOLIO_OVERRIDES === 'object' &&
      window.PORTFOLIO_OVERRIDES.hero &&
      typeof window.PORTFOLIO_OVERRIDES.hero === 'object'
        ? window.PORTFOLIO_OVERRIDES.hero
        : null;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    const localHero = parsed && parsed.hero && typeof parsed.hero === 'object' ? parsed.hero : null;
    const hero = localHero || liveHero;
    if (hero) {
      if (hero.mode === 'slideshow' && Array.isArray(hero.slides)) {
        const firstSlide = hero.slides.find((item) => item && typeof item.src === 'string' && item.src.trim() !== '');
        if (firstSlide) {
          preferredSrc = toThumbCandidate(firstSlide.src) || DEFAULT_SRC;
        }
      } else if (typeof hero.image === 'string' && hero.image.trim() !== '') {
        preferredSrc = toThumbCandidate(hero.image) || DEFAULT_SRC;
      }
    }
  } catch (error) {
    preferredSrc = DEFAULT_SRC;
  }

  if (!preferredSrc) {
    return;
  }

  const head = document.head;
  if (!head) {
    return;
  }

  const preload = document.createElement('link');
  preload.rel = 'preload';
  preload.as = 'image';
  preload.href = preferredSrc;
  preload.setAttribute('data-hero-preload', '1');
  head.appendChild(preload);

  const safeSrc = preferredSrc.replace(/"/g, '%22');
  const style = document.createElement('style');
  style.setAttribute('data-hero-preload', '1');
  style.textContent =
    `.hero-media{` +
    `background-image:url("${safeSrc}") !important;` +
    `background-size:cover !important;` +
    `background-position:center center !important;` +
    `background-repeat:no-repeat !important;` +
    `}`;
  head.appendChild(style);
})();
