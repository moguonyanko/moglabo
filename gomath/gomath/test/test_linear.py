#!/usr/bin/python3
# -*- coding: utf-8 -*-

import unittest
import math

import gomath.linear as lr

class TestVector(unittest.TestCase):
	
	def test_add(self):
		'''addition test'''
		v1 = lr.Vector([4, 3])
		v2 = lr.Vector([1, 2])
		res = v1 + v2
		self.assertEqual(res, lr.Vector([5, 5]))

	def test_sub(self):
		'''substract test'''
		v1 = lr.Vector([3, 4])
		v2 = lr.Vector([1, 2])
		res = v1 - v2
		self.assertEqual(res, lr.Vector([2, 2]))
		
	def test_mul(self):
		'''scalar multiplication test'''
		v1 = lr.Vector([3, 2])
		res_vecright = -2 * v1
		res_vecleft = v1 * -2
		resv = lr.Vector([-6, -4])
		self.assertEqual(res_vecright, resv)
		self.assertEqual(res_vecleft, resv)		

	def test_dotmul(self):
		'''dot multiplication test'''
		v1 = lr.Vector([3, 1])
		v2 = lr.Vector([2, 4])
		res = v1 * v2
		self.assertEqual(res, 10)
		
	def test_mulargerrorcheck(self):
		'''test of invalid argument error'''
		v1 = lr.Vector([3, 1])
		v2 = "TEST1"
		v3 = "TEST2"
		v4 = lr.Vector([3, 1])
		self.assertRaises(ValueError, v1.__mul__, v2)
		self.assertRaises(ValueError, v4.__rmul__, v3)

class TestNormalize(unittest.TestCase):
	'''
	Vector normalize test,\
	used by dot multiplication.
	'''
	def test_normalize(self):
		'''test normalize vector'''
		v1 = lr.Vector([3, 4])
		resv = lr.normalize(v1)
		self.assertEqual(resv, lr.Vector([3/5, 4/5]))

class TestOrthographicProjection(unittest.TestCase):
	'''
	Orthographic projection test.\
	This is required for orthonormalization.
	'''
	def test_orthproj(self):
		'''test orthographic projection'''
		v1 = lr.Vector([5, 3])
		v2 = lr.Vector([4, -2])
		resv = lr.orthproj(v1, v2)
		self.assertEqual(resv, lr.Vector([35/17, 21/17]))
		
class TestOrthogonalization(unittest.TestCase):
	'''Test for function of Gram-Schmidt orthogonalization'''
	def test_orthogonalize_dim2(self):
		'''test orthogonalization in 2 dimention'''
		v1 = lr.Vector([3, 1])
		v2 = lr.Vector([-2, 3])
		normv1 = lr.Vector([3/math.sqrt(10), 1/math.sqrt(10)])
		normv2 = lr.Vector([-1/math.sqrt(10), 3/math.sqrt(10)])
		resv = lr.orthogonalize([v1, v2])
		self.assertEqual(resv[0],normv1)
		self.assertEqual(resv[1],normv2)

	def test_orthogonalize_dim3(self):
		'''test orthogonalization in 3 dimention'''
		v1 = lr.Vector([1, 2, 0])
		v2 = lr.Vector([2, 1, 3])
		v3 = lr.Vector([2, 0, 1])
		d1 = math.sqrt(5)
		d2 = math.sqrt(30)
		d3 = math.sqrt(6)
		normv1 = lr.Vector([1/d1, 2/d1, 0/d1])
		normv2 = lr.Vector([2/d2, -1/d2, 5/d2])
		normv3 = lr.Vector([2/d3, -1/d3, -1/d3])
		resv = lr.orthogonalize([v1, v2, v3])
		self.assertEqual(resv[0],normv1)
		self.assertEqual(resv[1],normv2)
		self.assertEqual(resv[2],normv3)

