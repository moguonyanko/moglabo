#!/usr/bin/python3
# -*- coding: utf-8 -*-

import math

def simpson(fn, upper, lower, divnum=1000):
	'''
	Definite integral by simpson method.
	'''
	h = upper - lower
	if(divnum>0):
		h /= divnum
	
	x = lower
	
	res = 0
	for i in range(divnum):
		res += fn(x) + 4.0*fn(x+h/2) + fn(x+h)
		x += h
	
	return res*h/6

def differentiate(fn, x, dx):
	'''
	Calculate value by differentiate to x power function,
	but an error to some extent.
	fn: Differentiate target function.
	x: Differentiate start point.
	dx: Delta quantity from x.
	'''
	return (fn(x+dx)-fn(x))/dx

def diffn(fn):
	'''
	Make function to differentiate given function.
	fn: Differentiate target function.
	'''
	def nowdiffn(x, dx):
		return differentiate(fn, x, dx)
	
	return nowdiffn
	
def trapezoid(upper, lower, divnum, func):
	'''
	Integral caluclation by trapezoid approximation.
	'''
	deltax = (lower-upper)/divnum
	x = upper
	s = 0.0
	
	for i in range(divnum-1):
		x = x+deltax
		y = func(x)
		s += y
	
	s = deltax * ((func(upper)+func(lower))/2.0+s)
	
	return s

#Entry point
if __name__ == '__main__':
	print("calculus module load")

