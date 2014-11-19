(function (g) {
	'use strict';

	function getSubsets(set, index) {
		return [];
	}


	/**
	 * test
	 */
	var expected = [
		[], [1], [2], [3], [1, 2], [1, 3], [2, 2], [2, 3], [1, 2, 3]
	];
	var actual = getSubsets([], 3);

	g.assertEquals(expected, actual);

}(gomapre));
