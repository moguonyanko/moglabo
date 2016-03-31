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
        }
    ];
    
    goma.run(initializers);
}(window.goma));
