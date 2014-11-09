(function (g) {
	'use strict';

	g.load('./chapter4/graph.js',
		function () {
			function commonAncestor() {
				return null;
			}

			/**
			 * test
			 */
			var sample = g.graph.makeTree(
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

			var expected = new g.graph.TreeNode({
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
			});
			var p = new g.graph.TreeNode({
				data: 5,
				left: {
					data: 3
				},
				right: {
					data: 7
				}
			}),
				q = new g.graph.TreeNode({
					data: 15,
					right: {
						data: 17
					}
				});
			var actual = commonAncestor(sample, p, q);

			g.assertEquals(expected, actual);
		});
}(gomapre));
