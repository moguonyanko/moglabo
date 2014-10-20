(function (g) {
	'use strict';

	g.load('./chapter2/linkedlist.js',
		function () {
			function findBiginning(head) {
				var slow = head,
					fast = head;
				
				while(fast && fast.next){
					slow = slow.next;
					fast = fast.next.next;
					if(slow.data === fast.data){
						break;
					}
				}
				
				if(!fast || !fast.next){
					return null;
				}
				
				slow = head;
				while(slow.data !== fast.data){
					slow = slow.next;
					fast = fast.next;
				}
				
				return fast.data;
			}


			/**
			 * test
			 */
			var sample = g.linkedlist.makeLinkedList(
				['A', 'B', 'C', 'D', 'E', 'C', 'D', 'E', 
				'C', 'D', 'E', 'C', 'D', 'E', 'C', 'D', 'E', 
				'C', 'D', 'E', 'C', 'D', 'E', 'C', 'D', 'E']
				);
			var expected = 'C';
			var actual = findBiginning(sample);

			g.assertEquals(expected, actual);
		});
}(gomapre));
