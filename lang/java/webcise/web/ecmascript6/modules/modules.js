(function(g){
    "use strict";
    
    import * as math from "mymath";
    
    const inits = [
        () => {
            const baseCls = ".import-container "
            const resultArea = g.select(baseCls + ".result-area");
            g.clickListener(g.select(baseCls + ".calc-executer"), function(){
                const values = g.values(g.selectAll(baseCls + ".calc-source-value"), Number);
                const result = math.avg(values);
                g.plintln(resultArea, result);
            });
        }
    ];
    
    g.run(inits);
}(goma));
