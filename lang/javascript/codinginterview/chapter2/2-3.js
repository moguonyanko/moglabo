(function (g) {
	'use strict';

	g.load('./chapter2/linkedlist.js',
		function () {
			function deleteNode(n) {
				if (!n || !n.next) {
					throw new Error('null or last node cannot delete.');
				}

				var next = n.next;
				n.data = next.data;
				n.next = next.next;
			}

			/**
			 * test
			 */
			var sampleNode = g.linkedlist.makeLinkedList([1, 2, 3, 4, 5]);
			var expected = g.linkedlist.makeLinkedList([1, 2, 4, 5]);

			deleteNode(sampleNode.next.next);

			g.assertEquals(expected.next.next, sampleNode);
		});
}(gomapre));
