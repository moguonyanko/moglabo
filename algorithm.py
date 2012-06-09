#!/usr/bin/python3
# -*- coding: utf-8 -*-

import random
import math
import queue as qu

import util as ut

def fib(number):
	'''
	fibonach function
	'''
	memo = ut.makelist(number+1,0)
	
	def rec_fib(n):
		if n <= 1:
			return n
		if memo[n] != 0 :
			return memo[n]
		memo[n] = rec_fib(n-1)+rec_fib(n-2)
		return memo[n]
		
	return rec_fib(number)

def dfs_partial_sum(maxnum, result, nums):
	'''
	Depth First Search for patial sum
	'''
	def rec_dfs_partial_sum(i, sumnum):
		if i == maxnum:
			return sumnum == result
		if rec_dfs_partial_sum(i+1, sumnum):
			return True
		if rec_dfs_partial_sum(i+1, sumnum+nums[i]):
			return True
		return False
	
	return rec_dfs_partial_sum(0, 0)

def greed_min_coin(coins, target):
	'''
	minimum coin use
	'''
	total_coin_sheets = 0
	rev_coin_keys = sorted(coins.keys(), reverse=True)

	for coin in rev_coin_keys:
		coin_sheets = min(math.floor(target/coin), coins[coin])
		target -= coin_sheets*coin
		total_coin_sheets += coin_sheets
	
	return total_coin_sheets

def greed_fence_repair(cutnum, cut_length_values):
	'''
	Fence repair by greed method
	'''
	cost = 0
	
	while cutnum > 1:
		first_cut_idx = 0
		second_cut_idx = 1
		
		if cut_length_values[first_cut_idx] > cut_length_values[second_cut_idx]:
			first_cut_idx, second_cut_idx = ut.swap(first_cut_idx, second_cut_idx)
		
		i = 2
		while True:
			if i < cutnum:
				if cut_length_values[i] < cut_length_values[first_cut_idx]:
					second_cut_idx = first_cut_idx
					first_cut_idx = i
				elif cut_length_values[i] < cut_length_values[second_cut_idx]:
					second_cut_idx = i
				i += 1
			else:
				break
			
		now_cost = cut_length_values[first_cut_idx]+cut_length_values[second_cut_idx]
		cost += now_cost

		if first_cut_idx == cutnum-1:
			first_cut_idx, second_cut_idx = ut.swap(first_cut_idx, second_cut_idx)
			
		cut_length_values[first_cut_idx] = now_cost
		cut_length_values[second_cut_idx] = cut_length_values[cutnum-1]
		cutnum -= 1
	
	return cost

def knapsack(items, lim_weight):
	'''
	knapsack problem by dynamic programming
	'''
	#TODO:Uncorrect value returned.
	item_len = len(items)
	weights = []
	values = []
	for w, v in items:
		weights.append(w)
		values.append(v)
	dp = [[0]*(lim_weight+1)]*(item_len+1)
	
	i = item_len-1
	while i >= 0:
		j = 0
		while j <= lim_weight:
			if j < weights[i]:
				dp[i][j] = dp[i+1][j]
			else:
				dp[i][j] = max(dp[i+1][j], dp[i+1][j-weights[i]]+values[i])
			j += 1
		i -= 1
	
	return dp[0][lim_weight]

class Edge():
	'''
	Edge is parts of graph algorithm.
	'''
	def __init__(self, to, cost=float("inf")):
		'''
		United vertex number and cost initialize.
		to : append united vertex number.
		cost : route length, money...
		'''
		self.to = to
		self.cost = cost

	def __str__(self):
		'''
		All united vertex return.
		'''
		return str(self.to)
		
	def __eq__(self, target):
		'''
		If to and cot equal, return True.
		'''
		return self.to == target.to and self.cost == target.cost
		
class Vertex():
	'''
	Vertex of graph. 
	'''
	def __init__(self, cost=0):
		'''
		Required cost.
		'''
		self.cost = cost
		self.vertexes = []
		
	def __str__(self):
		'''
		All united vertex return.
		'''
		return str(self.vertexes)
	
	def append(self, vtx):
		'''
		Append united vertex.
		'''
		self.vertexes.append(vtx)

class Graph():
	'''
	Graph class
	It is used by route search, geometry etc.
	'''	
	def __init__(self, edges=[], vertexlen=0, direct=True):
		'''
		Vertex length and edge length require.
		Direct false, none direct graph express.
		Default direct is True, assume DAG.
		Edges is tuples list.
		'''
		self.vertexlen = vertexlen
		self.edgelen = len(edges)
		self.direct = direct
		self.edges = {}
		for start, end, cost in edges:
			self.append(start, end, cost)

	def __str__(self):
		'''
		All included vertexes return.
		'''
		return str(self.edges)
		
	def edgelen():
		'''
		Edge length utillity.
		'''		
		return len(self.edges)

	def append(self, start, end, cost=float("inf")):
		'''
		Append vertex.
		'''
		if not start in self.edges:
			self.edges[start] = []
		self.edges[start].append(Edge(end, cost))
		if self.direct == False:
			if not end in self.edges:
				self.edges[end] = []
			self.edges[end].append(self.edges[start]) #If cost not equal, Edge must be initialized.

