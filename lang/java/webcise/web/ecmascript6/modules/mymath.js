(function(){
   "use strict";
    
   function sum(...args){
       return args.reduce((a, b) => a + b);
   }
   
   function avg(...args){
       if(args.length <= 0){
           throw new Error("No elements.");
       }
       
       return sum(args) / args.length;
   }
   
   export sum;
   export avg;
   
}());
