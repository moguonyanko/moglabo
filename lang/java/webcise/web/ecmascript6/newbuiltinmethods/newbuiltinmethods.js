new Gomakit().run(
    g => {
        let resArea = g.select(".assign-sample-area .result-area"),
            eles = g.selectAll(".assign-value");
            
        let propNames = ["a", "b", "c"];
        
        g.clickListener(g.select(".assign-executer"), () => {
            let [a, b, c] = Array.prototype.map.call(eles, (ele, index) => {
                return { 
                    [propNames[index]]: ele.value
                };
            });

            let result = Object.assign(a, b, c);
            
            for(let [name, value] of Iterator(result)){
                g.println(resArea, name + ":" + value);
            }
        });
    }
);
