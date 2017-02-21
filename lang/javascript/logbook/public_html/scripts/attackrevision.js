((win, doc, lB) => {
    "use strict";

    const pointTypes = {
        normal: "normal",
        sensui_event: "sensui_event",
        kouku: "kouku",
        kushu: "kushu",
        fancy: "fancy",
        whirling_fuel: "whirling_fuel",
        whirling_ammo: "whirling_ammo"
    };

    const resourceTypes = {
        fuel: "fuel",
        ammo: "ammo"
    };

    class Point {
        constructor(typeName, {name, fuel, ammo}) {
            this.typeName = typeName;
            this.name = name;
            this.fuel = fuel;
            this.ammo = ammo;
        }

        isNormal() {
            return this.typeName === pointTypes.normal;
        }

        isWhirlingFuel() {
            return this.typeName === pointTypes.whirling_fuel;
        }

        isWhirlingAmmo() {
            return this.typeName === pointTypes.whirling_ammo;
        }
    }

    class Radar {
        constructor(size = 3) {
            this.size = size;
        }

        getReduction() {
            switch (this.size) {
                case 1:
                    return 10;
                case 2:
                    return 16;
                case 3:
                    return 20;
                default :
                    return 0;
            }
        }
    }

    class Condition {
        constructor( {point, night = false, radar}) {
            this.point = point;
            this.night = night;
            this.radar = radar;
        }

        /**
         * プロパティとして定義すると利用する側からすればシンプルになるが，誤った
         * プロパティ名で参照してしまった時にundefinedが返されるため間違いを見つけるのに
         * 時間がかかることがある。メソッドとして定義してあれば存在しないメソッド名を
         * 参照して呼び出した時点でエラーになるので間違いを発見するのが早くなる。
         */

        get fuel() {
            let f = this.point.fuel;

            if (this.point.isWhirlingFuel()) {
                f -= this.radar.getReduction();
            }

            return f;
        }

        get ammo() {
            let a = this.point.ammo;

            if (this.night) {
                a *= 1.5;
            }

            if (this.point.isWhirlingAmmo()) {
                a -= this.radar.getReduction();
            }

            return a;
        }
    }

    const getRevision = residual => {
        if (residual < 0) {
            residual = 0;
        } else if (100 <= residual) {
            residual = 100;
        }

        if (50 <= residual) {
            return 1.0;
        } else {
            return 2 * (residual / 100);
        }
    };

    const loadPointConfig = async () => {
        const req = new Request("../../config/pointconfig.json");
        const res = await fetch(req);
        const datas = await res.json();

        const revisionDatas = new Map();

        for (let typeName in datas) {
            const p = new Point(typeName, datas[typeName]);
            revisionDatas.set(typeName, p);
        }

        return revisionDatas;
    };

    class ConditionFactory {
        constructor(config) {
            this.config = config;
        }

        create(type, night, radarSize) {
            const point = this.config.get(type);

            if (!point) {
                throw new Error(`Unsupported type: ${type}`);
            }

            if (radarSize < 0) {
                throw new Error(`Radar size must be positive: ${radarSize}`);
            }

            const radar = new Radar(radarSize);

            return new Condition({point, night, radar});
        }

        [Symbol.iterator] () {
            return this.config.entries();
        }
    }

    const getResidual = (conditions, resourceType) => {
        let prop;

        if (!(resourceType in resourceTypes)) {
            throw new Error(`Unsupported residual type: ${resourceType}`);
        }

        const used = conditions.map(c => c[resourceType])
                .reduce((r1, r2) => r1 + r2);

        return 100 - used;
    };

    const calcRevision = (factory, params, resourceType) => {
        const conditions = params.map(param => factory.create(...param));
        const residual = getResidual(conditions, resourceType);
        const revision = getRevision(residual);

        return revision;
    };

    const testCalcRevision = async () => {
        const radarSize = 3;

        const params = [
            [pointTypes.kushu, false, radarSize],
            [pointTypes.normal, false, radarSize],
            [pointTypes.whirling_ammo, false, radarSize],
            [pointTypes.normal, false, radarSize],
            [pointTypes.kushu, false, radarSize]
        ];

        const conf = await loadPointConfig();
        const factory = new ConditionFactory(conf);
        const revision = calcRevision(factory, params, resourceTypes.ammo);

        console.log("TEST:弾薬量補正=" + revision);
    };

    /**
     * 状態選択用ページの構築
     * 
     * <strong>DOMを扱うコードとECMAScriptで完結できるコードは分離する。</strong>
     */

    const getPointConditionParams = () => {
        const pointEles = doc.querySelectorAll(".point-selector");

        const params = Array.from(pointEles).map(pointEle => {
            const typeEles = pointEle.querySelectorAll(".type-selector");
            const checkedTypes = Array.from(typeEles)
                    .filter(typeEle => typeEle.checked);
            const type = checkedTypes[0].value;

            const nightEle = pointEle.querySelector(".check-night");
            const night = nightEle.checked;

            const radarEle = pointEle.querySelector(".radar-size");
            const radarSize = parseInt(radarEle.value);

            return [type, night, radarSize];
        });

        return params;
    };

    const getRadarSizeInput = () => {
        const label = doc.createElement("label");
        label.setAttribute("class", "radar-size-name");
        label.appendChild(doc.createTextNode("電探="));
        const input = doc.createElement("input");
        input.setAttribute("class", "radar-size");
        input.setAttribute("type", "number");
        input.setAttribute("min", "0");
        input.setAttribute("max", "12");
        input.setAttribute("value", "3");
        label.appendChild(input);

        return label;
    };

    const getPointContainers = (id, factory) => {
        const containers = Array.from(factory).map(kv => {
            const [key, point] = kv;

            const label = doc.createElement("label");
            label.setAttribute("class", "type-selector-name");
            const input = doc.createElement("input");
            input.setAttribute("type", "radio");
            input.setAttribute("name", "point-" + id);
            input.setAttribute("class", "type-selector");
            input.setAttribute("value", key);
            if (point.isNormal()) {
                input.setAttribute("checked", "checked");
            }
            label.appendChild(input);
            label.appendChild(doc.createTextNode(point.name));

            return label;
        });

        return containers;
    };

    const getNightChecker = () => {
        const chkLabel = doc.createElement("label");
        chkLabel.setAttribute("class", "check-night-name");
        const chkNight = doc.createElement("input");
        chkNight.setAttribute("type", "checkbox");
        chkNight.setAttribute("class", "check-night");
        chkLabel.appendChild(chkNight);
        chkLabel.appendChild(doc.createTextNode("夜戦"));

        return chkLabel;
    };

    const initPointSelectors = (factory, selSize) => {
        const baseContainer = doc.querySelector(".point-type-container");
        baseContainer.innerHTML = "";

        const frag = doc.createDocumentFragment();

        for (let i = 0; i < selSize; i++) {
            const containers = getPointContainers(i, factory);
            const base = doc.createElement("li");
            base.setAttribute("class", "point-selector");
            containers.forEach(container => base.appendChild(container));
            base.appendChild(getNightChecker());
            base.appendChild(getRadarSizeInput());
            frag.appendChild(base);
        }

        baseContainer.appendChild(frag);
    };

    const getCount = () => {
        const e = doc.querySelector(".count");
        return parseInt(e.value);
    };

    let viewResultRevision = () => {
        //Does nothing by default
    };

    /**
     * viewResultRevisionとinitPointSelectorsで参照されるpointconfigは同一でなければ
     * ページ初期化時と補正値計算時で矛盾が生じる可能性がある。確実に同一のpointconfigが参照
     * されるようにinitPage内でviewResultRevisionを定義している。
     */
    const initPage = async () => {
        const conf = await loadPointConfig();
        const factory = new ConditionFactory(conf);

        viewResultRevision = (target, resourceType) => {
            const params = getPointConditionParams();
            const revision = calcRevision(factory, params, resourceType);
            target.innerHTML = revision * 100;
        };

        initPointSelectors(factory, getCount());

        const resultEles = doc.querySelectorAll(".result-value");
        Array.from(resultEles).forEach(ele => ele.innerHTML = "");
    };

    const addListeners = () => {
        const initEle = doc.querySelector(".init-conatiners");
        initEle.addEventListener("click", async () => await initPage());

        const fuelRunner = doc.querySelector(".run-calc-fuel");
        fuelRunner.addEventListener("click", () => {
            const target = doc.querySelector(".result-value-fuel");
            viewResultRevision(target, resourceTypes.fuel);
        });

        const ammoRunner = doc.querySelector(".run-calc-ammo");
        ammoRunner.addEventListener("click", () => {
            const target = doc.querySelector(".result-value-ammo");
            viewResultRevision(target, resourceTypes.ammo);
        });
    };

    const init = async () => {
        await initPage();
        addListeners();

        await testCalcRevision();
    };

    win.addEventListener("DOMContentLoaded", init);

})(window, document, window.lB);