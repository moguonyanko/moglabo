/**
 * 参考:
 * https://developer.mozilla.org/en-US/docs/Web/API/ExtendableEvent/waitUntil
 */

const addToCache = async () => {
    const cache = await caches.open("custom-response-sample-v1");
    return cache.addAll([
        //"/webcise/gomakit.js", // スコープがコンテキストルートでないとキャッシュできない。
        //"/webcise/images/star.png",
        "/webcise/esproposal/serviceworker/",
        "/webcise/esproposal/serviceworker/index.html",
        "/webcise/esproposal/serviceworker/main.css",
        "/webcise/esproposal/serviceworker/main.js",
        //"/webcise/esproposal/serviceworker/images/", // Cacheに保存されない。エラーになっている？
        "/webcise/esproposal/serviceworker/images/blue.png"
    ]);
};

self.addEventListener("install", async event => {
    console.log("Custom response sample installed");
    event.waitUntil(await addToCache());
});

self.addEventListener("fetch", async event => {
    console.log("Custom response sample fetched");
    event.respondWith(caches.match(event.request).catch(async () => {
        console.log("Recovery request");
        const res = await fetch(event.request);
        const cache = await caches.open("custom-response-sample-v1");
        cache.put(event.request, res.clone());
        return res;
    }));
});
