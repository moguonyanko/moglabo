#!/usr/bin/python3
# -*- coding: utf-8 -*-

import unittest
import sys

class Customer():
	'''
	お客さんクラスです。
	'''
	def __init__(self, customerid, name):
		self.id = customerid
		self.name = name
	
	def __eq__(self, customer):
		return self.id == customer.id and self.name === customer.name

class CustomerList():
	'''
	お客さんの名前や購入実績を保持するクラスです。
	'''
	def __init__(self, path):
		
		customers = {}
		
		with open(path, encoding='utf-8') as customerlist:
			for idx, line in enumerate(customerlist):
				if idx == 0: continue #ヘッダを飛ばす
				
				customerid, name, result = line.split("\t")
				customer = Customer(customerid, name)
				customers[customer] = {}
				for category in result.split(";"):
					if not customers[customer][category] in customers[customer]:
						customers[customer][category] = 0
					customers[customer][category] += 1
						
		self.customers = customers

class Book():
	def __init__(self, name, category):
		pass

class SalesRanking():
	'''
	書籍の売り上げランキングクラスです。
	'''
	def __init__(self, path):
		ranking = {}
		
		with open(path, encoding='utf-8') as sales:
			for idx, line in enumerate(sales):
				if idx == 0: continue #ヘッダを飛ばす
				
				rank, name, category = line.split("\t")
				ranking[rank] = Book(name, category)
						
		self.ranking = ranking
				
def recommend(customer, sales):
	pass

class RecommendBooks(unittest.TestCase):
	pass

if __name__ == '__main__':
	args = sys.argv
	if len(args) > 1: 
		quit()
		
	customer_list_file = args[0]
	sales_ranking_file = args[1]
	

