(function(m){
    "use strict";
    
    /**
     * Rest ParameterとSpread Operatorは同じ記号「...」を使っている。
     * Rest ParameterにもSpread Operatorを適用しないと値は展開されない。
     * 文字列にSpread Operatorを適用すれば文字ごとに分解して展開できるが
     * 数値などにSpread Operatorを適用するとエラーとなる。
     */
    function spreadArray(value, ...rest){
        var restArray = [];
        [...rest].forEach(el => restArray.push(...el));
        return [...value, ...restArray];
    }
    
    function SampleInfo(name){
        this.name = name;
        
        this.printThis = function(){
            setTimeout(() => {
               /**
                * Arrow functions内ではthisはレキシカルになる。
                * つまりここのthisはundefinedではなくSampleInfoになる。
                * thatだのselfだのを使いスコープ外でthisを保存しておく必要は無い。
                */
               m.log(this);
               m.log(this.name + " reported result!");
            }, 1000);
        };
    }
    
    /**
     * デフォルト引数はargumentsの中に含まれない。
     * 関数内部でデフォルト引数を参照しても含まれることはない。
     */
    function sum(x = "[default x]", y = "[default y]", z = "[default z]"){
        //var result = Array.prototype.reduce.call(arguments, (a, b) => a + b);
        var result = Array.prototype.reduce.call([x, y, z], (a, b) => a + b);
        
        return result;
    }
    
    var initializers = {
        spreadParameter: () => {
            var resultArea = m.select(".spread-operator-section .result-area textarea"),
                initialValue = resultArea.value;

            var printValue = evt => {
                var numberValue = m.ref("spread-target-numbers").value;
                var inputNumberValues = numberValue.split(",");
                var stringValue = m.ref("spread-target-string").value;
                var spreadValue = spreadArray(inputNumberValues, "ABC", "DEF", "GHI", stringValue);
                var orgValue = resultArea.value;
                var result = orgValue.split(",").concat(spreadValue);
                m.println(resultArea, result);
            };

            m.clickListener("spread-values", printValue);

            m.clickListener("reset-values", evt => resultArea.value = initialValue);

            var sample = new SampleInfo("arrow functions sample");
            sample.printThis();
        },
        defaultParameter: () => {
            var resultArea = m.select(".default-parameter-section .result-area textarea");
            
            m.clickListener("view-default-parameter", e => {
                var paramEles = m.selectAll(".default-parameter");
                var values = new Array(paramEles.length);
                Array.prototype.forEach.call(paramEles, function(el, index){
                    if(!isNaN(parseInt(el.value))){
                        values[index] = parseInt(el.value);
                    }
                });
                
                var result;
                if(values.length > 0){
                    var x = values[0],
                        y = values[1], 
                        z = values[2];
                    
                    result = sum(x, y, z);
                    /**
                     * 以下の渡し方では最後に宣言された引数に値が代入される。
                     */
                    //result = sum([...values]);
                }else{
                    result = sum();
                    /**
                     * undefinedを渡すとデフォルト引数が使用される。
                     * つまり引数を渡さない呼び出し方と同じである。
                     */
                    //result = sumWithDefaultParameter(undefined, undefined, undefined);
                    /**
                     * nullを渡してもデフォルト引数は使用されない。
                     * nullのまま処理が行われる。NaNについても同様。
                     */
                    //result = sumWithDefaultParameter(null, null, null);
                }
                
                m.println(resultArea, result);
            });
            
            m.clickListener("clear-default-parameter-result", e => {
                m.clear(resultArea);
            });
            
            m.clickListener("clear-default-parameters", e => {
                Array.prototype.forEach.call(m.selectAll(".default-parameter"), 
                function(el){
                    el.value = "";
                });
            });
        }
    };

    function init(){
        for(var name in initializers){
            initializers[name]();
        }
    }

    init();
}(my));
