(function (g) {
	'use strict';

	g.load('./chapter2/linkedlist.js',
		function () {
			function isPalindrome(head) {
				var fast = head,
					slow = head;

				var stack = [];

				while (fast && fast.next) {
					stack.push(slow.data);
					slow = slow.next;
					fast = fast.next.next;
				}

				if (fast) {
					slow = slow.next;
				}

				while (slow) {
					var top = stack.pop();
					
					if(top !== slow.data){
						return false;
					}
					
					slow = slow.next;
				}
				
				return true;
			}

			/**
			 * test
			 */
			var sample = g.linkedlist.makeLinkedList(
				['A', 'B', 'C', 'D', 'C', 'B', 'A']
				);
			var expected = true;
			var actual = isPalindrome(sample);

			g.assertEquals(expected, actual);
		});
}(gomapre));
