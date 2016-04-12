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
                const target = g.selected(g.selectAll(base + ".select-locale-target"));
                const collator = new Intl.Collator(target);
                const result = sample.sort(collator.compare);
                g.println(resultArea, result);
            });
            
            g.clickListener(g.select(base + ".clear-result"), () => {
                g.clear(resultArea);
            });
        },
        () => {
            const base = ".number-format-container ",
                resultArea = g.select(base + ".result-area");
            
            const sample = 1234567890;
            
            g.clickListener(g.select(base + ".view-result"), () => {
                const target = g.selected(g.selectAll(base + ".select-locale-target"));
                const formatter = new Intl.NumberFormat(target);
                /**
                 * 以下の記述でもよいが **-** の形式でないロケールを用いたフォーマットでは
                 * エラーになることがある。
                 */
                //const formatter = new Intl.NumberFormat(target.split("-", 1));
                const result = formatter.format(sample);
                g.println(resultArea, result);
            });
            
            g.clickListener(g.select(base + ".clear-result"), () => {
                g.clear(resultArea);
            });
        },
        () => {
            const base = ".currency-format-container ",
                resultArea = g.select(base + ".result-area");
            
            const sample = 1234567890;
            
            g.clickListener(g.select(base + ".view-result"), () => {
                const target = g.selected(g.selectAll(base + ".select-locale-target"));
                const currency = g.selected(g.selectAll(base + ".select-currency-target"));
                /**
                 * ロケールとcurrencyの組み合わせが正しくなくてもフォーマット自体は
                 * 成功して結果を出力できる。
                 */
                const formatter = new Intl.NumberFormat(target, {
                    style: "currency",
                    currency: currency
                });
                const result = formatter.format(sample);
                g.println(resultArea, result);
            });
            
            g.clickListener(g.select(base + ".clear-result"), () => {
                g.clear(resultArea);
            });
        }
    ];
    
    g.run(funcs);
})(window.goma));
