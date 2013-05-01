var Geese;
(function (Geese) {
    var Math = (function () {
        function Math() { }
        Math.sum = function sum(numbers) {
            return numbers.reduce(function (a, b) {
                return a + b;
            });
        };
        Math.mean = function mean(numbers) {
            var len = numbers.length;
            if(len <= 0) {
                return 0;
            }
            return Math.sum(numbers) / len;
        };
        return Math;
    })();
    Geese.Math = Math;    
})(Geese || (Geese = {}));
function exec() {
    var samples = [
        1, 
        2, 
        3, 
        4, 
        5, 
        6, 
        7, 
        8, 
        9, 
        10
    ];
    var meanValue = Geese.Math.mean(samples);
    print(meanValue);
}
exec();
