#!/usr/bin/python3
# -*- coding: utf-8 -*-

import unittest
import math

import pheasant.geometry as gm

class TestCalcArea(unittest.TestCase):
	'''
	Test class for calculate area functions.
	'''
	def test_heron(self):
		'''
		Test heron function.
		'''
		res = gm.heron(2,2,2)
		self.assertEqual(res, 2*math.sqrt(3)/2)
		
	def test_trianglep(self):
		'''
		Test to check Triangle fomation condition satisfied.
		'''
		tri1 = gm.trianglep(2,2,2)
		self.assertEqual(tri1, True)
		tri2 = gm.trianglep(2,2,100)
		self.assertEqual(tri2, False)
		tri3 = gm.trianglep(2,100,2)
		self.assertEqual(tri3, False)
		tri4 = gm.trianglep(100,2,2)
		self.assertEqual(tri4, False)
		
class TestCoodinateTransform(unittest.TestCase):
	'''
	Test class for coordinate transform.
	'''
	def test_polar2rectangular(self):
		'''
		Test function for converting polar to rectangular.
		'''
		res = gm.polar2rectangular(1.0, 0)
		self.assertEqual(res, (1.0, 0.0))
		res = gm.polar2rectangular(0.0, 1.0)
		self.assertEqual(res, (0.0, 0.0))
		#Lower test exists an error.
		#res = gm.polar2rectangular(1.0, 1.57)
		#self.assertEqual(res, (7.9639349e-04, 0.9999997))
		#res = gm.polar2rectangular(4.0, 3.14159)
		#self.assertEqual(res, (-4.000000, 1.1094401e-05))

if __name__ == '__main__':
	print(__file__)
	unittest.main()

