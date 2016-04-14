(function (goma) {
    "use strict";
    
    class SampleValue {
        constructor(value) {
            this.value = value;
        }
        
        toString() {
            return this.value.toString();
        }
    }
    
    class InitialValues {
        constructor() {
            /**
             * 様々な型のオブジェクトを同じSetやMapに登録するのは好ましくないが
             * ここでは動作確認のため登録している。
             */
            this.values = [
                new SampleValue("サンプルオブジェクト"), 
                1, 
                false, 
                "サンプル文字列",
                () => 1, 
                new Date()
            ];
        }
        
        [Symbol.iterator]() {
            let current = 0;
            
            return {
                next: () => {
                    let value = this.values[current];
                    let done = this.values.length < ++current;
                    
                    return {done, value};
                }
            };            
        }
    }
    
    const setActions = {
        "add": (set, value) => {
            set.add(value);
        },
        "delete": (set, value) => {
            set.delete(value);
        },
        "values": (set) => {
            const setIter =  set.values();
            return [...setIter];
        },
        "clear": (set) => {
            set.clear();
        }
    };
    
    class SampleKey{
        constructor(key) {
            this.key = key;
        }
        
        toString() {
            return this.key;
        }
        
        /**
         * equalsを実装していてもMapの値取得には全く影響を与えない。
         * ===演算子で等しいと見なされるキーをMapに与えた時のみ値取得に成功する。
         */
        equals(other) {
            if(other instanceof SampleKey){
                return this.key === other.key;
            }else{
                return false;
            }
        }
    }
    
    class MapAction{
        constructor(key){
            this.key = key;
        }
        
        setValue(map, value) {
            map.set(this.key, value);
        }
        
        /**
         * this.keyと等価なキーを外部から与えて値が取得できるかを
         * テストするためのメソッドである。
         */
        getValue(map, otherKey) {
            return map.get(otherKey);
        }
        
        toString() {
            /**
             * Symbolは文字列連結で暗黙的にtoStringが呼び出されて文字列に変換されない。
             * 明示的にtoStringを呼び出さないとエラーになる。
             */
            return "キー " + this.key.toString() + " で値を取得します。";
        }
    }
    
    /**
     * 今のところどのタイプのキーを用いる時でも常に同じ値を保存する。
     */
    const SAMPLE_MAP_VALUE = "値が取得できました！";
    
    const mapKeyFactory = {
        "string": () => "sample string",
        "number": () => 1,
        "boolean": () => true,
        "function": () => () => 1,
        "nan": () => NaN,
        /**
         * () => {} と記述するとブロックを持つArrow functionと区別が付かなくなる。
         * そのためオブジェクトを返すArrow functionを記述したい時は
         *  () => { return {}; } のように明示的にオブジェクトをreturnしなければ
         * ならない。
         */
        "object": () => { return { toString: () => "object literal" }; },
        "class": () => new SampleKey("sample key"),
        "symbol": () => Symbol("sample symbol"),
        /**
         * Global symbolはSymbol生成時に渡した引数が等しいSymbol同士であれば
         * ===演算子で比較した際にtrueを返す。つまり等しい引数で生成された
         * Global symbolはSetに複数追加することができない。
         */
        "globalsymbol": () => Symbol.for("sample global symbol")
    };
    
    const mapValues = {
        "string": "by string",
        "number": "by number",
        "boolean": "by boolean",
        "function": "by function",
        "nan": "by NaN",
        "object": "by object",
        "class": "by class",
        "symbol": "by symbol",
        "globalsymbol": "by global symbol"
    };
    
    let mapActions = {};
    
    const initMapActions = types => {
        for(let type of types){
            mapActions[type] = new MapAction(mapKeyFactory[type]());
        }
    };
    
    const initializers = [
        g => {
            const resultArea = g.select(".set-container .result-area");
            
            /**
             * Setのコンストラクタはiterableなオブジェクトを引数に取れる。
             * iterableなオブジェクトとはIteration protocolsを実装した
             * オブジェクトを指す。
             */
            const set = new Set(new InitialValues());
            
            const ctrls = g.selectAll(".control-set .control-set-button");
            const input = g.select(".control-set .set-value");
            
            g.forEach(ctrls, ctrl => {
                g.clickListener(ctrl, e => {
                    const actionName = ctrl.value;
                    const setAction = setActions[actionName];
                    const result = setAction(set, input.value);
                    /* 空文字は出力しない。 */
                    if(result && result.toString()){
                        g.println(resultArea, result.toString());
                    }
                });
            });
            
            g.clickListener(g.select(".clear-result-area"), e => {
                g.clear(resultArea);
            });
            
            g.clickListener(g.select(".control-set .change-array"), e => {
                const excludeCheck = g.select(".control-set .exclude-text-value");
                let array;
                if(excludeCheck.checked){
                    const exSet = new Set(input.value.split(","));
                    array = [];
                    /**
                     * SetはforEachを実装している。
                     */
                    set.forEach(v => {
                        if(!exSet.has(v)){
                            array.push(v);
                        }
                    });
                    /**
                     * Chrome49はリスト内包表記に対応していないのでシンタックスエラーになる。
                     * Firefox45では正常に動作する。
                     */
                    //array = [v for (v of set) if (!exSet.has(v))];
                }else{
                    array = Array.from(set);
                }
                g.println(resultArea, array.toString());
            });
        },
        g => {
            const resultArea = g.select(".map-container .result-area");
            const baseClass = ".control-map ";
            const typeEles = g.selectAll(baseClass + ".map-key-conatner input");
            
            let map = new Map();
            
            const types = g.values(typeEles);
            initMapActions(types);
            
            g.log(mapActions);
            
            const getType = () => {
                const typeEle = g.findFirst(typeEles, t => t.checked);
                const type = typeEle.value;
                return type;
            };
            
            g.clickListener(g.select(baseClass + ".set-map-value"), e => {
                const type = getType();
                const action = mapActions[type];
                action.setValue(map, mapValues[type]);
                g.println(resultArea, action.toString());
            });
            
            g.clickListener(g.select(baseClass + ".get-map-value"), e => {
                const type = getType();
                const action = mapActions[type];
                const value = action.getValue(map, mapKeyFactory[type]());
                g.println(resultArea, value.toString());
            });
            
            g.clickListener(g.select(".map-container .clear-result-area"), e => {
                g.clear(resultArea);
            });
            
            g.clickListener(g.select(baseClass + ".view-map-keys"), e => {
                /**
                 * Map.prototype.keysが返すオブジェクトはIteratorなので
                 * 配列のメソッドを適用する場合はArray.fromを介して行う必要がある。
                 * Map.prototype.valuesについても同様である。
                 */
                g.forEach(Array.from(map.keys()), key => g.println(resultArea, key.toString()));
            });
            
            g.clickListener(g.select(baseClass + ".view-map-values"), e => {
                g.forEach(Array.from(map.values()), value => g.println(resultArea, value.toString()));
            });
            
            g.clickListener(g.select(baseClass + ".view-map-keyvalues"), e => {
                /**
                 * Mapはiterableなのでfor...ofで反復できる。Map.prototype.entriesを
                 * 呼び出した時も同じ結果になる。
                 */
                for(let [key, value] of map){
                    g.println(resultArea, "key=" + key.toString() + ",value=" + value.toString());
                }
            });
            
            g.clickListener(g.select(baseClass + ".upper-map-values"), e => {
                /**
                 * MapはforEachを実装しているが「値，キー」の順序で引数が渡されてくる。
                 * for...ofによる反復とは異なる。
                 */
                map.forEach((value, key) => {
                    if(g.strp(value)){
                        map.set(key, value.toUpperCase());
                    }
                });
            });
            
            g.clickListener(g.select(baseClass + ".array-to-map"), e => {
                const size = map.size || 10;
                const array = [];
                for(let i = 0; i < size; i++){
                    array.push(null);
                }
                const newKeyValues = array.map((e, idx) => {
                    return ["key" + idx, "value" + idx];
                });
                /**
                 * iterableなオブジェクトからMapを生成することができる。
                 */
                map = new Map(newKeyValues);
            });
            
            g.clickListener(g.select(baseClass + ".clear-map-values"), e => {
                map.clear();
            });
            
            g.clickListener(g.select(baseClass + ".delete-map-value"), e => {
                const type = getType();
                const key = mapKeyFactory[type]();
                /**
                 * ===演算子で等しいと見なされるキーを渡せない場合は値をを削除する
                 * ことができない。Map.prototype.deleteが返す真偽値はMap.prototype.hasが
                 * 返す値と同じである。
                 */
                const result = map.delete(key);
                g.println(resultArea, "値が削除できたか？ ... " + result.toString());
            });
        },
        g => {
            const c = ".weakset-container ";
            const resultArea = g.select(c + ".result-area");
            
            let wsValues = {
                values: [
                    {
                        name: "hogehoge",
                        toString: function(){
                            return this.name;
                        }
                    }, 
                    function sampleFunc(){}, 
                    new Date()
                    /**
                     * Symbolは基本データ型同様nullにならないのでWeakSetに追加できない。
                     */
//                    ,Symbol("symbol foo"),
//                    Symbol("symbol foo"),
//                    Symbol.for("global symbol foo"),
//                    Symbol.for("global symbol foo")
                ],
                current: 0,
                [Symbol.iterator]: () => {
                    next: () => {
                        let value = wsValues.values[wsValues.current];
                        let done = wsValues.values.length < ++wsValues.current;

                        return {done, value};
                    }
                },
                reset: () => {
                    wsValues.current = 0;
                }
            };
            
            const ws = new WeakSet(wsValues.values);
            /**
             * @todo
             * オブジェクトリテラルのiteration protocolsが参照されないため
             * WeakSetに値を追加できない。
             */
            //const ws = new WeakSet(wsValues);
            const copyValues = Object.assign({}, {
                /**
                 * Array.fromで生成された配列を元の配列と===演算子で比較してもtrueにならない。
                 */
                values: Array.from(wsValues.values)
            });
            g.clickListener(g.select(c + ".view-weakset-values"), e => {
                /**
                 * WeakSetには値を反復したり直接得たりするためのAPIが存在しない。
                 * 現在のサイズを得るプロパティも無い。少なくともFirefox45のWeakSetに
                 * lengthプロパティは存在しない。
                 */
                for(let v of copyValues.values){
                    const result = "Is exist " + v.toString() + "? ..." + ws.has(v);
                    g.println(resultArea, result);
                }
            });
            
            g.clickListener(g.select(c + ".clear-result-area"), e => {
                g.clear(resultArea);
            });
            
            g.clickListener(g.select(c + ".delete-weakset-values"), e => {
                if(wsValues && "values" in wsValues){
                    /**
                     * @todo
                     * WeakSetの値がGCの対象になるような操作を行っても
                     * WeakSetから値が削除されない。削除される条件が不明。
                     */
                    wsValues.values = null;
                    delete wsValues.values;
                    wsValues = null;
                }
            });
        },
        g => {
            const base = ".weakmap-container ",
                  resultArea = g.select(base + ".result-area");
            
            class SampleKey{
                constructor(key){
                    this.key = key;
                }
                
                toString(){
                    return "sample key is " + this.key.toString();
                }
            }
            
            let keyValues = {
                "object": {
                    "key": {toString: () => "key object"},
                    "value": "by object"
                },
                "function": {
                    "key": () => 1,
                    "value": "by function"
                },
                "date": {
                    "key": new Date(),
                    "value": "by date"
                },
                "class": {
                    "key": new SampleKey("key class"),
                    "value": "by class"
                }
            };
            
            const kvs = [];
            for(let type in keyValues){
                kvs.push([keyValues[type].key, keyValues[type].value]);
            }
            
            let wm = new WeakMap(kvs);
            
            /**
             * Symbolはnullにならないのでキーにできない。
             */
            //wm.set(Symbol.for("key symbol"), "by symbol");
            
            g.clickListener(g.select(base + ".view-weakmap-values"), e => {
                for(let type in keyValues){
                    const key = keyValues[type].key;
                    g.println(resultArea, key.toString() + " = " + wm.get(key));
                }
            });
            
            g.clickListener(g.select(base + ".delete-weakmap-keys"), e => {
                for(let type in keyValues){
                    const key = keyValues[type].key;
                    const result = wm.delete(key);
                    g.println(resultArea, "Succeeded in deletion value by " + key.toString() + " ... " + result);
                }
            });
            
            g.clickListener(g.select(base + ".test-weakmap-gc"), e => {
                /**
                 * @todo
                 * WeakMapのキーを保持していたオブジェクトを別のオブジェクトに
                 * 置き換えてもWeakMapのキーと値は削除されない。削除される条件が不明。
                 */
                keyValues = Object.assign({}, keyValues);
                g.log(keyValues);
            });
            
            g.clickListener(g.select(base + ".clear-result-area"), e => {
                g.clear(resultArea);
            });
        }
    ];
    
    goma.run(initializers, {reject: err => console.error(err.toString())});
}(window.goma));