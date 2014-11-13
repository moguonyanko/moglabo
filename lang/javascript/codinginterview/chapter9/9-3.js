(function (g) {
	'use strict';

	function magicFast(array, start, end) {
		if (end < start || start < 0 || end >= array.length) {
			return -1;
		}

		var midIndex = Math.ceil((start + end) / 2),
			midValue = array[midIndex];

		if (midValue === midIndex) {
			return midIndex;
		}

		var leftIndex = Math.min(midIndex - 1, midValue),
			left = magicFast(array, start, leftIndex);
		if (left >= 0) {
			return left;
		}

		/* 左側を探し切ってしまった。 */

		var rightIndex = Math.max(midIndex + 1, midValue),
			right = magicFast(array, rightIndex, end);

		return right;
	}

	function magic(array) {
		return magicFast(array, 0, array.length - 1);
	}

	/**
	 * test
	 */
	//var sample = [-40, -20, -1, 1, 2, 3, 5, 7, 9, 12, 13];
	//var expected = 7;
	var sample = [-10, -5, 2, 2, 2, 3, 4, 7, 9, 12, 13];
	var expected = 2; /* 左側から探しているので7ではなく2が返る。 */
	
	var actual = magic(sample);

	g.assertEquals(expected, actual);

}(gomapre));
	