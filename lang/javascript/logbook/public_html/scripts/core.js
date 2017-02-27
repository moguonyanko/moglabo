/**
 * @fileOverview
 * @name core.js
 * @version 0.1
 * 
 * @description 
 * logbookアプリケーションを制御するための共通スクリプトです。
 */

(((win, doc) => {
    "use strict";

    const CONTEXT_NAME = "logbook";

    const lB = {};

    const noop = () => {
    };

    const identity = v => v;

    const forEach = (src, func) => {
        if (Array.isArray(src)) {
            src.forEach(func);
        } else {
            Array.from(src).forEach(func);
        }
    };

    const map = (src, func) => {
        if (Array.isArray(src)) {
            return src.map(func);
        } else {
            /**
             * Iteratorなどmapメソッドを持っていないオブジェクトは
             * 一度配列に変換してmapメソッドが使えるようにする。
             */
            return Array.from(src).map(func);
        }
    };

    const reduce = (src, func) => {
        if (Array.isArray(src)) {
            return src.reduce(func);
        } else {
            return Array.from(src).reduce(func);
        }
    };

    class InvalidStateError extends Error {
        constructor( { result = {}, message = "", status = 500 } = {}) {
            super(message);
            this.result = result;
            this.status = status;
        }
    }

    /**
     * 現在はGETリクエストのみの対応となっている。
     */
    const doRequest = (path, {
    type = "json", /* 空文字をデフォルト値にするとDOMStringになってしまう。 */
            onsuccess = () => {},
            onerror = () => {},
            timeout = 0 /* 単位はミリ秒。デフォルトはタイムアウト無し。 */
    } = {}) => {
        const xhr = new XMLHttpRequest();

        xhr.responseType = type;
        xhr.timeout = timeout;

        xhr.onreadystatechange = evt => {
            if (xhr.status >= 400) {
                onerror(new InvalidStateError({
                    status: xhr.status,
                    message: xhr.statusText
                }));
                xhr.abort();
                return;
            }

            if (xhr.readyState === XMLHttpRequest.DONE) {
                /**
                 * responseTypeにjsonを指定した時はパース済みのJSONのオブジェクトが
                 * 返されてくる。従ってJSON.parseを適用するとシンタックスエラーに
                 * なってしまう。
                 */
                onsuccess(xhr.response);
            }
        };

        xhr.ontimeout = err => {
            onerror(new InvalidStateError({
                status: xhr.status,
                message: err.message
            }));
            xhr.abort();
        };

        xhr.open("GET", path);
        xhr.send(null);
    };

    const select = (selector, opt_doc) => {
        return (opt_doc || doc).querySelector(selector);
    };

    const selectAll = (selector, opt_doc) => {
        return (opt_doc || doc).querySelectorAll(selector);
    };

    const toClassSelector = ele => {
        return map(ele.classList, cls => "." + cls).join(" ");
    };

    /**
     * @name baseFunctions
     * @type Object
     * @description 
     * lB名前空間の直下に公開される汎用関数群です。
     */
    const baseFunctions = {
        noop: noop,
        identity: identity,
        select: select,
        selectAll: selectAll,
        forEach: forEach,
        map: map,
        reduce: reduce,
        InvalidStateError: InvalidStateError,
        list(size, opt_defaultValue) {
            const siz = size || 0,
                    defValue = opt_defaultValue || null;

            /**
             * new Array(number)で生成された配列のlengthプロパティはnumberと
             * 同じ値になる。しかしこの配列には空行のみで要素が無いためforEachを
             * 呼び出しても1回も引数の関数が評価されない。
             * 要素の数だけ引数の関数が呼び出されるように生成した配列をnullや
             * デフォルト値で埋めている。
             */
            const lst = [];
            for (let i = 0; i < siz; i++) {
                lst.push(defValue);
            }

            return lst;
        },
        createBlobURL(blob) {
            return win.URL.createObjectURL(blob);
        },
        revokeBlobURL(url) {
            win.URL.revokeObjectURL(url);
        },
        loadConfig(path, { type = "json",
                onsuccess = () => {}, onerror = () => {}, timeout } = {}) {
            if (!path) {
                return;
            }

            let requestPath = path,
                    onlyFileName = !path.includes("/");

            if (onlyFileName) {
                requestPath = "/" + CONTEXT_NAME + "/config/" + path;
            }

            doRequest(requestPath, {
                type, onsuccess, onerror, timeout
            });
        },
        replaceElement(base, newEle) {
            const selector = toClassSelector(newEle);
            const oldEle = select(selector, base);
            if (oldEle) {
                base.replaceChild(newEle, oldEle);
            } else {
                base.appendChild(newEle);
            }
        },
        /**
         * Promiseの関数が非同期で実行される場合はresolveやrejectの呼び出しが
         * コールバック関数内で行われないと期待した結果が得られない。
         */
        funcall(funcs, { oncomplete = arg => arg,
                onerror = err => { throw err; } } = {}) {
            /**
             * 各Promiseでresolveを呼び出していても，Promise.all使用時は
             * 全てのPromiseの処理が完了した後の1回しかthenの関数は呼び出されない。
             * resolveの関数が実行される回数はthenの数と同じということである。
             * 後続のthenが引数として受け取りたい値はその前のthenで返す。
             */
            Promise.all(lB.map(funcs, f => new Promise(f)))
                    .then(oncomplete)
                    .catch(onerror);
        },
        /**
         * @deprecated 
         * 組み込み関数のfetchを使用すること。
         */
        fetch(url, {
        method = "GET",
                responseType = "json",
                data = null,
                timeout = 0
        } = {}) {

            return new Promise(function (resolve, reject) {
                const xhr = new XMLHttpRequest();
                xhr.open(method, url);
                xhr.responseType = responseType;
                xhr.timeout = timeout;
                xhr.onreadystatechange = () => {
                    if (xhr.readyState === XMLHttpRequest.DONE) {
                        if (xhr.status < 400) {
                            resolve(xhr.response);
                        } else {
                            reject(new Error("Request error:" + xhr.statusText));
                        }
                    }
                };
                xhr.ontimeout = () => reject(new Error("Request timeout"));
                xhr.onerror = evt => reject(new Error(evt));
                xhr.send(data);
            });
        },
        objToMap(obj, opt_valueFunc = (k, v) => v) {
            const param = Object.keys(obj)
                    .map(k => [k, opt_valueFunc(k, obj[k])]);
            return new Map(param);
        },
        arrayToMap(array = [], opt_keyFunc = k => k, opt_valueFunc = v => v) {
            const param = array.map(v => [opt_keyFunc(v), opt_valueFunc(v)]);
            return new Map(param);
        },
        async getConfig(name) {
            const url = `/${CONTEXT_NAME}/config/` + name;
            const json = await this.fetch(url);

            if (!json) {
                throw new Error(`設定ファイル読み込み失敗: ${url}`);
            }

            return json;
        },
        /**
         * @todo
         * 実装中
         * エラーを呼び出し側に伝搬したい。
         */
        init(initFuncs) {
            const runInit = funcs => {
                try {
                    for (let f of funcs) {
                        f(lB);
                    }
                } catch (err) {
                    throw new InvalidStateError("Init error:" + err.message);
                }
            };

            win.addEventListener("DOMContentLoaded", async () => {
                await runInit(initFuncs);
            });
        }
    };

    const externNamespace = () => {
        for (let name in baseFunctions) {
            lB[name] = baseFunctions[name];
        }

        win.lB = lB;
    };

    externNamespace();

})(window, document));
