(function (win, doc) {
    "use strict";

    if (typeof win.Gomakit === "function") {
        return;
    }

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
        if (arguments.length > 1) {
            Array.prototype.forEach.call(arguments, function (el) {
                console.log(el);
            });
        } else {
            console.log(arguments[0]);
        }
    }

    function consoleError() {
        if (arguments.length > 1) {
            Array.prototype.forEach.call(arguments, function (el) {
                console.error(el);
            });
        } else {
            console.error(arguments[0]);
        }
    }

    function strp(value) {
        return typeof value === "string";
    }

    function StringBuilder(opt_initialValue, opt_sep) {
        this.values = [];
        this.separator = opt_sep || "";
        strp(opt_initialValue) || this.values.push(opt_initialValue);
    }

    StringBuilder.prototype = {
        append: function (value) {
            strp(value) || this.values.push(value);
            return this;
        },
        toString: function () {
            return this.values.join(this.separator);
        }
    };

    function funcp(value) {
        return typeof value === "function";
    }

    function getValueFunc(opts) {
        opts = opts || {};

        if (funcp(opts.getter)) {
            return opts.getter;
        } else {
            return function (ele) {
                return ele.value;
            };
        }
    }

    function freeze(obj, names) {
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
                        writable: false,
                        configurable: false
                    });
                }
            }
        }
    }

    function Gomakit() {
        freeze(this);
    }
    
    function GomakitError(reason){
        this.message = reason;
        freeze(this);
    }
    
    GomakitError.prototype = Object.create(Error.prototype);

    Gomakit.prototype = {
        StringBuilder: StringBuilder,
        log: consoleLog,
        error: consoleError,
        println: function (ele, txt, override) {
            printText(ele, txt, override, true);
        },
        print: printText,
        clear: function (ele) {
            this.print(ele, "", true);
        },
        ref: function (id, doc) {
            return (doc || document).getElementById(id);
        },
        refs: function (name, doc) {
            /**
             * デフォルト値としては配列ではなくNodeListを返すべき。 
             * しかしNodeListのコンストラクタは呼び出せない。
             * 空のNodeListを意図的に返すにはどうすればよいか？
             */
            return (doc || document).getElementsByName(name) || [];
        },
        selectAll: function (selector, doc) {
            return (doc || document).querySelectorAll(selector);
        },
        select: function (selector, doc) {
            return (doc || document).querySelector(selector);
        },
        export: function (name, ns) {
            win[name] = ns;
        },
        addListener: function (element, type, fn, capture) {
            element.addEventListener(type, fn, capture);
        },
        removeListener: function (element, type, fn, capture) {
            element.removeEventListener(type, fn, capture);
        },
        prevent: function (evt) {
            evt.preventDefault();
        },
        noop: function () {
            /* Does nothing. */
        },
        selected: function (eles, opts) {
            opts = opts || {};

            var predicate = opts.predicate || function (ele) {
                /**
                 * Element.hasAttributeで要素の論理属性の状態を判別するには
                 * その論理属性が最初から記述されていなければならない。
                 * すなわちinput要素のchecked属性のようにユーザーの操作によって
                 * on, offが変化するような属性には利用できない。
                 * 最初にchecked属性を記述していた要素が常に選択されてしまう。
                 */
                return ele.checked;
            };

            var valGetter = getValueFunc(opts);

            for (var i = 0, len = eles.length; i < len; i++) {
                if (predicate(eles[i])) {
                    return valGetter(eles[i]);
                }
            }

            return null;
        },
        values: function (eles) {
            return Array.prototype.map.call(eles, function (el) {
                return el.value;
            });
        },
        freeze: freeze,
        extend: function (superClass, subClass) {
            subClass.prototype = Object.create(superClass.prototype);
        },
        appendChildAll: function (parentEle, childEles) {
            var fragment = doc.createDocumentFragment();
            Array.prototype.forEach.call(childEles, function (el) {
                fragment.appendChild(el);
            });
            parentEle.appendChild(fragment);
        },
        createWebSocket: function (resourceName, opts) {
            opts = opts || {};

            var protocol = location.protocol === "https:" ? "wss:" : "ws:",
                    host = location.host,
                    port = opts.port || 8080;

            return new WebSocket(protocol + "//" + host + ":" + port + "/webcise/" + resourceName);
        },
        clickListener: function (id, listener, opt_cap) {
            var ele = strp(id) ? this.ref(id) : id;
            this.addListener(ele, "click", listener, opt_cap || false);
        },
        loadedHook: function (listener, opt_cap) {
            this.addListener(win, "DOMContentLoaded", listener, opt_cap || false);
        },
        getStyles: function (ele) {
            var style = win.getComputedStyle(ele || doc.documentElement);
            return style;
        },
        makeCSS: function (selector, styles, opt_withTag) {
            var s = new StringBuilder("{", "\n");
            for (var name in styles) {
                s.append(name + ":" + styles[name] + ";");
            }
            s.append("}");

            var css = selector + " " + s.toString();
            if (opt_withTag) {
                css = "<style>" + css + "</style>";
            }

            return css;
        },
        getCSSVariables: function (varName, opt_doc) {
            var value = this.getStyles(opt_doc || doc.documentElement).getPropertyValue(varName);
            return (value || "").trim();
        },
        existsCSSVariables: function (varName, opt_doc) {
            var colorVar = this.getCSSVariables(varName, opt_doc);
            return Boolean(colorVar);
        },
        truthy: function (value) {
            return true;
        },
        falsy: function (value) {
            return false;
        },
        fulfill: function (func, resolve, reject, opt_predicate) {
            var predicate = opt_predicate || this.truthy;

            function executor(resolve, reject) {
                try {
                    var value = func();

                    if (predicate(value)) {
                        resolve(value);
                    } else {
                        reject(new GomakitError(value));
                    }
                } catch (err) {
                    reject(new GomakitError(err.message));
                }
            }

            /**
             * Promiseを使うことでコールバック関数内で発生した例外が
             * 握りつぶされないようにする。
             */
            var promise = new Promise(executor);
            promise.then(resolve).catch(reject);
        },
        makeArray: function (src) {
            return Array.prototype.map.call(src, function (el) {
                return el;
            });
        },
        strp: strp,
        funcp: funcp,
        forEach: function (targets, func) {
            if (Array.isArray(targets)) {
                targets.forEach(func);
            } else {
                var keys = Object.keys(targets);
                var syms = Object.getOwnPropertySymbols(targets);
                keys.concat(syms).forEach(func);
            }
        },
        run: function (runners, opts) {
            if (!Array.isArray(runners)) {
                runners = [runners];
            }

            var that = this,
                options = opts || {},
                resolve = funcp(options.resolve) ? options.resolve : this.noop,
                reject = funcp(options.reject) ? options.reject : this.noop,
                predicate = funcp(options.predicate) ? options.predicate : this.truthy,
                Pm = Promise;

            var promises = runners.map(function (runner) {
                return new Pm(function (resolve, reject) {
                    try {
                        var value = runner(that);
                        if(predicate(value)){
                            resolve(value);
                        }else{
                            reject(new GomakitError(value));
                        }
                    } catch (err) {
                        reject(new GomakitError(err.message));
                    }
                });
            });

            this.loadedHook(function () {
                Pm.all(promises).then(resolve).catch(reject);
            });
        },
        rand: function(seed){
            var n = parseInt(seed);
            var sd = (!isNaN(n) && n > 0) ? n : 1;
            
            return Math.trunc(Math.random() * sd);
        }
    };

    win.Gomakit = Gomakit;
    win.goma = Object.create(Gomakit.prototype);
}(window, document));
