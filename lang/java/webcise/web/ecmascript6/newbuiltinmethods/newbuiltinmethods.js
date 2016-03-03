new Gomakit().run(
    g => {
        let assignClass = ".assign-sample-area ";
        
        let resultArea = g.select(assignClass + ".result-area"),
            eles = g.selectAll(assignClass + ".assign-value");
            
        let propNames = ["a", "b", "c"];
        let result;
        
        g.clickListener(g.select(assignClass + ".assign-executer"), e => {
            let [a, b, c] = Array.prototype.map.call(eles, (ele, index) => {
                return { 
                    [propNames[index]]: ele.value
                };
            });

            result = Object.assign(a, b, c);
            
            for(let name of Object.keys(result)){
                g.println(resultArea, name + ":" + result[name]);
            }
        });
        
        g.clickListener(g.select(assignClass + ".assign-clearer"), e => {
            /**
             * このブロックをArrow Functionで記述した場合，thisは
             * Windowオブジェクトになる。strictモードでも同様である。
             * もしイベントリスナを登録した要素をthisで参照したい場合は
             * function式を使う必要がある。
             */
            g.clear(resultArea);
        });
        
        function Sample(name){
            this.name = name;
        }
        
        Sample.prototype.toString = function() {
            return this.name + " by Sample object.";
        };
        
        g.clickListener(g.select(assignClass + ".assign-merger"), e => {
           result = result || {};
            
           let appendObj = {
               greeting: "hello",
               [Symbol("hoge")]: "hoge",
               greet: () => "hello",
               greetFunc: function(){ return this.greeting; },
               sample: new Sample("fuga")
           };
           
           /**
            * Firefox44ではオブジェクトのキーにSymbolを指定すると
            * そのプロパティがconsole.logで表示されない。
            * appendObj[[Symbol("hoge")]]というコードは許容されない。
            * SymbolをStringに変換することが許されないためである。
            */
           g.log(appendObj);
           /**
            * Symbolをキーにしたプロパティを得るにはObject.getOwnPropertySymbolsで
            * オブジェクトに紐付く全てのSymbolを得て，それをオブジェクトのキーに指定する。
            */
           let syms = Object.getOwnPropertySymbols(appendObj);
           g.log(appendObj[syms[0]]);
           
           /**
            * 関数やオブジェクトもそのまま複製することができる。
            */
           let mergedObj = Object.assign({}, result, appendObj);
               
           g.log(mergedObj);
           
           /**
            * IteratorはECMAScriptの標準ではない。Chrome等では実装されていない。
            * Iteratorを使わないオブジェクトをfor...ofで反復することはできない。
            * SymbolのキーはObject.keysの戻り値に含まれない。
            */
           for(let name of Object.keys(mergedObj)){
               g.println(resultArea, name + ":" + mergedObj[name]);
           }
           
           /**
            * SymbolはObject.getOwnPropertySymbolsを介して列挙する必要がある。
            * 当然こちらの方法ではSymbolしか列挙できない。
            * 他のプロパティと同じように列挙できないのはミスに繋がるので
            * Symbolをオブジェクトのキーにしない方がいいかもしれない。
            */
           syms.forEach(sym => g.println(resultArea, "Symbol:" + mergedObj[sym]));
        });
    }
);
