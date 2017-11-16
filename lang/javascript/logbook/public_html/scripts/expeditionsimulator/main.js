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
        get income() {
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
        get income() {
            if (this.isExceededTime()) {
                const msg = `${this.name}の総遠征時間が制限時間(${this.availableTime}分)を超過しています。`;
                throw new Error(msg);
            }
            
            return this.expeditionService.income;
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
                income = fleet.income;
            console.log(`${name}は総遠征時間(${time}分)で収入は[${income}]です。`);
        });
    };
    
    // DOM
    
    const qs = (selector, base) => (base || document).querySelector(selector),
        qsa = (selector, base) => (base || document).querySelectorAll(selector),
        ce = elementName => document.createElement(elementName),
        cdf = () => document.createDocumentFragment(),
        ctn = text => document.createTextNode(text),
        attr = (element, property, value) => element.setAttribute(property, value);
    
    const configBasePath = "../../scripts/expeditionsimulator/";
        
    const loadConfigJson = async jsonName => {
        const response = await fetch(configBasePath + jsonName);
        if (!response.ok) {
            throw new Error(`Failded loading ${jsonName}: ${response.status}`);
        }
        return await response.json();
    };
    
    // IndexedDB
    // Reference: 
    // https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB
    
    const DB_NAME_PREFIX = "expeditionsimulator";
    
    const idb = window.indexedDB;
    
    const REVISION_DB_NAME = `${DB_NAME_PREFIX}_revision`,
        EXPEDITION_DB_NAME = `${DB_NAME_PREFIX}_expedition`;
        
    const dbConfig = {
        revision: {
            version: 1,
            dbName: `${DB_NAME_PREFIX}_revision`,
            storeName: "revision",
            configPath: "incomerevisionitem.json",
            keyPath: "name",
            index: "name"
        },
        expedition: {
            version: 1,
            dbName: `${DB_NAME_PREFIX}_expedition`,
            storeName: "expedition",
            configPath: "expeditiondata.json",
            keyPath: "name",
            index: "name"
        }
    };
        
    /**
     * IDBDatabase.transactionによるトランザクションの開始が非同期処理より前に
     * 行われているとデータの追加に失敗する。非同期処理の最中にトランザクションが
     * 終了してしまうようである。
     * https://stackoverflow.com/questions/22605065/transactioninactiveerror-in-indexeddb
     * https://stackoverflow.com/questions/40314074/indexeddb-transactioninactiveerror
     */
    const addAllItems = ({db, configPath, storeName}) => {
        return new Promise(async (resolve, reject) => {
            const json = await loadConfigJson(configPath);
            const transaction = db.transaction([storeName], "readwrite");
            const store = transaction.objectStore(storeName);
            console.log(`Try to add: ${JSON.stringify(json)}`);
            transaction.oncomplete = () => {
                console.log(`Transaction completed: ${storeName}`);
                resolve(store);
            };
            transaction.onerror = reject;
            Object.keys(json).forEach(key => json[key].forEach(item => {
                    try {
                        const request = store.add(item);
                        console.log(`Added: ${JSON.stringify(item)}`);
                        request.onerror = reject;
                    } catch (err) {
                        console.log(err);
                        reject(err);
                    }
            }));
        });
    };
    
    const createStore = ({db, index, keyPath, configPath, storeName}) => {
        return new Promise((resolve, reject) => {
            try {
                if (db.objectStoreNames.contains(storeName)) {
                    db.deleteObjectStore(storeName);
                }
                console.log(`Try to create store: ${storeName}`);
                const store = db.createObjectStore(storeName, {keyPath});
                console.log(`Created store: ${storeName}`);
                store.createIndex(index, keyPath, {unique: true});
                store.transaction.oncomplete = async () => {
                    try {
                        resolve(await addAllItems({db, configPath, storeName}));
                    } catch (err) {
                        console.log(err);
                        reject(err);
                    }
                };
            } catch (err) {
                console.log(err);
                reject(err);
            }
        });
    };
    
    const initDatabases = () => {
        const promises = Object.keys(dbConfig).map(key => {
            return new Promise((resolve, reject) => {
                const config = dbConfig[key];
                const request = idb.open(config.dbName, config.version);
                let doResolve = (db, resv) => {
                    db.close();
                    resv(db);
                };
                request.onupgradeneeded = async event => {
                    const db = event.target.result;
                    const arg = Object.assign({ db }, config);
                    await createStore(arg);
                    doResolve(db, resolve);
                };
                request.onsuccess = event => {
                    console.log(event);
                    const db = event.target.result;
                    console.log(`IDB init succeeded: ${db.name}`);
                    // TODO: onupgradeneededが呼び出されなかった時だけ
                    // onsuccessでresolveを呼び出さなければならない。
                    //doResolve(db, resolve);
                };
                request.onerror = reject;
            });
        });
        return new Promise((resolve, reject) => {
            Promise.all(promises).then(resolve).catch(reject);
        });
    };
    
    const getStoredData = configName => {
        return new Promise((resolve, reject) => {
            const config = dbConfig[configName];
            const request = idb.open(config.dbName, config.version);
            request.onerror = reject;
            request.onsuccess = event => {
                const db = event.target.result;
                const tx = db.transaction([config.storeName]);
                const store = tx.objectStore(config.storeName);
                const index = store.index(config.index);
                const cursorRequest = index.openCursor();
                
                const results = {};
                cursorRequest.onsuccess = event => {
                    if (event.target.result) {
                        const cursor = event.target.result;
                        results[cursor.key] = cursor.value;
                        // ここでresolveを呼び出しても同じレコードしか返せない。
                        //resolve(cursor.value);
                        cursor.continue();
                    } else {
                        db.close();
                        resolve(results);
                    }
                };
                
// IteratorかGeneratorでレコードを1件ずつ処理できるようにしたいが
// どちらもTransactionInactiveErrorが発生してしまう。
                
//// Iterator version                
//                cursorRequest.onsuccess = event => {
//                    resolve({
//                        [Symbol.iterator] () {
//                            return {
//                                next: () => {
//                                    const cursor = event.target.result;
//                                    if (!cursor) {
//                                        db.close();
//                                        return { done: true };
//                                    }
//                                    const value = cursor.value;
//                                    cursor.continue();
//                                    return {
//                                        done: false,
//                                        value
//                                    };
//                                }
//                            };
//                        }
//                    });
//                };
                
//// Generator version                
//                cursorRequest.onsuccess = event => {
//                    resolve(function* () {
//                        while (true) {
//                            const cursor = event.target.result;
//                            if (!cursor) {
//                                db.close();
//                                return;
//                            }
//                            const value = cursor.value;
//                            cursor.continue();
//                            yield value;
//                        }
//                    });
//                };
            };
        });
    };
    
    const getStoredExpedition = async () => await getStoredData("expedition");
    
    const getStoredRevision = async () => await getStoredData("revision");
    
    /**
     * @deprecated getAllは非標準メソッドらしい。
     */
    const getAllData = storeName => {
        return new Promise((resolve, reject) => {
            const tx = db.transaction([storeName]);
            const store = tx.objectStore(storeName);
            const request = store.getAll();
            request.onsuccess = event => resolve(event.target.result);
            request.onerror = reject;
        });
    };

    const makeConfigSelector = data => {
        const sel = ce("select");
        const initialOpt = ce("option");
        attr(initialOpt, "selected", true);
        initialOpt.appendChild(ctn("未選択"));
        sel.appendChild(initialOpt);
        Object.keys(data).forEach(name => {
            const opt = ce("option");
            attr(opt, "value", name);
            opt.appendChild(ctn(name));
            sel.appendChild(opt);
        });
        return sel;
    };
    
    const makeSizeElement = ({name, min, max, defaultValue = 0, className}) => {
        const label = ce("label");
        label.appendChild(ctn(name));
        const size = ce("input");
        attr(size, "type", "number");
        attr(size, "min", min);
        attr(size, "max", max);
        attr(size, "value", defaultValue);
        attr(size, "class", className);
        label.appendChild(size);
        return label;
    };
    
    // for Test
    const dumpRevisionData = async () => {
        try {
            const gf = await getStoredRevision();
            console.log(gf);
//            for (const v of gf) {
//                console.log(v);
//            }
//            const g = gf();
//            console.log(g.next());
//            console.log(g.next());
//            console.log(g.next());
        } catch (err) {
            console.log(err);
        }
    };
    
    const makeRevisionSelectors = async () => {
        const revisionData = await getStoredRevision();
        const bases = qsa(".revision-container");
        Array.from(bases).forEach(base => {
            const frag = cdf();
            const sel = makeConfigSelector(revisionData);
            attr(sel, "class", "revision-data-selector");
            frag.appendChild(sel);
            const size = makeSizeElement({
                name: "装備数",
                min: 0,
                max: 4,
                defaultValue: 4,
                className: "revision-data-size"
            });
            frag.appendChild(size);
            base.appendChild(frag);
        });
    };
    
    const makeSuccessExpeditionInput = () => {
        const successLabel = ce("label");
        const successEle = ce("input");
        attr(successEle, "class", "expedition-success-check");
        attr(successEle, "type", "checkbox");
        successLabel.appendChild(successEle);
        successLabel.appendChild(ctn("大成功"));
        return successLabel;
    };
    
    const makeExpeditionSelectors = async () => {
        const expeditionData = await getStoredExpedition(); 
        const bases = qsa(".expedition-container");
        Array.from(bases).forEach(base => {
            const frag = cdf();
            const sel = makeConfigSelector(expeditionData);
            attr(sel, "class", "expedition-data-selector");
            frag.appendChild(sel);
            const size = makeSizeElement({
                name: "遠征回数",
                min: 0,
                max: 99,
                defaultValue: 1,
                className: "expedition-data-size"
            });
            frag.appendChild(size);
            frag.appendChild(makeSuccessExpeditionInput());
            base.appendChild(frag);
        });
    };
    
    const getSelectedRevisionItems = async fleetEle => {
        const revBase = qs(".revision-container", fleetEle);
        const items = [];
        const name = qs(".revision-data-selector", revBase).value;
        const revisionData = await getStoredRevision();
        if (!(name in revisionData)) {
            return items;
        }
        const size = parseInt(qs(".revision-data-size", revBase).value);
        for (let i = 0; i < size; i++) {
            const obj = revisionData[name];
            items.push(new IncomeRevisionItem(obj));
        }
        return items;
    };
    
    const getSelectedExpedtions = async fleetEle => {
        const selector = qs(".expedition-data-selector", fleetEle);
        const expedtions = [];
        const name = selector.value;
        const expeditionData = await getStoredExpedition(); 
        if (!(name in expeditionData)) {
            return expedtions;
        }
        const expedtionObj = expeditionData[name];
        const time = expedtionObj.time,
            income = new Income(expedtionObj.income);
        const incomeRevisionItems = await getSelectedRevisionItems(fleetEle);
        const greetSuccess = qs(".expedition-success-check", fleetEle).checked;
        const size = parseInt(qs(".expedition-data-size", fleetEle).value);
        for (let i = 0; i < size; i++) {
            const expedition = new Expedition({
                name,
                time, 
                income,
                incomeRevisionItems,
                greetSuccess
            });
            expedtions.push(expedition);
        }
        return expedtions;
    };
    
    const makeFleets = () => {
        const fleetEles = qsa(".fleet-container");
        const fleets = Array.from(fleetEles).map(async fleetEle => {
            const name = qs(".fleet-name input", fleetEle).value;
            const availableTime = parseInt(qs(".availabletime", fleetEle).value);
            const expeditions = await getSelectedExpedtions(fleetEle);
            const fleet = new Fleet({
                name,
                availableTime,
                expeditions
            });
            return fleet;
        });
        return fleets;
    };
    
    const addListener = () => {
        const calculater = qs(".calc");
        const result = qs(".result");
        calculater.addEventListener("click", () => {
            result.innerHTML = "";
            const fleets = makeFleets();
            // TODO: Fleetの配列ではなくPromiseの配列が返ってきてしまう。
            console.log(fleets);
            fleets.map(f => f.then(fleet => {
                try {
                    const info = [
                        `${fleet.name}は総遠征時間(${fleet.sumOfTime}分)で`,
                        `収入は[${fleet.income}]です。<br />`
                    ];
                    result.innerHTML += info.join("");
                } catch(err) {
                    result.innerHTML += `${err.message}<br />`;
                }
            }));
//            fleets.forEach(fleet => {
//                try {
//                    const info = [
//                        `${fleet.name}は総遠征時間(${fleet.sumOfTime}分)で`,
//                        `収入は[${fleet.income}]です。<br />`
//                    ];
//                    result.innerHTML += info.join("");
//                } catch(err) {
//                    result.innerHTML += `${err.message}<br />`;
//                }
//            });
        });
    };
    
    const init = async () => {
        //testCalc();
        try {
            const dbs = await initDatabases();
            console.log(dbs);
        } catch (err) {
            console.error(err);
        } 

        await makeRevisionSelectors();
        await makeExpeditionSelectors();
        console.log("Maked page elements");
        addListener();
    };
    
    window.addEventListener("DOMContentLoaded", init);
})(window, document);
