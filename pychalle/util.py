#!/usr/bin/python3
# -*- coding: utf-8 -*-

import random
import math

def flatten(ls):
	'''nested list flatten'''
	if isinstance(ls, list):
		if ls == []:
			return [] #the end of the level list. nil
		else:
			return flatten(ls[0])+flatten(ls[1:]) #car+cdr
	else: #atom atom+atom=list
		return [ls]
		
def binary_search(target, samples):
	'''
	binary search by recursive
	'''
	#TODO:Inner value unfound, maximum recursion.
	if target > max(samples) or target < min(samples):
		raise LookupError("Not found target value.")
		
	def rec_search(left, right):
		if left >= right:
			raise LookupError("Not found target value.")
		pivot = math.floor((left+right)/2)
		if target == samples[pivot]:
			return pivot
		elif target > samples[pivot]:
			return rec_search(pivot, right)
		elif target < samples[pivot]:
			return rec_search(left, pivot)
	
	return rec_search(0, len(samples)-1)
	
def normal_binary_search(target, samples):
	'''
	normal binary search
	'''
	if target > max(samples) or target < min(samples):
		raise LookupError("Requested value is out of range.")
		
	left = 0
	right = len(samples)-1
	while left <= right:
		middle = math.floor((left+right)/2)
		if target == samples[middle]:
			return middle
		elif target < samples[middle]: 
			right = middle
		elif samples[middle] < target:
			left = middle
	
	raise LookupError("Not found target value.")
			
def nearchoice(target, sample):
	'''
	choice near value
	key is number type only.
	but should be modified algorithm.
	'''
	devmap = {}
	for orgkey in sample.keys():
		devmap[abs(orgkey-target)] = orgkey
	keys = devmap.keys()
	minkey = min(keys)
	return sample[devmap[minkey]]
	
def readcsv(path, header):
	'''read csv file'''
	pass

def rands(start, end, size):
	'''make random list'''
	if size == None:
		size = end-start
	
	rlst = []
	count = 0
	while count<size:
		rlst.append(random.randint(start, end))
		count += 1		
	
	return rlst

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

def makeformatlist(size, initnum):
	'''make adapt size and filled initnum list'''
	return [initnum for i in range(size)]

def compose(*funcs):
	'''function compose'''
	def compFn(x):
		val = x
		for fn in funcs:
			val = fn(val)
		return val

	return compFn
	
def readcsv(path):
	'''
	read csv file and return list 
	'''
	pass

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
	a quadratic equation
	[x**2-2x-3] has arguments [1, -2, -3]
	now real root and multiple root only deal.
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

def makelist(length, initvalue=None):
	'''
	make standard list requested length
	[object]*length is all value equal object.
	'''
	lst = []
	for i in range(length):
		lst.append(initvalue)
	
	return lst
	
def swap(a, b):
	'''
	value swap function
	'''
	tmp = a
	a = b
	b = tmp
	
	return (a, b)

def gcd(a, b):
	'''
	Calculate gcd.
	'''
	#TODO:If a or b is negative, value is undefined.
	if b == 0:
		return a
	else:
		x = abs(a)%abs(b)
		if (not (a<0 and b<0)) and (a<0 or b<0):
			x *= -1
		return gcd(b, x)
		
def tarai(x, y, z):
	'''
	Tarai function.(Takeuchi function)
	Used at benchmark.
	'''
	if x <= y:
		return y
	else:
		return tarai(tarai(x-1,y,z), tarai(y-1,z,x), tarai(z-1,x,y))
	
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

#Entry point
if __name__ == '__main__':
	print("util module load")

