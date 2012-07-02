#!/usr/bin/python3
# -*- coding: utf-8 -*-

import numbers
import math

import moglabo.pychalle.util as ut
import moglabo.pychalle.algorithm as al

class Vector():
	'''
	Vector class 
	This class will be used Matrix.
	'''
	
	'''
	a significant figure 
	suitably value set
	'''
	SIGNIFICANT_FIGURE = 4
	
	def __init__(self, cols):
		'''
		initialize vector
		recieve column value
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
		common multiplication operation 
		if argument is numbers.Real, scalar multiplication.
		elif Vector, dot multiplication.
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
		addition vector
		'''
		cmps = zip(self.cols, target.cols)
		ps = [a+b for a,b in cmps]
		return Vector(ps)
		
	def __sub__(self, target):
		'''
		subtract vector
		'''
		cmps = zip(self.cols, target.cols)
		ps = [a-b for a,b in cmps]
		return Vector(ps)
		
	def __mul__(self, target):
		'''
		multiplication vector for left side vector
		'''
		return self.__common_mul_operate(target, self)

	def __rmul__(self, target):
		'''
		multiplication vector for right side vector
		'''
		return self.__common_mul_operate(target, self)
		
	def __eq__(self, target):
		'''
		if point value equal, vectors are equal
		'''
		cmps = zip(self.cols, target.cols)
		sg = self.SIGNIFICANT_FIGURE
		for a,b in cmps:
			if round(a, sg) != round(b, sg):
				return False
		return True
		
	def __str__(self):
		'''
		point value return
		'''
		return str(self.cols)

	def __sizecheck(self):
		'''
		dimention size check
		'''
		if len(self.cols) != 2:
			raise ValueError("Sorry, now required 2 dimention vector.")

	def rotate(self, degree):
		'''
		calculate rotate matorix or vector expression
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
		turn vector
		note:This function is adapt only 2 dimention vector.
		'''
		self.__sizecheck()
			
		rad = math.radians(2*degree)
		v1 = Vector([math.cos(rad), math.sin(rad)])
		v2 = Vector([math.sin(rad), -math.cos(rad)])
		rotatem = Matrix([v1, v2])
		return rotatem*self
		
def normalize(vec):
	'''normalize vector'''
	orgcols = vec.cols
	tmp = [a**2 for a in orgcols]
	distance = math.sqrt(sum(tmp))
	newcols = list(map(lambda x: x*1/distance, orgcols))
	return Vector(newcols)

def orthproj(scalev, targetv):
	'''orthographic projection'''
	normv = normalize(scalev)
	return targetv*normv*normv

def rmcols(targetv, vecs):
	'''remove vectors columns'''
	orgv = Vector(targetv.cols)
	for v in vecs:
		orgv = orgv-v
	return orgv

def orthogonalize(vecs):
	'''Gram-Schmidt orthogonalization'''
	normvs = [normalize(vecs[0])]
	tmp = vecs[1:len(vecs)]
	for v in tmp:
		orthvs = []
		for normv in normvs:
			otv = v*normv*normv #orthographic projection
			orthvs.append(otv)
		rmdv = rmcols(v, orthvs)
		nmv = normalize(rmdv)
		normvs.append(nmv)
	return normvs

