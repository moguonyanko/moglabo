(function (g) {
	'use strict';

	function getSubsets(set, index) {
		var allSubsets = null;

		if (set.length === index) {
			allSubsets = [];
			allSubsets.push([]);
		} else {
			allSubsets = getSubsets(set, index + 1);
			var item = set[index];
			var moreSubsets = [];

			for (var i = 0; i < allSubsets.length; i++) {
				var subset = allSubsets[i];
				var newSubset = [];
				g.addAll(newSubset, subset);

				/* 現在のindexで参照される部分集合を追加する。 */
				newSubset.push(item);

				moreSubsets.push(newSubset);
			}

			g.addAll(allSubsets, moreSubsets);
		}

		return allSubsets;
	}


	/**
	 * test
	 */
	var sample = [1, 2, 3];
	var expected = [
		[], [1], [2], [3], [1, 2], [1, 3], [2, 2], [2, 3], [1, 2, 3]
	];
	var actual = getSubsets(sample, 0);
	
	g.assertEquals(expected, actual);

}(gomapre));
