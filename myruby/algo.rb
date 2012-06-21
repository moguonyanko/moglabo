#!/usr/bin/ruby1.9.1
# -*- encoding: utf-8 -*-
# Reference:
#		プログラミングコンテストチャレンジブック:マイコミ
#		アルゴリズムを学ぼう:ASCII		
#		アルゴリズムクイックリファレンス:O'REILY
#
# = moguonyanko's algorithm training
#

#
# Prime number caluculate algorithm by Eratosthenes sieve.
#
# [n] 
#		Under 'n' prime number detect and return.
#
def sieve(n)
	prime = []
	is_prime = Array.new(n+1, true)
	is_prime[0] = false
	is_prime[1] = false
	
	i = 2
	while i <= n
		if is_prime[i]
			prime.push(i)
			j = i+i
			while j <= n
				is_prime[j] = false
				j += i
			end
		end
		i += 1
	end
	
	prime.length
end

#
# Array class(Builtin)
#
class Array

	#
	# Binary search method.
	#
	# [target] 
	#		Search target value.
	#
	def bin_search(target)
		err = -1
		return err if self.length <= 0
	
		left, right = 0, self.length
	
		mid = 0
		while left+1 < right
			mid = left + (right - left) / 2
			
			return mid if target == self[mid]
		
			if target < self[mid]
				right = mid
			else
				left = mid
			end
		end
		
		-err-mid
	end
end

#
#	Heap class
#
class Heap
	@pos
	@values = []
	@errormessage = 'Requested value is out of bounds.'
		
	attr_reader :values
		
	def initialize(size)
		@pos = 0
		@values = Array.new(size, 0)
	end
	
	#
	# Push value to heap.
	#
	# [value] 
	#		Will be pushed value.
	#
	def push(value)
		if values.length <= @pos
			raise RuntimeError.exception @errormessage
		end
		
		i = @pos
		@pos += 1
		
		while i > 0
			idx = (i-1)/2
			break if values[idx] <= value
			
			values[i] = values[idx]
			i = idx
		end
		
		values[i] = value
	end
	
	#
	# Pop value from heap.
	#
	def pop
		if @pos <= 0
			raise RuntimeError.exception @errormessage
		end
		
		ret = values[0]
		
		@pos -= 1
		x = values[@pos]
		
		i = 0
		while i*2+1 < @pos
			l, r = i*2+1, i*2+2
			
			l = r if r < @pos and values[r] < values[l]
			
			break if values[l] >= x
			
			values[i] = values[l]
			i = l
		end
		
		values[i] = x
		ret
	end
	
	#
	# to_s override.
	# Call values to_s.
	#
	def to_s
		@values.to_s
	end
end


