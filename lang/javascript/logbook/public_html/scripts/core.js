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

	const lB = {};
	
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
				onerror({
					status: xhr.status,
					message: xhr.statusText
				});
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
			onerror({
				status: xhr.status,
				message: err.message
			});
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
		select: select,
		selectAll: selectAll,
		forEach: forEach,
		map: map,
		reduce: reduce,
		list (size, opt_defaultValue) {
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
		createBlobURL (blob) {
			return win.URL.createObjectURL(blob);
		},
		revokeBlobURL (url) {
			win.URL.revokeObjectURL(url);
		},
		loadConfig (path, { type = "json", 
			onsuccess = () => {}, onerror = () => {}, timeout } = {}) {
			if (!path) {
				return;
			}
			
			let requestPath = path, 
				onlyFileName = !path.includes("/");
			
			if (onlyFileName) {
				requestPath = "/logbook/config/" + path;
			} 
			
			doRequest(requestPath, {
				type, onsuccess, onerror, timeout
			});
		},
		replaceElement (base, newEle) {
			const selector = toClassSelector(newEle);
			const oldEle = select(selector, base);
			if (oldEle) {
				base.replaceChild(newEle, oldEle);
			} else {
				base.appendChild(newEle);
			}
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
