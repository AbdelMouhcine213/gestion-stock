self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("gc-app").then(cache => {
      return cache.addAll([
        "./",
        "./index.html",
        "./achats.html",
        "./sales.html",
        "./stock.html",
        "./stats.html",
        "./settings.html",
        "./manifest.json"
      ]);
    })
  );
});
