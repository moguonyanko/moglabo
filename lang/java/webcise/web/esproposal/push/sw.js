const VERSION = "v1";

self.addEventListener("install", async event => {
    const cache = await caches.open(`Push-API-Sample-${VERSION}`);
    event.waitUntil(cache.addAll([
        "./",
        "./index.html",
        "./main.js",
        "./main.css"
    ]));
});

self.addEventListener("fetch", event => {
    const request = event.request;
    event.respondWith(caches.match(request));
});
