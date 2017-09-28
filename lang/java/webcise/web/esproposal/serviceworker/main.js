((win, doc, nav, g) => {
	"use strict";
    
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
    
    const getCacheKeys = async () => {
        return await caches.keys();
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
        }
	};
	
	const init = () => Object.values(targets).forEach(t => t(g));
	
	win.addEventListener("DOMContentLoaded", init);
})(window, document, navigator, goma);
