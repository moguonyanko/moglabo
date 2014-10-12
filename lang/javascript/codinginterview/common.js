#!/usr/local/bin/node

function print(txt) {
	console.log(txt);
}

module.exports = {
	print: print,
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
