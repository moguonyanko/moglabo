#!/usr/bin/python3
# -*- coding: utf-8 -*-

import math
import unittest

import pheasant.calculus as cl

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
	
	#Test delta x.
	dx = 0.00000000001
	
	def test_differentiate_calcvalue(self):
		'''
		Differentiate to x power function test.
		'''
		def fn1(x):
			return x*x
		
		def fn2(x):
			return math.cos(x)
		
		res = cl.differentiate(fn1, 2, self.dx)
		self.assertEqual(round(res), 4)
		res2 = cl.differentiate(fn2, math.pi/2, self.dx)
		self.assertEqual(round(res2), -1)

	def test_differentiate_makefunc(self):
		'''
		Make differentiate function test.
		'''
		def testfn(p):
			return 7*math.log(p)+3*math.log(1-p)
			
		testprob = 0.1	
			
		resfn = cl.diffn(testfn)
		
		def chkfn(p):
			return 7*(1/p)+3*(1/(1-p))*(-1)
			
		res = resfn(testprob, self.dx)
		chk = chkfn(testprob)
			
		r = 2 #Convenient value for round...
		self.assertEqual(round(res, r), round(chk, r))

#Entry point
if __name__ == '__main__':
	print(__file__)
	unittest.main()

