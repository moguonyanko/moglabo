(function (g) {
	'use strict';

	/**
	 * 1:free 0:not free
	 */
	var map = [
		[1, 1, 0, 1, 0],
		[1, 0, 1, 0, 1],
		[1, 1, 1, 1, 1],
		[0, 1, 0, 1, 1],
		[0, 1, 0, 1, 1]
	];

	function isFree(x, y) {
		return map[x][y] === 1;
	}

	function Point(x, y) {
		this.x = x;
		this.y = y;
	}

	Point.prototype = {
		equals: function (other) {
			if (!other) {
				return false;
			}

			if (!(other instanceof Point)) {
				return false;
			}

			return this.x === other.x && this.y === other.y;
		},
		toString: function () {
			return this.x + ":" + this.y;
		}
	};

	function Path() {
		this.pIndexes = {};
		this.points = [];
	}

	Path.prototype = {
		add: function (p) {
			this.points.push(p);
			var pKey = p.toString();
			this.pIndexes[pKey] = this.points.length - 1;
		},
		remove: function (p) {
			var pKey = p.toString();
			var targetIndex = this.pIndexes[pKey];
			if (targetIndex != null) {
				this.points = this.points.slice(0, targetIndex).concat(this.points.slice(targetIndex + 1));
				this.pIndexes[pKey] = null;
				delete this.pIndexes[pKey];
			}
		},
		toString: function(){
			return this.points.toString();
		}
	};

	function getPath(x, y, path) {
		var p = new Point(x, y);
		path.add(p);

		if (x === 0 && y === 0) {
			return true;
		}

		var success = false;

		/* ゴールから戻るので座標を逆に引く。 */
		if (x >= 1 && isFree(x - 1, y)) {
			success = getPath(x - 1, y, path);
		}

		if (!success && y >= 1 && isFree(x, y - 1)) {
			success = getPath(x, y - 1, path);
		}

		if (!success) {
			path.remove(p);
		}

		return success;
	}

	/**
	 * test
	 */
	var expected = true;

	var path = new Path();
	var lastX = map[0].length - 1,
		lastY = map.length - 1;

	var actual = getPath(lastX, lastY, path);

	g.assertEquals(expected, actual);
	
	//g.print(path);

}(gomapre));
