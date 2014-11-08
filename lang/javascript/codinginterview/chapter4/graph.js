(function (win, doc, g) {
	'use strict';

	function TreeNode(data, left, right) {
		this.data = data;
		this.left = left;
		this.right = right;
	}

	function makeTree(src) {
		var root = new TreeNode(src.data, src.left, src.right);
		return root;
	}

	function makeSampleBalanceTree() {
		var sample = makeTree(
			{
				root: {
					data: 4,
					left: {
						data: 3,
						left: {
							data: 2,
							left: {
								data: 1
							},
							right: {
								data: 3
							}
						},
						right: {
							data: 4,
							left: {
								data: 3
							},
							right: {
								data: 5
							}
						}
					},
					right: {
						data: 5,
						left: {
							data: 4,
							left: {
								data: 3
							},
							right: {
								data: 5
							}

						},
						right: {
							data: 6,
							left: {
								data: 5
							},
							right: {
								data: 7
							}

						}
					}
				}
			}
		);

		return sample;
	}

	function makeSampleBinarySearchTree() {
		var sample = makeTree(
			{
				root: {
					data: 20,
					left: {
						data: 10,
						left: {
							data: 5,
							left: {
								data: 3
							},
							right: {
								data: 7
							}
						},
						right: {
							data: 15,
							right: {
								data: 17
							}
						}
					},
					right: {
						data: 30
					}
				}
			}
		);

		return sample;
	}

	g.graph = {
		TreeNode: TreeNode,
		makeTree: makeTree,
		makeSampleBalanceTree: makeSampleBalanceTree,
		makeSampleBinarySearchTree: makeSampleBinarySearchTree
	};
}(window, document, gomapre));