class TestMatrix(unittest.TestCase):
	'''
	Test for matrix class.
	'''
	def test_add(self):
		'''test addition matrix'''
		v1 = lr.Vector([2,1])
		v2 = lr.Vector([3,1])
		v3 = lr.Vector([-1,1])
		v4 = lr.Vector([1,2])
		
		m1 = lr.Matrix([v1,v2])
		m2 = lr.Matrix([v3,v4])
		
		resm = m1+m2
		v01 = lr.Vector([1,2])
		v02 = lr.Vector([4,3])
		self.assertEqual(resm, lr.Matrix([v01,v02]))
		
	def test_sub(self):
		'''test subsctiption matrix'''
		v1 = lr.Vector([1,2])
		v2 = lr.Vector([3,4])
		v3 = lr.Vector([-1,-2])
		v4 = lr.Vector([-3,-4])
		
		m1 = lr.Matrix([v1,v2])
		m2 = lr.Matrix([v3,v4])
		
		resm = m1-m2
		resv1 = lr.Vector([2,4])
		resv2 = lr.Vector([6,8])
		self.assertEqual(resm, lr.Matrix([resv1,resv2]))

	def test_mul_mat_vec_dim2(self):
		'''matrix multipulate vector by dimention 2'''
		v1 = lr.Vector([-1,3])
		v2 = lr.Vector([2,1])
		m1 = lr.Matrix([v1,v2])
		
		mulv = lr.Vector([3,2])
		
		resv = m1*mulv
		chkv = lr.Vector([1,11])
		self.assertEqual(resv, chkv)

	def test_mul_mat_vec_dim3(self):
		'''matrix multipulate vector by dimention 3'''
		v1 = lr.Vector([1,0,1])
		v2 = lr.Vector([2,-2,1])
		v3 = lr.Vector([0,-1,1])
		m1 = lr.Matrix([v1,v2,v3])
		
		mulv = lr.Vector([1,2,3])
		
		resv = m1*mulv
		chkv = lr.Vector([5,-7,6])
		self.assertEqual(resv, chkv)

	def test_mul_mat_mat_dim2x2(self):
		'''matrix multipulate matrix by dimention 2x2'''
		v1 = lr.Vector([1,4])
		v2 = lr.Vector([3,6])
		mA = lr.Matrix([v1,v2])
		v3 = lr.Vector([-1,2])
		v4 = lr.Vector([3,-1])
		mB = lr.Matrix([v3,v4])
		
		resmAB = mA*mB
		resmBA = mB*mA
		chkv1 = lr.Vector([5,8])
		chkv2 = lr.Vector([0,6])
		chkmAB = lr.Matrix([chkv1,chkv2])
		chkv3 = lr.Vector([11,-2])
		chkv4 = lr.Vector([15,0])
		chkmBA = lr.Matrix([chkv3,chkv4])
		self.assertEqual(resmAB, chkmAB)
		self.assertEqual(resmBA, chkmBA)

	def test_mul_mat_mat_dim2x3(self):
		'''matrix multipulate matrix by dimention 2x3'''
		v1 = lr.Vector([-1,3])
		v2 = lr.Vector([3,-4])
		v3 = lr.Vector([2,-5])
		mA = lr.Matrix([v1,v2,v3])
		v4 = lr.Vector([1,-2,3])
		v5 = lr.Vector([3,-2,-1])
		mB = lr.Matrix([v4,v5])
		
		resmAB = mA*mB
		resmBA = mB*mA
		chkv1 = lr.Vector([-1,-4])
		chkv2 = lr.Vector([-11,22])
		chkmAB = lr.Matrix([chkv1,chkv2])
		chkv3 = lr.Vector([8,-4,-6])
		chkv4 = lr.Vector([-9,2,13])
		chkv5 = lr.Vector([-13,6,11])
		chkmBA = lr.Matrix([chkv3,chkv4,chkv5])
		self.assertEqual(resmAB, chkmAB)
		self.assertEqual(resmBA, chkmBA)

	def test_mul_mat_mat_dim3x3(self):
		'''matrix multipulate matrix by dimention 3x3'''
		v1 = lr.Vector([3,-1,-2])
		v2 = lr.Vector([1,2,1])
		v3 = lr.Vector([1,-1,4])
		mA = lr.Matrix([v1,v2,v3])
		v4 = lr.Vector([2,5,3])
		v5 = lr.Vector([1,-4,0])
		v6 = lr.Vector([2,-1,1])
		mB = lr.Matrix([v4,v5,v6])
		
		resmAB = mA*mB
		resmBA = mB*mA
		
		chkv1 = lr.Vector([14,5,13])
		chkv2 = lr.Vector([-1,-9,-6])
		chkv3 = lr.Vector([6,-5,-1])
		chkmAB = lr.Matrix([chkv1,chkv2,chkv3])
		chkv4 = lr.Vector([1,21,7])
		chkv5 = lr.Vector([6,-4,4])
		chkv6 = lr.Vector([9,5,7])
		chkmBA = lr.Matrix([chkv4,chkv5,chkv6])
		self.assertEqual(resmAB, chkmAB)
		self.assertEqual(resmBA, chkmBA)

	def test_mul_mat_scala_dim2x2(self):
		'''test matrix multipulate scala by dimention 2x2'''
		v1 = lr.Vector([2,1])
		v2 = lr.Vector([3,1])
		scala = 2
		m1 = lr.Matrix([v1,v2])
		
		resm1 = scala*m1
		resm2 = m1*scala
		
		chkv1 = lr.Vector([4,2])
		chkv2 = lr.Vector([6,2])
		chkm = lr.Matrix([chkv1,chkv2])
		self.assertEqual(resm1, chkm)
		self.assertEqual(resm2, chkm)

	def test_pow_dim2x2(self):
		'''test inverse by dimention 2'''
		v1 = lr.Vector([4,7])
		v2 = lr.Vector([5,9])
		m1 = lr.Matrix([v1,v2])
		
		resm = m1**-1
		
		chkv1 = lr.Vector([9,-7])
		chkv2 = lr.Vector([-5,4])
		chkm = lr.Matrix([chkv1,chkv2])
		self.assertEqual(resm, chkm)

	def test_pow_dim2x2_zero(self):
		'''test determinent by diimention 2x2 but zero,occured exception'''
		v1 = lr.Vector([3,-12])
		v2 = lr.Vector([-2,8])
		m1 = lr.Matrix([v1,v2])
		self.assertRaises(ValueError, m1.__pow__, -1)

	def test_pow_dim2x2_notminus1(self):
		'''test determinent by diimention 3x2 but not minus1,occured exception'''
		v1 = lr.Vector([3,1,1])
		v2 = lr.Vector([1,8,3])
		m1 = lr.Matrix([v1,v2])
		self.assertRaises(ValueError, m1.__pow__, 2)

	def test_squarep(self):
		'''test square predicate fucntion'''
		v1 = lr.Vector([3,-12])
		v2 = lr.Vector([-2,8])
		m1 = lr.Matrix([v1,v2])
		
		v3 = lr.Vector([3,-12,1])
		v4 = lr.Vector([-2,8,8])
		m2 = lr.Matrix([v3,v4])

		v5 = lr.Vector([3,1])
		v6 = lr.Vector([-2,8])
		v7 = lr.Vector([10,1])
		m3 = lr.Matrix([v5,v6,v7])
		
		res1 = m1.squarep()
		res2 = m2.squarep()
		res3 = m3.squarep()
		self.assertEqual(res1, True)
		self.assertEqual(res2, False)
		self.assertEqual(res3, False)
		
	def test_solve_equations_by_inverse(self):
		'''
		test to solve equations by inverse matrix
		3x-y=-4
		2x-y=-3
		'''
		v1 = lr.Vector([3,2])
		v2 = lr.Vector([-1,-1])
		m1 = lr.Matrix([v1,v2])
		v3 = lr.Vector([-4,-3])
		
		resv = m1**-1*v3
		
		chkv = lr.Vector([-1,1])
		self.assertEqual(resv, chkv)
		
	def test_pow_dim3x3(self):
		'''inverse by dimention 3x3'''
		v1 = lr.Vector([1,-2,1])
		v2 = lr.Vector([-1,3,-1])
		v3 = lr.Vector([2,-5,1])
		m1 = lr.Matrix([v1,v2,v3])
		
		resm = m1**-1
		
		chkv1 = lr.Vector([2,3,1])
		chkv2 = lr.Vector([1,1,0])
		chkv3 = lr.Vector([1,-1,-1])
		chkm = lr.Matrix([chkv1,chkv2,chkv3])
		self.assertEqual(resm, chkm)
		
	def test_symmetryp(self):
		'''
		test for matrix symmetry check.
		'''
		v1 = lr.Vector([2,0,3])
		v2 = lr.Vector([0,1,0])
		v3 = lr.Vector([3,0,2])
		m1 = lr.Matrix([v1,v2,v3])
		v4 = lr.Vector([2,0,3])
		v5 = lr.Vector([0,1,0])
		v6 = lr.Vector([3,0,3])
		m2 = lr.Matrix([v4,v5,v6])
		v7 = lr.Vector([2,0,3])
		v8 = lr.Vector([0,1,0])
		v9 = lr.Vector([4,0,2])
		m3 = lr.Matrix([v7,v8,v9])
		
		res1 = m1.symmetryp()
		res2 = m2.symmetryp()
		res3 = m3.symmetryp()
		self.assertEqual(res1, True)
		self.assertEqual(res2, True)
		self.assertEqual(res3, False)
		
	def test_swap(self):
		'''
		Test matrix swap.
		'''
		v1 = lr.Vector([2,0,3])
		v2 = lr.Vector([0,1,0])
		v3 = lr.Vector([4,0,2])
		m1 = lr.Matrix([v1,v2,v3])

		m1.swap(0,2)	#column swap
		
		v4 = lr.Vector([3,0,2])
		v5 = lr.Vector([0,1,0])
		v6 = lr.Vector([2,0,4])
		m2 = lr.Matrix([v4,v5,v6])
		
		self.assertEqual(m1, m2)		

		m1.swap(0,2,"row")	#row swap
		
		v4 = lr.Vector([2,0,4])
		v5 = lr.Vector([0,1,0])
		v6 = lr.Vector([3,0,2])
		m3 = lr.Matrix([v4,v5,v6])
	
		self.assertEqual(m1, m3)
						
