const VERSION = "v1.04";
const CONTEXT_NAME = "logbook";
const APP_NAME = "easycalculator";
const APP_ROOT = `/${CONTEXT_NAME}/contents/${APP_NAME}/`;
const CACHE_KEY = `${APP_NAME}-${VERSION}`;

// ServiceWorkerスクリプトを登録しているスクリプトを読み込んでいるページの
// ディレクトリがキャッシュに追加されていないとFirefoxではコンテンツデータ破損エラーになる。
// 定数RESOURCESの最初に指定しているディレクトリがそれに当たる。
// またスコープ配下でキャッシュに追加されなかったページをブラウザで参照した時も
// Firefoxではコンテンツデータ破損エラーになってしまう。回避するためにはスコープを小さくする。
// スコープを小さくするとユーティリティ関数をまとめたスクリプトのような共有のリソースは
// 普通スコープ外に配置されているためキャッシュに追加できない。
// そこでHTTPレスポンスヘッダーservice-worker-allowedで指定したディレクトリ以下に
// 該当ファイルを配置してキャッシュに追加する。以下のcore.jsがそれに該当する。
const RESOURCES = [
    APP_ROOT,
    `${APP_ROOT}index.html`,
    `${APP_ROOT}styles/easycalculator.css`,
    `${APP_ROOT}scripts/easycalculator.js`,
    `${APP_ROOT}scripts/aircrafts.json`,
    `${APP_ROOT}scripts/ships.json`,
    `/${CONTEXT_NAME}/favicon.ico`,
    `/${CONTEXT_NAME}/styles/common.css`,
    `/${CONTEXT_NAME}/scripts/core.js`
];

const openCaches = async () => await caches.open(CACHE_KEY);

const isNotCurrentCacheKey = key => {
    return key.startsWith(APP_NAME) && key !== CACHE_KEY;
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

const getErrorResponse = url => {
    const page = `<strong>Cannot get resorces</strong><p>${url}</p>`;
    const response = new Response(page, {
        headers: {
            "Content-Type": "text/html"
        }
    });
    return response;
};

self.addEventListener("install", async event => {
    console.log(`Install: ${APP_NAME}`);
    const cache = await openCaches();
    event.waitUntil(cache.addAll(RESOURCES));
});

const checkResponse = (request, response) => {
    if (response) {
        console.log(`Fetch(from sw): ${request.url}`);
        return response;
    }

    return fetch(request).then(async response => {
        console.log(`Fetch(from server): ${request.url}`);
        return openCaches().then(cache => {
            cache.put(request, response.clone());
            return response;
        });
    });
};

self.addEventListener("fetch", event => {
    const request = event.request;
    event.respondWith(caches.match(request)
            .then(response => checkResponse(request, response))
            .catch(() => getErrorResponse(request.url)));
});

// ブラウザの履歴が削除された後，またはServiceWorkerが一度unregisterされた後に
// 再びregisterされるとactivateイベントが発生する。
self.addEventListener("activate", event => {
    console.log(`Activate: ${APP_NAME}`);
    event.waitUntil(caches.keys().then(keys => {
        return Promise.all(keys.map(key => getDeletePromise(key)));
    }));
});
