#!/usr/local/bin/node

function loopCompression(str, func) {
	var last = str[0],
		count = 1;

	for (var i = 1, max = str.length; i < max; i++) {
		if (str[i] === last) {
			count++;
		} else {
			func(last, count);
			last = str[i];
			count = 1;
		}
	}

	return {
		last: last,
		count: count
	};
}

function countCompression(str) {
	var size = 0;

	var res = loopCompression(str, function (last, count) {
		size += 1 + String(count).length;
	});

	size += 1 + String(res.count).length;

	return size;
}

function compress(str) {
	if (countCompression(str) >= str.length) {
		return str;
	}

	var result = [];

	var res = loopCompression(str, function (last, count) {
		result.push(last);
		result.push(count);
	});

	result.push(res.last);
	result.push(res.count);

	return result.join('');
}

/**
 * test
 */
console.assert(compress('aabcccccaaa') === 'a2b1c5a3');
console.assert(compress('abcdefgabcdefg') === 'abcdefgabcdefg');
