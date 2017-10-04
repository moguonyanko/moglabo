const VERSION = "v1.01";

const CONTEXT_NAME = "logbook";

const SERVICE_NAME = "easycalculator";

const CACHE_KEY = `${SERVICE_NAME}-${VERSION}`;

// ServiceWorkerスクリプトを登録しているスクリプトを読み込んでいるページの
// ディレクトリがキャッシュに追加されていないとFirefoxではコンテンツデータ破損エラーになる。
// 定数RESOURCESの最初に指定しているディレクトリがそれに当たる。
// またスコープ配下でキャッシュに追加されなかったページをブラウザで参照した時も
// Firefoxではコンテンツデータ破損エラーになってしまう。回避するためにはスコープを小さくする。
// スコープを小さくするとユーティリティ関数をまとめたスクリプトのような共有のリソースは
// 普通スコープ外に配置されているためキャッシュに追加できない。そこでHTTPレスポンスヘッダー
// service-worker-allowedで指定したディレクトリ以下に配置してキャッシュに追加する。
// 以下のcore.js等がそれに該当する。
const RESOURCES = [
    `/${CONTEXT_NAME}/contents/${SERVICE_NAME}/`,
    `/${CONTEXT_NAME}/contents/${SERVICE_NAME}/index.html`,
    `/${CONTEXT_NAME}/styles/common.css`,
    `/${CONTEXT_NAME}/styles/easycalculator.css`,
    `/${CONTEXT_NAME}/scripts/core.js`,
    `/${CONTEXT_NAME}/scripts/easycalculator.js`,
    `/${CONTEXT_NAME}/config/aircrafts.json`,
    `/${CONTEXT_NAME}/config/ships.json`
];

const openCaches = async () => await caches.open(CACHE_KEY);

const refetch = async request => {
    const response = await fetch(request);
    const cache = await openCaches();
    cache.put(request, response.clone());
    return response;
};

const isNotCurrentCacheKey = key => {
    return key.startsWith(SERVICE_NAME) && key !== CACHE_KEY;
};

const getDeletePromise = cacheKey => {
    if (isNotCurrentCacheKey(cacheKey)) {
        console.log(`Delete cache: ${cacheKey}`);
        return caches.delete(cacheKey);
    } else {
        // CacheStorage.delete()はキャッシュが削除されなかった時にfalseでresolveする
        // Promiseを返す。この仕様に倣いこの関数でもPromise.resolve(false)を返す。
        return Promise.resolve(false);
    }
};

self.addEventListener("install", async event => {
    console.log(`Install: ${SERVICE_NAME}`);
    const cache = await openCaches();
    event.waitUntil(cache.addAll(RESOURCES));
});

self.addEventListener("fetch", event => {
    const request = event.request;
    console.log(`Fetch: ${request.url}`);
    event.respondWith(caches.match(request)
            .catch(async () => await refetch(request)));
});

// ブラウザの履歴が削除された後，またはServiceWorkerが一度unregisterされた後に
// 再びregisterされるとactivateイベントが発生する。
self.addEventListener("activate", event => {
    console.log(`Activate: ${SERVICE_NAME}`);
    event.waitUntil(caches.keys().then(keys => {
        return Promise.all(keys.map(key => getDeletePromise(key)));
    }));
});
