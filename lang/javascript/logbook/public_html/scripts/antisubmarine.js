((win, doc) => {
    "use strict";

    const loadPatternData = async () => {
        const patternData = new Map();
        const response = await fetch("../../config/antisubmarinepattern.json");
        const datas = await response.json();
        for (let key in datas) {
            patternData.set(key, datas[key]);
        }
        return patternData;
    };
    
    const loadSynergyData = async () => {
        const patternData = new Map();
        const response = await fetch("../../config/antisubmarinesynergy.json");
        const datas = await response.json();
        return datas.synergypatterns;
    };

    const isOverAntiSubmarineBorder = ({shipValue, itemValue, border}) => {
        const shortage = border - shipValue;

        if (shortage <= 0) {
            return true;
        }

        return parseInt(itemValue) >= shortage;
    };

    const getPatternSorter = patternData => {
        return (key1, key2) => {
            const pattern1 = patternData.get(key1),
                    pattern2 = patternData.get(key2);
            /**
             * 右辺の二次元配列を一次元配列に変換して左辺の変数に代入している。
             * 以下のコードでも同じ結果になる。
             * <pre>const p1 = [].concat(...pattern1)</pre>
             */
            const [p1] = pattern1, [p2] = pattern2;
            return p1.length - p2.length;
        };
    };

    /**
     * IteratorをArrayに変換するのはIteratorのメモリ消費面でのメリットを
     * 失うことになるのではないか？
     */
    const getPreemptivePatterns = ({patternData, border, shipValue, slotLength}) => {
        const resultPatterns = Array.from(patternData.keys())
                .filter(itemValue => isOverAntiSubmarineBorder({
                        border, shipValue, itemValue
                    }))
                .map(key => patternData.get(key))
                /* 2次元配列を1次元配列にする。 */
                .reduce((p1, p2) => p1.concat(p2), [])
                /* スロット数が足りない構成は除外する。 */
                .filter(pattern => pattern.length <= slotLength)
                /* 必要装備数が少ない順に並べ替える。 */
                .sort((p1, p2) => p1.length - p2.length);

        return resultPatterns;
    };
    
    /**
     * checkedArrayにtestTargetArrayの要素が全て含まれればtrueを返す。
     * 1つでも含まない場合はfalseを返す。
     */
    const includesAllElements = ({checkedArray, testTargetArray}) => {
        return checkedArray.every(element => testTargetArray.includes(element));
    };
    
    /**
     * patternで示された構成がsynergyDataに定義された「より効果的な構成」のどれかに
     * 合致するかどうかを調べる。合致する構成が1つでも存在した場合この関数はtrueを返す。
     * 1つも存在しなかった場合falseを返す。
     */
    const isEffectivePattern = ({synergyData, pattern}) => {
        return synergyData.some(synergyPattern => includesAllElements({
            checkedArray: synergyPattern, 
            testTargetArray: pattern
        }));
    };

    const testCalcAntiSubmarineBorder = async () => {
        const patternData = await loadPatternData();
        const border = 100;
        const shipValue = 80;
        const slotLength = 3;

        const preemptivePatterns = getPreemptivePatterns({
            patternData, border, shipValue, slotLength
        });

        console.log(preemptivePatterns);
        
        const synergyData = await loadSynergyData();
        const effectivePatterns = preemptivePatterns
                .filter(pattern => isEffectivePattern({synergyData, pattern}));
        
        console.log(effectivePatterns);
    };

    /**
     * DOMを扱うコード群
     */

    const getInputInteger = className => {
        if (!className) {
            throw new Error("invalid class name");
        }
        const selector = className.startsWith(".") ? className : "." + className;
        return parseInt(doc.querySelector(selector).value);
    };

    const createPatternElement = ({synergyData, pattern}) => {
        const p = doc.createElement("p");
        p.classList.add("item-pattern");
        if (isEffectivePattern({synergyData, pattern})) {
           p.classList.add("effective-pattern"); 
        }
        p.appendChild(doc.createTextNode(pattern));
        return p;
    };

    const appendEffectivePattern = ({synergyData, patterns}) => {
        const resultArea = doc.querySelector(".result-area");
        /**
         * ページに独自の要素を追加するサードパーティ製ライブラリを利用した場合の
         * ことを考慮するとinnerHTMLではなくreplaceChildを使って要素を出力する方が
         * 安全かもしれない。しかしreplaceされる要素の内部にサードパーティ製ライブラリが
         * 出力した要素が含まれていた場合はやはり影響が出てしまう。
         */
        resultArea.innerHTML = "";

        const fragment = doc.createDocumentFragment();
        patterns.map(pattern => createPatternElement({synergyData, pattern}))
                .forEach(node => fragment.appendChild(node));

        resultArea.appendChild(fragment);
    };

    const addListener = () => {
        const runner = doc.querySelector(".calc-runner");
        runner.addEventListener("click", async () => {
            /**
             * ブラウザキャッシュが効くので毎回設定ファイル読込を行っている。
             */
            const patternData = await loadPatternData();
            const border = getInputInteger("border-value"),
                    shipValue = getInputInteger("raw-anti-value"),
                    slotLength = getInputInteger("slot-length");

            const patterns = getPreemptivePatterns({
                patternData, border, shipValue, slotLength
            });

            const synergyData = await loadSynergyData();
            appendEffectivePattern({synergyData, patterns});
        });
    };

    const main = async () => {
        //await testCalcAntiSubmarineBorder();
        addListener();
    };

    win.addEventListener("DOMContentLoaded", main);

})(window, document);
