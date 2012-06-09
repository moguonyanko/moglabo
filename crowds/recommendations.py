#!/usr/bin/python3
# -*- coding: utf-8 -*-

import math

#Similarity sample dictionary
critics = {
	"Lisa Rose" : {
		"Lady in the Water" : 2.5,
		"Shake on a Plane" : 3.5,
		"Just My Luck" : 3.0,
		"Superman Returns" : 3.5,
		"You, Me and Dupree" : 2.5,
		"The Night Listener" : 3.0
	},
	"Gene Seymour" : {
		"Lady in the Water" : 3.0,
		"Shake on a Plane" : 3.5,
		"Just My Luck" : 1.5,
		"Superman Returns" : 5.0,
		"The Night Listener" : 3.0,
		"You, Me and Dupree" : 3.5
	},
	"Michael Pillips" : {
		"Lady in the Water" : 2.5,
		"Shake on a Plane" : 3.0,
		"Superman Returns" : 3.5,
		"The Night Listener" : 4.0
	},
	"Claudia Puig" : {
		"Shake on a Plane" : 3.5,
		"Just My Luck" : 3.0,
		"The Night Listener" : 4.5,
		"Superman Returns" : 4.0,
		"You, Me and Dupree" : 2.5
	},
	"Mick LaSalle" : {
		"Lady in the Water" : 3.0,
		"Shake on a Plane" : 4.0,
		"Just My Luck" : 2.0,
		"Superman Returns" : 3.0,
		"The Night Listener" : 3.0,
		"You, Me and Dupree" : 2.0
	},
	"Jack Matthews" : {
		"Lady in the Water" : 3.0,
		"Shake on a Plane" : 4.0,
		"The Night Listener" : 3.0,
		"Superman Returns" : 5.0,
		"You, Me and Dupree" : 3.5
	},
	"Toby" : {
		"Shake on a Plane" : 4.5,
		"You, Me and Dupree" : 1.0,
		"Superman Returns" : 4.0
	}
}

def sim_distance(prefs,person1,person2):
	'''
	Similarity function by euclidean distance.
	'''
	si = set(prefs[person1]).intersection(set(prefs[person2]))
		
	if len(si) == 0:
		return 0
		
	squares = [(prefs[person1][item]-prefs[person2][item])**2 for item in si]
	sum_of_squares = sum(squares)

	return 1/(1+sum_of_squares)
	
def sim_peason(prefs,p1,p2):
	'''
	Similarity function by peason correlation.
	'''
	si = set(prefs[p1]).intersection(set(prefs[p2]))
	
	cosize = len(si) 	
	if cosize == 0: return 0

	pre_sum1 = []
	pre_sum2 = []
	pre_sum1Sq = []
	pre_sum2Sq = []
	pre_pSum = []
	for it in si:
		p1p = prefs[p1][it]
		p2p = prefs[p2][it]
		pre_sum1.append(p1p)
		pre_sum2.append(p2p)
		pre_sum1Sq.append(p1p**2)
		pre_sum2Sq.append(p2p**2)
		pre_pSum.append(p1p*p2p)
	
	sum1 = sum(pre_sum1)
	sum2 = sum(pre_sum2)
	sum1Sq = sum(pre_sum1Sq)
	sum2Sq = sum(pre_sum2Sq)
	pSum = sum(pre_pSum)
		
	nume = pSum-(sum1*sum2/cosize)
	deno = math.sqrt((sum1Sq-sum1**2/cosize)*(sum2Sq-sum2**2/cosize))
	
	if deno == 0: return 0
	
	return nume/deno

#Entry point
if __name__ == '__main__':
	print("recommendations module load")