class TestDetMatrix(unittest.TestCase):
	'''
	Test matrix determinent class.
	'''
	def test_det_dim2x2(self):
		'''test determinent by diimention 2x2'''
		v1 = lr.Vector([3,-12])
		v2 = lr.Vector([-2,8])
		m1 = lr.Matrix([v1,v2])
		
		detval = lr.det(m1)
		self.assertEqual(detval, 0)

	def test_det_dim3x3(self):
		'''test determinent by diimention 3x3'''
		v1 = lr.Vector([2,3,-1])
		v2 = lr.Vector([-1,1,-2])
		v3 = lr.Vector([1,2,3])
		m1 = lr.Matrix([v1,v2,v3])
		
		detval = lr.det(m1)
		self.assertEqual(detval, 20)

class TestRotate(unittest.TestCase):
	'''
	Test Rotation.
	'''	
	def test_rotate_vec(self):
		'''vector rotate test'''
		v1 = lr.Vector([6,4])
		deg = 60
		resv = v1.rotate(deg)
		chkv = lr.Vector([3-2*math.sqrt(3),3*math.sqrt(3)+2])
		self.assertEqual(resv, chkv)
		
	def test_rotate_size_error(self):
		'''vector size error check'''
		v1 = lr.Vector([6,4,9])
		deg = 60
		self.assertRaises(ValueError, v1.rotate, deg)
		