class Matrix():
	'''
	Matrix class \
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
		'''matrix addition'''
		newrows = []
		rows = self.rows
		trows = target.rows
		rowlen = len(rows)
		
		for i in range(rowlen):
			newrow = rows[i]+trows[i]
			newrows.append(newrow)
			
		return Matrix(newrows)
		
	def __sub__(self, target):
		'''matrix subsctiption'''
		newrows = []
		rows = self.rows
		trows = target.rows
		rowlen = len(rows)
		
		for i in range(rowlen):
			newrow = rows[i]-trows[i]
			newrows.append(newrow)
			
		return Matrix(newrows)

	def __innermul(self, col, nums):
		'''matrix column multipulate to numbers'''
		res = []
		for i in range(len(nums)):
			res.append(col[i]*nums[i])
		return sum(res)
	
	def __mulvector(self, target):
		'''matrix multipulate vector'''
		orgcols = [v.cols for v in self.rows]
		cols = list(zip(*orgcols))
		newcols = list(map(lambda col: self.__innermul(col, target.cols), cols))
		return Vector(newcols)

	def __common_mulmatscala(self, target):
		'''matrix multipulate scala common routine'''
		vecs = []
		for v in self.rows:
			vecs.append(Vector([x*target for x in v.cols]))
		return Matrix(vecs)

	def __mul__(self, target):
		'''composite linear mapping'''
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
		'''composite linear mapping by right multipulate'''
		if isinstance(target, numbers.Real):
			return self.__common_mulmatscala(target)
		else:
			pass
		
	def __pow__(self, target):
		'''
		matrix inverse 
		dimention 2 or more than 3,
		method change.
		'''
		if target != -1:
				raise ValueError("only accept -1 for exponent value.")
			
		cols = self.rows[0].cols
		if len(self.rows) == 2 and len(cols) == 2:
			detval = det(self)
			if detval == 0:
				raise ValueError("no matrix determinent.")
				
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
		'''if rows equal, return true.'''
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
		'''rows string expression'''
		rows = self.rows
		strs = ""
		for row in rows:
			strs += str(row)
		return strs
		
	def rotate(self, degree):
		'''expression matrix of rotated degree this matrix'''
		pass
		
	def turn(self, degree):
		'''turn expression matrix'''
		pass
		
	def squarep(self):
		'''is this matrix square matrix?'''
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
		Is matrix symmetry?
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
	matrix determinent
	todo: more than 3 dimention matrix
	'''
	dimension = mat.dim()
	if dimension == [2,2]:
		v1 = mat.rows[0]
		v2 = mat.rows[1]
		a = v1.cols[0]
		b = v1.cols[1]
		c = v2.cols[0]
		d = v2.cols[1]
		
		return a*d-b*c
		
	elif dimension == [3,3]:
		row1 = mat.rows[0]
		row2 = mat.rows[1]
		row3 = mat.rows[2]
		
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

def lu_decompose(mat):
	'''
	LU-decomposition
	'''
	#TODO:implement on the way
	cols = mat.getcolumns()
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
	
def base_exchange(matSrc, matDist):
	'''
	matrix base exchange
	'''
	return matSrc**-1*matDist
	
def base_exchanged_express(express_mat, exchange_mat):
	'''
	expression matrix after base exchange 
	from standard base to any base
	'''
	return exchange_mat**-1*express_mat*exchange_mat

def gcdreduct(a, b):
	'''
	coefficient reduction
	'''
	#TODO: gcd function number mark destroy.
	gcdval = abs(al.gcd(a, b))
	if gcdval != 1:
		a /= gcdval
		b /= gcdval
	
	return (a, b)	
	
def __eigen_2dim(mat):
	'''
	Calculate eigen value for 2 dimension matrix.
	'''
	formula = [0]*3
	formula[0] = 1 #x^2 coef

	rows = mat.rows
	cols1 = rows[0].cols
	cols2 = rows[1].cols
	a = cols1[0]
	d = cols2[1]
	formula[1] = a*-1+(-1)*d

	formula[2] = det(mat)
	
	egs = ut.quadeq(formula)
	
	res = {}
	for eg in egs:
		resA = a-eg
		resC = cols2[0]
#TODO: gcd function is fault.
#		if resA != 1 and resC != 1:
#			if resA>resC:
#				resA,resC = gcdreduct(resA, resC)
#			elif resC<resA:	
#				resC,resA = gcdreduct(resC, resA)
#			else:
#				resA = resC = 1
				
		res[eg] = Vector([-resC,resA])
	
	return res
	
def __eigen_3dim(mat):
	'''
	Calculate eigen value for 3 dimension matrix.
	'''
	#TODO:More than 3 dimention case.
	pass	

def eigen(mat):
	'''
	Calculate eigen value.
	'''
	dimension = mat.dim()
	if dimension == [2,2]:
		return __eigen_2dim(mat)
	elif dimension == [3,3]:
		return __eigen_3dim(mat)
	else:
		pass
		
def diagonalize(mat):
	'''
	Matrix diagonalization.
	Complex implement for check calculation.
	'''
	eg = eigen(mat)
	vecs = [eg[egv] for egv in sorted(eg)]
	if mat.symmetryp():
		normvecs = [normalize(vec) for vec in vecs]
		normmat = Matrix(normvecs)
		transnormmat = transpose(normmat)
		return transnormmat*mat*normmat
	else:
		egmat = Matrix(vecs)
		return egmat**-1*mat*egmat	
	
def spectral_decompose(mat):
	'''
	Matrix spectral decomposition.
	'''
	diag = diagonalize(mat)
	matdim = mat.dim()
	return [diag[(i,i)] for i in range(matdim[0])]
	
def transpose(mat):
	'''
	Matrix transpose.
	'''
	cols = [row.cols for row in mat.rows]
	tmp = list(zip(*cols))
	newrows = [Vector(newcols) for newcols in tmp]
		
	return Matrix(newrows)

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
	print("traingeom module load")
		
