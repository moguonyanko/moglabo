((win, doc, lB) => {
    "use strict";

    /**
     * 装備種別名称
     * 夜戦で補正値がある装備のみ
     */
    const shuhou_big = "大口径主砲",
            shuhou_middle = "中口径主砲",
            shuhou_small = "小口径主砲",
            hukuhou = "副砲",
            tekkoudan = "徹甲弾",
            kousha = "高射装置",
            tanshoutou = "探照灯",
            gyorai = "魚雷",
            daihatsu = "上陸用舟艇",
            naikatei = "特二式内火艇";

    /**
     * 攻撃種別の通称
     */
    const cutin_senden_gyakutan = "潜水艦電探＆逆探カットイン",
            cutin_senden_bouen = "潜水艦電探＆望遠鏡カットイン",
            cutin_gyorai = "魚雷カットイン",
            cutin_hourai = "砲雷カットイン",
            cutin_shuhou = "主砲カットイン",
            cutin_shuhuku = "主副カットイン",
            doubleAttack = "連撃";

    /**
     * 夜戦における改修補正値
     */
    const improvementRevisions = {
        [shuhou_big]: 1.0,
        [shuhou_middle]: 1.0,
        [shuhou_small]: 1.0,
        [hukuhou]: 1.0,
        [tekkoudan]: 1.0,
        [kousha]: 1.0,
        [tanshoutou]: 1.0,
        [gyorai]: 1.0,
        [daihatsu]: 1.0,
        [naikatei]: 1.0
    };

    /**
     * 基本攻撃力に乗算する倍率
     */
    const magnifications = {
        [cutin_senden_gyakutan]: 1.75,
        [cutin_senden_bouen]: 1.6,
        [cutin_gyorai]: 1.5,
        [cutin_hourai]: 1.3,
        [cutin_shuhou]: 2,
        [cutin_shuhuku]: 1.75,
        [doubleAttack]: 1.2
    };

    /**
     * 各攻撃種別ごとの攻撃回数
     */
    const attackTimes = {
        [cutin_senden_gyakutan]: 2,
        [cutin_senden_bouen]: 2,
        [cutin_gyorai]: 2,
        [cutin_hourai]: 2,
        [cutin_shuhou]: 1,
        [cutin_shuhuku]: 1,
        [doubleAttack]: 2
    };

    class AttackType {
        constructor(typeName) {
            this.typeName = typeName;
        }

        get magnification() {
            return magnifications[this.typeName];
        }

        get times() {
            return attackTimes[this.typeName];
        }
    }

    /**
     * 装備の種別と改修度を元に改修強化値を算出して返す。
     */
    const getImprovementValue = ({itemType, improvement}) => {
        /**
         * キーが存在しなかった時のデフォルト値をMapやObjectが必要に応じ自動で返す
         * 仕組みが存在すれば，キーを渡す側でデフォルト値を用意せずに済む。
         * その方が不正な値をデフォルト値として使われることが無くなり安全である。
         */
        const revision = improvementRevisions[itemType] || 0;
        const value = Math.sqrt(improvement) * revision;
        return value;
    };

    class Item {
        constructor( {name, itemType, karyoku = 0, raisou = 0, improvement = 0}) {
            this.name = name;
            this.itemType = itemType;
            this.karyoku = karyoku;
            this.raisou = raisou;
            this.improvement = improvement;
        }

        get power() {
            const impValue = getImprovementValue({
                itemType: this.itemType,
                improvement: this.improvement
            });
            return this.karyoku + this.raisou + impValue;
        }
    }

    class Ship {
        constructor( {name, karyoku = 0, raisou = 0, items = []}) {
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
     * 夜戦攻撃力の補正に影響与える要素
     * 現時点では夜偵のみ
     */
    class NightPowerFactor {
        constructor( {yatei = false}){
            this.yatei = yatei;
        }

        get revision() {
            let value = 0;

            if (this.yatei) {
                /**
                 * フィールドが定義できればこのようなマジックナンバーを減らせる。
                 */
                value += 5;
            }

            return value;
        }
    }

    /**
     * 基本攻撃力を返す。
     */
    const getBasePower = ({ship, factor}) => {
        return ship.power + factor.revision;
    };

    /**
     * 各種補正を考慮した夜戦攻撃力を返す。
     */
    const getNightPower = ({ship, attackType, factor, digits}) => {
        const basePower = getBasePower({ship, factor});
        const nightPower = basePower * attackType.magnification;
        return nightPower.toFixed(digits);
    };

    /**
     * テスト用関数群
     */

    const printTestResult = ({ship, attackType, nightPower}) => {
        console.log(`${ship.name} の ${attackType.typeName} は ` +
                `夜戦攻撃力 ${nightPower} の攻撃を ${attackType.times} 回行う。`);
    };

    const getTestPower1 = () => {
        const item = new Item({
            name: "203mm",
            itemType: shuhou_middle,
            karyoku: 9,
            improvement: 6
        });

        const ship = new Ship({
            name: "Zara due",
            karyoku: 87,
            raisou: 48,
            items: [item, item]
        });

        const factor = new NightPowerFactor({yatei: true});
        const attackType = new AttackType(doubleAttack);
        const nightPower = getNightPower({
            ship, attackType, factor,
            digits: 2
        });

        return {ship, attackType, nightPower};
    };

    const getTestPower2 = () => {
        const item1 = new Item({
            name: "後期型",
            itemType: gyorai,
            raisou: 15
        });

        const item2 = new Item({
            name: "六連酸素",
            itemType: gyorai,
            raisou: 16,
            improvement: 4
        });

        const item3 = new Item({
            name: "逆探",
            itemType: "潜水艦電探"
        });

        const ship = new Ship({
            name: "伊13改",
            karyoku: 16,
            raisou: 72,
            items: [item1, item2, item3]
        });

        const factor = new NightPowerFactor({yatei: true});
        const attackType = new AttackType(cutin_senden_gyakutan);
        const nightPower = getNightPower({
            ship, attackType, factor,
            digits: 2
        });

        return {ship, attackType, nightPower};
    };

    const init = () => {
        printTestResult(getTestPower1());
        printTestResult(getTestPower2());
    };

    win.addEventListener("DOMContentLoaded", init);
})(window, document, window.lB);
