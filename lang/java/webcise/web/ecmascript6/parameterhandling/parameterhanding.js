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
    
    function objToString(obj, opt_separator){
        obj = obj || this;
        let s = [];
        /**
         * Iteratorによる反復処理ではキーと値の配列が返される。
         * ここでは2番めの要素である値だけが必要なので，1番目の要素である
         * キーを無視するために[, v]と記述している。
         */
        for(let [, v] of Iterator(obj)){
            /* 関数は文字列表現の対象外とする。 */
            if(!m.funcp(v)){
                s.push(v);
            }
        }
        return s.join(opt_separator || ",");
    }

/**
 * Firefoxではバージョン45以降でないとclassは使用できない。
 * class宣言は巻上されないらしい。
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
 */    
//    class SampleKey {
//        constructor (id) {
//            this.id = id;
//        }
//        
//        equals (other) {
//            if(other instanceof SampleKey){
//                return this.id === other.id;
//            }else{
//                return false;
//            }
//        }
//    }

    function SampleKey(id) {
        this.id = id;
        m.freeze(this);
    }
    
    SampleKey.prototype = {
        equals : function(other){
            if(other instanceof SampleKey){
                return this.id === other.id;
            }else{
                return false;
            }
        }
    };
    
    var destructurings = {
        array : {
            0 : (...args) => {
                let [a, b] = ["foo", "bar"];
                return [a, b];
            },
            1 : (...args) => {
                let nums = [1, 2, 3];
                let [x, y, z] = nums;
                return [x, y, z];
            },
            2 : (...args) => {
                let oldVal = "old value";
                let newVal = "new value";
                /**
                 * 左辺にletを付けると変数の再定義になってしまいエラーになる。
                 * Chrome48では以下の記述でもスクリプトエラーになる。
                 */
                [newVal, oldVal] = [oldVal, newVal];
                return [newVal, oldVal];
            },
            3 : (...args) => {
                function f(...rest){
                    return rest;
                }
                let [x, y, z] = f(100, 200, 300);
                return [x, y, z];
            },
            4 : (...args) => {
                let [,x , ,y] = [100, 200, 300, 400];
                return [x, y];
            }
        },
        object : {
           0 : (...args) => {
               let obj = {
                   x : 100,
                   y : 200,
                   toString : () => {
                       /**
                        * このArrowFunction内ではthisはundefinedになる。
                        * function式を用いて関数が定義された場合はthisはobjになる。
                        */
                       return obj.x + ", " + obj.y;
                   }
               };
               /**
                * 左辺でプロパティ名を指定せずに分割代入する場合，
                * 右辺のオブジェクトのプロパティ名と一致していないと
                * 分割代入は行われず，プロパティはundefinedになる。
                */
               let {x, y, toString} = obj;
               return {x, y, toString};
           },
           1 : (...args) => {
               let obj = {
                   x : "foo",
                   y : "bar",
                   z : "baz"
               };
               /**
                * 「x : a」であれば右辺のaが新しいプロパティ名となる。
                */
               let {x : a, y : b, z : c} = obj;
               return {a, b, c, toString: function(){
                        return [this.a, this.b, this.c].join(", ");
                    }
               };
           },
           2 : (...args) => {
               let x, y;
               /**
                * 丸括弧で全体を囲んでいなければスクリプトエラーとなる。
                */
               ({x, y} = {x : "ABC", y : "DEF"});
               return {x, y, toString : objToString};
           },
           3 : (...args) => {
               let makeKey = x => new SampleKey(x);
               
                let leftKey = makeKey(10),
                    rightKey = makeKey(20);
                    
                m.log("leftKey is " + typeof leftKey);
                m.log("rightKey is " + typeof rightKey);
               
               /**
                * オブジェクトリテラルのキーにオブジェクトを指定できる。
                */
               let {[leftKey] : result} = {[rightKey] : "square value"};
               
               /**
                * 両辺のキーとして指定されたオブジェクトの等値性は考慮されない？
                * 異なるオブジェクトがキーに指定されていてもプロパティに値を代入する
                * ことができる。
                */
               m.log("leftKey equals rightKey ... " + leftKey.equals(rightKey));
               
               return result;
           }
        }
    };
    
    /**
     * DOMに触れるのは初期化関数かイベントハンドラだけにしたい。つまり
     * common.jsに定義したm.ref，m.refs, m.select等はそれらの関数内でしか
     * 呼び出さないということである。
     */
    let initializers = {
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
        },
        destructuringAssignment : () => {
            let initListener = (target) => {
                let section = "." + target + "-destructuring-section";
                let resultArea = m.select(".destructuring-assignment-section " + section + " .result-area");
                let exeEles = m.selectAll(".exec-" + target + "-destructuring");

                m.forEach(exeEles, el => {
                    let sampleFunc = destructurings[target][el.value];
                    m.clickListener(el, e => {
                        m.println(resultArea, sampleFunc());
                    });
                });

                m.clickListener("clear-" + target + "-destructuring-result", e => m.clear(resultArea));
            };
            
            ["array", "object"].forEach(initListener);
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
