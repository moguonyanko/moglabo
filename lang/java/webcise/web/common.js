(function(win, doc) {
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
			clear : function(ele){
				this.print(ele, "", true);
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
			selectAll : function(selector, doc){
				return (doc || document).querySelectorAll(selector);
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
			prevent : function(evt) {
				evt.preventDefault();
			},
			noop : function() {
				/* Does nothing. */
			},
			alwaysTrue : function() {
				return  true;
			},
			alwaysFalse : function() {
				return false;
			},
			selected : function(eles, opts) {
				opts = opts || {};
				
				var predicate = opts.predicate || function(ele) {
					/**
					 * Element.hasAttributeで要素の論理属性の状態を判別するには
					 * その論理属性が最初から記述されていなければならない。
					 * すなわちinput要素のchecked属性のようにユーザーの操作によって
					 * on, offが変化するような属性には利用できない。
					 * 最初にchecked属性を記述していた要素が常に選択されてしまう。
					 */
					return ele.checked;
				},
				getter = typeof opts.getter === "function" ?
				opts.getter : 
				function(ele) {
					return ele.value;
				};

				for (var i = 0, len = eles.length; i < len; i++) {
					if (predicate(eles[i])) {
						return getter(eles[i]);
					}
				}

				return null;
			},
			values : function(eles){
				var vals = [];
				Array.prototype.forEach.call(eles, function(el){
					vals.push(el.value);
				});
				
				return vals;
			},
			freeze : function(obj, names) {
				if (!names) {
					/**
					 * 不変(読み取り専用かつ編集不可)にするプロパティ名の配列が
					 * 引数に渡されなかった時は全ての独自プロパティを不変にする。
					 */
					Object.freeze(obj);
				} else {
					for (var i = 0, len = names.length; i < len; i++) {
						var name = names[i];

						/* 設定可能でないプロパティは無視する。 */
						if (Object.getOwnPropertyDescriptor(obj, name).configurable) {
							Object.defineProperty(obj, name, {
								writable : false,
								configurable : false
							});
						}
					}
				}
			},
			extend : function(superClass, subClass){
				subClass.prototype = Object.create(superClass.prototype);
			},
			appendChildAll : function(parentEle, childEles){
				var fragment = doc.createDocumentFragment();
				Array.prototype.forEach.call(childEles, function(el){
					fragment.appendChild(el);
				});
				parentEle.appendChild(fragment);				
			}
		};
	}

}(window, document));