class TestTurn(unittest.TestCase):
	'''
	Test turn.
	'''	
	def test_turn_vec(self):
		'''vector turn test'''
		v1 = lr.Vector([6,4])
		deg = 30
		resv = v1.turn(deg)
		chkv = lr.Vector([3+2*math.sqrt(3),3*math.sqrt(3)-2])
		self.assertEqual(resv, chkv)
		
	def test_turn_size_error(self):
		'''vector size error check'''
		v1 = lr.Vector([6,4,9])
		deg = 30
		self.assertRaises(ValueError, v1.turn, deg)

class TestMakeIdentityMatrix(unittest.TestCase):
	'''
	Test to make identity matrix.
	This is utility to avoid miss type.
	'''
	def test_einheit_2x2(self):
		'''test identity matrix by dimention 2x2'''
		resm = lr.einheit(2)
		v1 = lr.Vector([1,0])
		v2 = lr.Vector([0,1])
		chkm = lr.Matrix([v1, v2])
		self.assertEqual(resm, chkm)

	def test_einheit_3x3(self):
		'''test identity matrix by dimention 3x3'''
		resm = lr.einheit(3)
		v1 = lr.Vector([1,0,0])
		v2 = lr.Vector([0,1,0])
		v3 = lr.Vector([0,0,1])
		chkm = lr.Matrix([v1, v2, v3])
		self.assertEqual(resm, chkm)

