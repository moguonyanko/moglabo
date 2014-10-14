(function (g) {
	'use strict';

	g.load('./chapter2/linkedlist.js',
		function () {
			function nthToLast(head, k) {
				if (k <= 0) {
					return null;
				}

				var p1 = head, p2 = head;

				for (var i = 0; i < k - 1; i++) {
					if (!p2) {
						return null;
					}

					p2 = p2.next;
				}

				if (!p2) {
					return null;
				}

				while (p2.next) {
					p1 = p1.next;
					p2 = p2.next;
				}

				return p1;
			}

			/**
			 * test
			 */
			var sample = [1, 2, 3, 4, 5],
				sampleNode = g.linkedlist.makeLinkedList(sample);

			var expected = sampleNode.next,
				indexFromLast = 4,
				actual = nthToLast(sampleNode, indexFromLast);

			g.assertEquals(expected, actual);
		});
}(gomapre));
