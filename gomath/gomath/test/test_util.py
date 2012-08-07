#!/usr/bin/python3
# -*- coding: utf-8 -*-

import random
import unittest
import math

import gomath.util as ut

class TestFlatten(unittest.TestCase):
	sample_flatten = [[1,2,3],[4,5,6],["a",[400,500,600],"b"],[7,8,9]]
	fx = [1,2,3,4,5,6,"a",400,500,600,"b",7,8,9]
	
	def test_flatten(self):
		'''test nested list flatten'''
		res = ut.flatten(self.sample_flatten)
		self.assertEqual(res, self.fx)

class TestRands(unittest.TestCase):
	rsize = 100
	
	def test_rands(self):
		'''test get random values'''
		res = ut.rands(501,979,self.rsize)
		self.assertEqual(len(res), self.rsize)

class TestMakeList(unittest.TestCase):
	'''
	This is utility of making list.
	'''
	def test_makeformatlist(self):
		'''test make format list'''
		res = ut.makeformatlist(3, 0)
		chk = [0,0,0]
		self.assertEqual(res, chk)
	
	def test_makelist(self):
		'''
		test make array 1 dimention
		'''
		res1 = ut.makelist(10)
		self.assertEqual(len(res1), 10)
		res2 = ut.makelist(100,0)
		self.assertEqual(len(res2), 100)

class TestCompose(unittest.TestCase):
	'''
	Function compose test class.
	'''
	def test_compose(self):
		'''function compose test'''
		def square(x):
			return x**2
		
		def double(x):
			return x*2
			
		resfn = ut.compose(square, double)
		res = resfn(2)
		self.assertEqual(res, 8)
		
class TestNearChoice(unittest.TestCase):
	'''
	Near value return function test class.
	'''
	def test_nearchoice(self):
		'''test near value return'''
		target = 1
		sample = {
			3 : "Usao",
			5 : "Kitezo",
			7 : "Monchi",
			2 : "Hairegu",
			9 : "Pinny",
			4 : "Goro"
		}
		res = ut.nearchoice(target, sample)
		self.assertEqual(res, "Hairegu")

class TestBenchMark(unittest.TestCase):
	'''
	Test class for benchmark.
	'''
	def test_tarai(self):
		'''
		Test function for tarai.
		'''
		res1 = ut.tarai(10, 5, 0)
		self.assertEqual(res1, 10)
		#too late.
		#res2 = ut.tarai(18, 12, 6)
		#self.assertEqual(res2, 18)

#Entry point
if __name__ == '__main__':
	print(__file__)
	unittest.main()