class TestLUDecompose(unittest.TestCase):
	'''
	LU-decomposition test class.
	'''
	def test_lu_decompose(self):
		'''
		test lu decompose
		L and U each equal check.
		'''
		#TODO:implement now.
		'''
		v1 = lr.Vector([8,2,6,7])
		v2 = lr.Vector([16,7,17,22])
		v3 = lr.Vector([24,12,32,46])
		v4 = lr.Vector([32,17,59,105])
		m1 = lr.Matrix([v1,v2,v3,v4])
		
		res = lr.lu_decompose(m1)
		ml = res[0]
		mu = res[1]
		
		chkv1 = lr.Vector([8,2,6,7])
		chkv2 = lr.Vector([0,3,5,8])
		chkv3 = lr.Vector([0,0,4,9])
		chkv4 = lr.Vector([0,0,0,8])
		chkml = lr.Matrix([chkv1,chkv2,chkv3,chkv4])		
		
		chkv5 = lr.Vector([1,0,0,0])
		chkv6 = lr.Vector([2,1,0,0])
		chkv7 = lr.Vector([3,2,1,0])
		chkv8 = lr.Vector([4,3,5,1])
		chkml = lr.Matrix([chkv5,chkv6,chkv7,chkv8])		

		self.assertEqual(ml, chkml)
		self.assertEqual(mu, chkmu)
		'''

class TestBaseExchange(unittest.TestCase):
	'''
	Test base exchange of matrix
	'''
	def test_base_exchange_dim2(self):
		'''
		test matrix base echange by 2 dimention
		'''
		va = lr.Vector([-1,2])
		vb = lr.Vector([3,1])
		mSrc = lr.Matrix([va, vb])
		vc = lr.Vector([1,5])
		vd = lr.Vector([11,-1])
		mDist = lr.Matrix([vc, vd])
		resm = lr.base_exchange(mSrc, mDist)
		
		chkv1 = lr.Vector([2,1])
		chkv2 = lr.Vector([-2,3])
		chkm = lr.Matrix([chkv1,chkv2])
		
		self.assertEqual(resm, chkm)

	def test_base_exchange_dim3(self):
		'''
		test matrix base echange by 3 dimention
		'''
		va = lr.Vector([1,-1,2])
		vb = lr.Vector([-2,3,-5])
		vc = lr.Vector([1,-1,1])
		mSrc = lr.Matrix([va, vb, vc])
		vd = lr.Vector([3,-2,3])
		ve = lr.Vector([-1,1,3])
		vf = lr.Vector([-1,1,2])
		mDist = lr.Matrix([vd, ve, vf])
		resm = lr.base_exchange(mSrc, mDist)
		
		chkv1 = lr.Vector([3,1,2])
		chkv2 = lr.Vector([4,0,-5])
		chkv3 = lr.Vector([3,0,-4])
		chkm = lr.Matrix([chkv1,chkv2,chkv3])
		
		self.assertEqual(resm, chkm)
		
	def test_base_exchanged_express(self):
		'''
		test expressionmatrix after base exchanged
		'''
		v1 = lr.Vector([-3,2])
		v2 = lr.Vector([1,-2])
		express_mat = lr.Matrix([v1,v2])
		
		va = lr.Vector([2,5])
		vb = lr.Vector([1,3])
		exchange_mat = lr.Matrix([va,vb])
		
		resm = lr.base_exchanged_express(express_mat,exchange_mat)
		
		chkv1 = lr.Vector([3,-7])
		chkv2 = lr.Vector([4,-8])
		chkm = lr.Matrix([chkv1,chkv2])

		self.assertEqual(resm, chkm)

