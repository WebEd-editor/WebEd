const CACHE_NAME = 'webed-cache-v2.1.2';
const FILES_TO_CACHE = [
  '/',
  '/design.html',
  '/src/css/style.css',
  '/src/css/editor-footer.css',
  '/src/css/page.css',
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
    caches.open(CACHE_NAME).then(async cache => {
      for (const file of FILES_TO_CACHE) {
        try {
          await cache.add(file);
          console.log("Cached:", file);
        } catch (err) {
          console.error("Failed:", file, err);
        }
      }
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
self.addEventListener("fetch", (event) => {

    const request = event.request;
    const url = new URL(request.url);

    event.respondWith(
 caches.match(request).then((cachedResponse) => {

            // Agar cache me mila
            if (cachedResponse) {
                return cachedResponse;
            }

            // Homepage request
            if (
                request.mode === "navigate" ||
                url.pathname === "/"
            ) {

                return fetch("/design.html")
                .catch(() => {
                    return caches.match("/design.html");
                });
            }

            return fetch(request)
            .catch(() => {
                return new Response("Offline", {
                    status: 503,
                    statusText: "Offline"
                });
            });

        })

    );

});

/*self.addEventListener('fetch', event => {
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
});*/
