var Geese;
(function (Geese) {
    var Math = (function () {
        function Math() { }
        Math.sum = function sum(numbers) {
            return numbers.reduce(function (a, b) {
                return (a + b);
            });
        };
        Math.mean = function mean(numbers) {
            var len = numbers.length;
            if(len <= 0) {
                return 0;
            }
            return Math.sum(numbers) / len;
        };
        Math.getPrime = function getPrime(n) {
            var prime = [];
            var is_prime = new Array(n + 1);
            for(var idx = 0; idx < is_prime.length; idx++) {
                is_prime[idx] = true;
            }
            is_prime[0] = false;
            is_prime[1] = false;
            for(var i = 2; i <= n; i++) {
                if(is_prime[i]) {
                    prime.push(i);
                    for(var j = 2 * i; j <= n; j += i) {
                        is_prime[j] = false;
                    }
                }
            }
            return prime;
        };
        return Math;
    })();
    Geese.Math = Math;    
})(Geese || (Geese = {}));
((function () {
    var primes = Geese.Math.getPrime(10);
    print(primes);
})());
