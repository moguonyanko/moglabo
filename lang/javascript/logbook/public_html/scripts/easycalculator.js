(((win, doc, lB) => {
	"use strict";
	
	const CORRECTION_VALUES = {
		KS: 0.2,
		KB: 0.25
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
		KS: new AircraftType("KS", 25),
		KK: new AircraftType("KK", 3),
		KB: new AircraftType("KB", 3),
		SB: new AircraftType("SB", 9),
		SS: new AircraftType("SS", 25)
	};
	
	const getSkillBonus = aircraft => {
		return aircraft.type.bonus;
	};
	
	const getValueByImprovement = aircraft => {
		const cv = CORRECTION_VALUES[aircraft.type.name];
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
	
	const AIRCRAFTS_FACTORY = {
		rp: () => new Aircraft("rp", AIRCRAFT_TYPES.KS, 10),
		rp601: () => new Aircraft("rp601", AIRCRAFT_TYPES.KS, 11),
		rpk: () => new Aircraft("rpk", AIRCRAFT_TYPES.KS, 12),
		z62i: () => new Aircraft("z62i", AIRCRAFT_TYPES.KB, 7),
		z53i: () => new Aircraft("z53i", AIRCRAFT_TYPES.KS, 12),
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
	
	const SHIPS = {
		ag: new Ship("ag", [20, 20, 32, 10]),
		kg: new Ship("kg", [20, 20, 46, 12]),
		sr2: new Ship("sr2", [18, 35, 20, 6]),
		hr2: new Ship("hr2", [18, 36, 22, 3]),
		sk2k: new Ship("sk2k", [34, 21, 12, 9]),
		zk2k: new Ship("zk2k", [34, 24, 12, 6])
	};
	
	const initPage = () => {
		/**
		 * @todo 
		 * implement
		 */
	};
	
	const test = () => {
		const ship1 = SHIPS.ag;
		
		ship1.setAircraft(1, AIRCRAFTS_FACTORY.rp());
		ship1.setAircraft(2, AIRCRAFTS_FACTORY.rp601());
		ship1.setAircraft(3, AIRCRAFTS_FACTORY.rpk());
		ship1.setAircraft(4, AIRCRAFTS_FACTORY.z62i());
		
		console.log(ship1.toString());
		console.log(ship1.mastery);
		
		const ship2 = SHIPS.kg;
		
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
	
	const init = () => {
		test();
	};
	
	init();
	
})(window, document, window.lB));
