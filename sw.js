const CACHE_VERSION = 'ola-portfolio-v20260211-1';
const CORE_CACHE = `core-${CACHE_VERSION}`;
const ASSET_CACHE = `asset-${CACHE_VERSION}`;

const CORE_ASSETS = ['./', './index.html', './gallery.html', './styles.css', './content.js', './script.js'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CORE_CACHE)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CORE_CACHE && key !== ASSET_CACHE)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

const isSameOrigin = (requestUrl) => {
  try {
    return new URL(requestUrl).origin === self.location.origin;
  } catch (error) {
    return false;
  }
};

const isAssetRequest = (request) => {
  const destination = request.destination;
  return ['image', 'script', 'style', 'font'].includes(destination);
};

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET' || !isSameOrigin(request.url)) {
    return;
  }

  if (isAssetRequest(request)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) {
          return cached;
        }

        return fetch(request)
          .then((response) => {
            const clone = response.clone();
            caches.open(ASSET_CACHE).then((cache) => cache.put(request, clone)).catch(() => {});
            return response;
          })
          .catch(() => cached);
      })
    );
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CORE_CACHE).then((cache) => cache.put(request, clone)).catch(() => {});
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match('./index.html')))
    );
  }
});
