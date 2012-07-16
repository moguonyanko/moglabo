#!/usr/bin/python3
# -*- coding: utf-8 -*-

import math
import unittest

import moglabo.pychalle.calculus as cl

class TestIntegral(unittest.TestCase):
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
		
		res = cl.simpson(fn1, 1, 0, largenum)
		
		self.assertEqual(round(res), 3)
		
	def test_trapezoid(self):
		'''
		Test integral by trapezoid.
		'''
		def testfunc(x):
			return x**2+1.0
			
		res = cl.trapezoid(0,1,10,testfunc)
		self.assertEqual(round(res, 5), 1.33500)
		res = cl.trapezoid(0,1,50,testfunc)
		self.assertEqual(round(res, 5), 1.33340)
		res = cl.trapezoid(0,1,100,testfunc)
		self.assertEqual(round(res, 5), 1.33335)

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

