((win, doc, lB) => {
    "use strict";

    /**
     * @todo
     * 改修「強化値」の算出
     */

    class Ship {
        constructor( {karyoku, raisou}) {
            this.karyoku = karyoku;
            this.raisou = raisou;
        }
    }

    class Item {
        constructor( {karyoku, raisou, improvement = 0}) {
            this.karyoku = karyoku;
            this.raisou = raisou;
            this.improvement = improvement;
        }
    }

    class Slot {
        constructor( {name, item}) {
            this.name = name;
            this.item = item;
        }
    }

    const testCalc = () => {

    };

    const init = () => {
        testCalc();
    };

    win.addEventListener("DOMContentLoaded", init);
})(window, document, window.lB);
