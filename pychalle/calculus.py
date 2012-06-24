#!/usr/bin/python3
# -*- coding: utf-8 -*-

import math

def simpson(fn, bottom, top, divnum=1000):
	'''
	Definite integral by simpson method.
	'''
	h = top - bottom
	if(divnum>0):
		h /= divnum
	
	x = bottom
	
	res = 0
	for i in range(divnum):
		res += fn(x) + 4.0*fn(x+h/2) + fn(x+h)
		x += h
	
	return res*h/6

def differentiate(fn, x, dx):
	'''
	Differentiate by standard definition.
	But an error to some extent.
	'''
	return (fn(x+dx)-fn(x))/dx
	
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

