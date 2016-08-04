(((win, doc, lB) => {
	"use strict";
	
	const IMPROVEMENT_VALUES = {
		MIN: 0,
		MAX: 10,
		DEFAULT: 0
	};
		
	const AIRCRAFT_TYPE_NAMES = {
		KS: "kansen", 
		KK: "kankou", 
		KB: "kanbaku", 
		SB: "suibaku", 
		SS: "suisen"
	};
	
	class AircraftType {
		constructor (name, bonus) {
			this.name = name;
			this.bonus = bonus;
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
		[AIRCRAFT_TYPE_NAMES.KK]: new AircraftType(AIRCRAFT_TYPE_NAMES.KK, 3),
		[AIRCRAFT_TYPE_NAMES.KB]: new AircraftType(AIRCRAFT_TYPE_NAMES.KB, 3),
		[AIRCRAFT_TYPE_NAMES.SB]: new AircraftType(AIRCRAFT_TYPE_NAMES.SB, 9),
		[AIRCRAFT_TYPE_NAMES.SS]: new AircraftType(AIRCRAFT_TYPE_NAMES.SS, 25)
	};
	
	/**
	 * AircraftTypeの名前ではなくAircraftTypeオブジェクトをキーにしたい。
	 * Mapを使って表現すれば可能だが，現状のMapは値取得時に渡されたキーを
	 * 同値演算子(===)でしか既存のキーと比較できない。
	 */
	const CORRECTION_VALUES = {
		[AIRCRAFT_TYPE_NAMES.KS]: 0.2,
		[AIRCRAFT_TYPE_NAMES.KB]: 0.25
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
		constructor (name, type, ack, {skill = 7, improvement = 0} = {}) {
			this.name = name;
			this.type = type;
			this.ack = ack;
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
	
	const AIRCRAFTS_FACTORY = {
		rp: () => new Aircraft("rp", getAircraftType(AIRCRAFT_TYPE_NAMES.KS), 10),
		rp601: () => new Aircraft("rp601", getAircraftType(AIRCRAFT_TYPE_NAMES.KS), 11),
		rpk: () => new Aircraft("rpk", getAircraftType(AIRCRAFT_TYPE_NAMES.KS), 12),
		z53i: () => new Aircraft("z53i", getAircraftType(AIRCRAFT_TYPE_NAMES.KS), 12),
		z62i: () => new Aircraft("z62i", getAircraftType(AIRCRAFT_TYPE_NAMES.KB), 7),
		fw: () => new Aircraft("fw", getAircraftType(AIRCRAFT_TYPE_NAMES.KS), 10),
		ms: () => new Aircraft("ms", getAircraftType(AIRCRAFT_TYPE_NAMES.KS), 8),
		z21j: () => new Aircraft("z21j", getAircraftType(AIRCRAFT_TYPE_NAMES.KS), 8),
		z32j: () => new Aircraft("z32j", getAircraftType(AIRCRAFT_TYPE_NAMES.KS), 8),
		z52j: () => new Aircraft("z52j", getAircraftType(AIRCRAFT_TYPE_NAMES.KS), 9),
		z52h601: () => new Aircraft("z52h601", getAircraftType(AIRCRAFT_TYPE_NAMES.KS), 9),
		z62: () => new Aircraft("z62", getAircraftType(AIRCRAFT_TYPE_NAMES.KB), 4),
		sd2: () => new Aircraft("sd2", getAircraftType(AIRCRAFT_TYPE_NAMES.KS), 9),
		zu601: () => new Aircraft("zu601", getAircraftType(AIRCRAFT_TYPE_NAMES.SB), 3),
		zu12: () => new Aircraft("zu12", getAircraftType(AIRCRAFT_TYPE_NAMES.SB), 3),
		sr: () => new Aircraft("sr", getAircraftType(AIRCRAFT_TYPE_NAMES.SB), 0),
		ns: () => new Aircraft("ns", getAircraftType(AIRCRAFT_TYPE_NAMES.SS), 3),
		rs: () => new Aircraft("rs", getAircraftType(AIRCRAFT_TYPE_NAMES.SS), 2),
		sse: () => new Aircraft("sse", getAircraftType(AIRCRAFT_TYPE_NAMES.KB), 1),
		ss601: () => new Aircraft("ss601", getAircraftType(AIRCRAFT_TYPE_NAMES.KB), 0),
		tzt: () => new Aircraft("tzt", getAircraftType(AIRCRAFT_TYPE_NAMES.KK), 1),
		tzm: () => new Aircraft("tzm", getAircraftType(AIRCRAFT_TYPE_NAMES.KK), 1),
		rs601: () => new Aircraft("rs601", getAircraftType(AIRCRAFT_TYPE_NAMES.KK), 0),
		shinden: () => new Aircraft("shinden", getAircraftType(AIRCRAFT_TYPE_NAMES.KS), 15)
	};
	
	class Slot {
		constructor (size) {
			this.size = size || 0;
			this.aircraft = null;
		}
		
		toString () {
			return `size=${this.size}, {${this.aircraft || ""}}`;
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
	
	const calculateMastery = (ac, slot) => {
		const mastery = (ac.ack + getValueByImprovement(ac)) * 
			Math.sqrt(slot.size) + getSkillBonus(ac);
		
		return parseInt(mastery);
	};
	
	class Ship {
		constructor (name, loadingList) {
			this.name = name;
			this.slots = new Map(lB.map(loadingList, (size, idx) => {
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
		
		removeAircraft (slotNo) {
			this.setAircraft(slotNo, null);
		}
		
		getMasteryOneSlot (slotNo) {
			if (this.slots.has(slotNo)) {
				const slot = this.getSlot(slotNo);
				const ac = this.getAircraft(slotNo);
				if (ac) {
					return calculateMastery(ac, slot);
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
			/**
			 * NoNameShipのスロットはからの状態から変更させない。
			 */
		}
		
		get mastery () {
			return 0;
		}
	}
	
	/**
	 * 仕様検討中。
	 * 正常に動作はするが，必須パラメータをRest Parameterで
	 * 扱うべきではないかもしれない。
	 */
	const getShipMaker = (name, ...slots) => {
		return () => new Ship(name, slots);
	};
	
	const SHIPS = {
		ag: () => new Ship("ag", [20, 20, 32, 10]),
		kg: () => new Ship("kg", [20, 20, 46, 12]),
		sr2: () => new Ship("sr2", [18, 35, 20, 6]),
		hr2: () => new Ship("hr2", [18, 36, 22, 3]),
		sk2: () => new Ship("sk2", [27, 27, 27, 12]),
		sk2k: () => new Ship("sk2k", [34, 21, 12, 9]),
		zk2: () => new Ship("zk2", [28, 26, 26, 13]),
		zk2k: () => new Ship("zk2k", [34, 24, 12, 6]),
		hs: () => new Ship("hs", [14, 16, 12]),
		th: () => new Ship("th", [30, 24, 24, 8]),
		ur: () => new Ship("ur", [18, 21, 27, 3]),
		amg: () => new Ship("amg", [18, 21, 27, 3]),
		ktg: () => new Ship("ktg", [18, 21, 27, 3]),
		sh: () => new Ship("sh", [18, 12, 12, 6]),
		zh: () => new Ship("zh", [18, 12, 12, 6]),
		rh: () => new Ship("rh", [21, 9, 9, 6]),
		hy: () => new Ship("hy", [18, 18, 18, 12]),
		jy2: () => new Ship("jy2", [24, 18, 20, 3]),
		cht2: () => new Ship("cht2", [24, 18, 11, 8]),
		chy2: () => new Ship("chy2", [24, 18, 11, 8]),
		rj2: () => new Ship("rj2", [18, 28, 6, 3]),
		gz: () => new Ship("gz", [30, 13, 10, 3]),
		aks: () => new Ship("aks", [1, 1, 1]),
		akm: () => new Ship("akm", [8, 8, 8]),
		i401: () => new Ship("i401", [3, 3]),
		i58: () => new Ship("i58", [1, 1]),
		i19: () => new Ship("i19", [1, 1]),
		i8: () => new Ship("i8", [1, 1]),
		hys: () => new Ship("hys", [6, 3, 1])
	};
	
	const getShip = name => {
		if (name in SHIPS) {
			return SHIPS[name]();
		} else {
			return new NoNameShip();
		}		
	};
	
	const testCalculateMastery = () => {
		const ship1 = SHIPS.ag();
		
		ship1.setAircraft(1, AIRCRAFTS_FACTORY.rp());
		ship1.setAircraft(2, AIRCRAFTS_FACTORY.rp601());
		ship1.setAircraft(3, AIRCRAFTS_FACTORY.rpk());
		ship1.setAircraft(4, AIRCRAFTS_FACTORY.z62i());
		
		console.log(ship1.toString());
		console.log(ship1.mastery);
		
		const ship2 = SHIPS.kg();
		
		ship2.setAircraft(1, AIRCRAFTS_FACTORY.rp());
		ship2.setAircraft(2, AIRCRAFTS_FACTORY.rp601());
		const z53i = AIRCRAFTS_FACTORY.z53i();
		z53i.improve(5);
		ship2.setAircraft(3, z53i);
		const z62i = AIRCRAFTS_FACTORY.z62i();
		z62i.improve(5);
		ship2.setAircraft(4, z62i);
		
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
		impEle.setAttribute("value", IMPROVEMENT_VALUES.DEFAULT);
		
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
		
		const acImpContainer = doc.createElement("span");
		acImpContainer.setAttribute("class", "aircraft-improve-range-container");
		acImpContainer.appendChild(impEle);
		const impValEle = doc.createElement("span");
		impValEle.setAttribute("class", "aircraft-improve-value");
		impValEle.innerText = getImprovementText(IMPROVEMENT_VALUES.DEFAULT);
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
	
	const changeShipSlot = (ship, slotNo) => {
		return evt => {
			const acName = evt.target.value;
			if (acName in AIRCRAFTS_FACTORY) {
				const aircraft = AIRCRAFTS_FACTORY[acName]();
				ship.setAircraft(slotNo, aircraft);
			} else {
				ship.removeAircraft(slotNo);
			}
			
			/**
			 * 要素の親子や兄弟の関係はサードパーディのライブラリ利用時に
			 * 変更されることがあるので，parentNodeやchildNodes等は極力
			 * 使うべきでない。
			 */
			resetImprovementRange(evt.target.parentNode);
		};
	};
	
	const createAircraftSelector = (ship, slotNo) => {
		const aircraftSubBase = doc.createElement("div");
		aircraftSubBase.setAttribute("class", "aircraft-selector-container");
		
		const aircraftSelector = doc.createElement("select");
		aircraftSelector.setAttribute("class", "aircraft-selector");
		const empOpt = new Option("", "", true, true);
		aircraftSelector.appendChild(empOpt);
		appendAllAircrafts(aircraftSelector);
		aircraftSelector.addEventListener("change", changeShipSlot(ship, slotNo), false);
		aircraftSubBase.appendChild(aircraftSelector);
		
		const slotLoadingSize = ship.getSlot(slotNo).size;
		const slotLoadingEle = doc.createElement("span");
		slotLoadingEle.setAttribute("class", "aircraft-loading-size");
		slotLoadingEle.innerText = slotLoadingSize;
		aircraftSubBase.appendChild(slotLoadingEle);
		
		const improvementRange = createImprovementRange(ship, slotNo);
		aircraftSubBase.appendChild(improvementRange);
		
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
	
	const setupShips = () => {
		appendAllShips();
	};
	
	const initPage = () => {
		setupShips();
		
		lB.select(".calculator").addEventListener("click", evt => {
			const ships = getAllSelectedShips();
			const masteries = lB.map(ships, ship => ship.mastery);
			const result = lB.reduce(masteries, (m1, m2) => m1 + m2);
			const resultArea = lB.select(".result .result-area");
			resultArea.innerText = result;
		}, false);
	};
	
	const init = () => {
		testCalculateMastery();
		initPage();
	};
	
	init();
	
})(window, document, window.lB));
