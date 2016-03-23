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
        
        /**
         * Iteration protocols
         * 実装方法自体は従来の自前のイテレータと変わらない。
         * ただし戻り値のオブジェクトが持つnextというメソッド名は変えられない。
         * またnextが返すオブジェクトのプロパティdoneとvalueも変えられない。
         * doneが無いと無限ループに陥る。valueが無いと返される値はすべてundefinedになる。
         */
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
        
        /**
         * Generator function
         * クラスのメソッドをジェネレータ関数することもできる。
         */
        *next() {
            let current = 0;
            
            while(current < this.fruits.length){
                yield this.fruits[current++];
            }
        }
    }
    
    const fruitPrinter = {
        /**
         * Iteration protocolsを実装しているオブジェクトはfor...of文で
         * 保持している要素を反復することができる。
         */
        iterator: (fruitIterator, resultArea) => {
            for(let fruit of fruitIterator){
                g.println(resultArea, fruit);
            }
        },
        generator: (fruitIterator, resultArea) => {
            /**
             * ジェネレータを使う場合はジェネレータ関数を毎回呼び出す必要がある。
             */
            for(let fruit of fruitIterator.next()){
                g.println(resultArea, fruit);
            }
        },
        spreader: (fruitIterator, resultArea) => {
            /**
             * Iteration protocolsを実装している場合，Spread operatorで
             * 保持している要素から成る配列を得ることができる。
             */
            for(let fruit of [...fruitIterator]){
                g.println(resultArea, fruit);
            }
        }
    };
    
    const inits = [
        () => {
            const prefix = ".iterators-protocol-container ";
            
            const resultArea = g.select(prefix + ".result-area");
            
            g.clickListener(g.select(prefix + ".fruit-getter"), () => {
                const fruits = g.filter(g.selectAll(prefix + "option"), 
                    option => option.selected)
                    .map(el => new Fruit(el.value));

                const fruitIterator = new FruitIterator(fruits);
                
                const checkedMethod = g.findFirst(g.refs("fruit-method"), el => el.checked);
                const methodName = checkedMethod.value;
                
                fruitPrinter[methodName](fruitIterator, resultArea);
            });
            
            g.clickListener(g.select(prefix + ".fruit-clearer"), 
                () => g.clear(resultArea));
        }
    ];
        
    g.run(inits);
}(window.goma));