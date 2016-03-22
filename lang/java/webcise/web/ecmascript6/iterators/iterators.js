(function(g){
    "use strict";
    
    class Fruit {
        constructor(name) {
            this.name = name;
        }
        
        get displayName() {
            return "***" + this.name.toUpperCase() + "***";
        }
        
        /**
         * get name だけしか定義していないとエラーになり
         * 「setting a property that has only a getter」と通知される。
         * しかし set name も合わせて定義すると再帰エラーになる。
         */
        
        //get name() {
        //    return "***" + this.name.toUpperCase() + "***";
        //}
        
        //set name(name) {
        //    this.name = name;
        //}
        
        toString() {
            return this.name;
        }
    }
    
    class FruitIterator {
        constructor(fruits) {
            this.fruits = fruits;
        }
        
        toString() {
            return this.fruits.map(fruit => fruit.displayName).toString();
        }
        
        [Symbol.iterator]() {
            let current = 0;
            
            return {
                /**
                 * for...ofで反復するたびにnextは呼び出される。
                 * 
                 * nextメソッドを next() {} や next: function{}　のように
                 * 宣言してしまうとthis.fruitsはundefinedになってしまう。
                 */
                next: () => {
                    /**
                     * thisとだけ書いてもFruitIterator.toStringは呼び出されない。
                     * ここでreturnしているオブジェクトのtoStringがthisすなわち
                     * FruitIteratorオブジェクトに適用される。
                     */
                    g.log(this.toString());
                    
                    let value = this.fruits[current];
                    let done = this.fruits.length < ++current;
                    
                    return {done, value};
                }
            };
        }
    }
    
    const inits = [
        () => {
            const prefix = ".iterators-protocol-container ";
            
            const resultArea = g.select(prefix + ".result-area");
            
            g.clickListener(g.select(prefix + ".fruit-iterator"), () => {
                const fruits = g.filter(g.selectAll(prefix + "option"), 
                    option => option.selected)
                    .map(el => new Fruit(el.value));

                const fruitIterator = new FruitIterator(fruits);

                for(let fruit of fruitIterator){
                    g.println(resultArea, fruit);
                }
            });
            
            g.clickListener(g.select(prefix + ".fruit-clearer"), 
                () => g.clear(resultArea));
        }
    ];
        
    g.run(inits);
}(window.goma));