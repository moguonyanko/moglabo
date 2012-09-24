#!/usr/bin/ruby1.9.1
# -*- encoding: utf-8 -*-

#
# = moguonyanko's math library
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
		# Initialize element.
		#
		# [val] 
		#		Be restrainted by self element.
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
	
	def row_swap;end
		
	#
	# Gauss-Jordan sweep out method.
	#	
	def self.sweep_out(left, right)
		size = left.column_size
		
		left = Matrix.columns(left.to_a+[right.to_a])
		
		(0..size-1).each do |i|
			pivot = i
			
			(i..size-1).each do |j|
				pivot = j if left[j,i].abs > left[pivot,i].abs
			end
			
			#TODO: row swap
=begin			
			tmp = 	left.row(i)
			left.row(i) = 	left.row(pivot)
			left.row(pivot) = tmp
=end			
			tmp =	left.to_a
			print tmp
			tmp[i] = left.row(pivot).to_a
			tmp[pivot] = left.row(i).to_a
			left = Matrix.columns(tmp)
			
			return Matrix.columns([]) if left[i,i].abs < 1e-8
			
			(i+1..size).each do |j|
				left[i,j] /= left[i,i]
			end
			
			(0..size-1).each do |j|
					(i+1..size).each {|k| left[j,k] -= left[j,i]*left[i,k] } if i != j
			end
			
		end
		
		x = Array.new(size)
		(0..size-1).each {|i| x[i] = left[i,n] }
		
		return x #Need?
		
	end
	
end



