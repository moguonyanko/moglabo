(function (g) {
	'use strict';

	g.load('./chapter4/graph.js',
		function () {
			function getHeight(root) {
				if (!root) {
					return 0;
				}

				return Math.max(getHeight(root.left), getHeight(root.right) + 1);
			}
			
			function isBalanced_v1(root) {
				if (!root) {
					return true;
				}

				var heightDiff = getHeight(root.left) - getHeight(root.right);
				if (Math.abs(heightDiff) > 1) {
					return false;
				} else {
					return isBalanced(root.left) && isBalanced(root.right);
				}
			}
			
			function checkHeight(root){
				if(!root){
					return 0;
				}
				
				var leftHeight = checkHeight(root.left);
				if(leftHeight === -1){
					return -1;
				}
				
				var rightHeight = checkHeight(root.right);
				if(rightHeight === -1){
					return -1;
				}
				
				var heightDiff = leftHeight - rightHeight;
				if(heightDiff > 1){
					return -1;
				}else{
					return Math.max(leftHeight, rightHeight) + 1;
				}
			}

			function isBalanced(root) {
				return checkHeight(root) !== -1;
			}

			/**
			 * test
			 */
			var sample = g.graph.makeSampleBalanceTree();
			var expected = true;
			var actual = isBalanced(sample);

			g.assertEquals(expected, actual);
		});
}(gomapre));
