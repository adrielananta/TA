// From https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Offline_Service_workers
var CACHE_NAME = 'tldraw-p2p-pwa';
var urlsToCache = [
  '/TA/',
  '/TA/favicon.ico',
  '/TA/logo192.png',
  '/TA/logo512.png',
  '/TA/maskable_icon_x192.png',
  '/TA/maskable_icon_x512.png',
  '/TA/manifest.json',
  '/TA/static/js/bundle.js',
  '/TA/static/js/main.92038fcb.js',
  '/TA/static/css/main.1106d2d8.css',
  '/TA/index.html'
];


self.addEventListener('install', event => {
  console.log('[Service Worker] Install');
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    console.log('[Service Worker] Caching all: app shell and content');
    await cache.addAll(urlsToCache);
  })());
});

self.addEventListener('fetch', (e) => {
  e.respondWith((async () => {
    const r = await caches.match(e.request);
    console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
    if (r) { return r; }
    const response = await fetch(e.request);
    const cache = await caches.open(CACHE_NAME);
    console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
    cache.put(e.request, response.clone());
    return response;
  })());
});


self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keyList) => {
    return Promise.all(keyList.map((key) => {
      if (key === CACHE_NAME) { return; }
      return caches.delete(key);
    }));
  }));
});