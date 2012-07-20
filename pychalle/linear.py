#!/usr/bin/python3
# -*- coding: utf-8 -*-

import numbers
import math

import moglabo.pychalle.util as ut
import moglabo.pychalle.algorithm as al
import moglabo.pychalle.algebra as ag

class Vector():
	'''
	Vector class definition.
	This class will be used Matrix.
	'''
	
	'''
	A significant figure,
	suitably value set.
	'''
	SIGNIFICANT_FIGURE = 4
	
	def __init__(self, cols):
		'''
		Initialize vector.
		cols: column value list.
		'''
		self.cols = cols
		
	def __len__(self):
		'''
		Vector elements length return.
		'''
		return len(self.cols)
		
	def __getitem__(self, index):
		'''
		Get vector component by numeric index.
		'''
		return self.cols[index]

	def __setitem__(self, index, value):
		'''
		Set vector component by numeric index.
		'''
		self.cols[index] = value
		
	def __common_mul_operate(self, target, org):
		'''
		Common multiplication operation.
		If argument is numbers.Real, scalar multiplication.
		Elif Vector, dot multiplication.
		'''
		if isinstance(target, numbers.Real):
			ps = [target*a for a in org.cols]
			return Vector(ps)
		elif isinstance(target, Vector):
			tmp = zip(org.cols, target.cols)
			res = 0
			for a1, a2 in tmp:
				res += a1*a2
			return res
		else:
			raise ValueError("Argument need to be numbers.Real or Vector.")
	
	def __add__(self, target):
		'''
		Addition vector.
		'''
		cmps = zip(self.cols, target.cols)
		ps = [a+b for a,b in cmps]
		
		return Vector(ps)
		
	def __sub__(self, target):
		'''
		Subtract vector.
		'''
		cmps = zip(self.cols, target.cols)
		ps = [a-b for a,b in cmps]
		
		return Vector(ps)
		
	def __mul__(self, target):
		'''
		Multiplication vector for left side vector.
		'''
		return self.__common_mul_operate(target, self)

	def __rmul__(self, target):
		'''
		Multiplication vector for right side vector.
		'''
		return self.__common_mul_operate(target, self)
		
	def __eq__(self, target):
		'''
		If point value equal, vectors are equal.
		'''
		cmps = zip(self.cols, target.cols)
		sg = self.SIGNIFICANT_FIGURE
		for a,b in cmps:
			if round(a, sg) != round(b, sg):
				return False
				
		return True
		
	def __str__(self):
		'''
		Return point value by string expression.
		'''
		return str(self.cols)

	def __sizecheck(self):
		'''
		Dimention size check.
		'''
		if len(self.cols) != 2:
			raise ValueError("Sorry, now required 2 dimention vector.")

	def rotate(self, degree):
		'''
		Calculate rotate matorix or vector expression.
		note:This function is adapt only 2 dimention vector.
		'''
		self.__sizecheck()
		
		rad = math.radians(degree)
		v1 = Vector([math.cos(rad), math.sin(rad)])
		v2 = Vector([-math.sin(rad), math.cos(rad)])
		rotatem = Matrix([v1, v2])
		
		return rotatem*self

	def turn(self, degree):
		'''
		Turn vector function.
		note:This function is adapt only 2 dimention vector.
		'''
		self.__sizecheck()
			
		rad = math.radians(2*degree)
		v1 = Vector([math.cos(rad), math.sin(rad)])
		v2 = Vector([math.sin(rad), -math.cos(rad)])
		rotatem = Matrix([v1, v2])
		
		return rotatem*self
		
	def normalize(self):
		'''
		Vector normalization.
		'''
		orgcols = self.cols
		tmp = [a**2 for a in orgcols]
		distance = math.sqrt(sum(tmp))
		newcols = list(map(lambda x: x*1/distance, orgcols))
		
		return Vector(newcols)
		
	def orthproj(self, targetv, normal=False):
		'''
		Orthographic projection vector.
		'''
		normv = self
		if normal == False: 
			normv = self.normalize()
			
		return targetv*normv*normv

