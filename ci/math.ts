module Geese {
	export class Math {
		static sum(numbers : number[]) : number {
			return numbers.reduce(function(a, b){ return a + b; });
		}

		static mean(numbers : number[]) : number {
			var len = numbers.length;
		
			if(len <= 0)return 0;
		
			return sum(numbers) / len;
		}
	}
}

function exec() {
	var samples : number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	var meanValue : number = Geese.Math.mean(samples);
	print(meanValue);
}
exec();

