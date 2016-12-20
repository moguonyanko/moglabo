((win, doc, nav, g) => {
	"use strict";
	
	const targets = {
		registerSample(g) {
			const base = ".register-sample ";
			
			const regEle = doc.querySelector(base + ".register-service-worker"),
				clearEle = doc.querySelector(base + ".clear-result"),
				output = doc.querySelector(base + ".result-area");
			
			const regFunc = async () => {
				if ("serviceWorker" in nav) {
					const options = {
						scope: "./"
					};
					/**
					 * registerメソッドに渡すスクリプトのURLはHTTPS等セキュアな
					 * スキームを使用したオリジンで構成されていなければChromeでは
					 * エラーになる。Firefoxでは何も起きない。
					 * Firefoxはページを読み込んだ際にregisterの引数のスクリプトを
					 * 読み込んでしまう。
					 */
					const registration = await nav.serviceWorker.register("worker.js", options);
					console.log(registration);
					const sw = registration.active;
					g.println(output, `${sw.scriptURL} : ${sw.state}`);
				} else {
					g.println(output, "Cannot use Service Worker");
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
