// Napoli Pocket Brief — Service Worker
// Strategy: cache-everything-on-install, cache-first-forever after.
// This app is built to work with ZERO connectivity once installed.
// It is installed while you still have wifi (home, hotel, airport) —
// after that, it never needs the network again for its own content.

const CACHE_NAME = "napoli-brief-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Work+Sans:wght@400;500;600;700&display=swap"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Cache what we can; don't fail install if one font request hiccups
      return Promise.all(
        ASSETS.map((url) =>
          cache.add(url).catch((err) => console.warn("SW cache miss:", url, err))
        )
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Cache-first: always serve from cache if we have it (this is the whole point —
// Italian hotel wifi and Centro Storico stone walls should never be able to
// break this app). Fall back to network only for things not yet cached
// (e.g. an "Open in Maps" tap, which is an external link anyway).
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).catch(() => {
        if (event.request.mode === "navigate") {
          return caches.match("./index.html");
        }
      });
    })
  );
});
