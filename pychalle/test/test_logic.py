#!/usr/bin/python3
# -*- coding: utf-8 -*-

import unittest

import moglabo.pychalle.logic as lo

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
		
if __name__ == '__main__':
	print(__file__)
	unittest.main()		

