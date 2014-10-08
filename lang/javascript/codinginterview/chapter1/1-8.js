#!/usr/local/bin/node

function isSubstring(s1, s2){
	return s1.indexOf(s2) >= 0;
}

function isRotation(s1, s2) {
	var len = s1.length;
	
	if(len === s2.length && len > 0){
		var s1s1 = s1 + s1;
		return isSubstring(s1s1, s2);
	}else{
		return false;
	}
}

/**
 * test
 */
var s1 = 'waterbottle',
	s2 = 'erbottlewat';

console.assert(isRotation(s1, s2) === true);
