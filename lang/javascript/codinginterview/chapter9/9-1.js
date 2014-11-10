(function (g) {
	'use strict';

	function __countWays(n, dp) {
		if (n < 0) {
			return 0;
		} else if (n === 0) {
			return 1;
		} else if (dp[n] > -1) {
			return dp[n];
		} else {
			dp[n] = __countWays(n - 1, dp) + 
				__countWays(n - 2, dp) + 
				__countWays(n - 3, dp);

			return dp[n];
		}
	}
	
	function countWays(n){
		return __countWays(n, {});
	}

	/**
	 * test
	 */
	var steps = 37;
	var expected = 3831006429;
	var actual = countWays(steps);

	g.assertEquals(expected, actual);

}(gomapre));
