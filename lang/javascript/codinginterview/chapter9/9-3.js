(function (g) {
	'use strict';

	function magicFast(array, start, end) {
		if (end < start || start < 0 || end >= array.length) {
			return -1;
		}

		var mid = Math.ceil((start + end) / 2);

		if (array[mid] === mid) {
			return mid;
		} else if (array[mid] > mid) {
			return magicFast(array, start, mid - 1);
		} else {
			return magicFast(array, mid + 1, end);
		}
	}

	function magic(array) {
		return magicFast(array, 0, array.length - 1);
	}

	/**
	 * test
	 */
	var sample = [-40, -20, -1, 1, 2, 3, 5, 7, 9, 12, 13];
	var expected = 7;
	var actual = magic(sample);

	g.assertEquals(expected, actual);

}(gomapre));
	