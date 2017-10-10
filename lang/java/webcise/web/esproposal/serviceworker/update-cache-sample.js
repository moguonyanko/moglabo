/**
 * 参考:
 * https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers
 * https://jakearchibald.com/2016/caching-best-practices/
 */

const CACHE_PREFIX = "update-cache-sample-";

const CONTEXT = "/webcise/";

const APP_BASE = `${CONTEXT}esproposal/serviceworker/`;

const CACHE_BASE = `${APP_BASE}images/`;

const VERSION = "v2";

const COMMON_RESOURCES = [
    `${CONTEXT}gomakit.js`,
    `${CONTEXT}images/star.png`,
    APP_BASE,
    `${APP_BASE}index.html`,
    `${APP_BASE}main.css`,
    `${APP_BASE}main.js`
];

const cacheTargets = {
    [`${CACHE_PREFIX}v1`]: COMMON_RESOURCES.concat([
        `${CACHE_BASE}green.png`,
        `${CACHE_BASE}orange.png`
    ]),
    [`${CACHE_PREFIX}v2`]: COMMON_RESOURCES.concat([
        `${CACHE_BASE}red.png`,
        `${CACHE_BASE}yellow.png`
    ])
};

const getKey = () => `${CACHE_PREFIX}${VERSION}`;

self.addEventListener("activate", event => {
    console.log("Activated update cache sample");
    event.waitUntil(caches.keys().then(keys => {
        return Promise.all(keys.map(key => {
            if (key.startsWith(CACHE_PREFIX) && key !== getKey()) {
                console.log(`Try to delete: ${key}`);
                return caches.delete(key);
            } else {
                return Promise.resolve(false);
            }
        }));
    }));
});

self.addEventListener("install", async event => {
    const key = getKey();
    const cache = await caches.open(key);
    console.log(`${key} is installed`);
    event.waitUntil(cache.addAll(cacheTargets[key]));
});

self.addEventListener("fetch", async event => {
    console.log(`Fetched!: ${event.request.url}`);
    event.respondWith(caches.match(event.request)
            .catch(async event => {
                // TODO: CacheStorageにリソースが存在しない状態でもcatchブロックが評価されない。
                console.log("Recovery request");
                const res = await fetch(event.request);
                (await caches.open(getKey())).put(event.request, res.clone());
                return res;
            }));
});
