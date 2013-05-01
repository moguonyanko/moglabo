/**
 * Unittest functions.
 **/

if(!this.assert){
	var assert = function(b){
		if(b){
			return;
		}
		
		throw new Error("FAILED(-_-;)");
	}
}

var unittest = {
	suites : {},
	assertEqual : function(ans, res){
		try{
			/* TODO:Not enough as for checking "array". */
			if(ans.length != null && res.length != null){
				for(var i = 0, len = res.length; i<len; i++){
					assert(res[i] === ans[i]);
				}
			}else{
				assert(ans === res);
			}
			
			print("OK(*^_^*)b");
		}catch(e){
			print(e);
			print("ANSWER:" + ans);
			print("RESULT:" + res);
		}
	},
	putSuites : function(key, suite){
		this.suites[key] = suite;
	},
	assertAll : function(){
		for(var st in this.suites.length){
			st();
		}
	}
};
