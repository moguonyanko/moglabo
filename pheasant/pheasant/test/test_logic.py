#!/usr/bin/python3
# -*- coding: utf-8 -*-

import unittest

import pheasant.logic as lo

class TestPatternMatchingUtillity(unittest.TestCase):
	'''
	Pattern matching utillity test class.
	'''
	def test_symbolsetitem(self):
		'''
		Symbol setitem test.
		Should raise error.
		'''
		sym = lo.Symbol("HOGE")
		
		self.assertRaises(AttributeError, setattr, sym, "value", "FOO")
		self.assertEqual(sym.value, "HOGE")

class TestNatualNumber(unittest.TestCase):
	'''
	Definition of Natural Number test class.
	'''
	def test_natp(self):
		'''
		Natural Number predicate test.
		'''
		pass
		
if __name__ == '__main__':
	print(__file__)
	unittest.main()		

