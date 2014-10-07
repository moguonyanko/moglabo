#!/usr/local/bin/node

function replaceSpaces(str){
	var targets = str.trim().split('');
	for(var i = targets.length - 1; i >= 0; i--){
		if(targets[i] === ' '){
			targets[i] = '%20';
		}
	}
	
	return targets.join('');
}

/**
 * test
 */
var sample = 'Mr John Smith   ',
	expected = 'Mr%20John%20Smith';
console.assert(replaceSpaces(sample) === expected);
