#!/usr/bin/python3
# -*- coding: utf-8 -*-

import unittest
import algorithm as al

class TestSearch(unittest.TestCase):
	'''
	Test for search function.
	'''
	def test_fib(self):
		'''
		test fib function
		'''
		res = al.fib(100)
		self.assertEqual(res, 354224848179261915075)

	def test_dfs_partial_sum(self):
		'''
		test dfs for partial sum
		'''
		x1 = al.dfs_partial_sum(4, 13, [1,2,4,7])
		self.assertEqual(x1, True)
		x2 = al.dfs_partial_sum(4, 15, [1,2,4,7])
		self.assertEqual(x2, False)

class TestGreedMethod(unittest.TestCase):
	'''
	Test for greed method
	'''
	def test_greed_min_coin(self):
		'''
		test greed coin function
		'''
		coins = {
			1 : 3,
			5 : 2,
			10 : 1,
			50 : 3,
			100 : 0,
			500 : 2
		}
		coinnum = 620
		
		res = al.greed_min_coin(coins, coinnum)
		self.assertEqual(res, 6)
		
	def test_greed_fence_repair(self):
		'''
		test fence repair by greed method
		'''
		cutnum = 3
		cutlength = [8,5,8]

		res = al.greed_fence_repair(cutnum, cutlength)
		self.assertEqual(res, 34)
		
class TestDynamicProgramming(unittest.TestCase):
	'''
	Test for dynamic programming
	'''
	def test_knapsack(self):
		'''
		test for knapsack problem
		'''
		items = [(2,3),(1,2),(3,4),(2,2)]
		lim_weight = 5
		
		res = al.knapsack(items, lim_weight)
		#todo: test cannot pass
		#self.assertEqual(res, 7)

class TestGraph(unittest.TestCase):
	'''
	Test for graph class.
	'''
	def test_append(self):
		'''
		test for append edge
		create exist direct graph
		'''
		g = al.Graph(vertexlen=3,direct=True)
		g.append(0,1)
		g.append(0,2)
		g.append(1,2)
		
		res1 = g.edges[0]
		res2 = g.edges[1]
		
		self.assertEqual(res1, [al.Edge(1), al.Edge(2)])		
		self.assertEqual(res2, [al.Edge(2)])		

class TestRouteSearch(unittest.TestCase):
	'''
	Test for route search.
	'''
	def test_dijkstra(self):
		'''
		test dijkstra method function
		'''
		A = 0
		B = 1
		C = 2
		D = 3
		E = 4
		F = 5
		G = 6
		
		routes = [
			(A,B,2),
			(A,C,5),
			(B,C,4),
			(B,D,6),
			(B,E,10),
			(C,D,2),
			(D,F,1),
			(E,F,3),
			(E,G,5),
			(F,G,9)
		]
		routes_graph = al.Graph(edges=routes, vertexlen=7, direct=True)
		
		res = al.dijkstra(routes_graph, A, G)
		
		#TODO:dijkstra function is not work normality.Must be repaired.
		#self.assertEqual(res, ([A,C,D,F,E,G], 16))
		
class TestPrimeNumber(unittest.TestCase):
	'''
	Prime number algorithm test class.
	'''
	def test_sieve(self):
		'''
		Test for prime number check function.
		'''
		res = al.sieve(11)
		self.assertEqual(res, 5)
		#res = al.sieve(1000000)
		#self.assertEqual(res, 78498)

class TestMultiProcess(unittest.TestCase):
	'''
	Test class for multi process.
	'''
	def test_philosophers(self):
		'''
		Test function to Dining Philosophers Problem.
		'''
		phi0 = al.Philosopher(0)
		phi1 = al.Philosopher(1)
		phi2 = al.Philosopher(2)
		phi3 = al.Philosopher(3)
		phi4 = al.Philosopher(4)

		waiter = al.Waiter(forknum=5)	
		pass
		
class UnionFindTreeTest(unittest.TestCase):
	'''
	Test class for union find tree.
	'''
	#TODO: Test data is not prepared.
	def test_find(self):
		pass
		
	def test_unite(self):
		pass
	
	def test_same(self):
		pass
	
if __name__ == '__main__':
	unittest.main()

