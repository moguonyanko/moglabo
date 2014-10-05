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

var sample = 'abcdefg';
console.log(isUniqueChars(sample));
var sample2 = 'abccdefg';
console.log(isUniqueChars(sample2));
