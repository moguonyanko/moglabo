#!/usr/bin/python3
# -*- coding: utf-8 -*-

import math

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
		def form():
			res = 0
			for x in terms:
				res += x.base**x.power
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

#Entry point
if __name__ == '__main__':
	print("formula module load")

