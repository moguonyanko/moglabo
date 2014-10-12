#!/usr/local/bin/node

function sort(str){
	return str.split('').sort().join('');
}

function permutation(str1, str2){
	if(str1.length !== str2.length){
		return false;
	}
	
	return sort(str1) === sort(str2);
}

/**
 * test
 */
console.assert(permutation('abcde', 'edcba') === true);
console.assert(permutation('abcdea', 'edcba') === false);
