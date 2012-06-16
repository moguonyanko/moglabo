#!/usr/bin/python3
# -*- coding: utf-8 -*-

import math
import unittest

import moglabo.pychalle.formula as fm

class TestFormula(unittest.TestCase):
	'''
	Test class for formula class.
	'''
	def test_term_add(self):
		'''
		Term class add test.
		'''
		a = fm.Term(2,2)
		b = fm.Term(3,2)
		
		res = a+b
		
		self.assertEqual(res.calc(), 13)

#Entry point
if __name__ == '__main__':
	print(__file__)
	unittest.main()

