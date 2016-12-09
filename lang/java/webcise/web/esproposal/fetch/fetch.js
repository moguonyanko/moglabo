((win, doc, g) => {
	"use strict";
	
	const funcs = {
		fetchSample(g) {
			const base = ".fetch-request-sample ";
			
			const loader = g.select(base + ".load-image"),
				area = g.select(base + ".result-image-area");
				
			const loadImage = async url => {
				/**
				 * 組み込みのfetch関数をasync/awaitで呼び出してBodyオブジェクトを
				 * 得る。awaitイコールthen1回分resolveすると考える。
				 */
				const response = await fetch(url);
				const blobUrl = URL.createObjectURL(await response.blob());
				
				const img = new Image();
				img.onload = () => {
					URL.revokeObjectURL(blobUrl);
					console.log("Revoked blob url:" + blobUrl);
				};
				img.src = blobUrl;
				
				return img;
			};
				
			loader.addEventListener("click", async () => {
				const url = "samplestar.png";
				const img = await loadImage(url);
				area.innerHTML = "";
				area.appendChild(img);
			});
		}
	};
	
	const init = () => {
		Object.values(funcs).map(f => f(g));
	};
	
	win.addEventListener("DOMContentLoaded", init);
	
})(window, document, goma);
