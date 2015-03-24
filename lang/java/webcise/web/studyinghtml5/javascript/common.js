(function(win) {
	"use strict";

	win.commonNS = win.my = {
		log : function() {
			console.log.apply(null, arguments);
		},
		println : function(ele, txt, override) {
			var prop;

			if ("value" in ele) {
				prop = "value";
			} else {
				prop = "innerHTML";
			}

			if (override) {
				ele[prop] = txt + "\n";
			} else {
				ele[prop] += txt + "\n";
			}
		},
		ref : function(id, doc) {
			return (doc || document).getElementById(id);
		},
		refs : function(name, doc) {
			/**
			 * デフォルト値としては配列ではなくNodeListを返すべき。 
			 * しかしNodeListのコンストラクタは呼び出せない。
			 * 空のNodeListを意図的に返すにはどうすればよいか？
			 */
			return (doc || document).getElementsByName(name) || [];
		},
		export : function(name, ns) {
			win[name] = ns;
		},
		addListener : function(element, type, fn, capture){
			/* IE8以下には対応しない。 */
			element.addEventListener(type, fn, capture);
		}
	};

}(window));