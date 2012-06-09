#!/usr/bin/ruby1.9.1
# -*- encoding: utf-8 -*-

#
# = Kouichi's algorithm library
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


