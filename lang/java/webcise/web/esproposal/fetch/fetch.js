((win, doc, g) => {
	"use strict";
	
	const getResultArea = base => g.select(base + ".result-area");

	const dumpHeaders = headers => {
		Array.from(headers.entries()).forEach(header => {
			const [key, value] = header;
			console.log(`${key} : ${value}`);
		});
	};
	
	const getRequest = (resource, args = {
		method = "GET",
		mode = "cors",
		headers = new Headers({
			"X-webcise-sample-default-header": "WEBSICE_DEFAULT"
		})
	} = {}) => {
		const request = new Request(resource, args);
		
		console.log(request);
		
		return request;
	};
	
	const validContentType = (response, type) => {
		const contentType = response.headers.get("content-type");
		
		if (contentType && contentType.indexOf(type) >= 0) {
			return true;
		} else {
			return false;
		}
	};
	
	/**
	 * 組み込みのfetch関数をasync/awaitで呼び出してBodyオブジェクトを
	 * 得る。awaitイコールthen1回分resolveすると考える。
	 */
	const doFetch = async request => {
		const response = await fetch(request);
		dumpHeaders(response.headers);

		if (!response.ok) {
			throw new Error("Fetch error!:" + response.statusText + " " + response.status);
		}
		
		return response;
	};
	
	const loadImage = async (resource, options = {}) => {
		/**
		 * fetch関数にresourceとoptionsを直接渡しても問題無い。
		 */
		const response = await doFetch(getRequest(resource, options));
		if (!validContentType(response, "image/")) {
			throw new Error("Haven't got image");
		}
		
		const blobUrl = URL.createObjectURL(await response.blob());

		const img = new Image();
		img.onload = () => {
			URL.revokeObjectURL(blobUrl);
			console.log("Revoked blob url:" + blobUrl);
		};
		img.src = blobUrl;

		return img;
	};

	const funcs = {
		fetchSample(g) {
			const base = ".fetch-request-sample ";

			const loader = g.select(base + ".load-image"),
				area = getResultArea(base);

			loader.addEventListener("click", async () => {
				const resource = "samplestar.png";
				const img = await loadImage(resource);
				area.innerHTML = "";
				area.appendChild(img);
			});
		},
		headersSample() {
			const base = ".headers-request-sample ";

			const loader = g.select(base + ".load-image"),
				area = getResultArea(base);

			loader.addEventListener("click", async () => {
				const headers = new Headers();

				const header1 = "X-webcise-sample-header-numbers",
					header2 =  "X-webcise-sample-header-names";
					
				headers.append(header1, "123");
				headers.append(header1, "456");
				headers.append(header1, "789");
				
				headers.set(header2, "foo");
				headers.set(header2, "bar");
				headers.set(header2, "baz");
				
				dumpHeaders(headers);

				const options = {
					method: "GET",
					headers,
					mode: "cors",
					cache: "default"
				};

				const resource = "samplestar.png";
				const img = await loadImage(resource, options);
				area.innerHTML = "";
				area.appendChild(img);
			});
		},
		requestSample() {
			const base = ".new-request-sample ";

			const loader = g.select(base + ".load-image"),
				area = getResultArea(base);

			loader.addEventListener("click", async () => {
				const options = {
					method: "GET",
					headers: {
						"X-webcise-sample-header-value": "SAMPLEWEBCISE"
					},
					mode: "cors",
					cache: "default"
				};
				const resource = "samplestar.png";
				const img = await loadImage(resource, options);
				area.innerHTML = "";
				area.appendChild(img);
			});
		},
		modeSelectionSample() {
			const base = ".request-mode-sample ";

			const loader = g.select(base + ".load-image"),
				area = getResultArea(base),
				modeEles = g.selectAll(base + ".mode-type-select-panel input[type='radio']");
			
			/**
			 * クロスオリジンになるようなリソースを指定する。
			 */
			const resource = "//localhost/webcise/esproposal/fetch/samplestar.png";
			
			const getMode = () => {
				const eles = Array.from(modeEles).filter(ele => ele.checked);
				
				if (eles.length > 0) {
					return eles[0].value;
				} else {
					/**
					 * FirefoxではRequestオブジェクト生成時の引数に渡すmodeに
					 * nullや空文字を渡すとデフォルトのmodeを使おうとせずエラーになる。
					 */
					return undefined;
				}
			};
			
			loader.addEventListener("click", async () => {
				const options = {
					method: "GET",
					mode: getMode(),
					cache: "no-cache",
					/**
					 * HTTPレスポンスヘッダのAccess-Control-Allow-Credentialsに
					 * trueが指定されていないとcredentialsにincludeを指定してリクエスト
					 * した時エラーになる。Access-Control-Allow-Credentialsに
					 * trueを指定する場合，Access-Control-Allow-Originに*ではなく
					 * 明示的なオリジンを指定しなければやはりエラーになる。
					 * Access-Control-Allow-OriginにはHTTPリクエストヘッダの
					 * Originに指定されている値と同じ値を指定する。
					 * 
					 * 参考:
					 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS
					 */
					credentials: "include"
				};
				const img = await loadImage(resource, options);
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
