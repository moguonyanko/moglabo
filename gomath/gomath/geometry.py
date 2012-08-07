#!/usr/bin/python3
# -*- coding: utf-8 -*-

import math

def heron(a, b, c):
	'''
	Calculate area by heron method.
	'''
	s = (a+b+c)/2
	
	return math.sqrt(s*(s-a)*(s-b)*(s-c))
	
def trianglep(a, b, c):
	'''
	Check triangle formation condition satisfied.
	'''
	return a<b+c and b<a+c and c<a+b

def polar2rectangular(r, rad):
	'''
	Polar to rectangular coordinate transform.
	r: polar coordinates value
	rad: radian value
	'''
	return (r*math.cos(rad), r*math.sin(rad))

if __name__ == '__main__':
	print("geometry module load")

