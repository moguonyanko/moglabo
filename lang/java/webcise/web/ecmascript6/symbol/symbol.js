(((win, doc) => {
    "use strict";
    
    const samples = {
        symbolEnumerate(g) {
            const baseClass = ".enumerate-sample ";
            
            const resultArea = g.select(baseClass + ".result-area"),
                eles = g.selectAll(baseClass + ".enumerate-elements .enumerate-element");
               
            const clear = () => g.clear(resultArea);
            
            const symEntries = Array.from(eles).map(ele => {
                const text = ele.innerText;
                return [Symbol(text), text.toUpperCase()];
            });
            
            const symMap = new Map(symEntries);
            
            const symObj = {};
            /**
             * Map.entriesの戻り値はIteratorなのでforEachを持っていない。
             */
            Array.from(symMap.entries()).forEach(entry => 
                    Object.assign(symObj, { [entry[0]]: entry[1] }));
            
            const display = () => {
                /**
                 * Map.keysはキーとして保持されるSymbolを返す。
                 */
                Array.from(symMap.keys()).forEach(key => {
                    g.println(resultArea, symMap.get(key) + " at Map(Map.keys)");
                });
                
                /**
                 * Mapに対してObject.getOwnPropertySymbolsを適用しても
                 * キーのSymbolを得ることはできない。空の配列が返される。
                 */
                Object.getOwnPropertySymbols(symMap).forEach(sym => {
                    g.println(resultArea, sym.toString() + " at Map(Object.getOwnPropertySymbols)");
                });
                
                /**
                 * for...inでObjectのSymbolは列挙不可。
                 */
                for (let k in symObj) {
                    const v = symObj[k];
                    g.println(resultArea, v + " at object(for...in)");
                }
                
                for (let k of Object.getOwnPropertySymbols(symObj)) {
                    const v = symObj[k];
                    g.println(resultArea, v + " at Object(Object.getOwnPropertySymbols)");
                }
            };
            
            g.select(baseClass + ".enumerate-runner").addEventListener("click", display);
            g.select(baseClass + ".enumerate-clearer").addEventListener("click", clear);
        }  
    };
    
    win.goma.run(Object.values(samples));
})(window, document));
