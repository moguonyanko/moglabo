#!/usr/bin/ruby1.9.1
# -*- encoding: utf-8 -*-

require 'test/unit'
require './math'

class TestElementCalc < Test::Unit::TestCase
	def setup;	end

	def test_defaultmul
		x = GroupTheory::Element.new 100
		y = GroupTheory::Element.new 200
		res = x*y
		assert_equal res, 20000
	end

	def test_defaultadd
		x = GroupTheory::Element.new 100
		y = GroupTheory::Element.new 200
		res = x+y
		assert_equal res, 300
	end

	def test_defaultsub
		x = GroupTheory::Element.new 100
		y = GroupTheory::Element.new 200
		res = x-y
		assert_equal res, -100
	end

	def test_defaultdiv
		x = GroupTheory::Element.new 100
		y = GroupTheory::Element.new 200
		res = x/y
		assert_equal res, Rational(1/2)
	end
end

class TestLinear < Test::Unit::TestCase
	require 'matrix'
	
	def test_sweep_out
		a,b,c = [1,4,7],[-2,-5,-8],[3,6,10]
		left = Matrix.columns([a,b,c])
		d = [6,12,21]
		right = Matrix.columns([d])
		
		result = Linear.sweep_out(left, right)
		x = [1,2,3]
		checker = Matrix.columns([x])
		
		assert_equal checker, result
	end	

end

