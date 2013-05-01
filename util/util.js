/**
 * Common utility functions.
 * Reference:
 * 	Mozilla Developer Network
 **/
 
 if(!print){
 	window.print = function(obj){
 		console.log(obj);
 	};
 }
 
/**
 * Array reduce function append.
 */
if(!Array.prototype.reduce){
	Array.prototype.reduce = function reduce(accumulator){
		if(this === null || this === undefined){
    		throw new TypeError("Array object is null or undefined.");
    	}
    
		if(typeof accumulator !== "function"){ 
			throw new TypeError("Must be give function object.");
		}
		
		var len = this.length;
		if(len <= 0){
			throw new Error("It is necessary to give one array element at least.");
		}
		
		var result;
		for(var i = 0; i<len-1; i++){
			var a = this[i], 
			b = this[i+1];
						
			result = accumulator(a, b);	
		}
		
		return result;
	};
}
