(((self) => {
	"use strict";
	
	class Incrementer {
		constructor(intArray) {
			this.initial = intArray[0];
			this.limit = intArray[1];
			this.step = intArray[2];
		}
		
		[Symbol.iterator]() {
			let value = this.initial,
				done = false;
			
			return {
				next() {
					value += this.step;
					
					if (value >= this.limit) {
						done = true;
					}
					
					return { value, done };
				}
			};
		}
	}
	
	self.onmessage = evt => {
		const intArray = evt.data;
		const incrementer = new Incrementer(intArray);
		
		let reusltValue = null;
		
		for (let { value, done } of incrementer) {
			if (done) {
				reusltValue = value;
				break;
			}
		}
				
		self.postMessage({
			value: reusltValue
		});
	};
})(this));
