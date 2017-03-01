((win, doc, lB) => {
    "use strict";

    /**
     * 基本攻撃力に乗算する倍率
     */
    const magnifications = {
        cutin_senden_gyakutan: 1.75,
        cutin_senden_bouen: 1.6,
        cutin_gyorai: 1.5,
        cutin_hourai: 1.3,
        cutin_shuhou: 2,
        cutin_shuhuku: 1.75,
        doubleAttack: 1.2
    };
    
    /**
     * 各攻撃種別ごとの攻撃回数
     */
    const attackTimes = {
        cutin_senden_gyakutan: 2,
        cutin_senden_bouen: 2,
        cutin_gyorai: 2,
        cutin_hourai: 2,
        cutin_shuhou: 1,
        cutin_shuhuku: 1,
        doubleAttack: 2
    };

    /**
     * 攻撃種別の通称
     */
    const attackTypeNames = {
        cutin_senden_gyakutan: "潜水艦電探＆逆探カットイン",
        cutin_senden_bouen: "潜水艦電探＆望遠鏡カットイン",
        cutin_gyorai: "魚雷カットイン",
        cutin_hourai: "砲雷カットイン",
        cutin_shuhou: "主砲カットイン",
        cutin_shuhuku: "主副カットイン",
        doubleAttack: "連撃"
    };
    
    class AttackType {
        constructor(key) {
            this.key = key;
        }

        get magnification() {
            return magnifications[this.key];
        }
        
        get times() {
            return attackTimes[this.key];
        }
        
        get typeName() {
            return attackTypeNames[this.key];
        }
    }

    /**
     * @todo
     * 改修「強化値」の算出
     */

    class Item {
        constructor(name, {karyoku = 0, raisou = 0, improvement = 0}) {
            this.name = name;
            this.karyoku = karyoku;
            this.raisou = raisou;
            this.improvement = improvement;
        }

        /**
         * @todo 
         * 改修「強化値」が加味されていない。
         */
        get power() {
            return this.karyoku + this.raisou;
        }
    }

    class Ship {
        constructor(name, {karyoku = 0, raisou = 0, items = []}) {
            this.name = name;
            this.karyoku = karyoku;
            this.raisou = raisou;
            this.items = items;
        }

        get power() {
            const shipPower = this.karyoku + this.raisou;

            const itemPower = this.items
                    .map(item => item.power)
                    .reduce((a, b) => a + b, 0);

            return shipPower + itemPower;
        }
    }

    /**
     * 基本攻撃力を返す。
     */
    const getBasePower = (ship, { yatei = false }) => {
        let p = ship.power;

        if (yatei) {
            p += 5;
        }

        return p;
    };

    const testCalc = () => {
        const item = new Item("203mm", {
            karyoku: 9
        });

        const items = [
            item, item
        ];

        const ship = new Ship("Zara due", {
            karyoku: 87,
            raisou: 48,
            items
        });

        const yatei = true;
        const power = getBasePower(ship, {yatei});
        const atkType = new AttackType("doubleAttack");
        
        const nightPower = power * atkType.magnification;

        console.log(`${ship.name} の ${atkType.typeName} は ` + 
                `威力 ${nightPower} の攻撃を ${atkType.times} 回行う。`);
    };

    const init = () => {
        testCalc();
    };

    win.addEventListener("DOMContentLoaded", init);
})(window, document, window.lB);
