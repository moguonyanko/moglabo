((win, doc, loc, math) => {
    "use strict";

    // ECMAScriptで完結しているコードとそうでないコードは分離する。

    // Reference: MDN Math.random()
    const getRandomValue = ({ min, max }) => {
        const r = math.random() * (max - min + 1) + min;
        return math.floor(r);
    };

    const getRandomValues = ({ size, min, max }) => {
        const values = [];
        for (let i = 0; i < size; i++) {
            values.push(getRandomValue({min, max}));
        }
        return values;
    };

    // DOM utility

    const getSelectedElementValue = ({base, selector}) => {
        const eles = Array.from(base.querySelectorAll(selector))
                .filter(ele => ele.checked);
        return eles[0] ? eles[0].value : null;
    };

    const accessControlAllowOriginSample = () => {
        const base = doc.getElementById("access-control-allow-origin-sample");
        const result = base.querySelector(".result");

        const createWorker = ({ host, workerFileName, onmessage }) => {
            const urls = [
                loc.protocol + "//",
                host,
                loc.pathname,
                workerFileName
            ];
            const worker = new Worker(urls.join(""));
            worker.onmessage = evt => {
                const res = evt.data.result;
                onmessage(res);
            };
            return worker;
        };

        const getHost = () => {
            const hostEles = doc.getElementsByName("select-host");
            return Array.from(hostEles).filter(ele => ele.checked)[0].value;
        };

        const getAddingArgs = () => {
            const size = parseInt(base.querySelector(".adding-values-size").value);
            const min = parseInt(base.querySelector(".adding-values-min").value);
            const max = parseInt(base.querySelector(".adding-values-max").value);
            return {size, min, max};
        };

        const println = txt => result.innerHTML += txt + "<br />";

        base.querySelector(".run").addEventListener("click", () => {
            const host = getHost();
            const workerFileName = "calcworker.js";
            const onmessage = resultValue => println(resultValue);
            try {
                const worker = createWorker({host, workerFileName, onmessage});
                const values = getRandomValues(getAddingArgs());
                println(`adding:${values}`);
                worker.postMessage({values});
            } catch (err) {
                println(err.message);
            }
        });

        base.querySelector(".clear").addEventListener("click", () => {
            result.innerHTML = "";
        });
    };

    const preflightRequest = () => {
        const calculation = {
            async post( { values = [], url, useCustomHeader = false } = {}) {
                if (values.length <= 0 || !url) {
                    throw new Error("Invalid arguments");
                }
                const op = "ADD";
                // URLSearchParamsでPOSTリクエストを行うと自動的にContent-Typeは
                // application/x-www-form-urlencoded になる。
                const body = new URLSearchParams();
                body.append("operator", "ADD");
                values.forEach(v => body.append("parameter", v));

                const method = "POST";
                const headers = new Headers();
                if (useCustomHeader) {
                    //headers.append("Content-Type", "application/xml");
                    // カスタムヘッダーを用いるだけではプリフライトリクエストが行われない。
                    headers.append("X-MYCUSTOMHEADER", "CustomHeaderTest");
                }
                const request = new Request(url, {method, body, headers});
                const response = await fetch(request);
                if (!response.ok) {
                    throw new Error(`Adding failed:${values}`);
                }
                return await response.json();
            },
            async delete( { url } = {}) {
                if (!url) {
                    throw new Error("Invalid arguments");
                }
                // DELETEリクエストをしてもプリフライトリクエストされない。
                const method = "DELETE";
                const request = new Request(url, {method});
                const response = await fetch(request);
                if (!response.ok) {
                    throw new Error(`Delete request failed`);
                }
                return await response.json();
            }
        };

        const throwError = msg => {
            throw new Error(msg);
        };

        const doCalc = async ({ method, useCustomHeader = false } = {}) => {
            const values = getRandomValues({
                size: 5,
                min: 1,
                max: 10
            });
            const url = "/webcise/Calculator";
            const func = calculation[method.toLowerCase()] ||
                    throwError(`${method} is unsupported`);
            return await func({values, useCustomHeader, url});
        };

        const saveXML = async ({useCustomHeader = false} = {}) => {
            const url = "/webcise/SaveXML";
            const body = `<?xml version="1.0"><sample>test</sample>`;
            const method = "POST";
            
            // Fetchを使ってもXMLHttpRequestを使ってもプリフライトリクエストが
            // 行われない。ローカルのリクエストに対しては決して行われないのだろうか。
            
            /*
             const headers = new Headers();
             headers.append("Content-Type", "application/xml");
             if (useCustomHeader) {
             headers.append("X-MYCUSTOMHEADER", "XML sample test");
             }
             const request = new Request(url, {method, body, headers});
             const response = await fetch(request);
             if (!response.ok) {
             throw new Error(`XML request failed`);
             }
             return await response.json();
             */
            
            // Fetchを用いた上のコードとXMLHttpRequestを用いた下のコードはほぼ同じ。

            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open(method, url, true);
                if (useCustomHeader) {
                    xhr.setRequestHeader("Content-Type", "application/xml");
                    xhr.setRequestHeader("X-MYCUSTOMHEADER", "XML sample test");
                }
                xhr.onload = () => resolve(JSON.parse(xhr.responseText));
                xhr.onerror = () => reject(new Error(`XML request failed`));
                // XMLHttpRequestで値を返すPromiseを書く場合は
                // onreadystatechangeではなくonloadプロパティを使う。
                /*
                 xhr.onreadystatechange = () => {
                 if (this.readyState === XMLHttpRequest.DONE) {
                 const r = JSON.parse(xhr.responseText);
                 resolve(r);
                 }
                 };
                 */
                xhr.send(body);
            });
        };

        const base = doc.getElementById("preflight-request-sample");
        const result = base.querySelector(".result");

        const isUseCustomHeader = () => base.querySelector(".use-custom-header").checked;
        const getMethod = () => getSelectedElementValue({base, selector: ".method"});
        const getContentType = () => getSelectedElementValue({base, selector: ".content-type"});

        base.querySelector(".run").addEventListener("click", async () => {
            const useCustomHeader = isUseCustomHeader();
            const method = getMethod();
            const contentType = getContentType();
            let content;
            if (contentType === "application/xml") {
                content = await saveXML({useCustomHeader});
            } else {
                content = await doCalc({useCustomHeader, method});
            }
            result.innerHTML += `${JSON.stringify(content)}<br />`;
        });

        base.querySelector(".clear").addEventListener("click", () => {
            result.innerHTML = "";
        });
    };

    const samples = [
        accessControlAllowOriginSample,
        preflightRequest
    ];

    win.addEventListener("DOMContentLoaded", () => samples.forEach(s => s()));
})(window, document, location, Math);
