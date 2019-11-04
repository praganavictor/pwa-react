var CACHE_NAME = "otimigas-app";

var urlsToCache = [
  "/",
  "/static/js/bundle.js",
  "/static/js/main.chunk.js",
  "/static/js/1.chunk.js",
  "/static/js/0.chunk.js",
  "/favicon.ico",
  "/css?family=Open+Sans",
  "/icon?family=Material+Icons"
];

self.addEventListener("install", async e => {
  const cache = await caches.open(CACHE_NAME);
  await cache.addAll(urlsToCache);
  return self.skipWaiting();
});

self.addEventListener("activate", e => {
  self.clients.claim();
});

self.addEventListener("fetch", async e => {
  const req = e.request;
  const url = new URL(req.url);

  if (url.origin === location.origin) {
    e.respondWith(cacheFirst(req));
  } else {
    e.respondWith(networkAndCache(req));
  }
});

async function cacheFirst(req) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(req);
  return cached || fetch(req);
}

async function networkAndCache(req) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const fresh = await fetch(req);
    await cache.put(req, fresh.clone());
    return fresh;
  } catch (e) {
    const cached = await cache.match(req);
    return cached;
  }
}
