#!/usr/bin/ruby1.9.1
# -*- encoding: utf-8 -*-

require 'test/unit'
require './algo'

class TestPrimeNumber < Test::Unit::TestCase
	def setup
		@par = 11
		@sol = 5
=begin
		@par = 1000000
		@sol = 78498
=end
	end
	
	def test_sieve
		res = sieve @par
		assert_equal res, @sol 
	end
end

class TestSearch < Test::Unit::TestCase
	def setup
		@list = [1,3,9,12,20,34,70,75,83]
		@target = 34
		@sol = 5
	end

	def test_bin_search
		res = @list.bin_search @target
		assert_equal res, @sol 
	end
end
