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

    const isOverAntiSubmarineBorder = ({shipValue, itemValue, border}) => {
        const shortage = border - shipValue;

        if (shortage <= 0) {
            return true;
        }

        return parseInt(itemValue) >= shortage;
    };

    /**
     * IteratorをArrayに変換するのはIteratorのメモリ消費面でのメリットを
     * 失うことになるのではないか？
     */
    const getEffectivePattern = ({patternData, border, shipValue, slotLength}) => {
        const resultPatterns = Array.from(patternData.keys())
                .filter(itemValue => isOverAntiSubmarineBorder({
                        border, shipValue, itemValue
                    }))
                .map(key => patternData.get(key))
                .reduce((p1, p2) => p1.concat(p2), []) //flatMap
                .filter(pattern => pattern.length <= slotLength);

        return resultPatterns;
    };

    const testCalcAntiSubmarineBorder = async () => {
        const patternData = await loadPatternData();
        const border = 100;
        const shipValue = 80;
        const slotLength = 3;

        const resultPatterns = getEffectivePattern({
            patternData, border, shipValue, slotLength
        });

        console.log(resultPatterns);
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

    const createPatternElement = patternText => {
        const p = doc.createElement("p");
        p.setAttribute("class", "effective-pattern");
        p.appendChild(doc.createTextNode(patternText));
        return p;
    };

    const appendEffectivePattern = (patterns = []) => {
        const resultArea = doc.querySelector(".result-area");
        /**
         * ページに独自の要素を追加するサードパーティ製ライブラリを利用した場合の
         * ことを考慮するとinnerHTMLではなくreplaceChildを使って要素を出力する方が
         * 安全かもしれない。しかしreplaceされる要素の内部にサードパーティ製ライブラリが
         * 出力した要素が含まれていた場合はやはり影響が出てしまう。
         */
        resultArea.innerHTML = "";

        const fragment = doc.createDocumentFragment();
        patterns.map(pattern => createPatternElement(pattern))
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

            const resultPatterns = getEffectivePattern({
                patternData, border, shipValue, slotLength
            });

            appendEffectivePattern(resultPatterns);
        });
    };

    const main = async () => {
        await testCalcAntiSubmarineBorder();
        addListener();
    };

    win.addEventListener("DOMContentLoaded", main);

})(window, document);