def dijkstra(route, start, end):
	'''
	Dijkstra route search function with priority queue.
	Return tuple of most smallest route list and cost.
	Argument start is start vertex index.
	Argument end is end vertex index.
	'''
	#TODO:This is not work normality.Must be repaired.
	que = qu.PriorityQueue()
	vtxlen = route.vertexlen
	distance = ut.makelist(length=vtxlen, initvalue=float("inf"))
	distance[start] = 0
	que.put((0, start)) #shorest distance, vertex number
	
	smallroute = [start]
	totalcost = 0
	while que.empty() == False:
		smldist = que.get()
		vertexid = smldist[1]
		if distance[vertexid] < smldist[0]:
			continue
		
		for vtxidx in route.edges:
			edges = route.edges[vtxidx]
			for edgidx in range(len(edges)):
				edge = edges[edgidx]
				cost = distance[vertexid]+edge.cost
				if distance[edge.to] > cost:
					distance[edge.to] = cost
					que.put((distance[edge.to], edge.to))
					smallroute.append(edge.to)
					totalcost += edge.cost
						
	return (smallroute, totalcost)
	
def without_priority_queue_dijkstra(route, start, end):
	'''
	Dijkstra route search function 
	without priority queue.
	'''	
	#TODO:This is not work normality.Must be repaired.
	vtxlen = route.vertexlen
	d = ut.makelist(length=vtxlen, initvalue=float("inf"))
	used = ut.makelist(length=vtxlen, initvalue=False)
	d[start] = 0
	prev = ut.makelist(length=vtxlen, initvalue=-1)

	while True:
		v = -1
		for u in range(vtxlen):
			if (used[u] == False) and (v == -1 or d[u] < d[v]):
				v = u
				
		if v == -1:
			break
		
		used[v] = True
		
		for u in range(vtxlen):
			cost = d[v]+route.edges[v][u].cost
			if d[u] > cost:
				d[u] = cost
				prev[u] = v
				
	path = []
	t = end
	while t != -1:
		t = prev[t]
		path.append(t)
	
	return (path[::-1], d[end])

def sieve(n):
	'''
	Caluculate prime number length under "n" by Eratosthenes sieve.
	n: under n prime number detect and return.
	'''
	prime = []
	is_prime = ut.makelist(n+1, initvalue=True)
	is_prime[0] = False
	is_prime[1] = False

	i = 2 #Most minimum prime number.
	while i <= n:
		if is_prime[i] == True:
			prime.append(i)
			j = 2*i
			while j <= n:
				is_prime[j] = False
				j += i
		i += 1
	
	return len(prime)

#Dining Philosophers Problem	
class Waiter():
	'''
	Dining Philosophers Problem.
	This class express waiter.
	Waiter deal forks	on the table.
	'''
	def __init__(self, forknum=5):	
		self.forks = ut.makelist(length=forknum, initvalue=False)
		
	def __getsuffix(phinum, side):
		suffix = None
		if side == "right":
			suffix = phinum
		else:
			suffix = (phinum+1)%forknum
			
		return suffix
		
	def existfork(self, phinum, side):
		'''
		phinum: Philosopher number.
		side: Fork side.
		'''
		suffix = __getsuffix(phinum, side)
		return self.forks[suffix]
	
	def forkset(self, phinum, side, exist):
		'''
		Fork exist update.
		phinum: Philosopher number.
		side: Fork side.
		exist: Bool of fork exist or not exist.
		'''
		suffix = __getsuffix(phinum, side)
		self.forks[suffix] = exist
		
	def getfork(self):
		'''
		Get fork on the table.
		'''
		#TODO: implement
		pass

	def putfork(self):
		'''
		Put fork on the table.
		'''
		#TODO: implement
		pass

class Philosopher():
	'''
	Dining Philosophers Problem.
	This class express philosopher.
	'''
	def __init__(self, number):
		'''
		Philosopher initialize.
		number: Number of philosopher.
		'''
		self.number = number
		
	def eat(self, table):
		'''
		Philosopher's action of eating.
		'''
		eatlim = 2
		eatnum = 0
		while eatnum <= eatlim:
			if eatnum == eatlim:
				print(self.number + " is sleeping...")
			else:
				print(self.number + "is thinking...")
				table.getfork(number, "right")
				table.getfork(number, "left")
				print(self.number + "is eating...")
				yield number
				table.putfork(number, "right")
				table.putfork(number, "left")
				eatnum += 1

class UnionFindTree():
	'''
	Union find tree
	'''
	def __init__(self, elenum):
		'''
		Initialize by element number.
		'''
		for i in range(elenum):
			self.par[i] = i
			self.rank[i] = 0
	
	def find(self, target):
		'''
		Find target root.
		'''
		if self.par[target] == target:
			return target
		else:
			self.par[target] = self.find(par[target])
			return self.par[target]
			
	def unite(self, a, b):
		'''
		Unite a and b set.
		'''
		a = self.find(a)
		b = self.find(b)
		if a == b:
			return
		
		if self.rank[a] < self.rank[b]:
			self.par[a] = b
		else:
			self.par[b] = a
			if self.rank[a] == self.rank[b]:
				self.rank[a] += 1
		
	def same(self, a, b):
		'''
		Is a and b same set?
		'''
		return self.find(a) == self.find(b)

#Entry point
if __name__ == '__main__':
	print("algorithm module load")