class TestEigen(unittest.TestCase):
	'''
	Test class for eigen function. 
	'''
	def test_eigen_2dim(self):
		'''
		test eigen function by 2 dimention
		'''
		v1 = lr.Vector([4,5])
		v2 = lr.Vector([-1,-2])
		matA = lr.Matrix([v1,v2])
		
		res = lr.eigen(matA)
		
		chk = {
			-1 : lr.Vector([1,5]), 
			3 : lr.Vector([1,1])
		}
		
		self.assertEqual(res, chk)

	def test_eigen_3dim(self):
		'''
		test eigen function by 3 dimention
		'''
		v1 = lr.Vector([1,-1,0])
		v2 = lr.Vector([-2,1,-2])
		v3 = lr.Vector([0,-1,1])
		m1 = lr.Matrix([v1,v2,v3])
		
		res = lr.eigen(m1)
		
		chk = {-1,1,3}
		
		#TODO: implement
		#self.assertEqual(res, chk)
		
	def test_diagonalize(self):
		'''
		test diagonalization function.
		'''
		v1 = lr.Vector([4,5])
		v2 = lr.Vector([-1,-2])
		m1 = lr.Matrix([v1,v2])
		
		res = lr.diagonalize(m1)
		
		chkv1 = lr.Vector([-1,0])
		chkv2 = lr.Vector([0,3])
		chkm1 = lr.Matrix([chkv1,chkv2])
		
		self.assertEqual(res, chkm1)
		
	def test_spectral_decompose(self):
		'''
		test for spectral decomposition function.
		'''
		v1 = lr.Vector([4,5])
		v2 = lr.Vector([-1,-2])
		m1 = lr.Matrix([v1,v2])
		
		res = lr.spectral_decompose(m1)
		
		self.assertEqual(res, [-1,3])

	def test_diagonalize_symmetry(self):
		'''
		test diagonalization function by symmetry matrix.
		'''
		v1 = lr.Vector([1,3])
		v2 = lr.Vector([3,1])
		m1 = lr.Matrix([v1,v2])
		
		res = lr.diagonalize(m1)
		
		chkv1 = lr.Vector([-2,0])
		chkv2 = lr.Vector([0,4])
		chkm1 = lr.Matrix([chkv1,chkv2])
		
		self.assertEqual(res, chkm1)
	
	def test_trace(self):
		'''
		Test trace calculate function
		'''
		v1 = lr.Vector([4,5])
		v2 = lr.Vector([-1,-2])
		matA = lr.Matrix([v1,v2])
		
		res = lr.trace(matA)
		
		self.assertEqual(res, 2)
		
	"""	
	def test_givens_rotate(self):
		'''
		Givens rotation function test.
		'''
		v1 = lr.Vector([1,0.19,0.36])
		v2 = lr.Vector([0.19,1,0.30])
		v3 = lr.Vector([0.36,0.30,1])
		m1 = lr.Matrix([v1,v2,v3])
		
		resm = m1.rotate(degree=0, method="givens")
		
		#TODO:test code is not uncompleted
		chkv1 = lr.Vector([1,0.19,0.36])
		chkv2 = lr.Vector([0.19,1,0.30])
		chkv3 = lr.Vector([0.36,0.30,1])
		chkm = lr.Matrix([chkv1,chkv2,chkv3])
		
		#self.assertEqual(resm, chkm)
	"""		
		
	def test_jacobi(self):
		'''
		Jacobi method test.
		'''
		#v1 = lr.Vector([1,1,2])
		#v2 = lr.Vector([1,1,1])
		#v3 = lr.Vector([2,1,1])
		v1 = lr.Vector([1.0,0.19,0.36])
		v2 = lr.Vector([0.19,1.0,0.30])
		v3 = lr.Vector([0.36,0.30,1.0])
		m1 = lr.Matrix([v1,v2,v3])
		
		res = lr.jacobi(m1)
		#res = m1.eigen()
		
		chk = {
			1.6 : lr.Vector([0.57,0.52,0.63]), 
			0.8 : lr.Vector([-0.60,0.79,-0.11]),
			0.6 : lr.Vector([-0.55,-0.32,0.77])
		}
				
		#TODO: implement now.
		#self.assertEqual(res, chk)
	
class TestTranspose(unittest.TestCase):
	'''
	Matrix transpose test class.
	'''
	def test_transpose(self):
		'''
		Test for transpose function.
		'''
		v1 = lr.Vector([1,0,1])
		v2 = lr.Vector([0,2,0])
		v3 = lr.Vector([-1,0,1])
		m1 = lr.Matrix([v1,v2,v3])
		
		resm = lr.transpose(m1)
		
		cv1 = lr.Vector([1,0,-1])
		cv2 = lr.Vector([0,2,0])
		cv3 = lr.Vector([1,0,1])
		chkm = lr.Matrix([cv1,cv2,cv3])
		
		self.assertEqual(resm, chkm)

