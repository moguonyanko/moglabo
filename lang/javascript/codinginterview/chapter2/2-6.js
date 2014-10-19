(function (g) {
	'use strict';

	g.load('./chapter2/linkedlist.js',
		function () {
			function findBiginning(node) {
				return 'TEST';
			}


			/**
			 * test
			 */
			var sample = g.linkedlist.makeLinkedList(
				['A', 'B', 'C', 'D', 'E', 'C']
				);
			var expected = 'C';
			var actual = findBiginning(sample);

			g.assertEquals(expected, actual);
		});
}(gomapre));
