(function (g) {
	'use strict';

	function StackWithMin(values) {
		var _stack = [],
			_minStack = [Number.MAX_VALUE];

		if (Array.isArray(values)) {
			values.forEach(function (x) {
				if (x <= _minStack[0]) {
					_minStack[0] = x;
				}
				_stack.push(x);
			});
		}

		this.stack = _stack;
		this.minStack = _minStack;
	}

	StackWithMin.prototype = {
		push: function (x) {
			if (x <= this.min()) {
				this.minStack.push(x);
			}

			this.stack.push(x);
		},
		pop: function () {
			var value = this.stack.pop();

			if (value === this.min()) {
				this.minStack.pop();
			}

			return value;
		},
		min: function () {
			if (this.minStack.length <= 0) {
				return Number.MAX_VALUE;
			} else {
				return this.minStack[0];
			}
		}
	};

	/**
	 * test
	 */
	var sample = new StackWithMin([7, 3, 6, 5]);
	var expected = 3;
	sample.pop();
	sample.pop();
	sample.push(2);
	sample.pop();
	var actual = sample.min();

	g.assertEquals(expected, actual);

}(gomapre));