class TestSpecialMethodAccessor(unittest.TestCase):
	'''
	Matrix and Vactor class special method test class.
	'''
	def test_vector_setitem(self):
		'''
		Vector class setter test.
		'''
		v1 = lr.Vector([1,4,7])
		v1[0] = 100
		v1[1] = 200
		v1[2] = 300
		chkv = lr.Vector([100,200,300])

		self.assertEqual(v1, chkv)

	def test_vector_getitem(self):
		'''
		Vector class getter test.
		'''
		v1 = lr.Vector([1,4,7])

		self.assertEqual(v1[0], 1)
		self.assertEqual(v1[1], 4)
		self.assertEqual(v1[2], 7)
		
	def test_matrix_setitem(self):
		'''
		Matrix class setter test.
		'''
		v1 = lr.Vector([1,4,7])
		v2 = lr.Vector([-2,-5,-7])
		v3 = lr.Vector([3,6,10])
		m1 = lr.Matrix([v1,v2,v3])
		
		m1[(0,0)] = 100
		m1[(1,1)] = 200
		m1[(2,2)] = 300
		
		v4 = lr.Vector([100,4,7])
		v5 = lr.Vector([-2,200,-7])
		v6 = lr.Vector([3,6,300])
		chkm = lr.Matrix([v4,v5,v6])

		self.assertEqual(m1, chkm)

	def test_matrix_getitem(self):
		'''
		Matrix class getter test.
		'''
		v1 = lr.Vector([1,4,7])
		v2 = lr.Vector([-2,-5,-7])
		v3 = lr.Vector([3,6,10])
		m1 = lr.Matrix([v1,v2,v3])

		self.assertEqual(m1[(0,0)], 1)
		self.assertEqual(m1[(1,1)], -5)
		self.assertEqual(m1[(2,2)], 10)

		self.assertEqual(m1[0], v1)
		self.assertEqual(m1[1], v2)
		self.assertEqual(m1[2], v3)
		
	def test_vector_len(self):
		'''
		Vector class length test.
		'''
		v1 = lr.Vector([1,4,7])
	
		self.assertEqual(len(v1), 3)
		
	def test_matrix_len(self):
		'''
		Matrix class length test.
		'''
		v1 = lr.Vector([1,4,7])
		v2 = lr.Vector([-2,-5,-7])
		v3 = lr.Vector([3,6,10])
		m1 = lr.Matrix([v1,v2,v3])
	
		self.assertEqual(len(m1), 3)
		
	def test_matrix_loop(self):
		'''
		Test get element in loop.
		'''
		v1 = lr.Vector([1])
		m1 = lr.Matrix([v1])
		
		for x in v1:
			#print(type(x))
			self.assertEqual(x, 1)
			
		for v in m1:
			#print(type(v))
			self.assertEqual(v, v1)

	def test_matrix_pow_notminus1(self):
		'''
		Matrix power function test.
		'''
		v1 = lr.Vector([1.0,0.0])
		v2 = lr.Vector([0.0,2.0])
		m1 = lr.Matrix([v1,v2])
	
		#resm = m1*m1 #easy test
		resm = m1**2
		
		chkv1 = lr.Vector([1.0,0.0])
		chkv2 = lr.Vector([0.0,4.0])
		chkm = lr.Matrix([chkv1,chkv2])
	
		self.assertEqual(resm, chkm)

class TestSweepOut(unittest.TestCase):
	'''
	Test class for sweep out function.
	'''
	def test_sweep_out(self):
		'''
		Test function of sweep out.
		'''
		#TODO: implement on the way.
		'''
		v1 = lr.Vector([1,4,7])
		v2 = lr.Vector([-2,-5,-7])
		v3 = lr.Vector([3,6,10])
		m1 = lr.Matrix([v1,v2,v3])
		
		v4 = lr.Vector([6,12,21])
		
		resv = lr.sweep_out(m1, v4)
		
		chkv = lr.Vector([1,2,3])
		
		self.assertEqual(resv, chkv)
		'''
		pass
		
class MatrixMinMaxTest(unittest.TestCase):
	'''
	Matrix min max value function test class.
	'''
	v1 = lr.Vector([1,4,7])
	v2 = lr.Vector([-2,-50,-300])
	v3 = lr.Vector([3,6,10])
	v4 = lr.Vector([1,500,100])
	m1 = lr.Matrix([v1,v2,v3,v4])
	def test_min(self):
		'''
		Matrix min value test.
		'''
		res = self.m1.minElement()		

		chk = (2,1,-300)
		self.assertEqual(res, chk)
	
	def test_max(self):
		'''
		Matrix max value test.
		'''
		res = self.m1.maxElement()		

		chk = (1,3,500)
		self.assertEqual(res, chk)

#Entry point
if __name__ == '__main__':
	print(__file__)
	unittest.main()
