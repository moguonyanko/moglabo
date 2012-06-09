#!/usr/bin/python3
# -*- coding: utf-8 -*-

import unittest

import recommendations as rc

class TestSimilarity(unittest.TestCase):
	'''
	Test class for similarity function.
	'''
	fixednum = 3
	
	def test_sim_distance(self):
		'''
		Test similarity function by distance.
		'''
		res = rc.sim_distance(rc.critics, "Lisa Rose", "Gene Seymour")
		self.assertEqual(round(res,self.fixednum), 0.148)

	def test_sim_peason(self):
		'''
		Test similarity function by peason correlation.
		'''
		res = rc.sim_peason(rc.critics, "Lisa Rose", "Gene Seymour")
		self.assertEqual(round(res,self.fixednum), 0.396)

#Entry point
if __name__ == '__main__':
	unittest.main()

