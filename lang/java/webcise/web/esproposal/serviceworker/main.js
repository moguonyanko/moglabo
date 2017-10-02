((win, doc, nav, g) => {
	"use strict";
    
    const q = (selector, base) => {
        return (base || doc).querySelector(selector);
    };
    
    const qa = (selector, base) => {
        return (base || doc).querySelectorAll(selector);
    };
    
    const pr = (target, content) => {
        target.innerHTML += content + "<br />";
    };
    
    const cl = target => target.innerHTML = "";
    
    const sw = nav.serviceWorker;
	
    const enableSW = () => {
        return "serviceWorker" in nav;
    };
    
    /**
     * デフォルトはこのディレクトリのみをスコープとする。
     * 自己証明書を用いたHTTPSで通信している場合，Chromeでは
     * セキュリティエラーになってしまう。
     * Chromeの起動オプションを変更することで対応できる。
     */
    const register = async ({url, scope}) => {
        const registration = await sw.register(url, {scope});
        return registration;
    };
    
    const getCacheKeys = async pattern => {
        if (pattern) {
            const regex = new RegExp(pattern);
            return (await caches.keys()).filter(key => regex.test(key));
        } else {
            return await caches.keys();
        }
    };
    
    const getCacheKeyString = async (pattern, separator = ",") => {
        return (await getCacheKeys(pattern)).join(separator);
    };
    
	const targets = {
		registerSample(g) {
			const base = ".register-sample ";
			
			const regEle = doc.querySelector(base + ".register-service-worker"),
				clearEle = doc.querySelector(base + ".clear-result"),
				output = doc.querySelector(base + ".result-area");
			
            const checkReady = () => {
                sw.ready.then(registration => g.println(output, `Ready: ${JSON.stringify(registration)}`))
                        .catch(err => g.println(output, `Ready failed: ${err.message}`));
                        // Promise.prototype.finallyは未対応ブラウザが多い。
                        //.finally(() => g.println(output, "Ready!"));
            };
            
			const regFunc = async () => {
				if (!enableSW()) {
					g.println(output, "Cannot use Service Worker");
                    return;
                }
                
                try {
                    // このディレクトリのみをスコープとする。
                    const scope = "./";
                    // 自己証明書を用いたHTTPSで通信している場合，
                    // Chromeではセキュリティエラーになってしまう。
                    // Chromeの起動オプションを変更することで対応できる。
                    const registration = await sw.register("register-sample.js", {scope});
                    console.log(registration);
                    const active = registration.active;
                    g.println(output, `${active.scriptURL} : ${active.state}`);
                } catch(err) {
    				g.println(output, err.message);
                } finally {
                    checkReady();
                }
			};
			
			regEle.addEventListener("click", regFunc);
			clearEle.addEventListener("click", () => g.clear(output));
		},
        cacheSample() {
            if(!enableSW()){
                return;
            }
            
            const base = document.querySelector(".cache-sample");
            const resultArea = base.querySelector(".result-area");
            
            base.querySelector(".register").addEventListener("click", async () => {
                const scope = "/webcise/esproposal/serviceworker/";
                const reg = await register({
                    url: "cache-sample.js", scope
                });
                resultArea.innerHTML += JSON.stringify(reg) + "<br />";
                resultArea.innerHTML += (await getCacheKeys()).join(",") + "<br />";
            });
            
            base.querySelector(".clear").addEventListener("click", () => {
                resultArea.innerHTML = "";
            });
        },
        customResponseSample() {
            const base = q(".custom-response-sample"),
                resultArea = q(".result-area", base),
                resultImage = q(".result-image", base),
                adder = q(".adder", base),
                getter = q(".getter", base),
                clearer = q(".clearer", base);
            
            getter.addEventListener("click", () => {
                const url = "./images/blue.png";
                const img = doc.createElement("img");
                img.onload = () => resultImage.appendChild(img);
                img.src = url;
            });
            
            clearer.addEventListener("click", () => {
                cl(resultArea);
                cl(resultImage);
            });
            
            if(!enableSW()){
                return;
            }
            
            adder.addEventListener("click", async () => {
                // ここでコンテキストルートをスコープにするにはServiceWorkerスクリプトを
                // 移動するかService-Worker-Allowedヘッダーを使用しなければならない。
                const scope = "/webcise/";
                //const scope = "/webcise/esproposal/serviceworker/";
                const registration = await register({
                    url: "custom-response-sample.js", scope
                });
                const keyStr = await getCacheKeyString("custom-response-sample");
                console.log(keyStr);
                pr(resultArea, keyStr);
            });
        }
	};
	
	const init = () => Object.values(targets).forEach(t => t(g));
	
	win.addEventListener("DOMContentLoaded", init);
})(window, document, navigator, goma);
