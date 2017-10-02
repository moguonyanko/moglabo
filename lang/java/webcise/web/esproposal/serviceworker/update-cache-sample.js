/**
 * 参考:
 * https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers
 */

const CACHE_PREFIX = "update-cache-sample-";

const CACHE_BASE = "/webcise/esproposal/serviceworker/images/";

const VERSION = "v1";

const cacheTargets = {
    [`${CACHE_PREFIX}v1`]: [
        `${CACHE_BASE}red.png`,
        `${CACHE_BASE}yellow.png`
    ],
    [`${CACHE_PREFIX}v2`]: [
        `${CACHE_BASE}green.png`,
        `${CACHE_BASE}orange.png`
    ]
};

const getKey = () => `${CACHE_PREFIX}${VERSION}`;

self.addEventListener("activate", event => {
    console.log("Activated update cache sample");
    event.waitUntil(caches.keys().then(keys => {
        return Promise.all(keys.map(key => {
            if (key.startsWith(CACHE_PREFIX)) {
                console.log(`Try to delete: ${key}`);
                // 少なくともFirefoxではCacheStorageのdeleteしてもCacheのkeyは残る。
                // TODO: installイベント後に登録されたはずのCacheが削除されてしまう。
                return caches.delete(key);
                // return Promise.resolve(true);
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
