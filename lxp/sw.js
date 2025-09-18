// sw.js (아주 단순화)
const STATIC = "static-v1";
const PAGES = "pages-v1";

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(STATIC).then(c => c.addAll([
    "/lxp/", "/lxp/lxp.css", "/lxp/lxp.js", "/lxp/spa.js"
  ])));
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);

  // pages HTML 조각 캐싱 (stale-while-revalidate)
  if (url.pathname.startsWith("/lxp/pages/")) {
    e.respondWith((async () => {
      const cache = await caches.open(PAGES);
      const cached = await cache.match(e.request);
      const fetchPromise = fetch(e.request).then((res) => {
        cache.put(e.request, res.clone());
        return res;
      }).catch(() => cached);
      return cached || fetchPromise;
    })());
    return;
  }
});
