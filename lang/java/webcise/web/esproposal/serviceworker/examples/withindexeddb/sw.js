/**
 * TODO:
 * 練習として何か適当なオブジェクトをIndexedDBを使って読み書きする。
 */

// TODO: ServiceWorkerでmoduleをimportする方法が不明。以下はエラーになる。
// import swutils from "./swutils.js";

const checkResponse = ({caches, request, response, isCacheTarget}) => {
    if (response) {
        const time = new Date().toLocaleString();
        console.info(`Fetched (from cache storage): ${request.url} at ${time}`);
        return Promise.resolve(response);
    }

    const promise = fetch(request).then(response => {
        console.info(`Fetched (from server): ${request.url}`);
        if (isCacheTarget(request.url)) {
            return caches.open(getKey()).then(cache => {
                console.info(`Recovered cache: ${request.url}`);
                cache.put(request, response.clone());
                return response;
            });
        } else {
            console.info(`Not add to cache: ${request.url}`);
            return response;
        }
    });

    return promise;
};

const onActivate = ({caches, CACHE_KEY, CACHE_PREFIX}) => {
    return event => {
        console.info(`Activated: ${CACHE_KEY}`);
        event.waitUntil(caches.keys().then(keys => {
            return Promise.all(keys.map(key => {
                if (key.startsWith(CACHE_PREFIX) && key !== CACHE_KEY) {
                    console.info(`Delete: ${key}`);
                    return caches.delete(key);
                } else {
                    return Promise.resolve(false);
                }
            }));
        }));
    };
};

const onInstall = ({caches, CACHE_KEY, cacheTargets}) => {
    return event => {
        console.info(`Installed: ${CACHE_KEY}`);
        event.waitUntil(caches.open(CACHE_KEY)
            .then(cache => cache.addAll(cacheTargets)));
    };
};

const onFetch = ({caches, isCacheTarget}) => {
    return event => {
        console.info(`Fetched client id: ${event.clientId}`);
        const request = event.request;
        event.respondWith(caches.match(request)
            .then(response => checkResponse({caches, request, response, isCacheTarget})));
    };
};

const swutils = {
    onActivate, onInstall, onFetch
};

// setup

const CACHE_PREFIX = "sw-examples-withindexeddb";
const CONTEXT = "/webcise/";
const APP_BASE = `${CONTEXT}esproposal/serviceworker/examples/withindexeddb/`;
const VERSION = "1";
const CACHE_KEY = `${CACHE_PREFIX}-${VERSION}`;

const cacheTargets = [
    APP_BASE,
    `${APP_BASE}index.html`,
    `${APP_BASE}main.js`,
    `${APP_BASE}yellowarrow.png`,
    //`${CONTEXT}esproposal/serviceworker/images/blue.png`,
    `${CONTEXT}esproposal/serviceworker/images/red.png`
];

const isCacheTarget = url => cacheTargets.indexOf(url) >= 0;

// 一度ServiceWorkerがunregisterされるまでは何度ServiceWorkerスクリプトに
// 変更を行ってもactivateイベントは発生しない。installイベントはServiceWorker
// スクリプトに変更を加えてページを読み込みし直すたびに発生する。
self.addEventListener("activate", swutils.onActivate({caches, CACHE_KEY, CACHE_PREFIX}));
self.addEventListener("install", swutils.onInstall({caches, CACHE_KEY, cacheTargets}));
self.addEventListener("fetch", swutils.onFetch({caches, isCacheTarget}));
