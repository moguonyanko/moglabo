(function (win, doc, g) {
	'use strict';

	function TreeNode(value, left, right) {
		this.value = value;
		this.left = left;
		this.right = right;
	}

	function makeGraph(src) {
		var root = new TreeNode(src.value, src.left, src.right);
		return root;
	}

	function makeSampleGraph() {
		var sample = makeGraph(
			{
				root: {
					value: 4,
					left: {
						value: 3,
						left: {
							value: 2,
							left: {
								value: 1
							},
							right: {
								value: 3
							}
						},
						right: {
							value: 4,
							left: {
								value: 3
							},
							right: {
								value: 5
							}
						}
					},
					right: {
						value: 5,
						left: {
							value: 4,
							left: {
								value: 3
							},
							right: {
								value: 5
							}

						},
						right: {
							value: 6,
							left: {
								value: 5
							},
							right: {
								value: 7
							}

						}
					}
				}
			}
		);

		return sample;
	}

	g.graph = {
		TreeNode: TreeNode,
		makeGraph: makeGraph,
		makeSampleGraph: makeSampleGraph
	};
}(window, document, gomapre));
