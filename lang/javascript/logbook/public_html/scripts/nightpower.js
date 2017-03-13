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
            naikatei = "特二式内火艇",
            suibaku = "水上爆撃機",
            suitei = "水上偵察機",
            dentan = "電探",
            kijyu = "機銃",
            kouhyouteki = "甲標的",
            kantei = "艦上偵察機",
            kansen = "艦上戦闘機",
            kankou = "艦上攻撃機",
            jyukurenseibiin = "熟練艦載機整備員",
            taichi = "対地兵装",
            sensuisoubi = "潜水艦装備";

    /**
     * 補強増設に持つことができる装備群
     */
    const canHaveReinforceSlot = {
        [kijyu]: kijyu
    };

    /**
     * 攻撃種別の通称
     */
    const cutin_sensuisoubi_sensuigyorai = "潜水艦装備＆潜水艦魚雷カットイン",
            cutin_sensuigyorai = "潜水艦魚雷カットイン",
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
        [naikatei]: 1.0,
        [suibaku]: 0,
        [suitei]: 0,
        [dentan]: 0,
        [kijyu]: 0,
        [kouhyouteki]: 0,
        [kantei]: 0,
        [kansen]: 0,
        [kankou]: 0,
        [jyukurenseibiin]: 0,
        [taichi]: 0,
        [sensuisoubi]: 0
    };

    /**
     * 基本攻撃力に乗算する倍率
     */
    const magnifications = {
        [cutin_sensuisoubi_sensuigyorai]: 1.75,
        [cutin_sensuigyorai]: 1.6,
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
        [cutin_sensuisoubi_sensuigyorai]: 2,
        [cutin_sensuigyorai]: 2,
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

    const toReadableImprovementValue = srcImpVal => {
        const imp = parseInt(srcImpVal);

        let value = "★";

        if (isNaN(imp) || imp <= 0) {
            value = "";
        } else if (0 < imp && imp < 10) {
            value += imp;
        } else if (10 <= imp) {
            value += "max";
        }

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

        getPower({ground = false}) {
            const impValue = getImprovementValue({
                itemType: this.itemType,
                improvement: this.improvement
            });
            const power =  this.karyoku + (ground ? 0 : this.raisou) + impValue;
            return power;
        }

        toString() {
            const str = [
                `装備名=${this.name},装備種別=${this.itemType}`,
                `火力=${this.karyoku},雷装=${this.raisou}`,
                `改修度=${toReadableImprovementValue(this.improvement)}`
            ];

            return str.join("\n");
        }
    }

    class Ship {
        constructor( {name, karyoku = 0, raisou = 0, items = []}) {
            this.name = name;
            this.karyoku = karyoku;
            this.raisou = raisou;
            this.items = items;
        }

        getPower({ground = false}) {
            const shipPower = this.karyoku + (ground ? 0 : this.raisou);

            const itemPower = this.items
                    .map(item => item.getPower({ground}))
                    .reduce((a, b) => a + b, 0);

            return shipPower + itemPower;
        }
    }

    /**
     * 夜戦攻撃力の補正に影響与える要素
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
     * @description 
     * 対地攻撃力を計算する要素をまとめたクラスです。
     */
    class GroundFunction {
        constructor({basePower = 0}) {
            this.basePower = basePower;
        }
        
        apply() {
            /**
             * @todo
             * 補正計算の実装
             */
            
            return this.basePower;
        }
    }

    /**
     * 基本攻撃力を返す。
     */
    const getBasePower = ({ship, factor, ground = false}) => {
        return ship.getPower({ground}) + factor.revision;
    };

    /**
     * 各種補正を考慮した夜戦攻撃力を返す。
     */
    const getNightPower = ({ship, attackType, factor, digits = 2, 
        ground = false}) => {
        const basePower = getBasePower({ship, factor});
        
        if (ground) {
            const gf = new GroundFunction({basePower});
            basePower = gf.apply();
        }
        
        const nightPower = basePower * attackType.magnification;
        
        return nightPower.toFixed(digits);
    };

    /**
     * @todo
     * 装備全てをメモリに保持している。
     * ストリームのような形で必要な時に必要なだけ読み込むようにできないか。
     */
    const loadItemList = async () => {
        const response = await fetch("../../config/itemlist.json");

        if (response.ok) {
            const data = await response.json();
            return data.items;
        } else {
            throw new Error("Fail to get item list:" + response.status);
        }
    };

    /**
     * テスト用関数群
     */

    const createResultText = ({ship, attackType, nightPower}) => {
        return `${ship.name} の ${attackType.typeName} は ` +
                `夜戦攻撃力 ${nightPower} の攻撃を ${attackType.times} 回行う。`;
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
            name: "試製六連装魚雷",
            itemType: gyorai,
            raisou: 14,
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
        const attackType = new AttackType(cutin_sensuisoubi_sensuigyorai);
        const nightPower = getNightPower({
            ship, attackType, factor,
            digits: 2
        });

        return {ship, attackType, nightPower};
    };

    /**
     * 入力ページの構築
     */

    /**
     * 全ての装備に対応するItemオブジェクトを保持している。
     * メモリを逼迫するのでIndexedDBなどに保持しておくのが望ましい。
     */
    const selectableItems = new Map();

    const setSelectableItem = (key, itemData, itemType) => {
        const param = Object.assign({itemType}, itemData);
        selectableItems.set(key, param);
    };

    const getSelectedItems = () => {
        const slots = Array.from(doc.querySelectorAll(".slot"));

        const items = slots.map(slot => {
            const sel = slot.querySelector(".item");
            const param = selectableItems.get(sel.value);
            let item = null;
            if (param) {
                const imp = slot.querySelector(".implove");
                const itemArgs = Object.assign({improvement:
                            parseInt(imp.value)}, param);
                item = new Item(itemArgs);
            }
            return item;
        }).filter(item => item !== null);

        return items;
    };

    const getSelectedNightFactor = () => {
        const yatei = doc.querySelector(".revision .yatei");
        return new NightPowerFactor({
            yatei: yatei.checked
        });
    };

    const getSelectedAttackType = () => {
        const types = doc.querySelectorAll(".revision .attacktype-list .attacktype");
        const selectedTypes = Array.from(types).filter(type => type.checked);
        return new AttackType(selectedTypes[0].value);
    };

    const createItemList = itemDataList => {
        const sels = Array.from(doc.querySelectorAll(".slot .item"));

        sels.forEach(sel => {
            for (let itemType in itemDataList) {
                if (sel.classList.contains("item-reinforce") &&
                        !(itemType in canHaveReinforceSlot)) {
                    continue;
                }

                itemDataList[itemType].forEach(itemData => {
                    const opt = doc.createElement("option");
                    opt.setAttribute("label", itemData.name);
                    const itemKey = itemType + ":" + itemData.name;
                    opt.setAttribute("value", itemKey);
                    sel.appendChild(opt);
                    setSelectableItem(itemKey, itemData, itemType);
                });
            }
        });
    };

    const calcTargetNightPower = () => {
        const name = doc.querySelector(".ship-name").value,
                karyoku = parseInt(doc.querySelector(".karyoku").value),
                raisou = parseInt(doc.querySelector(".raisou").value),
                items = getSelectedItems();

        const ship = new Ship({
            name, karyoku, raisou, items
        });

        const factor = getSelectedNightFactor();
        const attackType = getSelectedAttackType();

        const nightPower = getNightPower({
            ship, attackType, factor,
            digits: 2
        });

        return {ship, attackType, nightPower};
    };

    const addListener = () => {
        doc.querySelector(".runner").addEventListener("click", () => {
            const resEle = doc.querySelector(".result");
            resEle.innerHTML = createResultText(calcTargetNightPower());
        });

        const forms = Array.from(doc.querySelectorAll(".improve-form"));

        forms.forEach(form => {
            form.addEventListener("input", evt => {
                const output = form.querySelector(".improveresult");
                output.value = toReadableImprovementValue(evt.target.value);
            });
        });
    };

    const init = async () => {
        addListener();
        createItemList(await loadItemList());
    };

    win.addEventListener("DOMContentLoaded", init);
})(window, document, window.lB);
