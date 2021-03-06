(function (g) {
	'use strict';

	g.load('./chapter2/linkedlist.js',
		function () {
			function deleteDups(n) {
				var table = {},
					current = n,
					previous = null;

				while (current !== null) {
					if (current.data in table) {
						previous.next = current.next;
					} else {
						table[current.data] = true;
						previous = current;
					}

					current = current.next;
				}

				return previous.getHead();
			}

			/**
			 * test
			 */
			var sample = [1, 2, 2, 3, 4, 4, 4, 5];
			var sampleNode = g.linkedlist.makeLinkedList(sample);
			var resultNode = deleteDups(sampleNode);
			var expected = [1, 2, 3, 4, 5].join(','),
				actual = resultNode.dump();

			g.assertEquals(expected, actual);
		});
}(gomapre));
