(((win, doc, lB) => {
	"use strict";
		
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
			if (value < 0) {
				value = 0;
			}
			
			if (10 < value) {
				value = 10;
			}
			
			this.improvement = value;
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
		z62i: () => new Aircraft("z62i", getAircraftType(AIRCRAFT_TYPE_NAMES.KB), 7),
		z53i: () => new Aircraft("z53i", getAircraftType(AIRCRAFT_TYPE_NAMES.KS), 12),
	};
	
	class Slot {
		constructor (size) {
			this.size = size;
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
		
		getMasteryOneSlot (slotNo) {
			if (this.slots.has(slotNo)) {
				const slot = this.getSlot(slotNo);
				const ac = this.getAircraft(slotNo);
				if (ac) {
					const m = (ac.ack + getValueByImprovement(ac)) * 
						Math.sqrt(slot.size) + getSkillBonus(ac);
					return parseInt(m);
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
			super("noname", [0, 0, 0, 0]);
		}
		
		setSlot () {
			/* Does nothing. */
		}
	}
	
	const SHIPS = {
		ag: () => new Ship("ag", [20, 20, 32, 10]),
		kg: () => new Ship("kg", [20, 20, 46, 12]),
		sr2: () => new Ship("sr2", [18, 35, 20, 6]),
		hr2: () => new Ship("hr2", [18, 36, 22, 3]),
		sk2k: () => new Ship("sk2k", [34, 21, 12, 9]),
		zk2k: () => new Ship("zk2k", [34, 24, 12, 6]),
		hs: () => new Ship("hs", [14, 16, 12])
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
	
	const appendAircraft = (aircraftSelector, name) => {
		const aircraftEle = new Option(name, name);
		aircraftSelector.appendChild(aircraftEle);
	};
	
	const appendAircraftSelectors = (slotSize, selectBase) => {
		const baseClassName = "aircraft-selector-base";
		const aircraftBase = doc.createElement("div");
		aircraftBase.setAttribute("class", baseClassName);
			
		for (let i = 0; i < slotSize; i++) {
			const aircraftSubBase = doc.createElement("div");
			const aircraftSelector = doc.createElement("select");
			aircraftSelector.setAttribute("class", "aircraft-selector");
			const empOpt = new Option("", "", true, true);
			aircraftSelector.appendChild(empOpt);
			aircraftSubBase.appendChild(aircraftSelector);
			aircraftBase.appendChild(aircraftSubBase);
		}
			
		/**
		 * @todo
		 * append aircraft elements.
		 */
		
		if(lB.select("." + baseClassName, selectBase)){
			selectBase.replaceChild(aircraftBase, lB.select("." + baseClassName, selectBase));
		} else {
			selectBase.appendChild(aircraftBase);
		}
	};
	
	const appendShip = (shipName, selectBase) => {
		const shipEle = new Option(shipName, shipName);
		const shipSel = lB.select(".ship-selector", selectBase);
		shipSel.appendChild(shipEle);
		shipSel.addEventListener("change", evt => {
			const value = evt.target.value;
			const ship = getShip(value);
			const slotSize = ship.slotSize;
			appendAircraftSelectors(slotSize, selectBase);
		}, false);
	};
	
	const appendAllShips = () => {
		lB.forEach(selectAllShipElements(), selectBase => {
			lB.forEach(Object.keys(SHIPS), shipName => {
				appendShip(shipName, selectBase);
			});
		});
	};
	
	const getSelectedShip = selectBase => {
		const shipSel = lB.select(".ship-selector", selectBase);
		if (shipSel.value in SHIPS) {
			return getShip(shipSel.value);
		} else {
			return new NoNameShip();
		}
	};
	
	const getAllSelectedShips = () => {
		return lB.map(selectAllShipElements(), selectBase => {
			return getSelectedShip(selectBase);
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
