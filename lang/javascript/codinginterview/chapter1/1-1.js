#!/usr/local/bin/node

function isUniqueChars(str) {
	if (str.length > 256) {
		return false;
	}

	var charSet = {};
	for (var i = 0, size = str.length; i < size; i++) {
		if (charSet[str[i]]) {
			return false;
		}

		charSet[str[i]] = true;
	}

	return true;
}

/**
 * Run tests.
 */
var sample = 'abcdefg';
console.assert(isUniqueChars(sample) === true);
var sample2 = 'abccdefg';
console.assert(isUniqueChars(sample2) === false);
