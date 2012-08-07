#!/usr/bin/python3
# -*- coding: utf-8 -*-

'''
Indicates pattern match failure.
'''
FAIL = None

'''
Indicates pattern match success, with no valiables.
'''
NO_BINDINGS = (True, True)

class Symbol(object):
	'''
	Symbol type class as that in Lisp.
	'''
	def __init__(self, value):
		'''
		value: Include value in Symbol.
		'''
		self.value = value
		
	def __setattr__(self, key, value):
		'''
		Symbol value is constant.
		Syntax error raise.
		'''
		if hasattr(self, key):
			raise AttributeError("Symbol value is constant.")
		else:
			object.__setattr__(self, key, value)			

def variablep(x):
	'''
	Is x a variable (a symbol begining with ?) ?
	'''
	pass
	
def natp(n):
	'''
	Is n Natural Number?.
	'''
	pass

if __name__ == '__main__':
	print("logic module load")


