const CACHE_NAME = 'webed-v3';
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/AddElements.js',
  '/dragable.js',
  '/FileDatabases.js',
  '/logo.png',
  '/offline.html'
];

// Install
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }));
    })
  );
  self.clients.claim();
});

// Fetch - Cache First, then Network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse; // Serve from cache
      }
      return fetch(event.request)
        .catch(() => {
          if (event.request.destination === 'document') {
            return caches.match('/offline.html'); // Fallback HTML
          }
        });
    })
  );
});
