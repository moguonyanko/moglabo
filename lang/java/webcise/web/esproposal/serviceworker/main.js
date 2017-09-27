((win, doc, nav, g) => {
	"use strict";
    
    const sw = nav.serviceWorker;
	
	const targets = {
		registerSample(g) {
			const base = ".register-sample ";
			
			const regEle = doc.querySelector(base + ".register-service-worker"),
				clearEle = doc.querySelector(base + ".clear-result"),
				output = doc.querySelector(base + ".result-area");
			
            const checkReady = () => {
                sw.ready.then(registration => g.println(output, "Ready!"))
                        .catch(err => g.println(output, `Ready failed: ${err.message}`));
                        // Promise.prototype.finallyは未対応ブラウザが多い。
                        //.finally(() => g.println(output, "Ready!"));
            };
            
			const regFunc = async () => {
				if (!("serviceWorker" in nav)) {
					g.println(output, "Cannot use Service Worker");
                    return;
                }
                
                checkReady();
                
                try {
                    // このディレクトリのみをスコープとする。
                    const scope = "./";
                    // 自己証明書を用いたHTTPSで通信している場合，
                    // Chromeではセキュリティエラーになってしまう。
                    // Chromeの起動オプションを変更することで対応できる。
                    const registration = await sw.register("worker.js", {scope});
                    console.log(registration);
                    const active = registration.active;
                    g.println(output, `${active.scriptURL} : ${active.state}`);
                } catch(err) {
    				g.println(output, err.message);
                }
			};
			
			regEle.addEventListener("click", regFunc);
			clearEle.addEventListener("click", () => g.clear(output));
		}
	};
	
	const init = () => {
		Object.values(targets).forEach(t => t(g));
	};
	
	win.addEventListener("DOMContentLoaded", init);
})(window, document, navigator, goma);
