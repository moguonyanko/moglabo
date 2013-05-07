module Geese {
  export class Math {
    static sum(numbers: number[]): number {
      return numbers.reduce((a, b) => (a + b));
    }

    static mean(numbers: number[]): number {
      var len = numbers.length;
		
      if (len <= 0) {
        return 0;
      }
		
      return Math.sum(numbers) / len;
    }
		
    static getPrime(n: number): number[] {
      var prime = [];
      var is_prime = new Array(n + 1);
			
      for (var idx = 0; idx < is_prime.length; idx++) {
        is_prime[idx] = true;
      }
			
      is_prime[0] = false;
      is_prime[1] = false;
			
      for (var i = 2; i <= n; i++) {
        if (is_prime[i]) {
          prime.push(i);
          for (var j = 2 * i; j <= n; j += i) {
            is_prime[j] = false;
          }
        }
      }
			
      return prime;
    }
  }
}

(function() : void {
  /*
  var samples : number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  var meanValue : number = Geese.Math.mean(samples);
  print(meanValue);
  */
  
  var primes = Geese.Math.getPrime(10);
  print(primes);
}());