def normalize(vec):
	'''
	Vector normalization.
	'''
	return vec.normalize()

def orthproj(scalev, targetv):
	'''
	Orthographic projection vector.
	'''
	return scalev.orthproj(targetv)

def rmcols(targetv, vecs):
	'''
	Remove columns from vector.
	'''
	orgv = Vector(targetv.cols)
	for v in vecs:
		orgv = orgv-v
		
	return orgv

def orthogonalize(vecs):
	'''
	Gram-Schmidt orthogonalization.
	'''
	normvs = [vecs[0].normalize()]
	tmp = vecs[1:len(vecs)]
	for v in tmp:
		orthvs = []
		for normv in normvs:
			otv = normv.orthproj(v, normal=True)
			orthvs.append(otv)
		rmdv = rmcols(v, orthvs)
		nmv = rmdv.normalize()
		normvs.append(nmv)
		
	return normvs

class Matrix():
	'''
	Matrix class definition.
	This is used to express linear mapping.
	'''
	invalid_index_message = "Invarid index recieved."
	
	def __init__(self, rows):
		'''
		Initialize matrix by received row vector.
		'''
		self.rows = rows
		
	def __setitem__(self, row_column, value):
		'''
		Set value to matrix by row column tuple.
		'''
		if isinstance(row_column, tuple):
			self.rows[row_column[0]][row_column[1]] = value
		elif isinstance(row_column, int):
			self.rows[row_column] = value
		else:
			raise ValueError(self.invalid_index_message)
		
	def __getitem__(self, row_column):
		'''
		Get value from matrix by row column tuple.
		If row_column is tuple, return element. 
		If row_column is int, return row of vector. 
		'''
		if isinstance(row_column, tuple):
			return self.rows[row_column[0]][row_column[1]]
		elif isinstance(row_column, int):
			return self.rows[row_column]
		else:
			raise ValueError(self.invalid_index_message)
		
	def __add__(self, target):
		'''
		Matrix addition.
		'''
		newrows = []
		rows = self.rows
		trows = target.rows
		rowlen = len(rows)
		
		for i in range(rowlen):
			newrow = rows[i]+trows[i]
			newrows.append(newrow)
			
		return Matrix(newrows)
		
	def __sub__(self, target):
		'''
		Matrix subsctiption.
		'''
		newrows = []
		rows = self.rows
		trows = target.rows
		rowlen = len(rows)
		
		for i in range(rowlen):
			newrow = rows[i]-trows[i]
			newrows.append(newrow)
			
		return Matrix(newrows)

	def __innermul(self, col, nums):
		'''
		Matrix column multipulate to numbers.
		'''
		res = []
		for i in range(len(nums)):
			res.append(col[i]*nums[i])
		return sum(res)
	
	def __mulvector(self, target):
		'''
		Matrix multipulate vector.
		'''
		orgcols = [v.cols for v in self.rows]
		cols = list(zip(*orgcols))
		newcols = list(map(lambda col: self.__innermul(col, target.cols), cols))
		return Vector(newcols)

	def __common_mulmatscala(self, target):
		'''
		Matrix multipulate scala common routine.
		'''
		vecs = []
		for v in self.rows:
			vecs.append(Vector([x*target for x in v.cols]))
		return Matrix(vecs)

	def __mul__(self, target):
		'''
		Composite linear mapping.
		'''
		if isinstance(target, Vector):
			if len(self.rows) != len(target.cols):
				raise ValueError("difference size of matrix rows and vector columns.")
			return self.__mulvector(target)
		elif isinstance(target, Matrix):
			if len(self.rows) != len(target.rows[0].cols):
				raise ValueError("difference size of matrix rows and matrix columns.")
			return Matrix([self.__mulvector(trow) for trow in target.rows])
		elif isinstance(target, numbers.Real):
			return self.__common_mulmatscala(target)
		else:
			pass
			
	def __rmul__(self, target):
		'''
		Composite linear mapping by right multipulate.
		'''
		if isinstance(target, numbers.Real):
			return self.__common_mulmatscala(target)
		else:
			pass
			
	def __propereq_dim2(self, n):
		'''
		Solve to power of 2x2 dimention matrix by proper equation.
		n: Power number.
		'''
		eg = self.eigen()
		egvalues = sorted(list(eg.keys()))
		
		a = egvalues[0]
		b = egvalues[1] 
		E = einheit(2)
		
		resm = ((b**n-a**n)/(b-a))*self+((a**n*b-a*b**n)/(b-a))*E
		
		return resm
		
	def __pow__(self, target):
		'''
		If power number is -1, inverse matrix.
		Dimention 2 or more than 3, method change.
		target: Power number.
		'''
		is2x2 = self.dim() == [2,2]
		if target != -1:
			if is2x2:	return self.__propereq_dim2(target)
			else:	raise ValueError("Unsupported exponent value.")
		else:
			cols = self.rows[0].cols
			if is2x2:
				detval = det(self)
				if detval == 0:	raise ValueError("no matrix determinent.")
				
				v1 = self.rows[0]
				v2 = self.rows[1]
				a = v1.cols[0]
				b = v1.cols[1]
				c = v2.cols[0]
				d = v2.cols[1]
				scala = 1/detval
				newv1 = Vector([d,-b])
				newv2 = Vector([-c,a])
			
				return scala*Matrix([newv1,newv2])
			elif self.squarep():
				E = einheit(len(self.rows))
				eqvecs = []
				veccols = [row.cols for row in self.rows]
				for erow in E.rows:
					tmp = veccols+[erow.cols]
					formuras = list(zip(*tmp))
					eqs = ut.sleq(formuras)
					eqvecs.append(Vector(eqs))
			
				return Matrix(eqvecs)
			else:
				pass			
	
	def __eq__(self, target):
		'''
		If rows equal, return true.
		'''
		rows = self.rows
		tarrows = target.rows
		rowlen = len(rows)

		if rowlen != len(tarrows):
			return False
			
		for i in range(rowlen):
			if rows[i] != tarrows[i]:
				return False
		return True
				
	def __str__(self):
		'''
		Rows string expression return.
		'''
		rows = self.rows
		strs = ""
		for row in rows:
			strs += str(row)
		return strs
		
	def __round__(self, n):
		'''
		Matrix element round.
		'''	
		pass
		
	def rotate(self, degree):
		'''
		Expression matrix of rotated degree this matrix.
		'''
		pass
		
	def turn(self, degree):
		'''
		Turn expression matrix.
		'''
		pass
		
	def squarep(self):
		'''
		Predicate to confirm matrix square.
		'''
		rownum = len(self.rows)
		colnum = len(self.rows[0].cols)
		return rownum == colnum
		
	def dim(self):
		'''
		Matrix dimension return.
		'''
		return [len(self.rows), len(self.rows[0].cols)]
		
	def symmetryp(self):
		'''
		Predicate to confirm matrix symmetry.
		'''
		if self.squarep() == False:
			return False
			
		for i in range(len(self.rows)):
			for j in range(len(self.rows[i].cols)):
				if i != j and (self.rows[i].cols[j] != self.rows[j].cols[i]):
					return False	
					
		return True
		
	def __len__(self):
		'''
		Matrix row length return.
		'''
		return len(self.rows)
		
	def getcolumns(self):
		'''
		Return matrix elements by columns form.
		'''
		rows = [v.cols for v in self]
		
		return list(zip(*rows))
		
	def swap(self, i, j, target="column"):
		'''
		Swap rows for indexes.
		'''
		if target == "column":
			cols = self.getcolumns()

			#Swap matrix columns.		
			tmp = cols[i]
			cols[i] = cols[j]
			cols[j] = tmp
			#TODO: Is need Vector create?
			self[i] = Vector(cols[i])
			self[j] = Vector(cols[j])
		else: 
			#Swap matrix rows.
			tmp = self[i]
			self[i] = self[j]
			self[j] = tmp
	
	def det(self):
		'''
		Caluculate determinant.
		'''
		#TODO: more than 3 dimention matrix
		dimension = self.dim()
		if dimension == [2,2]:
			v1 = self.rows[0]
			v2 = self.rows[1]
			a = v1.cols[0]
			b = v1.cols[1]
			c = v2.cols[0]
			d = v2.cols[1]
		
			return a*d-b*c
		
		elif dimension == [3,3]:
			row1 = self.rows[0]
			row2 = self.rows[1]
			row3 = self.rows[2]
		
			A = row1.cols[0]
			B = row1.cols[1]
			C = row1.cols[2]
			x = row2.cols[0]
			y = row2.cols[1]
			z = row2.cols[2]
			a = row3.cols[0]
			b = row3.cols[1]
			c = row3.cols[2]
		
			return A*y*c+B*z*a+C*x*b-A*z*b-B*x*c-C*y*a
		
		else:
			pass
			
	def __eigen_2dim(self):
		'''
		Calculate eigen value for 2 dimension matrix.
		'''
		formula = ut.makelist(length=3, initvalue=0)
		formula[0] = 1 #x^2 coef

		rows = self.rows
		cols1 = rows[0].cols
		cols2 = rows[1].cols
		a = cols1[0]
		d = cols2[1]
		formula[1] = a*-1+(-1)*d

		formula[2] = self.det()
	
		egs = ag.quadeq(formula)
		
		if len(egs) <= 1:
			raise ValueError("Multiple root cannot deal.")
		
		res = {}
		for eg in egs:
			resA = a-eg
			resC = cols2[0]
	#TODO: reduct function is fault.
	#		if resA != 1 and resC != 1:
	#			if resA>resC:
	#				resA,resC = ag.reduct(resA, resC)
	#			elif resC<resA:	
	#				resC,resA = ag.reduct(resC, resA)
	#			else:
	#				resA = resC = 1
				
			res[eg] = Vector([-resC,resA])
	
		return res
	
	def __eigen_3dim(self):
		'''
		Calculate eigen value for 3 dimension matrix.
		'''
		#TODO:More than 3 dimention case.
		pass				

	def eigen(self):
		'''
		Calculate eigen value.
		Return dict has key of eigen value, 
		value of eigen vector.
		'''
		dimension = self.dim()
		if dimension == [2,2]:
			return self.__eigen_2dim()
		elif dimension == [3,3]:
			return self.__eigen_3dim()
		else:
			pass
		
	def base_exchange(self, dist):
		'''
		Matrix base exchange.
		'''
		return self**-1*dist
	
	def base_exchanged_express(self, exchange_mat):
		'''
		Matrix expression after base exchange.
		From standard base to any base.
		'''
		return exchange_mat**-1*self*exchange_mat
		
	def diagonalize(self):
		'''
		Matrix diagonalization.
		Complex implement for check calculation.
		'''
		eg = self.eigen()
		vecs = [eg[egv] for egv in sorted(eg)]
		if self.symmetryp():
			normvecs = [normalize(vec) for vec in vecs]
			normmat = Matrix(normvecs)
			transnormmat = normmat.transpose()
			return transnormmat*self*normmat
		else:
			egmat = Matrix(vecs)
			return egmat**-1*self*egmat	
		
	def transpose(self):
		'''
		Matrix transposition.
		'''
		cols = [row.cols for row in self.rows]
		tmp = list(zip(*cols))
		newrows = [Vector(newcols) for newcols in tmp]
		
		return Matrix(newrows)
	
	def lu_decompose(self):
		'''
		LU-decomposition of matrix.
		'''
		#TODO:implement on the way
		cols = self.getcolumns()
		msize = len(cols)
		for i in range(msize-1):
			j = i+1
			while j < msize:
				cols[j*msize+i] /= cols[i*msize+i]
				j += 1
				k = i+1
				while k < msize:
					cols[j*msize+k] -= cols[j+msize+i]*cols[i*msize+k]

					k += 1
	
		rows = list(*zip(cols))
	
		lvs = []
		for l in range(len(rows)):
			lvs.append(rows[l])
			for ll in range(l):
				lvs[ll] = 0
			
		lvecs = [Vector(vs) for vs in lvs]

		uvs = []
		for u in range(len(rows)):
			uvs.append(rows[u])
			uu = u
			while uu < msize:
				if uu == u:
					uvs[uu] = 1
				else:
					uvs[uu] = 0
				uu += 1

		uvecs = [Vector(vs) for vs in uvs]
	
		return (Matrix(lvecs), Matrix(uvecs))	
		
	def spectral_decompose(self):
		'''
		Matrix spectral decomposition.
		'''
		diag = self.diagonalize()
		matdim = self.dim()
		return [diag[(i,i)] for i in range(matdim[0])]
		
	def trace(self):
		'''
		Trace of matrix.
		'''
		egvecs = self.eigen()
		return sum([egvalue for egvalue in egvecs])		
		
