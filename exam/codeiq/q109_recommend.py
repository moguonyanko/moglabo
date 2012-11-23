#!/usr/bin/python3
# -*- coding: utf-8 -*-

class Customer():
	'''
	お客さんのクラスです。
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
	'''
	書籍のクラスです。
	'''
	def __init__(self, name, rank):
		self.name = name
		self.rank = rank
		
	def __lt__(self, other):
		rankdiv = self.rank <= other.rank
		
		if rankdiv != 0: return rankdiv
		else: self.name <= other.name		

	def __gt__(self, other):
		rankdiv = self.rank > other.rank
		
		if rankdiv != 0: return rankdiv
		else: self.name > other.name		

	def __eq__(self, other):
		return self.name == other.name

	def __ne__(self, other):
		return self.name != other.name
	
	def __str__(self):
		return str(rank)+":"+name

class SalesRanking():
	'''
	書籍の売り上げランキングのクラスです。
	'''
	def __init__(self, path):
		ranking = []
		categories = {}
		
		with open(path, encoding='utf-8') as sales:
			for idx, line in enumerate(sales):
				if idx == 0: continue #ヘッダを飛ばす
				
				rank, name, category = line.split("\t")
				book = Book(name, rank)
				ranking.append(book)
				if categories[category] == None:
					categories[category] = []
				categories[category].append(book)
						
		self.ranking = sorted(ranking)
				
class Recommender():
	'''
	*推薦方針* 
	基本的に購入実績が多いジャンルの書籍を推薦する。
	推薦する書籍数はデフォルトで3冊とする。
	購入実績が並ぶ場合は売上ランクの高い書籍を推薦する。
	購入実績の割合から推薦内容を決定する。
	例えば「技術;文学;技術」であれば，技術系の書籍を2冊,
	文学系の書籍を1冊推薦することを試みる。
	3冊未満など購入実績が乏しい場合,推薦内容は
	売上ランクの結果に大きく依存することになる。
	全体で最も多く推薦されているジャンルの書籍を
	別枠で表示できるようにするのもいい。
	'''
	def __init__(self, customerlist, sales):
		self.customerlist = customerlist
		self.salesranking = salesranking 
		
	def recommend(self, target, recommendnum=3):
		'''
		target: Recommend target customer's name.
		'''
		pass			

	def __str__(self):
		pass

if __name__ == '__main__':
	import sys
	
	args = sys.argv
	if len(args) > 1: 
		quit()
		
	customer_list_file = args[0]
	sales_ranking_file = args[1]
	customerlist = CustomerList(customer_list_file)
	salesranking = SalesRanking(sales_ranking_file)
	
	recommender = Recommender(customerlist, salesranking)
	
	recommendnum = 3 #3冊推薦する
	result = recommender.recommend("太郎", recommendnum)
	
	print(result)
	
