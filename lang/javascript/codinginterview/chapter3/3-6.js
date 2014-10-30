(function (g) {
	'use strict';

	function sort(s) {
		var r = [];

		while (s.length > 0) {
			var tmp = s.pop();
			while (r.length > 0 && r[r.length - 1] < tmp) {
				s.push(r.pop());
			}
			r.push(tmp);
		}

		return r;
	}

	/**
	 * test
	 */
	var sample = [5, 1, 3, 2, 4, 6];
	/* Stack top is last element. */
	var expected = [6, 5, 4, 3, 2, 1];
	var actual = sort(sample);

	g.assertEquals(expected, actual);

}(gomapre));
