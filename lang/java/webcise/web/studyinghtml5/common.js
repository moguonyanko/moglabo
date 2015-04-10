(function(win) {
	"use strict";

	var commonNS,
		my;

	function printText(ele, txt, override, newline) {
		var prop,
			newLineChar;

		if ("value" in ele) {
			prop = "value";
			newLineChar = "\n";
		} else {
			prop = "innerHTML";
			newLineChar = "<br />";
		}

		if (!newline) {
			newLineChar = "";
		}

		if (override) {
			ele[prop] = txt + newLineChar;
		} else {
			ele[prop] += txt + newLineChar;
		}
	}

	function consoleLog() {
		try {
			console.log.apply(null, arguments);
		} catch (err) {
			console.log(arguments[0]);
		}
	}

	if (!commonNS && !my) {
		win.commonNS = win.my = {
			log : consoleLog,
			println : function(ele, txt, override) {
				printText(ele, txt, override, true);
			},
			print : printText,
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
			addListener : function(element, type, fn, capture) {
				/* IE8以下には対応しない。 */
				element.addEventListener(type, fn, capture);
			},
			removeListener : function(element, type, fn, capture) {
				/* IE8以下には対応しない。 */
				element.removeEventListener(type, fn, capture);
			},
			prevent : function(evt){
				evt.preventDefault();
			}
		};
	}

}(window));