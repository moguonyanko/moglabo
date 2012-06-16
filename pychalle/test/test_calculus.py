#!/usr/bin/python3
# -*- coding: utf-8 -*-

import math
import unittest

import moglabo.pychalle.calculus as cl

class TestSimpson(unittest.TestCase):
	'''
	Simpson method test class.
	'''
	def test_simpson(self):
		'''
		Test simpson function.
		'''
		def fn1(x):
			return 3*x**2+2
			
		largenum = 1000
		
		res = cl.simpson(fn1, 0, 1, largenum)
		
		self.assertEqual(round(res), 3)

class TestDifferentiate(unittest.TestCase):
	'''
	Differentiate class.
	'''
	def test_differentiate(self):
		'''
		test differentiate function.
		'''
		def fn1(x):
			return x*x
		
		def fn2(x):
			return math.cos(x)
			
		dx = 0.00000000001
		
		res = cl.differentiate(fn1, 2, dx)
		self.assertEqual(round(res), 4)
		res2 = cl.differentiate(fn2, math.pi/2, dx)
		self.assertEqual(round(res2), -1)

#Entry point
if __name__ == '__main__':
	print(__file__)
	unittest.main()

