#!/usr/bin/python3
# -*- coding: utf-8 -*-

import math
import fractions as fr

import gomath.util as ut

class Term():
	'''
	Term is included formula.
	'''
	def __init__(self, base, power):
		'''
		Initializer is recieved base and power number.
		'''
		#TODO: Undefined number cannot deal.
		self.base = base
		self.power = power
		
	def __add__(self, target):
		'''
		Term add.
		'''
		terms = [self, target]
		return Formula(terms)

class Formula():
	'''
	Formula class.
	Have base number and multiplier.
	'''
	def __init__(self, terms):
		'''
		Recieved Term object list.
		'''
		#TODO: Undefined number cannot deal.
		#TODO: Function can not recieve.
		
		self.terms = terms

		def form():
			res = 0
			for x in terms:
				res += x.base**x.power
			return res
			
		self.form = form

	def __mul__(self, target):
		'''
		Multiply out.
		'''
		if isinstance(target, Formula) == False:
			raise ValueError("Require Formula instance!")
			
		def form():
			res = 0
			for t in target.terms:
				for x in self.terms:
					res += t*x.base**x.power
			return res
		
		self.form = form

	def calc(self):
		'''
		Retaining formula caluculate.
		'''
		if self.form != None:
			return self.form()
		else:
			return None

def newton_raphson(root, start, repeat):
	'''
	Iteration method to calculate near solution.
	root: Origin of square root.
	start: Repeat start value.
	repeat: Repeat limit.
	'''
	#TODO:Square root caluculation only.
	def func(x):
		return 1/2*(x+root/x)

	res = None
	testx = start
	for i in range(repeat):
		res = func(testx)
		testx = res
	
	return res

def gcd(a, b):
	'''
	Calculate gcd.
	'''
	#TODO: If a or b is negative, value is undefined.
	if b == 0:
		return a
	else:
		x = abs(a)%abs(b)
		if (not (a<0 and b<0)) and (a<0 or b<0):
			x *= -1
		return gcd(b, x)
		
def exgcd(terms):
	'''
	Calculate gcd by extended Euclid's algorithm.
	terms: Expressed (a,b). This tuple is composed a of ax and b of by.
	'''
	x1 = 1
	y1 = 0
	z1 = terms[0] 
	x2 = 0
	y2 = 1
	z2 = terms[1]
	while z2 > 1:
		r = (z1-(z1%z2))/z2
		x1 = x1-(r*x2)
		y1 = y1-(r*y2)
		z1 = z1-(r*z2)
		
		x1,x2 = ut.swap(x1,x2)
		y1,y2 = ut.swap(y1,y2)
		z1,z2 = ut.swap(z1,z2)
	
	return (x2,y2)

def reduct(deno, nume):
	'''
	Coefficient reduction by gcd.
	'''
	#TODO: gcd function number mark destroy.
	gcdval = abs(gcd(deno, nume))
	if gcdval != 1:
		deno /= gcdval
		nume /= gcdval
	
	return (deno, nume)	
	
def discriminant(formula):
	'''
	discriminant of quadratic equation
	return real root number
	'''
	a = formula[0]
	b = formula[1]
	c = formula[2]

	return b**2-4*a*c

def quadeq(formula):
	'''
	Quadratic equation.
	[x**2-2x-3] has arguments [1, -2, -3]
	Now real root and multiple root only deal.
	'''
	disc = discriminant(formula)
	if disc < 0:
		raise ValueError("Real root is none.")

	b = formula[1]
	discroot = math.sqrt(disc)
	deno = 2*formula[0]
	
	alpha = (-b+discroot)/deno
	beta = (-b-discroot)/deno

	return {alpha, beta}

def normalize_formula(form, target):
	'''make 1 for simultanious linear equations'''
	coef = form[target]
	coeflst = []
	for idx in range(len(form)):
		if idx == target:
			coeflst.append(1)
		else:
			if coef == 0:
				if form[len(form)-1] == 0:
					raise ValueError("indefinite")
				else:
					raise ValueError("impossible")
			else:
				coeflst.append(form[idx]/coef) #TODO:Take acccount of pivot!
			
	return coeflst
		
def subtraction_formulas(formulas, target):
	'''make 0 for simultanious linear equations'''
	orgfm = formulas[target]
	coeflst = []
	for fm in formulas:
		if fm != orgfm:
			f = []
			for idx in range(len(fm)):
				if idx == target:
					f.append(0)
				else:
					f.append(fm[idx]-orgfm[idx]*fm[target])
			coeflst.append(f)
		else:
			coeflst.append(fm)		
					
	return coeflst
	
def sleq(formulas):
	'''
	simultanious linear equations 
	formura length 2 (so 2 dimention), should be inverse matrix use. 
	but if LU resolve masterd, should be attempt to use it.
	'''			
	tmp = list(formulas)
	calccount = len(tmp)
	for i in range(calccount):
		normform = normalize_formula(tmp[i], i)
		tmp[i] = normform
		tmp = subtraction_formulas(tmp, i)
		
	equations = [f.pop() for f in tmp]
	
	return equations
	
def zeta(exp):
	'''
	Riemann's zeta function.
	exp: denominator exponent
	'''
	#TODO: Infinity stream implement?
	pass
	
def prime(n):
	'''
	Caluculate prime number length under "n" by Eratosthenes sieve.
	n: under n prime number detect and return.
	'''
	prime = []
	is_prime = ut.makelist(n+1, initvalue=True)
	is_prime[0] = False
	is_prime[1] = False

	i = 2 #Most minimum prime number.
	while i <= n:
		if is_prime[i] == True:
			prime.append(i)
			j = 2*i
			while j <= n:
				is_prime[j] = False
				j += i
		i += 1
	
	return prime
	
def coprimep(a, b):
	'''
	Check on coprime.
	'''
	return gcd(a, b) == 1
	
def euler_totient(n):
	'''
	Euler's totient function.
	'''
	res = []
	for m in range(n):
		chknum = m+1
		if coprimep(chknum, n):
			res.append(chknum)
	
	return len(res)

def even(n):
	'''
	Is even number?
	'''
	return n % 2 == 0
	
def odd(n):
	'''
	Is odd number?
	'''
	return n % 2 != 0

def collatz(n):
	'''
	Collatz probrem function.
	n: Natural Number (not zero).
	'''
	if n == 0:
		raise ValueError("Given Natural Number but not zero.")
	
	if n == 1:
		return n
	elif even(n):
		return collatz(n/2)
	else: #odd number except 1
		return collatz(n*3+1)
	
def harmony(n=1):
	'''
	Harmonic series generate.
	'''
	def fn(k): return 1/k
	while True:
		yield fn(n)
		n += 1
	
if __name__ == '__main__':
	print("algebra module load")

