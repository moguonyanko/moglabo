((window, document) => {
    "use strict";
    
    let antiaircraftBonus = {},
        weightedMagnification = {},
        fleetMagnification = {},
        weightedImprovement = {},
        floatingImprovement = {},
        formationRevisionValues = {},
        unionRevisionValues = {};
    
    const loadConfig = async () => {
        const baseDir = "../../scripts/antiaircraftfire/";
        
        const antiaircraftcutin = await fetch(`${baseDir}antiaircraftcutin.json`);
        antiaircraftBonus = await antiaircraftcutin.json();
        
        const magnification_weighted = await fetch(`${baseDir}magnification_weighted.json`);
        weightedMagnification = await magnification_weighted.json();
        
        const magnification_fleet = await fetch(`${baseDir}magnification_fleet.json`);
        fleetMagnification = await magnification_fleet.json();
        
        const improvement_weighted = await fetch(`${baseDir}improvement_weighted.json`);
        weightedImprovement = await improvement_weighted.json();
        
        const improvement_fleet = await fetch(`${baseDir}improvement_fleet.json`);
        floatingImprovement = await improvement_fleet.json();
        
        const formation_normal = await fetch(`${baseDir}formation_normal.json`);
        formationRevisionValues.normal = await formation_normal.json();
        const formation_union = await fetch(`${baseDir}formation_union.json`);
        formationRevisionValues.union = await formation_union.json();
        
        const unionrevision = await fetch(`${baseDir}unionrevision.json`);
        unionRevisionValues = await unionrevision.json();
    };
    
    class Downing {
        constructor({success = false} = {}) {
            this.success = success;
        }
        getWeightedDefence(fleet) {
            const ship = fleet.interceptShip;
            const a = ship.equipments.length === 0 ? 1 : 2;
            const x = ship.weightedAntiaircraft;
            return a * Math.trunc(x / a);
        }
        getFleetDefence(fleet) {
            const allAntiAirs = fleet.ships
                    .map(ship => ship.floatingAntiaircraft)
                    .reduce((a, b) => a + b, 0);
            const revision = fleet.formationRevision;
            return Math.trunc(revision * allAntiAirs) * (2 / 1.3);
        }
    }
    
    class RateDowning extends Downing {
        constructor({success = false} = {}) {
            super({success});
        }
        execute({fleet, enemyCarrySize} = {}) {
            if (!this.success) {
                return 0;
            }
            const weightedDefence = super.getWeightedDefence(fleet);
            const rev = fleet.fleetRevision;
            const result = Math.trunc((weightedDefence * rev / 400) * enemyCarrySize);
            return result;
        }
    }
    
    class FixedDowning extends Downing {
        constructor({success = false} = {}) {
            super({success});
        }
        execute({fleet} = {}) {
            if (!this.success) {
                return 0;
            }
            const weightedDefence = super.getWeightedDefence(fleet);
            const fleetDefence = super.getFleetDefence(fleet);
            const bonus = fleet.antiaircraftCutin.floatingBonus;
            const rev = fleet.fleetRevision;
            const result = ((weightedDefence + fleetDefence) * rev * bonus) / 10;
            return Math.trunc(result);
        }
    }
    
    class MinimumGuarantee extends Downing {
        constructor() {
            super({success: true});
        }
        execute({fleet} = {}) {
            const result = 1 + fleet.antiaircraftCutin.fixedBonus;
            return result;
        }
    }
    
    class Equipment {
        constructor({typeName, antiaircraft = 0, improvement = 0} = {}) {
            this.typeName = typeName;
            this.antiaircraft = antiaircraft;
            this.improvement = improvement;
        }
        get weightedAntiaircraft() {
            const mag = weightedMagnification[this.typeName] || 0;
            const imp = weightedImprovement[this.typeName] || 0;
            return mag * this.antiaircraft + imp * Math.sqrt(this.improvement);
        }
        get floatingAntiaircraft() {
            const mag = fleetMagnification[this.typeName] || 1.0;
            const imp = floatingImprovement[this.typeName] || 1.0;
            return mag * this.antiaircraft + imp * Math.sqrt(this.improvement);
        }
    }
    
    class Ship {
        constructor({antiaircraft = 0, equipments = [], 
            intercept = false,
            fleetPosition = 1} = {}) {
            this.antiaircraft = antiaircraft;
            this.equipments = equipments;
            this.intercept = intercept;
            this.fleetPosition = fleetPosition;
        }
        get weightedAntiaircraft() {
            const allEqValue = this.equipments.map(eq => eq.weightedAntiaircraft)
                                            .reduce((a, b) => a + b, 0);
            return this.antiaircraft + allEqValue;
        }
        get floatingAntiaircraft() {
            const allEqValue = this.equipments.map(eq => eq.floatingAntiaircraft)
                                            .reduce((a, b) => a + b, 0);
            return Math.trunc(allEqValue);
        }
    }
    
    class AntiaircraftCutin {
        constructor({shipTypeName, cutinTypeName} = {}) {
            this.shipTypeName = shipTypeName;
            this.cutinTypeName = cutinTypeName;
        }
        get bonus() {
            const cutins = antiaircraftBonus[this.shipTypeName];
            if (cutins && this.cutinTypeName in cutins) {
                return cutins[this.cutinTypeName];
            } else {
                return {
                    fixed: 0,
                    floating: 0
                };
            }
        }
        get fixedBonus() {
            return this.bonus.fixed;
        }
        get floatingBonus() {
            return this.bonus.floating;
        }
    }
    
    class AntiaircraftCutin2 {
        constructor({fixedBonus, cutinTypeName} = {}) {
            this.fixedBonus = fixedBonus;
            this.floatingBonus = floatingBonus;
        }
    }
    
    class MisfireAntiaircraftCutin extends AntiaircraftCutin {
        constructor() {
            // superのコンストラクタ呼び出しが無いと実行時エラーとなる。
            super();
        }
        get fixedBonus() {
            return 0;
        }
        get floatingBonus() {
            return 1.0;
        }
    }
    
    class Fleet {
        constructor({ships = [], downings = [], 
            antiaircraftCutin = new MisfireAntiaircraftCutin(), 
            formationRevision = 1.0,
            fleetRevisionValue = 1.0} = {}) {
            this.ships = ships;
            this.downings = downings;
            this.antiaircraftCutin = antiaircraftCutin;
            this.formationRevision = formationRevision;
            this.fleetRevisionValue = fleetRevisionValue;
        }
        antiaircraftFire(enemy) {
            const fleet = this;
            const enemyCarrySize = enemy.targetSlotCarrySize;
            const downingSize = this.downings.map(downing => downing.execute({
                fleet, enemyCarrySize
            })).reduce((a, b) => a + b, 0);
            return downingSize < enemyCarrySize ? downingSize : enemyCarrySize;              
        }
        get interceptShip() {
            const intercepter = this.ships.filter(ship => ship.intercept)[0];
            if (intercepter) {
                return intercepter;
            } else {
                throw new Error("迎撃艦が指定されていません。");
            }
        }
        get fleetRevision() {
            return this.fleetRevisionValue;
        }
    }
    
    class NormalFleet extends Fleet {
        constructor({ships = [], downings = [], 
            antiaircraftCutin, 
            formationName = "単縦陣"} = {}) {
            const formationRevision = formationRevisionValues.normal[formationName];
            super({ships, downings, antiaircraftCutin, formationRevision});
        }
        get name() {
            return "通常艦隊";
        }
    }
    
    class UnionFleet extends Fleet {
        constructor({ships = [], downings = [], 
            antiaircraftCutin, 
            formationName = "第2警戒"} = {}) {
            const formationRevision = formationRevisionValues.union[formationName];
            super({ships, downings, antiaircraftCutin, formationRevision});
        }
        get fleetRevision() {
            const intercepter = super.interceptShip;
            return unionRevisionValues[intercepter.fleetPosition] || 1.0;
        }
        get name() {
            return "連合艦隊";
        }
    }
    
    class Enemy {
        constructor({carries = [0, 0, 0, 0, 0], targetSlotNumber = 0} = {}) {
            this.carries = carries;
            this.targetSlotNumber = targetSlotNumber;
        }
        get targetSlotCarrySize() {
            return this.carries[this.targetSlotNumber];
        }
    }
    
    const makeFleet = ({
        downings = [], 
        ships = [], 
        antiaircraftCutin,
        fleetTypeName,
        formationName
    }) => {
        if (!fleetTypeName) {
            throw new Error(`Fleet type is falsy: ${fleetTypeName}`);
        }
        
        const type = fleetTypeName.toLowerCase();
        if (type === "normal") {
            return new NormalFleet({
                downings, 
                ships, 
                antiaircraftCutin,
                formationName
            });
        } else if(type === "union") {
            return new UnionFleet({
                downings, 
                ships, 
                antiaircraftCutin,
                formationName
            });
        } else {
            throw new Error(`Fleet type is invalid: ${fleetTypeName}`);
        }
    };
    
    // for Test
    
    const makeSampleShip = (fleetPosition, intercept) => {
        const eq1 = new Equipment({
            typeName: "高角砲(高射装置有)",
            antiaircraft: 10,
            improvement: 10
        }),
        eq2 = new Equipment({
            typeName: "高角砲(高射装置有)",
            antiaircraft: 10,
            improvement: 10
        }),
        eq3 = new Equipment({
            typeName: "小型電探",
            antiaircraft: 4,
            improvement: 10
        });    
        
        const equipments = [eq1, eq2, eq3];
            
        const ship = new Ship({
            antiaircraft: 119,
            equipments,
            intercept,
            fleetPosition
        });   
        
        return ship;
    };
    
    const makeSampleNormalFleet = downings => {
        const ships = [
            makeSampleShip(1, true)
        ];    
        
        const antiaircraftCutin = new AntiaircraftCutin({
            shipTypeName: "秋月型・同改",
            cutinTypeName: "高角砲_高角砲_電探"
        });
        
        const fleet = new NormalFleet({
            downings, 
            ships, 
            antiaircraftCutin
        });
        
        return fleet;
    };
    
    const makeSampleUnionFleet = downings => {
        const ships = [
            makeSampleShip(1, false),
            makeSampleShip(1, true)
        ];    
        
        const antiaircraftCutin = new AntiaircraftCutin({
            shipTypeName: "秋月型・同改",
            cutinTypeName: "高角砲_高角砲_電探"
        });
        
        const fleet = new UnionFleet({
            downings, 
            ships, 
            antiaircraftCutin
        });
        
        return fleet;
    };
    
    const runTest = () => {
        const enemy = new Enemy({carries: [50, 50], targetSlotNumber: 0});
        const rd = new RateDowning({success: true}),
            fd = new FixedDowning({success: true}),
            mg = new MinimumGuarantee();
        const downings = [rd, fd, mg];
        //const fleet = makeSampleNormalFleet(downings);
        const fleet = makeSampleUnionFleet(downings);
        
        const downingSize = fleet.antiaircraftFire(enemy);
        console.log(`${fleet.name}は敵艦載機${enemy.targetSlotCarrySize}機のうち${downingSize}機撃墜しました。`);
    };
    
    // DOM
    
    const q = (selector, base) => {
        return (base || document).querySelector(selector);
    };
    
    const qa = (selector, base) => {
        return (base || document).querySelectorAll(selector);
    };
    
    const ctn = txt => {
        return document.createTextNode(txt);
    };
    
    const ce = elementName => {
        return document.createElement(elementName);
    };
    
    const makeAntiaircraftElement = () => {
        const antiAir = ce("label");
        antiAir.appendChild(ctn("対空値"));
        const antiAirInput = ce("input");
        antiAirInput.setAttribute("class", "antiaircraft-value");
        antiAirInput.setAttribute("type", "number");
        antiAirInput.setAttribute("min", "0");
        antiAirInput.setAttribute("max", "100");
        antiAirInput.setAttribute("value", "0");
        antiAir.appendChild(antiAirInput);
        
        return antiAir;
    };
    
    const makeEquipmentElement = () => {
        const container = ce("div");
        container.setAttribute("class", "equipment");
        
        const wKeys = Object.keys(weightedMagnification),
            fKeys = Object.keys(fleetMagnification);
        const eqTypeNames = new Set(wKeys.concat(fKeys));
        const makeSel = () =>{
            const sel = ce("select");
            sel.setAttribute("class", "equipment-type");
            const defaultOp = ce("option");
            defaultOp.appendChild(ctn("装備無し"));
            sel.appendChild(defaultOp);
            eqTypeNames.forEach(name => {
                const op = ce("option");
                op.setAttribute("value", name);
                op.appendChild(ctn(name));
                sel.appendChild(op);
            });
            return sel;
        };
        
        const makeImp = () => {
            const imp = ce("label"); 
            imp.appendChild(ctn("改修度"));
            const impInput = ce("input");
            impInput.setAttribute("class", "equipment-improvement");
            impInput.setAttribute("type", "number");
            impInput.setAttribute("min", "0");
            impInput.setAttribute("max", "10");
            impInput.setAttribute("value", "0");
            imp.appendChild(impInput);
            return imp;
        };
        
        const maxSlotSize = 5;
        for (let i = 0; i < maxSlotSize; i++) {
            const eqEle = ce("div");
            eqEle.setAttribute("class", "equipment-info-container");
            eqEle.appendChild(makeSel());
            eqEle.appendChild(makeAntiaircraftElement());
            eqEle.appendChild(makeImp());
            container.appendChild(eqEle);
        }
        
        return container;
    };
    
    const makeEquipments = shipEle => {
        const eqs = qa(".equipment-info-container", shipEle);
        const equipments = Array.from(eqs).map(eqEle => {
            const antiaircraft = parseInt(q(".antiaircraft-value", eqEle).value);
            const typeName = q(".equipment-type", eqEle).value;
            const improvement = parseInt(q(".equipment-improvement", eqEle).value);
            
            const equipment = new Equipment({
                typeName, antiaircraft, improvement
            });            
            
            return equipment;
        });
        
        return equipments;
    };
    
    const makeShipElement = fleetPosition => {
        const container = ce("div");
        container.setAttribute("class", "ship");
        
        const antiAir = makeAntiaircraftElement();
        const eqEle = makeEquipmentElement();
        
        const intercept = ce("label");
        const interceptInput = ce("input");
        interceptInput.setAttribute("class", "check-intercept");
        interceptInput.setAttribute("type", "checkbox");
        interceptInput.addEventListener("click", evt => {
            if (evt.target.checked) {
                interceptInput.setAttribute("checked", "checked");
            } else {
                interceptInput.removeAttribute("checked");
            }
        });
        intercept.appendChild(interceptInput);
        intercept.appendChild(ctn("迎撃艦選出"));
        
        const fp = ce("input");
        fp.setAttribute("class", "fleet-position");
        fp.setAttribute("type", "hidden");
        fp.setAttribute("value", fleetPosition);
        
        container.appendChild(antiAir);
        container.appendChild(eqEle);
        container.appendChild(intercept);
        container.appendChild(fp);
        
        return container;
    };
    
    const makeAntiaircraftCutinElement = () => {
        const container = ce("div");
        
        const sel = ce("select");
        sel.setAttribute("class", "antiaircraft-cutin-type");
        const defaultOp = ce("option");
        defaultOp.appendChild(ctn("カットイン不発"));
        defaultOp.setAttribute("selected", "selected");
        sel.appendChild(defaultOp);
        Object.keys(antiaircraftBonus).forEach(parentType => {
            const optionGroup = ce("optgroup");
            optionGroup.setAttribute("label", parentType);
            Object.keys(antiaircraftBonus[parentType]).forEach(type => {
                const option = ce("option");
                option.appendChild(ctn(type));
                // ページに設定値を保存してしまうと，ページがキャッシュされた後
                // 設定値が更新された場合に最新の設定値を使用できない恐れがある。
                // これを回避するため設定値のキーを保存するにとどめる。
                // キーは値よりは更新頻度が低いはずである。
                option.setAttribute("value", `${parentType},${type}`);
                optionGroup.appendChild(option);
            });
            sel.appendChild(optionGroup);
        });
        container.appendChild(sel);
        
        return container;
    };
    
    const makeFormationElement = fleetTypeName => {
        const container = ce("div");
        const sel = ce("select");
        sel.setAttribute("class", `${fleetTypeName}-formation-type formation-type`);
        Object.keys(formationRevisionValues[fleetTypeName])
                .forEach((name, index) => {
            const option = ce("option");
            option.appendChild(ctn(name));
            option.setAttribute("value", name);
            if (index === 0) {
                option.setAttribute("selected", "selected");
            }
            sel.appendChild(option);
        });
        container.appendChild(sel);
        
        return container;
    };
    
    const appendShips = (fleetPosition, className) => {
        const container1 = q(className);
        const fleetShipSize = 6;
        for (let i = 0; i < fleetShipSize; i++) {
            const shipEle = makeShipElement(fleetPosition);
            container1.appendChild(shipEle);
        }
    };
    
    const makePage = () => {
        const normalFc = q(".normal-formation-container");
        normalFc.appendChild(makeFormationElement("normal"));
        const unionFc = q(".union-formation-container");
        unionFc.appendChild(makeFormationElement("union"));
        
        const cutinContainer = q(".antiaircutin-container");
        cutinContainer.appendChild(makeAntiaircraftCutinElement());
        
        appendShips(1, ".first-fleet-info-container");
        appendShips(2, ".second-fleet-info-container");
    };
    
    const makeShips = containerClassName => {
        const container = q(containerClassName);
        const ships = Array.from(qa(".ship", container)).map(shipEle => {
            const eqEle = q(".equipment-type", shipEle);
            const ship = new Ship({
                antiaircraft: parseInt(q(".antiaircraft-value", shipEle).value),
                equipments: makeEquipments(shipEle),
                intercept: Boolean(q(".check-intercept", shipEle).checked),
                fleetPosition: q(".fleet-position", shipEle).value
            });
            return ship;
        });
        
        return ships;
    };
    
    const turnVisibleState = ({selector, visible}) => {
        Array.from(qa(selector)).forEach(ele => ele.classList.toggle("invisible"));
    };
    
    const outputResult = ({fleet, enemy}) => {
        const resultArea = q(".result");
        let result;
        try {
            const downingSize = fleet.antiaircraftFire(enemy);
            result = `${fleet.name}は敵艦載機${enemy.targetSlotCarrySize}機のうち${downingSize}機撃墜しました。`;
        } catch(err) {
            result = err.message;
        }
        resultArea.innerHTML = result;
    };
    
    const makeAircraftCutin = () => {
        const selectedCutinValue = q(".antiaircraft-cutin-type").value;
        let antiaircraftCutin = new MisfireAntiaircraftCutin();
        if (selectedCutinValue && selectedCutinValue.split(",").length >= 2) {
            const cutinNames = selectedCutinValue.split(",");
            antiaircraftCutin = new AntiaircraftCutin({
                shipTypeName: cutinNames[0],
                cutinTypeName: cutinNames[1]
            });
        }
        
        return antiaircraftCutin;
    };
    
    const makeDownings = ({rateSuccess, fixedSuccess}) => {
        const rd = new RateDowning({success: rateSuccess}),
            fd = new FixedDowning({success: fixedSuccess}),
            mg = new MinimumGuarantee();
        const downings = [rd, fd, mg];
        
        return downings;
    };
    
    const runCalc = () => {
        const enemy = new Enemy({
            carries: [parseInt(q(".enemy-carry-size").value)], 
            targetSlotNumber: 0
        });
        
        const rateSuccess = q(".success-intercept.rate").checked;
        const fixedSuccess = q(".success-intercept.fixed").checked;
        const downings = makeDownings({rateSuccess, fixedSuccess});

        const fleetTypeName = Array.from(qa(".fleet-type"))
                .filter(ele => ele.checked)[0].value;
        const formationName = q(`.${fleetTypeName}-formation-type`).value;
        
        const antiaircraftCutin = makeAircraftCutin();
        
        let ships = makeShips(".first-fleet-info-container");
        if (fleetTypeName === "union") {
            ships = ships.concat(makeShips(".second-fleet-info-container"));
        }

        const fleet = makeFleet({
            downings, fleetTypeName, formationName, antiaircraftCutin, ships
        });
        outputResult({fleet, enemy});
    };
    
    const addListener = () => {
        q(".runner").addEventListener("click", runCalc);
        // 各input要素ではなくそのコンテナ要素にイベントリスナーを登録する。
        // バブリングしてきたイベントを調べて各要素の表示状態を切り替える。
        q(".fleet-type-container").addEventListener("click", evt => {
            if (evt.target.getAttribute("class") === "fleet-type") {
                evt.stopPropagation();
                const selector = ".visibility-target";
                const visible = evt.target.value === "union";
                turnVisibleState({selector, visible});
            }
        });
    };
    
    window.addEventListener("DOMContentLoaded", async () => {
        await loadConfig();
        //runTest();
        makePage();
        addListener();
    });
})(window, document);
