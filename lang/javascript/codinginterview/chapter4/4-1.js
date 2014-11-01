(function (g) {
	'use strict';

	g.load('./chapter4/graph.js',
		function () {
			function isBalanced(){
				return false;
			}

			/**
			 * test
			 */
			var sample = g.graph.makeSampleGraph();
			var expected = true;
			var actual = isBalanced(sample);

			g.assertEquals(expected, actual);
		});
}(gomapre));
