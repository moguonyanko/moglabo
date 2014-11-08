/**
 * @todo
 * implement
 */


(function (g) {
	'use strict';

	var states = {
		unvisited: 0,
		visited: 1,
		visiting: 2
	};

	function Node(data, adjacents) {
		this.data = data;
		this.adjacents = adjacents;
		this.state = states.unvisited;
	}

	function Graph(nodes) {
		this.nodes = nodes;
	}
	
	function makeSampleGraph(nodesMap){
		
	}

	function search(g, start, end) {
		return false;
	}

	/**
	 * test
	 */
	var sampleNodesMap = {
		3: {
			2: {
				0: null
			},
			1: {
				1: {
					0: null
				}
			},
			0: null
		}
	};

	var expected = true;
	var actual = search(null, null, null);

	g.assertEquals(expected, actual);
}(gomapre));
