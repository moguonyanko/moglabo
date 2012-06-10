#!/usr/bin/ruby1.9.1
# -*- encoding: utf-8 -*-

#
# 20120521 moguonyanko
# Exam training source code
# Reference: 
#		Metaprograming Ruby
#		Ruby公式資格教科書
#

require 'thread'

module MetaPrograming

class Greeting
	def initialize(text)
		@text = text
	end
	
	def welcome
		@text
	end
end

module M
	Y = "CONST"
	
	class C
		module M2
			Y2 = "CONST2"
			Module.nesting
		end
	end
end

class DefineMethods
	attr_accessor :hoge
	
	def initialize(hoge)
		@hoge = hoge
	end	

	def define_methods
		shared = 0
		
		puts "define_methods #{self} #{@hoge}"
		
		Kernel.send :define_method, :counter do
			puts "counter #{self} #{@hoge}"
			shared
		end
	
		Kernel.send :define_method, :inc do
			puts "inc #{self} #{@hoge}"
			shared += 1
		end
	end
end

@@my_var2 = 25 #Overwrited...

class MyClass1
	@my_var = 1
	@@my_var2 = 100
	
	def write; @my_var = 2; end
	def read; @my_var; end
	def self.read; @my_var; end
	def read2; @@my_var2; end
	def self.read2; @@my_var2; end

end

class MyClass2
	def self.inherited(subclass)
		#puts "#{self} is superclass of #{subclass}"
	end		
=begin
	self.class_eval do
		define_method :greet do 
			"Hello,class now!"
		end
	end
=end
end

MyClass2.class_eval do
	define_method :greet do 
		"Hello,class now!"
	end
end

class MySubClass2 < MyClass2
	self.class_eval do
#	self.superclass.class_eval do
		define_method :greet do 
			"GoodMorning, sub class now!"
		end
	end
end

module MyMixin
	def self.included(base)
		base.extend(ClassMethods)
	end
	
	module ClassMethods
		def foo
			"foofoofoo!"
		end
	end
end

class MyClass3
	include MyMixin
end

module M4
	def method1
		"M4 method"
	end
end

class C4
	include M4
	extend M4
end

@@my_class_var = 100

class MyClass5
	@my_var = 1
	@@my_class_var	 = -1

	def self.read; @my_var; end
	def write; @my_var = 2; end
	def read; @my_var; end
end

module ConstTest
	TESTTEST = 1000
	
	def self.const_missing(id)
		-1000
	end
end

end

#
#	Multi thread test
#

module MultiThreadTest
	@counter = 0	
	@mtx = Mutex.new
	
	def self.mtxtest
		local = @counter
		sleep 1
		@counter = local + 1
		print "#{@counter}, "
	end
	
	def main
		t1 = Thread.new do
			5.times do
				@mtx.lock
				begin
					mtxtest
				ensure
					@mtx.unlock
				end
			end
		end
		
		t2 = Thread.new do
			5.times do
				@mtx.lock
				begin
					mtxtest
				ensure
					@mtx.unlock
				end
			end
		end

		t1.join
		t2.join
		
		puts #newline
	end
	
	module_function :main
	
end

MultiThreadTest.main

=begin
puts ConstTest::TESTTEST
puts ConstTest::HOGEHOGE
obj = MyClass5.new
obj.write
puts obj.read
puts MyClass5.read
puts @@my_class_var
puts C4.method1
c4 = C4.new
puts c4.method1
puts C4.class == c4.method1
puts MyClass3.foo
obj = MyClass2.new
puts obj.greet
obj2 = MySubClass2.new
puts obj2.greet

puts my_object = Greeting.new("Hello")
puts my_object.class
puts my_object.class.instance_methods(false)
puts my_object.instance_variables
puts M.constants
puts M::C::M2.constants
puts Module.constants
dm = DefineMethods.new "WATCH!"
puts "#{self} #{dm.hoge}"
dm.define_methods
puts counter
puts inc

obj = MyClass1.new
puts obj.write
puts obj.read
puts MyClass1.read
puts obj.read2
puts MyClass1.read2
puts "my_var2 is #{@@my_var2}"
=end






