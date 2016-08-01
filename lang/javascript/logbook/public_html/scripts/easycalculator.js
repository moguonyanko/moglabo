(((win, doc, lB) => {
	"use strict";
	
	/**
	 * @todo
	 * Calculator implement
	 */
	
	class Aircraft {
		/**
		 * Parameter Context Matchingのデフォルト値を[]や{}の右辺に書くことができる。
		 */
		constructor (name, ack, {skill = 7, improvement = 0} = {}) {
			this.name = name;
			this.ack = ack;
			this.skill = skill;
			this.improvement = improvement;
		}
		
		/**
		 * Function文をここに定義することはできない。 
		 */
		//function fail(){}
		
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
		
		setAircraft (slotNo, aircraft) {
			if (this.slots.has(slotNo)) {
				const slot = this.slots.get(slotNo);
				slot.aircraft = aircraft;
				this.slots.set(slotNo, slot);
			} else {
				throw new InvalidSlotError(slotNo);
			}
		}
		
		getAircraft (slotNo) {
			if (this.slots.has(slotNo)) {
				return this.slots.get(slotNo).aircraft;
			} else {
				throw new InvalidSlotError(slotNo);
			}
		}
		
		toString () {
			const s = [this.name].concat(lB.map(this.slots.entries(), value => {
				const [slotNo, slot] = value;
				return `slot[${slotNo}]:${slot}`;
			}));
			
			return s.join("\n");
		}
	}
	
	const test = () => {
		const ship = new Ship("ag", [20, 20, 32, 10]);
		
		ship.setAircraft(1, new Aircraft("zi", 12, {
			improvement: 5
		}));
		ship.setAircraft(2, new Aircraft("r", 10));
		ship.setAircraft(3, new Aircraft("tm", 1));
		ship.setAircraft(4, new Aircraft("z21j", 8, {
			skill: 5
		}));
		
		console.log(ship.toString());
	};
	
	const init = () => {
		test();
	};
	
	init();
	
})(window, document, window.lB));
