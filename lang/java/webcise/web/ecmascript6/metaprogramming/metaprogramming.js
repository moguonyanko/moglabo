((g => {
    "use strict";
    
    /**
     * Arrow function内ではstrictモードであってもthisはundefinedにならない。
     * withが使用できない等といった他のstrictモードの特性は保持している。
     * 
     * 参考:Relation with strict mode
     * https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/Arrow_functions
     */
    g.log(this);
    g.log("window === this -> " + (window === this));
    
    class Person{
        constructor(name, age){
            this.name = name;
            this.age = parseInt(age);
        }
        
        toString(){
            return this.name + ":" + this.age;
        }
    }
    
    const pList = Array.of(
        ["foo", 20], 
        ["bar", 40], 
        ["baz", 30],
        ["hoge", 45], 
        ["poo", 15], 
        ["peko", 30], 
        ["moo", 25], 
        ["don", 50], 
        ["mike", 18], 
        ["joe", 35]
    );
    
    const getPersons = size => {
        return pList.slice(0, size).map(params => new Person(...params));
    };
    
    const forEachPersons = (persons, func) => {
        /**
         * 元のオブジェクトとProxyを同じfor...ofで巡回するためには，
         * Proxyのコンストラクタに渡したオブジェクトがiteratableで
         * なければならない。
         */
        for(let p of persons){
            func(p);
        }        
    };
    
    const funcs = [
        g => {
            const base = ".proxy-container ",
                resultArea = g.select(base + ".result-area");
            
            const handler = {
                get: (persons, prop) => {
                    let p = persons[prop];
                    
                    /**
                     * Symbolのプロパティを避ける処理を行っているのは，
                     * Proxyコンストラクタの引数に配列(=iteratable)を
                     * 渡したことでSymbol.iteratorも渡されてくるからである。
                     * ここではインデックスが渡された時だけ特別な処理を行う。
                     */
                    const isIndex = !g.symp(prop) && !isNaN(parseInt(prop));
                    if(isIndex){
                        return new Person(p.name.toUpperCase(), p.age + 100);
                    }else{
                        /**
                         * 配列のインデックス以外が参照された時はプロパティの値を
                         * そのまま返す。
                         */
                        return p;
                    }
                }
            };
            
            const size = 5;
            const persons = getPersons(size);
            const proxy = new Proxy(persons, handler);
            
            g.clickListener(g.select(base + ".view-objects"), 
                e => forEachPersons(persons, p => g.println(resultArea, p)));
            
            g.clickListener(g.select(base + ".view-objects-proxy"), 
                e => forEachPersons(proxy, p => g.println(resultArea, p)));
            
            g.clickListener(g.select(base + ".clear-result"), e => {
                g.clear(resultArea);
            });
        }
    ];
    
    g.run(funcs);
})(window.goma));
