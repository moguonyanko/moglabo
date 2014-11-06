(function (g) {
	'use strict';
	
	function File() {

	}

	function Direcotry(files) {
		this.files = files;
	}

	function FileSystem(dirs) {
		this.dirs = dirs;
	}

	var state = {
		unvisited: 0,
		visited: 1,
		visiting: 2
	};

	function search(g, start, end) {
		return false;
	}

	/**
	 * test
	 */
	var expected = true;
	var actual = search(null, null, null);

	g.assertEquals(expected, actual);
}(gomapre));
