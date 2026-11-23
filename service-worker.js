const CACHE_NAME = "sekka-pwa-v5";
const SB_CDN = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.min.js";
const APP_SHELL = ["./", "./index.html", "./style.css", "./script.js", "./pwa-install.css", "./pwa-install.js", "./manifest.json", "./icon-192.png", "./icon-512.png", "./icon-maskable-192.png", "./icon-maskable-512.png", "./apple-touch-icon.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await cache.addAll(APP_SHELL);
      try { await cache.put(SB_CDN, await fetch(new Request(SB_CDN, { mode: "no-cors" }))); } catch (_) {}
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith("sekka-pwa-") && k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  if (request.url === SB_CDN) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && (response.ok || response.type === "opaque")) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((c) => c.put(SB_CDN, copy));
          }
          return response;
        })
        .catch(async () => (await caches.match(SB_CDN)) || Response.error())
    );
    return;
  }

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((c) => c.put("./index.html", copy));
          }
          return response;
        })
        .catch(async () => (await caches.match("./index.html")) || (await caches.match("./")) || Response.error())
    );
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((c) => c.put(request, copy));
        }
        return response;
      })
      .catch(async () => (await caches.match(request)) || Response.error())
  );
});
