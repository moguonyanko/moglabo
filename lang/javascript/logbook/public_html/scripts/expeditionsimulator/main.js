((window, document) => {
    "use strict";
    
    class Income {
        constructor({fuel = 0, ammunition = 0, steel = 0, bauxite = 0} = {}) {
            this.fuel = parseInt(fuel);
            this.ammunition = parseInt(ammunition);
            this.steel = parseInt(steel);
            this.bauxite = parseInt(bauxite);
        }
        get incomeItems() {
            const fuel = this.fuel, 
                ammunition = this.ammunition,
                steel = this.steel,
                bauxite = this.bauxite;
            return { fuel, ammunition, steel, bauxite };
        }
        merged(anotherIncome) {
            if (!anotherIncome) {
                return new Income(this.incomeItems);
            }
            
            const fuel = this.fuel + anotherIncome.fuel,
                ammunition = this.ammunition + anotherIncome.ammunition,
                steel = this.steel + anotherIncome.steel,
                bauxite = this.bauxite + anotherIncome.bauxite;
                
            return new Income({ fuel, ammunition, steel, bauxite });
        }
        toString() {
            const info = [
                `燃料:${this.fuel}`,
                `弾薬:${this.ammunition}`,
                `鋼材:${this.steel}`,
                `ボーキサイト:${this.bauxite}`
            ];
            return info.join(",");
        }
    }
    
    class Expedition {
        constructor({name, time = 0, income = new Income(), greetSuccess = false, 
            incomeRevisionItems = []} = {}) {
            this.name = name;
            this.time = time;
            this.income = income;
            this.greetSuccess = greetSuccess;
            this.incomeRevisionItems = incomeRevisionItems;
        }
        calcIncomeItems(revValue = 1.0) {
            const fuel = this.income.fuel * revValue,
                  ammunition = this.income.ammunition * revValue,
                  steel = this.income.steel * revValue,
                  bauxite = this.income.bauxite * revValue;
            return { fuel, ammunition, steel, bauxite };
        }
        getIncome() {
            if (this.incomeRevisionItems.length > 0) {
                let rate = this.incomeRevisionItems.map(rev => rev.revision)
                        .reduce((r1, r2) => r1 + r2, 0);
                // TODO: 獲得量上限(20%)突破時の計算は未対応
                if (rate >= 20) {
                    rate = 20;
                }
                let revValue = ((100 + rate) / 100);
                if (this.greetSuccess) {
                    revValue = revValue * 1.5;
                }
                return new Income(this.calcIncomeItems(revValue));
            } else {
                let revValue = this.greetSuccess ? 1.5 : 1.0;
                return new Income(this.calcIncomeItems(revValue));
            }
        }
    }
    
    class IncomeRevisionItem {
        constructor({name, revision = 0, enableExceeded = false} = {}) {
            this.name = name;
            this.revision = revision;
            this.enableExceeded = enableExceeded;
        }
    }
    
    class ExpeditionService {
        constructor({expeditions = []} = {}) {
            this.expeditions = expeditions;
        }
        get sumOfTime() {
            return this.expeditions.map(e => e.time)
                    .reduce((e1, e2) => e1 + e2, 0);
        }
        getIncome() {
            const resultIncome = this.expeditions
                    .map(e => e.getIncome())
                    .reduce((i1, i2) => i1.merged(i2), new Income());
            
            return resultIncome;
        }
    }
    
    class Fleet {
        constructor({name, expeditions = [], availableTime = 0} = {}) {
            this.name = name;
            this.availableTime = availableTime; // この艦隊で使える総遠征時間(分)
            this.expeditionService = new ExpeditionService({expeditions, availableTime});
        }
        get sumOfTime() {
            return this.expeditionService.sumOfTime;
        }
        isExceededTime() {
            return this.sumOfTime > this.availableTime;
        }
        getIncome() {
            if (this.isExceededTime()) {
                const msg = `${this.name}の総遠征時間が制限時間(${this.availableTime}分)を超過しています。`;
                throw new Error(msg);
            }
            
            return this.expeditionService.getIncome();
        }
    }
    
    const testCalc = () => {
        const rev1 = new IncomeRevisionItem({
            name: "大発動艇",
            revision: 5
        }),
        rev2 = new IncomeRevisionItem({
            name: "特大発動艇",
            revision: 7
        });
        
        const ep1 = new Expedition({
            name: "海上護衛任務",
            time: 90,
            income: new Income({
                fuel: 200, 
                ammunition: 200, 
                steel: 20, 
                bauxite: 20
            }),
            incomeRevisionItems: [rev1, rev1, rev1, rev1]
        }), 
        ep2 = new Expedition({
            name: "水上機基地建設",
            time: 540,
            income: new Income({
                fuel: 480, 
                ammunition: 0, 
                steel: 200, 
                bauxite: 200
            }),
            greetSuccess: true,
            incomeRevisionItems: [rev1, rev1, rev1, rev2]
        });
        
        const fleet1 = new Fleet({
            name: "第1艦隊",
            expeditions: [ep1, ep1, ep1, ep1],
            availableTime: 480
        }),
        fleet2 = new Fleet({
            name: "第2艦隊",
            expeditions: [ep2, ep1, ep1],
            availableTime: 720
        });
        
        const fleets = [ fleet1, fleet2 ];
        
        fleets.forEach(fleet => {
            const name = fleet.name,
                time = fleet.sumOfTime,
                income = fleet.getIncome();
            console.log(`${name}は総遠征時間(${time}分)で収入は[${income}]です。`);
        });
    };
    
    const init = () => {
        testCalc();
    };
    
    window.addEventListener("DOMContentLoaded", init);
})(window, document);
