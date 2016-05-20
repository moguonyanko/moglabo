((g => {
    "use strict";
    
    const funcs = [
        () => {
            const base = ".arguments-object-in-arrow-functions ",
                resultArea = g.select(base + ".resultarea"),
                runner = g.select(base + ".check-arguments-object"),
                clearer = g.select(base + ".clear-result");
                
            const getArgumentsLength = () => {
                /**
                 * アロー関数内でもArgumentsオブジェクト自体はECMAScript5までと
                 * 同じように存在している。しかし参照するとエラーになってしまう。
                 * この振る舞いはstrictモードでなくても変わらない。
                 */
                if(arguments){
                    return arguments.length;
                } else {
                    g.log(arguments);
                    throw new Error("Arguments is nothing!");
                }
            }; 
            
            g.clickListener(runner, () => {
                let result;
                try{
                    result = getArgumentsLength(1, 2, 3, 4, 5);
                }catch(err){
                    result = err.message;
                }
                g.println(resultArea, result);
            });
            
            g.clickListener(clearer, () => {
                g.clear(resultArea);
            });
        }
    ];
    
    g.run(funcs);
})(window.goma));