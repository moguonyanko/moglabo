/**
 * @fileOverview
 * @name core.js
 * @version 0.1
 * 
 * @description 
 * logbookアプリケーションを制御する基幹となるスクリプトです。
 * あまり深い階層を持ったライブラリにせずシンプルで使い易くすることを心がけます。
 */

(function (win, doc) {
	"use strict";

	var lB = {};

	function noop() {}

	function log(txt) {
		win.console && win.console.log(txt);
	}

	/**
	 * @description 
	 * lB名前空間の直下に公開される汎用関数群です。
	 */
	var baseFunctions = {
		log : log,
		element : function (id, opt_doc) {
			return (opt_doc || doc).getElementById(id);
		},
		select : function (selector, opt_doc) {
			return (opt_doc || doc).querySelector(selector);
		},
		selectAll : function (selector, opt_doc) {
			return (opt_doc || doc).querySelectorAll(selector);
		},
		imagep : function (file) {
			return /^image\//.test(file.type);
		},
		hookDocumentLoad : function (listener) {
			win.addEventListener("DOMContentLoaded", listener, false);
		},
		hookClick : function (ele, listener, opt_capture) {
			ele.addEventListener("click", listener, opt_capture);
		},
		hookChange : function (ele, listener, opt_capture) {
			ele.addEventListener("change", listener, opt_capture);
		},
		forEach : function (src, func) {
			if (Array.isArray(src)) {
				src.forEach(func);
			} else {
				Array.prototype.forEach.call(src, func);
			}
		},
		map : function (src, func) {
			if (Array.isArray(src)) {
				return src.map(func);
			} else {
				return Array.prototype.map.call(src, func);
			}
		},
		list : function (size, opt_defaultValue) {
			var siz = size || 0,
				defValue = opt_defaultValue || null;

			/**
			 * new Array(number)で生成された配列のlengthプロパティはnumberと
			 * 同じ値になる。しかしこの配列には空行のみで要素が無いためforEachを
			 * 呼び出しても1回も引数の関数が評価されない。
			 * 要素の数だけ引数の関数が呼び出されるように生成した配列をnullや
			 * デフォルト値で埋めている。
			 */
			var lst = [];
			for (var i = 0; i < siz; i++) {
				lst.push(defValue);
			}

			return lst;
		},
		createBlobURL : function (blob) {
			return win.URL.createObjectURL(blob);
		},
		revokeBlobURL : function (url) {
			win.URL.revokeObjectURL(url);
		}
	};

	function externNamespace() {
		for (var name in baseFunctions) {
			lB[name] = baseFunctions[name];
		}

		win.lB = lB;
	}

	externNamespace();

}(window, document));
