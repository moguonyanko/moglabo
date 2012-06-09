#!/usr/bin/ruby1.9.1
# -*- encoding: utf-8 -*-

require 'test/unit'
require './math'

class TestElementMul < Test::Unit::TestCase
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

