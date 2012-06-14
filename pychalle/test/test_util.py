#!/usr/bin/python3
# -*- coding: utf-8 -*-

import random
import unittest
import math

import util as ym

class TestFlatten(unittest.TestCase):
	sample_flatten = [[1,2,3],[4,5,6],["a",[400,500,600],"b"],[7,8,9]]
	fx = [1,2,3,4,5,6,"a",400,500,600,"b",7,8,9]
	
	def test_flatten(self):
		'''test nested list flatten'''
		res = ym.flatten(self.sample_flatten)
		self.assertEqual(res, self.fx)

class TestRands(unittest.TestCase):
	rsize = 100
	
	def test_rands(self):
		'''test get random values'''
		res = ym.rands(501,979,self.rsize)
		self.assertEqual(len(res), self.rsize)

class TestSleq(unittest.TestCase):
	formura1 = [[2,-3,-13],[7,5,1]]
	equation1 = [-2,3]

	formura2 = [[1,-1,2,0],[-2,3,-5,1],[1,-1,1,0]]
	equation2 = [1,1,0]
	
	formura2_2 = [[1,5,-4,-1],[1,-5,15,17],[4,9,5,16]]
	equation2_2 = [-3,2,2]
	
	formura3 = [[1,-2,3],[3,-6,9]]
	
	formura4 = [[1,-2,3],[3,-6,10]]
	
	formura5 = [[1,2,-5,4],[2,3,-7,7],[4,-1,7,7]]
	
	formura6 = [[1,2,-5,4],[2,3,-7,7],[4,-1,7,8]]
	
	INDEFINITE = "indefinite"
	IMPOSSIBLE = "impossible"
	
	def test_sleq_eq_2dim(self):
		'''test by 2 dimention'''
		result = ym.sleq(self.formura1)
		self.assertEqual(result, self.equation1)

	def test_sleq_eq_3dim_inverse_matrix_error(self):
		'''test by 3 dimention at inverse matrix error occured.'''
		result = ym.sleq(self.formura2)
		res = map(lambda x: round(x), result)
		self.assertEqual(list(res), self.equation2)
	
	def test_sleq_eq_3dim(self):	
		'''test by 3 dimention'''
		result2 = ym.sleq(self.formura2_2)
		res2 = map(lambda x: round(x), result2)
		self.assertEqual(list(res2), self.equation2_2)

	def check_errormessage(self, func, args, chkmessage):
		'''check returned error message'''
		try:
			func(args)
		except ValueError as ex:
			message = str(ex)
			self.assertEqual(message, chkmessage)

	def test_sleq_eq_2dim_indefinite(self):
		'''test by 2 dimention and indefinite case'''
		self.check_errormessage(ym.sleq, self.formura3, self.INDEFINITE)

	def test_sleq_eq_2dim_inpossible(self):
		'''test by 2 dimantion and impossible case'''
		self.check_errormessage(ym.sleq, self.formura4, self.IMPOSSIBLE)

	def test_sleq_eq_3dim_indefinite(self):
		'''test by 3 dimention and imdefinite case'''
		self.check_errormessage(ym.sleq, self.formura5, self.INDEFINITE)

	def test_sleq_eq_3dim_inpossible(self):
		'''test by 3 dimantion and inpossible case'''
		self.check_errormessage(ym.sleq, self.formura6, self.IMPOSSIBLE)
		
#	def test_sleq_indefinite_return_formula(self):
#		'''test return formula at indefinite case'''
#		forms = [[1,2,4,0],[2,-3,1,0],[0,1,1,0]]
#		
#		resforms = ym.sleq(forms)
#		
#		chkforms = [[1,0,2,0],[0,1,1,0],[0,0,0,0]]
#		self.assertEqual(resforms, chkforms)

class TestMakeList(unittest.TestCase):
	'''
	This is utility of making list.
	'''
	def test_makeformatlist(self):
		'''test make format list'''
		res = ym.makeformatlist(3, 0)
		chk = [0,0,0]
		self.assertEqual(res, chk)
	
	def test_makelist(self):
		'''
		test make array 1 dimention
		'''
		res1 = ym.makelist(10)
		self.assertEqual(len(res1), 10)
		res2 = ym.makelist(100,0)
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
			
		resfn = ym.compose(square, double)
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
		res = ym.nearchoice(target, sample)
		self.assertEqual(res, "Hairegu")

class TestBinaruSearch(unittest.TestCase):
	'''
	Binary search test class.
	'''
	def test_binary_search(self):
		'''
		binary search test function
		'''
		sample = [1,2,3,4,6,7,8,9]
		target_idx1 = ym.binary_search(7, sample)
		self.assertEqual(target_idx1, 5)
		target_idx2 = ym.binary_search(2, sample)
		self.assertEqual(target_idx2, 1)
		target_idx3 = ym.binary_search(4, sample)
		self.assertEqual(target_idx3, 3)
		
		self.assertRaises(LookupError, ym.binary_search, 100, sample)
		
#inner value unfound, maximum recursion.		
#		target_idx5 = ym.binary_search(5, sample)
#		self.assertEqual(target_idx5, -1)

class TestQuadEq(unittest.TestCase):
	'''
	This is quadratic equation test class.
	'''
	def test_quadeq_real_root(self):
		'''
		test a quadratic equation function
		result is real root
		'''
		formula = [1,-2,-3]
		res = ym.quadeq(formula)
		chk = {3,-1}
		
		self.assertEqual(res, chk)

	def test_quadeq_imaginary_root(self):
		'''
		test a quadratic equation function
		result is imaginary root
		but unsupport and should return error.
		'''
		formula = [1,1,1]
		
		self.assertRaises(ValueError, ym.quadeq, formula)
		
	def test_discriminant(self):
		'''
		test for discriminant of quadratic equation function
		'''
		formula1 = [1,-2,-3]
		xnum = ym.discriminant(formula1)
		res1 = xnum > 0
		formula2 = [1,1,1]
		ynum = ym.discriminant(formula2)
		res2 = ynum < 0
		formula3 = [1,-4,4]
		znum = ym.discriminant(formula3)
		res3 = znum == 0
		self.assertEqual(res1, True)
		self.assertEqual(res2, True)
		self.assertEqual(res3, True)

class TestFormula(unittest.TestCase):
	'''
	Make formula function tests.
	'''	
	pass
	
class TestGCD(unittest.TestCase):
	'''
	GCD test class.
	'''
	def test_gcd(self):
		'''
		test function for gcd.
		'''
		res = ym.gcd(206, 40)
		self.assertEqual(res, 2)
		
class TestBenchMark(unittest.TestCase):
	'''
	Test class for benchmark.
	'''
	def test_tarai(self):
		'''
		Test function for tarai.
		'''
		res1 = ym.tarai(10, 5, 0)
		self.assertEqual(res1, 10)
		#too late.
		#res2 = ym.tarai(18, 12, 6)
		#self.assertEqual(res2, 18)

class TestIterationMethodTest(unittest.TestCase):
	'''
	Iteration method test class.
	'''
	def test_newton_raphson_by_sqrt(self):
		'''
		Test for newton_raphson method.
		Test by square root.
		'''
		res = ym.newton_raphson(root=2, start=2, repeat=4)
		self.assertEqual(round(res, 7), 1.4142136)

#Entry point
if __name__ == '__main__':
	unittest.main()