def einheit(dim):
	'''make identity matrix'''
	rows = ut.makeformatlist(dim, None)
	for i in range(dim):
		row = ut.makeformatlist(dim, 0)
		row[i] = 1
		rows[i] = Vector(row)
	return Matrix(rows)
	
def det(mat):
	'''
	Matrix determinent.
	todo: more than 3 dimention matrix
	'''
	return mat.det()

def lu_decompose(mat):
	'''
	LU-decomposition of matrix.
	'''
	return mat.lu_decompose()
	
def base_exchange(matSrc, matDist):
	'''
	Matrix base exchange.
	'''
	return matSrc.base_exchange(matDist)
	
def base_exchanged_express(express_mat, exchange_mat):
	'''
	Matrix expression after base exchange.
	From standard base to any base.
	'''
	return express_mat.base_exchanged_express(exchange_mat)

def eigen(mat):
	'''
	Calculate eigen value.
	'''
	return mat.eigen()
		
def diagonalize(mat):
	'''
	Matrix diagonalization.
	Complex implement for check calculation.
	'''
	return mat.diagonalize()
	
def trace(mat):
	'''
	Trace of matrix.
	'''
	return mat.trace()
	
def spectral_decompose(mat):
	'''
	Matrix spectral decomposition.
	'''
	return mat.spectral_decompose()
	
def transpose(mat):
	'''
	Matrix transpose.
	'''
	return mat.transpose()

def sweep_out(leftm, rightv):
	'''
	Solution of simultanious linear equations 
	by sweep out method.
	Take account of pivot.
	'''
	#TODO: implement on the way.
	eps = 1E-8
	msize = len(leftm)
	newvs = leftm.rows + [rightv]
	
	mat = Matrix(newvs)
	print(mat)
	
	i = 1
	while i < msize:
		pivot = i
		j = i
		while j < msize:
			if abs(mat[(j,i)]) > abs(mat[(pivot,i)]):
				pivot = j
			j += 1
	
		if abs(mat[(i,i)]) < eps:
			return Vector([]) #singular

		mat.swap(i, pivot)
	
		k = i+1
		while k < msize:
			mat[(i,k)] /= mat[(i,i)] #TODO:ERROR
			k += 1
			
		for idx in range(msize):
			if i != idx:
				l = i+1
				while l <= msize:
					mat[(idx,l)] -= 	mat[(idx,i)]*mat[(i,l)]
					
		i += 1
		
	return mat[msize-1]
	
#Entry point
if __name__ == '__main__':
	print("linear module load")
		
