(function (win, doc) {
	'use strict';

	function print(txt) {
		console.log(txt);
	}

	function load(path, callback) {
		var isPathArray = Array.isArray(path),
			pathes = isPathArray ? path : [path],
			restScriptSize = pathes.length;

		var loadFunc = function (targetPath) {
			var testScriptEle = doc.createElement('script');
			testScriptEle.onload = function (evt) {
				doc.body.removeChild(testScriptEle);
				testScriptEle = null;

				restScriptSize--;
				if (restScriptSize <= 0) {
					callback();
				}
			};
			testScriptEle.src = targetPath;
			doc.body.appendChild(testScriptEle);
		};

		for (var i = 0, max = pathes.length; i < max; i++) {
			loadFunc(pathes[i]);
		}
	}

	function isFunction(f) {
		return typeof f === 'function';
	}

	function isEquals(obj1, obj2) {
		if (obj1 === obj2) {
			return true;
		}

		if (isFunction(obj1.equals)) {
			return obj1.equals(obj2);
		} else {
			return false;
		}
	}

	win.gomapre = {
		print: print,
		load: load,
		isEquals: isEquals,
		assertEquals: function (expected, actual) {
			print('start test');

			if (this.isEquals(expected, actual)) {
				print('OK');
			} else {
				print('NG');
				print('expected ... ' + expected.toString());
				print('actual ... ' + actual.toString());
				throw new Error('Fail tests.');
			}
		}
	};
}(window, document));
