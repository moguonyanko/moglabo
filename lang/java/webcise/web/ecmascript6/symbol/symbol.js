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
        },
        symbolSpecies(g) {
            const base = ".species-sample ",
                resultArea = g.select(base + ".result-area"),
                inspecter = g.select(base + ".type-inspecter"),
                clearer = g.select(base + ".clear-result"),
                useSpecies = g.select(base + ".use-species"),
                isSpecies = () => useSpecies.checked;
            
            class SpeciesMap extends Map {
                static get [Symbol.species]() {
                    return Map;
                }
                
                /**
                 * Mapを拡張しているのだからSymbol.iteratorを実装しなくても
                 * iterableなはず…。つまりこのクラスのインスタンスはMapの
                 * コンストラクタ関数の引数としてそのまま渡すことができる。
                 */
                //[Symbol.iterator]() {
                //    super[Symbol.iterator]();
                //}
            }
            
            class NoSpeciesMap extends Map {
                /**
                 * @todo
                 * Symbol.speciesを実装しない。 それにも関わらず
                 * SpeciesMapを用いて調査した場合と結果が変わらない。
                 */
                
                //[Symbol.iterator]() {
                //    super[Symbol.iterator]();
                //}
            }
            
            const entries = [["foo", 100], ["bar", 200], ["baz", 300]];
            
            const speciesMap = new SpeciesMap(entries);
            const noSpeciesMap = new NoSpeciesMap(entries);
            
            const inspectWithMap = m => m instanceof Map,
                inspectSpeciesMap = m => m instanceof SpeciesMap,
                inspectNoSpeciesMap = m => m instanceof NoSpeciesMap;
            
            inspecter.addEventListener("click", () => {
                let result = [];
                const orgMap = isSpecies() ? speciesMap : noSpeciesMap;
                /**
                 * Mapを拡張したクラスのインスタンスではなくそのインスタンスを元に
                 * 生成したインスタンスで調査を行う。
                 */
                const clonedMap = new Map(orgMap);
                
                if (isSpecies()) {
                    result.push(`clonedMap instanceof SpeciesMap === ${inspectSpeciesMap(clonedMap)}`);
                } else {
                    result.push(`clonedMap instanceof NoSpeciesMap === ${inspectNoSpeciesMap(clonedMap)}`);
                }
                result.push(`clonedMap instanceof Map === ${inspectWithMap(clonedMap)}`);
                
                result.forEach(res => g.println(resultArea, res));
                
                /* Map.entries()の戻り値は配列ではない。 */
                //Array.from(clonedMap.entries()).forEach(entry => 
                //        g.println(resultArea, entry[0] + ":" + entry[1]));
            });
            
            clearer.addEventListener("click", () => g.clear(resultArea));
        }
    };
    
    win.goma.run(Object.values(samples), {
        reject: err => console.error(err)
    });
})(window, document));
