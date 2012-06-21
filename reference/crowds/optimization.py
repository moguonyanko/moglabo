#!/usr/bin/python3
# -*- coding: utf-8 -*-

#
# Referense:
# 	集合知プログラミング:O'REILLY
#

import math
import time
import random
import os

#Sample data
people = [("Seimour", "BOS"),
						("Franny", "DAL"),
						("Zooey","CAK"),
						("Walt","MIA"),
						("Buddy","ORD"),
						("Les","OMA")]

destination = "LGA"

flights = {}

with open(os.getcwd()+"/schedule.txt", encoding="UTF-8") as a_file:
	for line in a_file:
		origin,dest,depart,arrive,price=line.strip().split(",")
		flights.setdefault((origin,dest),[])
		flights[(origin,dest)].append((depart,arrive,int(price)))

def getminutes(t):
	'''
	Convert time to minutes.
	'''
	x = time.strptime(t, "%H:%M")
	return x[3]*60+x[4]
	
def printschedule(r):
	half = math.floor(len(r)/2)
	for d in range(half):
		name = people[d][0]
		origin = people[d][1]
		out = flights[(origin,destination)][int(r[d*2])]
		ret = flights[(destination,origin)][int(r[d*2+1])]
		
		print("{0:10s}{1:10s} {2:5s}-{3:5s} ${4:3s} {5:5s}-{6:5s} ${7:3s}".
			format(name,origin,str(out[0]),str(out[1]),str(out[2]),
			str(ret[0]),str(ret[1]),str(ret[2])))

def schedulecost(sol):
	'''
	Schedule cost caluclate.
	'''
	totalprice = 0
	latestarrival = 0
	earliestdep = 24*60
	
	half = math.floor(len(sol)/2)
	for d in range(half):
		origin = people[d][1]
		outbound = flights[(origin,destination)][int(sol[d*2])]
		returnf = flights[(destination,origin)][int(sol[d*2+1])]
		
		totalprice += outbound[2]
		totalprice += returnf[2]
	
		outmin = getminutes(outbound[1])
		if latestarrival < outmin:
			latestarrival = outmin
		retmin = getminutes(returnf[0])
		if earliestdep > retmin:
			earliestdep = retmin
	
	totalwait = 0
	for d in range(half):
		origin = people[d][1]
		outbound = flights[(origin,destination)][int(sol[d*2])]
		returnf = flights[(destination,origin)][int(sol[d*2+1])]
		totalwait += latestarrival-getminutes(outbound[1])
		totalwait += getminutes(returnf[0])-earliestdep
		
	#Rental Car
	if latestarrival < earliestdep:
		totalplice += 50
	
	return totalprice+totalwait

def randomoptimize(domain, costf):
	'''
	Random optimization.
	domain: Min and Max element list.
	costf: Cost function.
	''' 
	best = 999999999
	bestr = None
	for i in range(10000):
		r = [random.randint(domain[i][0],domain[i][1]) for i in range(len(domain))]
	
	cost = costf(r)
	
	if cost < best:
		best = cost
		bestr = r
	
	return r

def hillclimb(domain, costf):
	'''
	Hillclimb optimization.
	domain: Min and Max element list.
	costf: Cost function.
	'''
	domlen = len(domain)
	sol = [random.randint(domain[i][0],domain[i][1]) for i in range(domlen)]
	
	while True:
		neighbors = []
		
		for j in range(domlen):
			if sol[j]>domain[j][0]:
				neighbors.append(sol[0:j]+[sol[j]-1]+sol[j+1:])
			if 	sol[j]>domain[j][1]:
				neighbors.append(sol[0:j]+[sol[j]+1]+sol[j+1:])
		
		current = costf(sol)
		best = current
		
		for k in range(len(neighbors)):
			cost = costf(neighbors[k])
			if cost<best:
				best = cost
				sol = neighbors[k]
				
		if best == current:
			break
	
	return sol
	
def annealingoptimize(domain, costf, T=10000.0, cool=0.95, step=1):
	'''
	domain: Min and Max element list.
	costf: Cost function.
	T: Intention of accepting bad solution = Temperature.
	cool: Cooling rate of T.
	step: Hillclimb change degree.
	'''	
	vec = makerandsol(domain)
	
	while T>0.1:
		i = random.randint(0,len(domain)-1)
		direction = random.randint(-step,step)
		
		vecb = vec[:]
		vecb[i] += direction
		
		if vecb[i]<domain[i][0]:
			vecb[i] = domain[i][0]
		elif vecb[i]>domain[i][1]:
			vecb[i]=domain[i][1]
		
		nowsol = costf(vec)
		createsol = costf(vecb)
		p = math.e**(-abs(createsol-nowsol)/T)
		
		if createsol<nowsol or random.randint(0.0,1.0)<p:
			vec = vecb	
		
		T=T*cool
	
	return vec		

def makerandsol(domain):
	'''
	Make random solution.
	domain: Min and Max element list.
	'''
	domlen = math.floor(len(domain))
	return [random.randint(domain[i][0],domain[i][1]) for i in range(domlen)]
		
def geneticoptimize(domain,costf,popsize=50,step=1,
											mutprob=0.2,elite=0.2,maxiter=100):
	'''
	Genetic optimize.
	domain: Min and Max element list.
	costf: Cost function.
	popsize: Population size.
	step: Move left or right step size.
	mutprob: Mutate ratio.
	elite: Elite solution ratio.
	maxiter: Calculation generation number.
	'''
	def mutate(vec):
		i = random.randint(0,len(domain)-1)
		if random.random()<0.5 and vec[i]>domain[i][0]:
			return vec[0:i]+[vec[i]-step]+vec[i+1:]
		elif vec[i]<domain[i][1]:
			return vec[0:i]+[vec[i]+step]+vec[i+1:]
		
	def crossover(r1,r2):
		i = random.randint(1,len(domain)-2)
		return r1[0:i]+r2[i:]
	
	pop=[]
	for i in range(popsize):
		vec = makerandsol(domain)
		pop.append(vec)
	
	topelite = int(elite*popsize)
	
	for i in range(maxiter):
		scores = [(costf(v),v) for v in pop]
		scores.sort()
		ranked = [v for (s,v) in scores]
		
		pop = ranked[0:topelite]
		
		while len(pop)<popsize:
			if random.random()<mutprob:
				c = random.randint(0,topelite)
				pop.append(mutate(ranked[c]))
			else:
				c1 = random.randint(0,topelite)
				c2 = random.randint(0,topelite)
				pop.append(crossover(ranked[c1],ranked[c2]))
				
		print(scores[0][0]) #Debug print
		
	return scores[0][1]	

def makedomain():
	'''
	For test sample make function.
	'''
	return [(0,8)]*(len(people)*2)
	
if __name__ == '__main__':
	print("optimization module load")

