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
            return downingSize;              
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
    
    // for Test
    
    const makeSampleShip = (fleetPosition, intercept) => {
        const eq1 = new Equipment({
            typeName: "高角砲＋高射装置",
            antiaircraft: 10,
            improvement: 10
        }),
        eq2 = new Equipment({
            typeName: "高角砲＋高射装置",
            antiaircraft: 10,
            improvement: 10
        }),
        eq3 = new Equipment({
            typeName: "対空電探",
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
    
    window.addEventListener("DOMContentLoaded", async () => {
        await loadConfig();
        runTest();
    });
})(window, document);
