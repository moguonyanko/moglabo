#!/usr/bin/ruby1.9.1
# -*- encoding: utf-8 -*-

#
# = Kouichi's math library
#

#
# Group theory namespace.
#
module GroupTheory

#
# Addtion module.
#
module Add

	#
	# Default addition.
	#
	# [right] 
	#		Right side value add to left side value.
	#	
	def +(right)
		self.val+right.val
	end
end

#
# Subtraction module.
#
module Sub
	
	#
	# Default subtraction.
	#
	# [right] 
	#		Right side value do subtraction left side value.
	#	
	def -(right)
		self.val-right.val
	end
end

#
# Multiplication module.
#
module Mul
	
	#
	# Default multiplication.
	#
	# [right] 
	#		Right side value mulutiplicate to left side value.
	#	
	def *(right)
		self.val*right.val
	end
end

#
# Division module.
#
module Div
	
	#
	# Default division.
	#
	# [right] 
	#		Right side value divide to left side value.
	#	
	def /(right)
		Rational(self.val/right.val)
	end
end

#
# Element is included formula, group...
#
class Element
	include Add
	include Sub
	include Mul
	include Div
	
	attr_reader :val
	
	#
	# Initialize term.
	#
	# [val] 
	#		Be restrainted by self term.
	#	
	def initialize(val)
		@val = val
	end
end

#
# Formula is maked by elements.
#
class Formula;end

end

#
# Linear algebra namespace.
#
module Linear
	require 'matrix'
		
end



