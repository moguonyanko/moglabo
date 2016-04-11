((g => {
    "use strict";
    
    /**
     * 最初の...valuesは配列として可変長引数を受け取る。
     * Array.ofの引数の...valuesは配列として受け取った可変長引数を個々の値に展開している。
     * <small>Array.ofに配列を渡すと2次元以上の配列が生成される。</small>
     * 
     * 引数として渡された個々の値を配列にまとめる処理と
     * 配列の要素を個々の値に展開する処理で同じ記号...が使われている。
     * この関数自体は配列のリテラルを使えば必要無いのだが，
     * 意味的に異なる処理で全く同じ記号を使うのは仕様として誤っている。
     */
    const list = (...values) => {
        return Array.of(...values);
    };
    
    const funcs = [
        () => {
            const base = ".collation-container ",
                resultArea = g.select(base + ".result-area");
            
            const sample = list("a", "z", "ä", "ö", "ü");
            
            g.clickListener(g.select(base + ".view-result"), () => {
                const target = g.selected(g.selectAll(base + ".select-collation-target"));
                const collator = new Intl.Collator(target);
                const result = sample.sort(collator.compare);
                g.println(resultArea, result);
            });
            
            g.clickListener(g.select(base + ".clear-result"), () => {
                g.clear(resultArea);
            });
        }
    ];
    
    g.run(funcs);
})(window.goma));
