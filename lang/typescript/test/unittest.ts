import Logging = module("../util/logging");
import logger = Logging.Logger;

module UnitTest {
  export class Assertions {
    static assert(a: bool): void {
      if (!a) {
        throw new Error("FAILED(-_-;)");
      }
    }
    
    static assertEquals(ans: any, res: any): void {
		  try {
		    var arrayStr = "[object Array]";
		  
			  if (Object.prototype.toString.call(ans) !== arrayStr && 
			      Object.prototype.toString.call(res) !== arrayStr) {
			      
				  for (var i = 0, len = res.length; i<len; i++) {
					  Assertions.assert(res[i] === ans[i]);
				  }				  
			  } else {
				  Assertions.assert(ans === res);
			  }
			
			  print("OK(*^_^*)b");
		  } catch(e) {
			  logger.log(e.message);
			  logger.log("ANSWER:" + ans);
			  logger.log("RESULT:" + res);
		  }      
    }
  } 
}
