((window, document) => {
    "use strict";
    
    // 以下の設定オブジェクト群は暫定である。
    
    const antiaircraftBonus = {
        "秋月型・同改": {
            "高角砲_高角砲_電探": {
                "fixed": 7,
                "floating": 1.7
            },
            "高角砲_電探": {
                "fixed": 6,
                "floating": 1.7
            },
            "高角砲_高角砲": {
                "fixed": 4,
                "floating": 1.6
            }
        }
    };
    
    const weightedMagnification = {
        "対空機銃": 6,
        "高角砲": 4,
        "高射装置": 4,
        "小型電探": 3,
        "大型電探": 3
    };
    
    const fleetMagnification = {
        "三式弾": 0.6,
        "高角砲": 0.35,
        "高射装置": 0.35,
        "小型電探": 0.4,
        "大型電探": 0.4,
        "対空機銃": 0.2,
        "主砲(赤)": 0.2,
        "副砲(黄)": 0.2,
        "艦戦": 0.2,
        "艦爆": 0.2,
        "水偵": 0.2
    };
    
    const weightedImprovement = {
        "対空機銃": 4,
        "高角砲(高射装置有)": 3,
        "高角砲(高射装置無)": 2,
        "高射装置": 2
    };
    
    const floatingImprovement = {
        "高角砲(高射装置有)": 3,
        "高角砲(高射装置無)": 2,
        "高射装置": 2,
        "小型電探": 1.5,
        "大型電探": 1.5
    };
    
    const formationRevision = {
        normal: {
            "単縦陣": 1.0,
            "複縦陣": 1.2,
            "梯形陣": 1.0,
            "単横陣": 1.0,
            "輪形陣": 1.6
        }
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
            const revision = fleet.formation.revision;
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
            const result = Math.trunc((weightedDefence / 400) * enemyCarrySize);
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
            const result = Math.trunc(((weightedDefence + fleetDefence) * bonus) / 10);
            return result;
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
            intercept = false} = {}) {
            this.antiaircraft = antiaircraft;
            this.equipments = equipments;
            this.intercept = intercept;
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
            try {
                return antiaircraftBonus[this.shipTypeName][this.cutinTypeName];
            } catch(err) {
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
            formation} = {}) {
            this.ships = ships;
            this.downings = downings;
            this.antiaircraftCutin = antiaircraftCutin;
            this.formation = formation;
        }
        get interceptShip() {
            return this.ships.filter(ship => ship.intercept)[0];
        }
    }
    
    class Formation {
        constructor({name, revision}) {
            this.name = name;
            this.revision = revision;
        }
    }
    
    class NormalFleet extends Fleet {
        constructor({ships = [], downings = [], 
            antiaircraftCutin, 
            formation = new Formation({name: "単縦陣", revision: 1.0})} = {}) {
            super({ships, downings, antiaircraftCutin, formation});
        }
        antiaircraftFire(enemy) {
            const fleet = this;
            const enemyCarrySize = enemy.targetSlotCarrySize;
            const downingSize = this.downings.map(downing => downing.execute({
                fleet, enemyCarrySize
            })).reduce((a, b) => a + b, 0);
            return downingSize;              
        }
    }
    
    // TODO: 連合艦隊は未対応
    // Fleetを2つ持つクラスにした方がいいかもしれない。
    class UnionFleet extends Fleet {
        constructor({ships = [], downings = [], 
            antiaircraftCutin, 
            formation = new Formation({name: "第2警戒", revision: 1.0})} = {}) {
            super({ships, downings, antiaircraftCutin, formation});
            // 連合艦隊補正値は第1艦隊と第2艦隊で異なる。
        }
        antiaircraftFire() {
            throw new Error("Not implement");
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
    
    const runTest = () => {
        const enemy = new Enemy({carries: [50, 50], targetSlotNumber: 0});
        
        const rd = new RateDowning({success: true}),
            fd = new FixedDowning({success: true}),
            mg = new MinimumGuarantee();
        const downings = [rd, fd, mg];
            
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
        //const equipments = [];
            
        const ship1 = new Ship({
            antiaircraft: 119,
            equipments,
            intercept: true
        });   
        const ships = [ship1];    
        
        const antiaircraftCutin = new AntiaircraftCutin({
            shipTypeName: "秋月型・同改",
            cutinTypeName: "高角砲_高角砲_電探"
        });
            
        const fleet = new NormalFleet({downings, ships, antiaircraftCutin});
        //const fleet = new NormalFleet({downings, ships});
        
        const downingSize = fleet.antiaircraftFire(enemy);
        
        console.log(`${enemy.targetSlotCarrySize} のうち ${downingSize} 機撃墜しました。`);
    };
    
    const init = () => {
        runTest();
    };
    
    window.addEventListener("DOMContentLoaded", init);
})(window, document);
