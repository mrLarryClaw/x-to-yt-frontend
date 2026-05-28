const CACHE_NAME = 'x2yt-v1';
const SHELL_ASSETS = [
  '/',
  '/history',
  '/settings',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

// Install: cache app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(SHELL_ASSETS);
    })
  );
  // @ts-ignore
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  ); // @ts-ignore
  self.clients.claim();
});

 function shouldBypassCache(req) {
   const url = new URL(req.url);
   // Bypass auth callback
   if (url.pathname === '/api/auth/callback') return true;
   // Bypass POST/DELETE/PUT/PATCH
   if (['POST', 'DELETE', 'PUT', 'PATCH'].includes(req.method)) return true;
   // Bypass api routes
   if (url.pathname.startsWith('/api/')) return true;
   return false;
 }

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (shouldBypassCache(req)) {
    return;
  }
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) {
        return cached;
      }
      return fetch(req).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(req, responseClone);
        });
        return response;
      });
    })
  );
});
