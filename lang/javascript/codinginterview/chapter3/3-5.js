(function (g) {
	'use strict';

	function MyQueue() {
		this.stackNewest = [];
		this.stackOldest = [];
	}

	MyQueue.prototype = {
		size: function () {
			return this.stackNewest.length + this.stackOldest.length;
		},
		shiftStacks: function () {
			if (this.stackOldest.length <= 0) {
				while (this.stackNewest.length > 0) {
					this.stackOldest.push(this.stackNewest.pop());
				}
			}
		},
		add: function (value) {
			this.stackNewest.push(value);
			return this;
		},
		peek: function () {
			this.shiftStacks();
			return this.stackOldest[this.stackOldest.length - 1];
		},
		remove: function () {
			this.shiftStacks();
			return this.stackOldest.pop();
		}
	};

	/**
	 * test
	 */
	var q = new MyQueue();
	q.add(1).add(2).add(3);
	q.remove();

	var expected = 2;
	var actual = q.peek();

	g.assertEquals(expected, actual);

}(gomapre));
