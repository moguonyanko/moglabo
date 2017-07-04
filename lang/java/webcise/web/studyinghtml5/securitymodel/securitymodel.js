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
        const testAdd = async (useCustomHeader = false) => {
            const values = getRandomValues({ 
                size: 5,
                min: 1,
                max: 10
            });
            const url = "/webcise/Calculator";
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
                // TODO: カスタムヘッダーを用いるだけではプリフライトリクエストが行われない。
                headers.append("X-MyCustomHeader", "CustomHeaderTest");
            }
            const request = new Request(url, { method, body, headers });
            const response = await fetch(request);
            if (!response.ok) {
                throw new Error(`Adding failed:${values}`);
            }
            
            return await response.json();
        };

        const base = doc.getElementById("preflight-request-sample");
        const result = base.querySelector(".result");

        base.querySelector(".run").addEventListener("click", async () => {
            const useCustomHeader = base.querySelector(".use-custom-header").checked;
            const answer = await testAdd(useCustomHeader);
            result.innerHTML += `${JSON.stringify(answer)}<br />`;
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
