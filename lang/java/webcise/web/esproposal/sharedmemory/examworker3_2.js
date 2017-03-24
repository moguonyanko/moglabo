(((self) => {
	"use strict";
	
	self.onmessage = evt => {
		const array = evt.data;
		
		array.forEach((v, i) => {
			Atomics.store(array, i, v * 10);
		});
		
		self.postMessage({
			value: array
		});
	};
})(self));
