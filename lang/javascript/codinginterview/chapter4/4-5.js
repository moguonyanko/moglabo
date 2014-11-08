(function (g) {
	'use strict';

	g.load('./chapter4/graph.js',
		function () {
			function __checkBST(n, min, max){
				if(!n){
					return true;
				}
				
				if(n.data < min || n.data >= max){
					return false;
				}
				
				if(!checkBST(n.left, min, n.data) || 
					!checkBST(n.right, n.data, max)){
					return false;
				}
				
				return true;
			}
			
			function checkBST(n){
				return __checkBST(n, Number.MIN_SAFE_VALUE, Number.MAX_SAFE_VALUE);
			}
			
			/**
			 * test
			 */
			var sample = g.graph.makeSampleBinarySearchTree();
			var expected = true;
			var actual = checkBST(sample);

			g.assertEquals(expected, actual);
		});
}(gomapre));
