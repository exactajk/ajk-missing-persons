const CACHE_NAME = 'ajk-portal-v34';
const ASSETS = [
    './',
    './index.html',
    './styles.css',
    './app.js',
    './manifest.json',
    './assets/images/logo.png',
    './assets/images/ali.png',
    './assets/images/hussain.png',
    './assets/images/irfan.png',
    './assets/images/yaseen.png',
    './assets/images/bilal.png',
    './assets/images/aamir.png'
];

// Install: cache core assets
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(ASSETS))
            .then(() => self.skipWaiting())
    );
});

// Activate: clear ALL old caches immediately
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.map((key) => {
                if (key !== CACHE_NAME) return caches.delete(key);
            }))
        ).then(() => self.clients.claim())
    );
});

// Network-first strategy: always try network, fall back to cache
self.addEventListener('fetch', (e) => {
    // Only handle GET requests
    if (e.request.method !== 'GET') return;

    e.respondWith(
        fetch(e.request)
            .then((networkResponse) => {
                // Save fresh copy in cache
                if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                    const clone = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
                }
                return networkResponse;
            })
            .catch(() => {
                // Offline: serve from cache
                return caches.match(e.request).then((cached) => {
                    if (cached) return cached;
                    if (e.request.mode === 'navigate') return caches.match('./index.html');
                });
            })
    );
});
