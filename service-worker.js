const CACHE_NAME = 'webed-cache-v2.1.1';
const FILES_TO_CACHE = [
  '/',
  '/design.html',
  '/src/css/style.css',
  '/src/js/script.js',
  '/src/js/AddElements.js',
  '/src/js/Assets-media.js',
  '/src/js/dragable.js',
  '/src/js/FileDatabases.js',
  '/src/js/behave.js',
  '/src/js/webedmenu.js',
  '/src/js/webDekstop.js',
  '/src/js/dragDropEl.js',
  '/src/js/core js/st/bg.js',
  '/src/js/FileDatabases.js',
  '/logo.png',
  '/webed-icon-512.png'
];

// Install
self.addEventListener('install', event => {
  console.log('[ServiceWorker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate
self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Activate');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(name => {
          if (name !== CACHE_NAME) {
            console.log('[ServiceWorker] Deleting old cache:', name);
            return caches.delete(name);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).catch(() => {
        // Fallback for HTML requests
        if (event.request.destination === 'document') {
          return caches.match('/design.html');
        }
      });
    })
  );
});
