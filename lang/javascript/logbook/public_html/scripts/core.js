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

	/**
	 * @name baseFunctions
	 * @type Object
	 * @description 
	 * lB名前空間の直下に公開される汎用関数群です。
	 */
	const baseFunctions = {
		noop : () => {},
		element (id, opt_doc) {
			return (opt_doc || doc).getElementById(id);
		},
		select (selector, opt_doc) {
			return (opt_doc || doc).querySelector(selector);
		},
		selectAll (selector, opt_doc) {
			return (opt_doc || doc).querySelectorAll(selector);
		},
		forEach (src, func) {
			if (Array.isArray(src)) {
				src.forEach(func);
			} else {
				Array.from(src).forEach(func);
			}
		},
		map (src, func) {
			if (Array.isArray(src)) {
				return src.map(func);
			} else {
				/**
				 * Iteratorなどmapメソッドを持っていないオブジェクトは
				 * 一度配列に変換してmapメソッドが使えるようにする。
				 */
				return Array.from(src).map(func);
			}
		},
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
