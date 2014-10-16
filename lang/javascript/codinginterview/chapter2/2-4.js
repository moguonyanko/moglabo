(function (g) {
	'use strict';

	g.load('./chapter2/linkedlist.js',
		function () {
			function partition(node, x) {
				var beforeStart,
					afterStart;

				while (node) {
					var next = node.next;
					if (node.data < x) {
						node.next = beforeStart;
						beforeStart = node;
					} else {
						node.next = afterStart;
						afterStart = node;
					}
					node = next;
				}
				
				if(!beforeStart){
					return afterStart;
				}
				
				var tail = beforeStart.getTail();
				tail.next = afterStart;
				
				return beforeStart;
			}

			/**
			 * test
			 */
			var expected = g.linkedlist.makeLinkedList([1, 2, 3, 4, 5]);
			var sampleNode = g.linkedlist.makeLinkedList([5, 4, 3, 2, 1]);
			var actual = partition(sampleNode, 3);

			while(expected && actual){
				g.assertEquals(expected.data, actual.data);
				expected = expected.next;
				actual = actual.next;
			}
		});
}(gomapre));
