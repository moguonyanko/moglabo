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

    function init(){
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
    }

    init();
}(my));
