/**
 * @version 1.02
 */

(((win, doc, lB) => {
	"use strict";
	
	const IMPROVEMENT_VALUES = {
		MIN: 0,
		MAX: 10,
		DEFAULT: 0
	};
		
	const AIRCRAFT_TYPE_NAMES = {
		KS: "kansen",  //艦上戦闘機
		KK: "kankou",  //艦上攻撃機
		KB: "kanbaku",  //艦上爆撃機
		SB: "suibaku",  //水上爆撃機
		SS: "suisen", //水上戦闘機
		HB: "hunbaku", //噴式爆撃機
        RS: "rikusen", //陸軍戦闘機
        KYS: "kyokusen", //局地戦闘機
        RK: "rikko", //陸上攻撃機
        KT: "kantei", //艦上偵察機
        ST: "suitei" //水上偵察機
	};
	
	class AircraftType {
		constructor (name, bonus, defaultNoSkillBonus = false) {
			this.name = name;
			this.bonus = bonus;
            this.defaultNoSkillBonus = defaultNoSkillBonus;
		} 
		
		toString () {
			return this.name;
		}
	}
	
	/**
	 * 今のところskill < 7は考慮していない。
	 * 常に最大skillのボーナス値が設定されている。
	 */
	const AIRCRAFT_TYPES = {
		[AIRCRAFT_TYPE_NAMES.KS]: new AircraftType(AIRCRAFT_TYPE_NAMES.KS, 25),
		[AIRCRAFT_TYPE_NAMES.KK]: new AircraftType(AIRCRAFT_TYPE_NAMES.KK, 3, true),
		[AIRCRAFT_TYPE_NAMES.KB]: new AircraftType(AIRCRAFT_TYPE_NAMES.KB, 3, true),
		[AIRCRAFT_TYPE_NAMES.SB]: new AircraftType(AIRCRAFT_TYPE_NAMES.SB, 9, true),
		[AIRCRAFT_TYPE_NAMES.SS]: new AircraftType(AIRCRAFT_TYPE_NAMES.SS, 25),
		[AIRCRAFT_TYPE_NAMES.HB]: new AircraftType(AIRCRAFT_TYPE_NAMES.HB, 3, true),
		[AIRCRAFT_TYPE_NAMES.RS]: new AircraftType(AIRCRAFT_TYPE_NAMES.RS, 25),
		[AIRCRAFT_TYPE_NAMES.KYS]: new AircraftType(AIRCRAFT_TYPE_NAMES.KYS, 25),
		[AIRCRAFT_TYPE_NAMES.RK]: new AircraftType(AIRCRAFT_TYPE_NAMES.RK, 3, true),
		[AIRCRAFT_TYPE_NAMES.KT]: new AircraftType(AIRCRAFT_TYPE_NAMES.KT, 3, true),
		[AIRCRAFT_TYPE_NAMES.ST]: new AircraftType(AIRCRAFT_TYPE_NAMES.ST, 3, true)
	};
	
	/**
	 * AircraftTypeの名前ではなくAircraftTypeオブジェクトをキーにしたい。
	 * Mapを使って表現すれば可能だが，現在のMapは値取得時に渡されたキーを
	 * 同値演算子(===)でしか既存のキーと比較できない。
     * 
     * 改修できない機種の場合，改修による補正値は0として扱う。
	 */
	const CORRECTION_VALUES = {
		[AIRCRAFT_TYPE_NAMES.KS]: 0.2,
		[AIRCRAFT_TYPE_NAMES.KB]: 0.25,
		[AIRCRAFT_TYPE_NAMES.SS]: 0.2
	};
	
	const getCorrectionValue = aircraft => {
		if (aircraft.type.name in CORRECTION_VALUES) {
			return CORRECTION_VALUES[aircraft.type.name];
		} else {
			return 0;
		}
	};
	
	const getSkillBonus = aircraft => {
		return aircraft.type.bonus;
	};
	
	const getValueByImprovement = aircraft => {
		const cv = getCorrectionValue(aircraft);
		return cv * aircraft.improvement;
	};
	
	class Aircraft {
		/**
		 * Parameter Context Matchingのデフォルト値を[]や{}の右辺に書くことができる。
		 */
		constructor ({
            name, 
            type, 
            ack = 0, 
            intercept = 0,
            antibomb = 0,
            skill = 7, 
			improvement = IMPROVEMENT_VALUES.DEFAULT } = {}) {
			this.name = name;
			this.type = type;
			this.ack = ack;
			this.intercept = intercept;
			this.antibomb = antibomb;
			this.skill = skill;
			this.improvement = improvement;
		}
		
		/**
		 * Function文をここに定義することはできない。 
		 */
		//function fail(){}
		
		improve (value) {
			let impValue = parseInt(value);
			
			/**
			 * Number.isNaNはグローバル関数のisNaNと異なり暗黙の型変換を行わない。
			 * 引数の型がnumberでなければ常にfalseを返す。
			 */
			if (Number.isNaN(value)) {
				impValue = IMPROVEMENT_VALUES.DEFAULT;
			} else if (impValue < IMPROVEMENT_VALUES.MIN) {
				impValue = IMPROVEMENT_VALUES.MIN;
			} else if (IMPROVEMENT_VALUES.MAX < impValue) {
				impValue = IMPROVEMENT_VALUES.MAX;
			} else {
				/* 範囲内の値はそのまま使用する。 */
			}
			
			this.improvement = impValue;
		}
		
		toString () {
			const s = [
				`name=${this.name}`,
				`ack=${this.ack}`,
				`skill=${this.skill}`,
				`improvement=${this.improvement}`
			];
			
			return s.join(", ");
		}
	}
	
	const getAircraftType = typeName => AIRCRAFT_TYPES[typeName];

	const AIRCRAFTS_FACTORY = {};
	
	const setAircraftMaker = acData => {
		AIRCRAFTS_FACTORY[acData.name] = () => new Aircraft({
            name: acData.name,
            type: getAircraftType(AIRCRAFT_TYPE_NAMES[acData.type]), 
			ack: acData.ack,
            intercept: acData.intercept,
            antibomb: acData.antibomb,
            skill: acData.skill, 
            improvement: acData.improvement 
        });
	};

	const toAircraftsJSON = () => {
		let result = [];
		
		for(let name in AIRCRAFTS_FACTORY){
			const ac = AIRCRAFTS_FACTORY[name]();
			result.push("\"" + ac.name + "\":" + JSON.stringify(ac));
		}
		
		return "{" + result.join(",") + "}";
	};
	
	class Slot {
		constructor (size, noSkillBonus = false) {
			this.size = size || 0;
			this.aircraft = null;
            this.noSkillBonus = noSkillBonus;
		}
		
		toString () {
            const msg = [
                `size=${this.size}`,
                `{${this.aircraft || "未装備"}}`,
                `熟練度ボーナス=${this.noSkillBonus ? "なし" : "あり"}`
            ];
			return msg.join(",");
		}
	}
	
	class InvalidSlotError extends Error {
		constructor (slotNo) {
			this.slotNo = slotNo;
		}
		
		get message () {
			return "Invalid slot number : " + this.slotNo;
		}
	}
	
    /**
     * 制空値の計算を行う。
     * 防空時には未対応。
     */
	const calculateMastery = (ac, slot, noSkillBonus = false) => {
        const ack = ac.ack + getValueByImprovement(ac);
        const skillBonus = noSkillBonus ? 0 : getSkillBonus(ac);
		const mastery = (ack + (ac.intercept * 1.5)) * 
			Math.sqrt(slot.size) + skillBonus;
		return parseInt(mastery);
	};
	
	class Ship {
		constructor (name, slotComposition) {
			this.name = name;
			this.slots = new Map(lB.map(slotComposition, (size, idx) => {
				return [idx + 1, new Slot(size)];
			}));
		}
		
		get slotSize () {
			return this.slots.size;
		}
		
		getSlot (slotNo) {
			if (this.slots.has(slotNo)) {
				return this.slots.get(slotNo);
			} else {
				throw new InvalidSlotError(slotNo);
			}
		}
		
		setSlot (slotNo, slot) {
			if (this.slots.has(slotNo)) {
				this.slots.set(slotNo, slot);
			} else {
				throw new InvalidSlotError(slotNo);
			}
		}
		
		getAircraft (slotNo) {
			const slot = this.getSlot(slotNo);
			return slot.aircraft;
		}
		
		setAircraft (slotNo, aircraft) {
			const slot = this.getSlot(slotNo);
			slot.aircraft = aircraft;
			this.setSlot(slotNo, slot);
		}
		
		getNoSkillBonus (slotNo) {
			const slot = this.getSlot(slotNo);
			return slot.noSkillBonus;
		}
		
		setNoSkillBonus (slotNo, noSkillBonus = false) {
			const slot = this.getSlot(slotNo);
			slot.noSkillBonus = noSkillBonus;
			this.setSlot(slotNo, slot);
		}
        
		removeAircraft (slotNo) {
			this.setAircraft(slotNo, null);
		}
		
		getMasteryOneSlot (slotNo) {
			if (this.slots.has(slotNo)) {
				const ac = this.getAircraft(slotNo);
				if (ac) {
                    const slot = this.getSlot(slotNo);
                    const noSkillBonus = this.getNoSkillBonus(slotNo);
					return calculateMastery(ac, slot, noSkillBonus);
				} else {
					return 0;
				}
			} else {
				return 0;
			}
		}
		
		get mastery () {
			const masteries = lB.map(this.slots.keys(), 
				slotNo => this.getMasteryOneSlot(slotNo));
			
			const result = lB.reduce(masteries, (a, b) => a + b);
			
			return result;
		}
		
		toString () {
			const s = [this.name].concat(lB.map(this.slots.entries(), value => {
				const [slotNo, slot] = value;
				return `slot[${slotNo}]:${slot}`;
			}));
			
			return s.join("\n");
		}
	}
	
	class NoNameShip extends Ship {
		constructor () {
			super("", []);
		}
		
		setSlot () {
            // NoNameShipのスロットは空の状態から変更させない。
		}
		
		get mastery () {
			return 0;
		}
	}
	
	const SHIPS = {};
	
	const setShipMaker = shipData => {
		SHIPS[shipData.name] = () => new Ship(shipData.name, shipData.slotComposition);
	};
	
	const toShipsJSON = () => {
		let res = [];
		
		for(let name in SHIPS){
			res.push("\"" + name + "\":" + JSON.stringify(SHIPS[name]()));
		}
		
		return "{" + res.join(",") + "}";
	};
	
	const getShip = name => {
		if (name in SHIPS) {
			return SHIPS[name]();
		} else {
			return new NoNameShip();
		}		
	};
	
    const makeAircraft = (name, type, ack) => {
        return new Aircraft({name, type, ack});
    };
    
	const testCalculateMastery = () => {
		const ship1 = new Ship("ag", [20, 20, 32, 10]);
		
		ship1.setAircraft(1, makeAircraft("rp", getAircraftType(AIRCRAFT_TYPE_NAMES.KS), 10));
		ship1.setAircraft(2, makeAircraft("rp601", getAircraftType(AIRCRAFT_TYPE_NAMES.KS), 11));
		ship1.setAircraft(3, makeAircraft("rpk", getAircraftType(AIRCRAFT_TYPE_NAMES.KS), 12));
		ship1.setAircraft(4, makeAircraft("z62i", getAircraftType(AIRCRAFT_TYPE_NAMES.KB), 7));
        ship1.setNoSkillBonus(4, true);
		
		console.log(ship1.toString());
		console.log(ship1.mastery);
		
		const ship2 = new Ship("kg", [20, 20, 46, 12]);
		
		ship2.setAircraft(1, makeAircraft("rp", getAircraftType(AIRCRAFT_TYPE_NAMES.KS), 10));
		ship2.setAircraft(2, makeAircraft("rp601", getAircraftType(AIRCRAFT_TYPE_NAMES.KS), 11));
		const z53i = makeAircraft("z53i", getAircraftType(AIRCRAFT_TYPE_NAMES.KS), 12);
		z53i.improve(5);
		ship2.setAircraft(3, z53i);
		const z62i = makeAircraft("z62i", getAircraftType(AIRCRAFT_TYPE_NAMES.KB), 7);
		z62i.improve(5);
		ship2.setAircraft(4, z62i);
        ship2.setNoSkillBonus(4, true);
		
		console.log(ship2.toString());
		console.log(ship2.mastery);
		
		console.log(ship1.mastery + ship2.mastery);
	};
	
	/* 計算対象指定用ページの構築 */
	
	const selectAllShipElements = () => {
		return lB.selectAll(".ships .ship");
	};
	
	const appendAircraft = (aircraftSelector, acName) => {
		const aircraftEle = new Option(acName, acName);
		aircraftSelector.appendChild(aircraftEle);
	};
	
	const appendAllAircrafts = aircraftSelector => {
		lB.forEach(Object.keys(AIRCRAFTS_FACTORY), acName => {
			appendAircraft(aircraftSelector, acName);
		});
	};
	
	const getImprovementText = impValue => {
		const value = parseInt(impValue);
		
		if (Number.isNaN(value) || value <= IMPROVEMENT_VALUES.MIN) {
			return "　";
		} else if (IMPROVEMENT_VALUES.MAX <= value) {
			return "★max";
		} else {
			return "★" + value;
		}
	};
	
	const createImprovementRange = (ship, slotNo) => {
		const impEle = doc.createElement("input");
		impEle.setAttribute("class", "aircraft-improve-range");
		impEle.setAttribute("type", "range");
		impEle.setAttribute("min", IMPROVEMENT_VALUES.MIN);
		impEle.setAttribute("max", IMPROVEMENT_VALUES.MAX);
		
		let impValue = IMPROVEMENT_VALUES.DEFAULT;
		if(ship.getAircraft(slotNo)){
			impValue = ship.getAircraft(slotNo).improvement;
		} 
		impEle.setAttribute("value", impValue);
		
		const impValEle = doc.createElement("span");
		impValEle.setAttribute("class", "aircraft-improve-value");
		impValEle.innerText = getImprovementText(impValue);
		const improveAircraft = evt => {
			const aircraft = ship.getAircraft(slotNo);
			if (aircraft) {
				const impValue = evt.target.value;
				aircraft.improve(impValue);
				ship.setAircraft(slotNo, aircraft);
				impValEle.innerText = getImprovementText(impValue);
			}
		};
		impEle.addEventListener("change", improveAircraft, false);
		
		const acImpContainer = doc.createElement("div");
		acImpContainer.setAttribute("class", "aircraft-improve-range-container");
		acImpContainer.appendChild(impEle);
		acImpContainer.appendChild(impValEle);
		
		return acImpContainer;
	};
	
	const resetImprovementRange = rangeBase => {
		const impEle = lB.select(".aircraft-improve-range", rangeBase);
		if (impEle) {
			impEle.value = IMPROVEMENT_VALUES.DEFAULT;
		}
		
		const impValEle = lB.select(".aircraft-improve-value", rangeBase);
		if (impValEle) {
			impValEle.innerText = getImprovementText(IMPROVEMENT_VALUES.DEFAULT);
		}
	};
    
    class NoSkillBonusChecker {
        constructor(ship, slotNo) {
            this.checkerClassName = "aircraft-nobonus-checker";
            const container = doc.createElement("div");
            container.setAttribute("class", "aircraft-nobonus-checker-container");

            const checker = doc.createElement("input");
            checker.setAttribute("class", this.checkerClassName);
            checker.setAttribute("type", "checkbox");
            checker.addEventListener("click", 
                () => ship.setNoSkillBonus(slotNo, checker.checked));

            const label = doc.createElement("label");
            label.appendChild(checker);
            label.appendChild(doc.createTextNode("熟練度なし"));

            container.appendChild(label);
            
            this.container = container;
        }
        
        get checkElement() {
            return this.container.querySelector(`.${this.checkerClassName}`);
        }
    }
	
    /**
     * 航空機が選択された時のイベントハンドラを返します。
     */
	const changeShipSlot = (ship, slotNo, checker) => {
		return evt => {
			const acName = evt.target.value;
			if (acName in AIRCRAFTS_FACTORY) {
				const aircraft = AIRCRAFTS_FACTORY[acName]();
				ship.setAircraft(slotNo, aircraft);
                const defaultNoSkillBonus = aircraft.type.defaultNoSkillBonus;
                ship.setNoSkillBonus(slotNo, defaultNoSkillBonus);
                if (defaultNoSkillBonus) {
                    checker.checkElement.checked = "checked";
                } else {
                    checker.checkElement.checked = null;
                }
			} else {
				ship.removeAircraft(slotNo);
                ship.setNoSkillBonus(slotNo, false);
                checker.checkElement.checked = null;
			}
			/**
			 * 要素の親子や兄弟の関係はサードパーティのライブラリ利用時に
			 * 変更されることがあるので，parentNodeやchildNodes等は極力
			 * 使うべきでない。
			 */
			resetImprovementRange(evt.target.parentNode);
		};
	};
	
    const createNoSkillBonusChecker = (ship, slotNo) => {
        /**
         * 要素を横に並べるためにspanのようなinline要素を選択するべきではない。
         * 表示方法はCSSに任せる。
         */
        const container = doc.createElement("div");
        container.setAttribute("class", "aircraft-nobonus-checker-container");
        
        const checker = doc.createElement("input");
        checker.setAttribute("class", "aircraft-nobonus-checker");
        checker.setAttribute("type", "checkbox");
        checker.addEventListener("click", 
            () => ship.setNoSkillBonus(slotNo, checker.checked));
        
        const label = doc.createElement("label");
        label.appendChild(checker);
        label.appendChild(doc.createTextNode("熟練度なし"));
        
        container.appendChild(label);
        
        return container;
    };
    
	const createAircraftSelector = (ship, slotNo) => {
		const aircraftSubBase = doc.createElement("div");
		aircraftSubBase.setAttribute("class", "aircraft-selector-container");
		
        const noSkillBonusChecker = new NoSkillBonusChecker(ship, slotNo);
        const changeSlotListener = changeShipSlot(ship, slotNo, noSkillBonusChecker);
        
		const aircraftSelector = doc.createElement("select");
		aircraftSelector.setAttribute("class", "aircraft-selector");
		const empOpt = new Option("", "", true, true);
		aircraftSelector.appendChild(empOpt);
		appendAllAircrafts(aircraftSelector);
		aircraftSelector.addEventListener("change", changeSlotListener, false);
		aircraftSubBase.appendChild(aircraftSelector);
		
		const slotLoadingSize = ship.getSlot(slotNo).size;
		const slotLoadingEle = doc.createElement("span");
		slotLoadingEle.setAttribute("class", "aircraft-loading-size");
		slotLoadingEle.innerText = slotLoadingSize;
		aircraftSubBase.appendChild(slotLoadingEle);
		
		const improvementRange = createImprovementRange(ship, slotNo);
		aircraftSubBase.appendChild(improvementRange);
		
		aircraftSubBase.appendChild(noSkillBonusChecker.container);
        
		return aircraftSubBase;
	};
	
	const appendAircraftSelectors = (ship, selectBase) => {
		const baseClassName = "aircraft-selector-base";
		const aircraftBase = doc.createElement("div");
		aircraftBase.setAttribute("class", baseClassName);
			
		for (let i = 0; i < ship.slotSize; i++) {
			const slotNo = i + 1;
			const aircraftSelector = createAircraftSelector(ship, slotNo);
			aircraftBase.appendChild(aircraftSelector);
		}
			
		if (lB.select("." + baseClassName, selectBase)) {
			selectBase.replaceChild(aircraftBase, lB.select("." + baseClassName, selectBase));
		} else {
			selectBase.appendChild(aircraftBase);
		}
	};
	
	const selectedShips = ((() => {
		let selShips = {};
		
		lB.forEach(selectAllShipElements(), (selectBase, idx) => {
			selShips[idx] = {};
		});
		
		return selShips;
	})());
	
	const saveSelectedShip = (shipIdx, ship) => {
		/**
		 * 現在選択されていないShipの情報は削除してよい。
		 * ただしもう一度選択した際に以前設定した状態で復帰させたい場合は必要になる。
		 */
		selectedShips[shipIdx] = {};
		
		if (ship.name in SHIPS) {
			selectedShips[shipIdx][ship.name] = ship;
		}
	};
	
	const findSelectedShip = (shipIdx, shipName) => {
		if (shipIdx in selectedShips) {
			return selectedShips[shipIdx][shipName] || new NoNameShip();
		} else {
			return new NoNameShip();
		}
	};
	
	const appendShip = (shipName, selectBase, idx) => {
		const shipEle = new Option(shipName, shipName);
		const shipSel = lB.select(".ship-selector", selectBase);
		shipSel.appendChild(shipEle);
		shipSel.addEventListener("change", evt => {
			const value = evt.target.value;
			const ship = getShip(value);
			appendAircraftSelectors(ship, selectBase);
			saveSelectedShip(idx, ship);
		}, false);
	};
	
	const appendAllShips = () => {
		lB.forEach(selectAllShipElements(), (selectBase, idx) => {
			lB.forEach(Object.keys(SHIPS), shipName => {
				appendShip(shipName, selectBase, idx);
			});
		});
	};
	
	const getSelectedShip = (selectBase, idx) => {
		const shipSel = lB.select(".ship-selector", selectBase);
		return findSelectedShip(idx, shipSel.value);
	};
	
	const getAllSelectedShips = () => {
		return lB.map(selectAllShipElements(), (selectBase, idx) => {
			return getSelectedShip(selectBase, idx);
		});
	};
	
	const initPage = () => {
		appendAllShips();
		
		lB.select(".calculator").addEventListener("click", evt => {
			const ships = getAllSelectedShips();
			const masteries = lB.map(ships, ship => ship.mastery);
			const result = lB.reduce(masteries, (m1, m2) => m1 + m2);
			const resultArea = lB.select(".result .result-area");
			resultArea.innerText = result;
		}, false);
		
		console.info("Finished init page: " + new Date());
	};
	
	const reportError = err => {
		const reportEle = doc.createElement("span");
		/**
		 * classListでは複数のクラスを一度に設定できない。
		 * addの引数にスペースが含まれているとシンタックスエラーになる。
		 */
		reportEle.setAttribute("class", "error error-report");
		reportEle.appendChild(doc.createTextNode(err.message));
		lB.select(".result").replaceElement(reportEle);
	};
	
	const configLoader = (name, callback) => {
		return (oncomplete, onerror) => {
			lB.loadConfig(name, {
				onsuccess: res => {
					for (let key in res) {
						callback(res[key]);
					}
					oncomplete(name);
				},
				onerror
			});
		};
	};
    
    const putAppInfo = txt => {
        const info = doc.querySelector(".app-info");
        info.innerHTML = txt;
    };
	
    const registerService = async () => {
        if (!("serviceWorker" in navigator)) {
            throw new Error("ServiceWorker未対応");
        }

        const scope = "./";
        const url = "sw.js";
        return await navigator.serviceWorker.register(url, {scope});
    };
    
    // キャッシュのクリアにはキャッシュのキーが必要になる。
    // キャッシュ対象となるアプリのスクリプトでキャッシュのキーを
    // 参照するべきではないので，ServiceWorkerスクリプトに
    // キャッシュのクリアは任せてアプリのスクリプトでは
    // ServiceWorkerのregister及びunregisterのみ行う。
    const unregisterService = async registration => {
        return await registration.unregister();
    };
    
    const addInstallListener = () => {
        const installer = doc.querySelector(".app-installer");
        installer.addEventListener("click", async () => {
            try {
                await registerService();
                putAppInfo("インストール成功");
            } catch (err) {
                putAppInfo(`インストール失敗: ${err.message}`);
            }
        });
    };
    
    const addUninstallListener = async () => {
        const uninstaler = doc.querySelector(".app-uninstaller");
        uninstaler.addEventListener("click", async () => {
            try {
                // TODO: 
                // 登録済みServiceWorkerのServiceWorkerRegistrationを
                // 得る方法が分からないのでregisterを呼び出して取得している。
                // 本来は不要なはずである。
                const result = await unregisterService(await registerService());
                if (result) {
                    putAppInfo("アンインストール成功");
                } else {
                    putAppInfo("アンインストール失敗");
                }
            } catch (err) {
                putAppInfo(`アンインストール失敗: ${err.message}`);
            }
        });
    };
    
    const setupServiceWorkerListener = () => {
        addInstallListener();
        addUninstallListener();
    };
    
	const init = () => {
		//testCalculateMastery();
        setupServiceWorkerListener();
		
		const funcs = [
			configLoader("aircrafts.json", setAircraftMaker),
			configLoader("ships.json", setShipMaker)
		];
		
		lB.funcall(funcs, {
			oncomplete: loadedConfigNames => {
				console.info("Loaded config files: " + loadedConfigNames);
				initPage();
			},
			onerror: reportError
		});
	};
	
	win.addEventListener("DOMContentLoaded", init);
})(window, document, window.lB));
