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
                * Arrow function内ではthisはレキシカルになる。
                * つまりここのthisはundefinedではなくSampleInfoになる。
                * thatだのselfだのを使いスコープ外でthisを保存しておく必要は無い。
                */
               m.log(this);
               m.log(this.name + " reported result!");
            }, 1000);
        };
    }
    
    function Parameter(value){
        if(!isNaN(parseInt(value))){
            this.value = parseInt(value);
        }else{
            /**
             * 数値計算のデフォルト値が文字列というのはあり得ない。
             * デフォルト値が使われたことを分かりやすくするための措置である。
             */
            this.value = "[default " + value + "]";
        }
        
        m.freeze(this);
    }
    
    Parameter.prototype = {
//        valueOf : () => {
//            /**
//             * このArrow Function内ではthisはundefinedになる。
//             * function式を単純にArrow Functionに置き換えることはできない。
//             */
//            m.log(this);
//            return this.value;
//        }
        /**
         * valueOfメソッドは単項演算子での計算時に呼び出される。
         */
        valueOf : function(){
            return this.value;
        }
    };
    
    /**
     * デフォルト引数に関数呼び出しを指定することも可能である。
     */
    function sum(x = new Parameter("x"), y = new Parameter("y"), z = new Parameter("z")){
        /**
         * デフォルト引数はargumentsの中に含まれない。
         * 関数内部でデフォルト引数を参照しても含まれることはない。
         */
        //var result = Array.prototype.reduce.call(arguments, (a, b) => a + b);
        /**
         * Rest Parameterを使うことでargumentsを使う時と似たような書き方ができる。
         * Rest Parameterはaugumentsとは違いArrayオブジェクトである。そのため
         * Arrayオブジェクトのメソッドをcallなどを介さずに呼び出すことができる。
         */
        var f = (...args) => args.reduce((a, b) => a + b);
        
        return f(x, y, z);
    }
    
    /**
     * Rest parameterは引数の最後に宣言されていなければスクリプトエラーになる。
     * JavaScriptはオーバーロードが仕様上は存在しないのでRest parameter(可変長引数)を
     * あまり気にせず使えるのかも…。今のところargumentsを代替するために使うことが
     * 多くなりそう。
     */
    var calcMethods = {
        add : (...args) => {
            return args.reduce((a, b) => a + b);
        },
        sub : (...args) => {
            return args.reduce((a, b) => a - b);
        },
        mul : (...args) => {
            return args.reduce((a, b) => a * b);
        },
        div : (...args) => {
            return args.reduce((a, b) => a / b);
        }
    };
    
    /**
     * DOMに触れるのは初期化関数かイベントハンドラだけにしたい。つまり
     * common.jsに定義したm.ref，m.refs, m.select等はそれらの関数内でしか
     * 呼び出さないということである。
     */
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
        },
        restParameter : () => {
            var resultArea = m.select(".rest-parameter-section .result-area textarea");
            
            m.clickListener("exec-calc-rest-parameter", e => {
                var selectedMethodName = m.selected(m.refs("calc-method"));
                var calcMethod = calcMethods[selectedMethodName];
                
                if(m.funcp(calcMethod)){
                    var paramEles = m.selectAll(".rest-parameter");
                    var params = Array.prototype.map.call(paramEles, el => parseInt(el.value));
                
                    /**
                     * 普通この状況なら引数を配列で渡すがRestParametersの仕様確認の
                     * ためにわざとバラバラにして渡す。
                     */
                    var x = params[0],
                        y = params[1],
                        z = params[2];
                        
                    var result = calcMethod(x, y, z);
                    m.println(resultArea, result);
                }
            });
            
            m.clickListener("clear-rest-parameter-result", e => m.clear(resultArea));
        }
    };
    
    /**
     * オブジェクトを反復可能にするにはIterator関数に渡す。
     */
    function init(){
        for(let [name, initializer] of Iterator(initializers)){
            initializer();
            m.log(name + "を初期化しました。");
        }
    }

    m.loadedHook(init);
}(my));
