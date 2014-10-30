(function (win, doc, g) {
	'use strict';

	function TreeNode(left, right) {
		this.left = left;
		this.right = right;
	}

	g.graph = {
		TreeNode: TreeNode
	};
}(window, document, gomapre));
