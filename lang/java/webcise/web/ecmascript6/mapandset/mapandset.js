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
         * 演算子 === で等しいと見なされるキーをMapに与えた時のみ値取得に成功する。
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
            return "キー " + this.key + " で値を取得します。";
        }
    }
    
    /**
     * 今のところどのタイプのキーを用いる時でも常に同じ値を保存する。
     */
    const SAMPLE_MAP_VALUE = "値が取得できました！";
    
    const createMapKey = {
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
        "class": () => new SampleKey("sample key")
    };
    
    let mapActions = {};
    
    const initMapActions = types => {
        for(let type of types){
            const mapKey = createMapKey[type]();
            mapActions[type] = new MapAction(mapKey);
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
                        g.println(resultArea, result);
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
                g.println(resultArea, array);
            });
        },
        g => {
            const resultArea = g.select(".map-container .result-area");
            const baseClass = ".control-map ";
            const typeEles = g.selectAll(baseClass + ".map-key-conatner input");
            
            const map = new Map();
            
            const types = g.values(typeEles);
            initMapActions(types);
            
            g.log(mapActions);
            
            const getType = () => {
                const typeEle = g.findFirst(typeEles, t => t.checked);
                const type = typeEle.value;
                return type;
            };
            
            const getMapAction = () => {
                const action = mapActions[getType()];
                return action;
            };
            
            g.clickListener(g.select(baseClass + ".set-map-value"), e => {
                const action = getMapAction();
                action.setValue(map, SAMPLE_MAP_VALUE);
                g.println(resultArea, action);
            });
            
            g.clickListener(g.select(baseClass + ".get-map-value"), e => {
                const action = getMapAction();
                const mapKey = createMapKey[getType()]();
                const value = action.getValue(map, mapKey);
                g.println(resultArea, value);
            });
            
            g.clickListener(g.select(".map-container .clear-result-area"), e => {
                g.clear(resultArea);
            });
        }
    ];
    
    goma.run(initializers);
}(window.goma));
