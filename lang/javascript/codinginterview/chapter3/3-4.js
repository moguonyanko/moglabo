(function (g) {
	'use strict';

	function Tower(index) {
		this.disks = [];
		this.index = index;
	}

	Tower.prototype.add = function (d) {
		if (this.disks.length <= 0 || this.disks[this.disks.length - 1] <= d) {
			this.disks.push(d);
		} else {
			throw new Error('Error placing disk ' + d);
		}
	};

	Tower.prototype.moveToTop = function (t) {
		var top = this.disks.pop();
		t.add(top);
		g.print('Move disk ' + top + ' from ' + this.index + ' to ' + t.index);
	};

	Tower.prototype.moveDisks = function (n, destination, buffer) {
		if (n > 0) {
			this.moveDisks(n - 1, buffer, destination);
			this.moveToTop(destination);
			buffer.moveDisks(n - 1, destination, this);
		}
	};

	Tower.prototype.equals = function (t) {
		if (!t) {
			return false;
		}

		if (!(t instanceof Tower)) {
			return false;
		}

		if (this.disks.length !== t.disks.length) {
			return false;
		}

		if (this.index !== t.index) {
			return false;
		}

		for (var i = 0, max = this.disks.length; i < max; i++) {
			if (this.disks[i] !== t.disks[i]) {
				return false;
			}
		}

		return true;
	};

	Tower.prototype.toString = function () {
		return this.disks.toString();
	};

	/**
	 * test
	 */
	var towerSize = 3,
		towers = [];

	for (var towerIdx = 0; towerIdx < towerSize; towerIdx++) {
		towers.push(new Tower(towerIdx));
	}

	var diskSize = 5,
		expected = new Tower(towerSize - 1);

	for (var diskIdx = 0; diskIdx < diskSize; diskIdx++) {
		towers[0].add(diskIdx);
		expected.add(diskIdx);
	}

	var src = towers[0],
		dest = towers[2],
		buff = towers[1];

	src.moveDisks(diskSize, dest, buff);

	var actual = dest;

	g.assertEquals(expected, actual);

}(gomapre));
