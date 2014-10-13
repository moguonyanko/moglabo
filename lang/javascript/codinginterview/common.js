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

	win.gomapre = {
		print: print,
		load: load,
		assertEquals: function (expected, actual) {
			print('start test');

			try {
				console.assert(expected === actual);
			} catch (err) {
				print('NG');
				print('expected ... ' + expected.toString());
				print('actual ... ' + actual.toString());
				throw err;
			}

			print('OK');
		}
	};
}(window, document));
