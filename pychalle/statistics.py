#!/usr/bin/python3
# -*- coding: utf-8 -*-

import unittest
import math

import moglabo.pychalle.const_statistics as cs
import moglabo.pychalle.util as ym
import moglabo.pychalle.linear as lr

def mean(samples, mode="arith"):
	'''
	Caluculate mean value
	mode:	Mean mode.
	'''
	size = len(samples)
	
	def arith():
		sumvalue = sum(samples)
		return sumvalue/size
		
	def geom():
		res = 1
		for x in samples:
			res *= x
		return res**(1/size)
		
	def harmony():
		quota = samples[0][0]
		res = quota*sum([1/data for qta, data in samples])/size
		return res
	
	fns = {
		"arith" : arith,
		"geom" : geom,
		"harmony" : harmony
	}
	
	func = fns[mode]
	return func()
	
def mean_weighting(samples):
	'''Caluculate mean value by weighting'''
	sumvalues = 0
	sumweight = 0
	for weight,value in samples:
		sumvalues = sumvalues+weight*value
		sumweight = sumweight+weight
	
	return sumvalues/sumweight

def median(tests):
	'''Caluculate median'''
	samples = list(tests)
	samples.sort()
	size = len(samples) 
	idx = math.floor(size/2)
	if size%2 == 0:
		idx1 = idx-1
		idx2 = math.ceil(size/2)
		return (samples[idx1]+samples[idx2])/2
	else:
		return samples[idx]

def sqsum(sample):
	'''deviation square sum'''
	m = mean(sample)
	devsqs = map(lambda x: (x-m)**2, sample)
	
	return sum(devsqs)

def prosum(xs, ys):
	'''sum of product of deviation'''
	mx = mean(xs)
	my = mean(ys)
	devxs = map(lambda x: x-mx, xs)
	devys = map(lambda y: y-my, ys)
	pairxy = zip(devxs, devys)
	xy = [x*y for x,y in pairxy]
	
	return sum(xy)	

def normalize(x, m, s):
	'''normalization'''
	return (x-m)/s

def devvalue(x, m, s):
	'''deviation value'''
	return normalize(x,m,s)*10+50

def gradenum(sample):
	'''calculate grade number by stuges formula''' 
	size = len(sample)
	return round(1+(math.log(size,10)/math.log(2,10)))
	
def gradewidth(sample):
	'''calculate grade width by stuges formula''' 
	mx = max(sample)
	mn = min(sample)
	return (mx-mn)/round(gradenum(sample))

def iqr(targets):
	'''
	Caluculate IQR
	This function is not correct.
	'''
	samples = list(targets)
	samples.sort()
	size = len(samples)
	
	def inner_iqr(per):
		peridx = (1-per)+(per*(size-1)) #1:size-1=per:1-per
		idx = math.floor(peridx)
		
		if peridx == idx:
			return samples[idx]
		else:
			peridxlow = idx
			peridxhigh = math.ceil(peridx)
			low = samples[peridxlow]
			high = samples[peridxhigh]
			return (1-per)*low+per*high
	
	quantper = 0.25
	q1 = inner_iqr(quantper)
	q3 = inner_iqr(1-quantper)
	
	return q3-q1

def siqr(samples):
	'''Calculate SIQR'''	
	return iqr(samples)/2

def unbiasedvar(samples):
	'''unbiased variance'''
	powall = 0
	m = mean(samples)
	for ele in samples:
		powall = powall+((ele-m)**2)
		
	df = len(samples)-1
	
	return powall/df
	
def sd(samples):
	'''unbiased standard deviation'''
	return math.sqrt(unbiasedvar(samples))

def stderror(samples):
	'''standard error'''
	n = math.sqrt(len(samples))
	return sd(samples)/n

def samplevar(samples):
	'''sample variance'''
	powall = 0
	m = mean(samples)
	for ele in samples:
		powall = powall+((ele-m)**2)
		
	return powall/len(samples)

def samplesd(samples):
	'''standard deviation'''
	return math.sqrt(samplevar(samples))

def coefvariation(samples):
	'''coefficient of variation'''
	return samplesd(samples)/mean(samples)*100

def confinterval(samples):
	'''confidential interval'''
	m = mean(samples)
	err = stderror(samples)
	size = len(samples)
	t = cs.T_TABLE[size-1]
	
	l = m-t*err
	h = m+t*err
	
	return (l,h)
	
def stderrdev(xs, ys):
	'''stamdard error for devide'''
	xlen = len(xs)
	xdevsum = samplevar(xs)*xlen
	ylen = len(ys)
	ydevsum = samplevar(ys)*ylen
	estvar = (xdevsum+ydevsum)/((xlen-1)+(ylen-1))
	stderr = math.sqrt(estvar*((1/xlen)+(1/ylen)))
	
	return stderr
	
def confintervaldev(xs, ys):
	'''confidential interval for devide'''
	df = (len(xs)-1)+(len(ys)-1)
	stderr = stderrdev(xs, ys)
	t = cs.T_TABLE[df]
	
	devm = mean(xs)-mean(ys)
	l = devm-t*stderr
	h = devm+t*stderr
	
	return (l,h)
	
def exfreq(col,row):
	'''expected frequency'''
	sumnum = sum(col)
	
	lst = list()
	for r in row:
		for c in col:
			lst.append(c/sumnum*r)
		
	result = tuple(lst)	
	
	return result
	
def chisq(freqpair):
	'''chi-square'''
	x = 0
	for obs, exp in freqpair:
		x = x+((obs-exp)**2)/exp
		
	return x
	
def cor(xs,ys):
	'''correlation coreffcient'''
	mx = mean(xs)
	my = mean(ys)
	sxx = 0
	syy = 0
	sxy = 0
	xys = list(zip(xs,ys))
	for x, y in xys:
		sxx = sxx+(x-mx)**2
		syy = syy+(y-my)**2
		sxy = sxy+(x-mx)*(y-my)
	
	return sxy/math.sqrt(sxx*syy)	
	
def t_test(xs, ys):
	'''t test'''
	devm = mean(xs)-mean(ys)
	deverr = stderrdev(xs, ys)
	t = devm/deverr
	tdist = cs.T_TABLE[(len(xs)-1)+(len(ys)-1)]
	
	return (t, abs(t)>abs(tdist))

def t_test_inter(xs, ys):
	'''t test with interraction'''
	devm = mean(xs)-mean(ys)
	xys = list(zip(xs, ys))
	devs = list(map(lambda pair: pair[0]-pair[1], xys))
	
	mdevs = mean(devs)
	deverr = math.sqrt(unbiasedvar(devs)/len(xs))
	
	t = mdevs/deverr
	tdist = cs.T_TABLE[(len(xs)-1)]
	result = abs(t)>abs(tdist)
	
	return (t, result)

def anova(groups):
	'''analysis of variance'''
	alls = ym.flatten(groups)
	aldsq = sqsum(alls)
	allm = mean(alls)
	
	dsqs = [sqsum(group) for group in groups]
	innerdsq = sum(dsqs)
	interparts = [(mean(group)-allm)**2*len(group) for group in groups]
	interdsq = sum(interparts)
	
	interdf = len(groups)-1
	innerdfls = [len(group)-1 for group in groups]
	innerdf = sum(innerdfls)
	aldf = len(alls)-1
	
	intermsq = interdsq/interdf
	innermsq = innerdsq/innerdf
	
	f = intermsq/innermsq
	fdist = cs.F_TABLE[innerdf][interdf]
	
	return (f, f>fdist)

def anovam(g1, g2):
	'''analysis of variance for multi group'''
	g1a = g1[0]
	g1b = g1[1]
	g2a = g2[0]
	g2b = g2[1]
	
	g1data = ym.flatten(g1)
	g2data = ym.flatten(g2)
	alldata = g1data+g2data
	allmean = mean(alldata)
	g1mean = mean(g1data)
	g2mean = mean(g2data)
	f1dev = ((g1mean-allmean)**2*len(g1data))+((g2mean-allmean)**2*len(g2data))
	
	f2data1 = g1a+g2a
	f2data2 = g1b+g2b
	f2mean1 = mean(f2data1)
	f2mean2 = mean(f2data2)
	f2dev = ((f2mean1-allmean)**2*len(f2data1))+((f2mean2-allmean)**2*len(f2data2))

	groupdev = (mean(g1a)-allmean)**2*len(g1a) + (mean(g1b)-allmean)**2*len(g1b) + (mean(g2a)-allmean)**2*len(g2a) + (mean(g2b)-allmean)**2*len(g2b)
	interdev = groupdev-f1dev-f2dev
	
	residev = sum(map(sqsum, [g1a,g1b,g2a,g2b]))
	
	f1df = len(g1)-1
	f2df = len(g2)-1
	interdf = f1df*f2df
	alldf = len(alldata)-1
	residf = alldf-f1df-f2df-interdf
	f1msq = f1dev/f1df
	f2msq = f2dev/f2df
	intermsq = interdev/interdf
	resimsq = residev/residf
	
	fvalues = tuple([x/resimsq for x in [f1msq,f2msq,intermsq]])
	fdist = cs.F_TABLE[residf][interdf]
	fresults = tuple([x>fdist for x in fvalues])

	return (fvalues,fresults)

class DataFrame():
	'''
	Data object for statistics
	'''
	def __init__(self, data, colNames, rowNames):
		'''
		data:data by matrix expression
		colNames:column names
		rowNames:row names
		'''
		pass
	
	def __add__(self, target):
		'''
		addition set
		'''
		pass
		
	def __sub__(self, target):
		'''
		substruction set
		'''
		pass
		
	def __mul__(self, target):
		'''
		multipulation set
		'''
		pass
	
	def __str__(self):
		'''
		data string expression
		'''
		pass
		
	def __eq__(self):
		'''
		check to equaldata
		'''
		pass	
		
def coratio(categorynames, pairs):
	'''correlation ratio'''
	#category initialize
	catmap = {catname:[] for catname in categorynames}
	alldata = []
	for catname,num in pairs:
		catmap[catname].append(num)
		alldata.append(num)
	
	prewithin = [sqsum(catmap[catname]) for catname in categorynames]
	withinclassvariation = sum(prewithin)
	
	allmean = mean(alldata)	
	preamong = [len(catmap[catname])*((mean(catmap[catname])-allmean)**2) for catname in catmap]
	amongclassvariation = sum(preamong)
	
	return amongclassvariation/(withinclassvariation+amongclassvariation)

def cramercoef(cat1sums, cat2sums, crosstable):
	'''Cramer's coefficient of association'''
	allsum = sum([crosstable[catpair] for catpair in crosstable])
	
	pairs = []
	for cat1 in cat1sums:
		for cat2 in cat2sums:
			obs = crosstable[(cat1[0],cat2[0])]
			exp = cat1[1]*cat2[1]/allsum
			pairs.append((obs,exp))

	chi = chisq(pairs)
	coef = math.sqrt(chi/(allsum*min(len(cat1sums),len(cat2sums)-1)))
	
	return coef

def cor_test(sample1, sample2):
	'''test of no correlation'''
	samplecornum = cor(sample1, sample2)
	samplesize = len(sample1)
	df = samplesize-2
	a = samplecornum*math.sqrt(df)
	b = math.sqrt(1-samplecornum**2)
	t_statistic = a/b
	
	alpha = 0.05
	criticalregion = cs.T_TABLE[df]
	
	return (t_statistic, abs(t_statistic)>criticalregion)

def z_test(sample, popmean, popvar):
	'''normal distribution test, taht is z test'''
	a = mean(sample)-popmean
	b = math.sqrt(popvar/len(sample))
	statistic = a/b
	
	zlim = cs.NORMAL_DIST_LIMIT
	
	return (statistic, abs(statistic)>zlim)
	
def permutate(left, right):
	'''calculate permutations'''
	if left <= 0 or right <= 0:
		raise ValueError("require positive value")
	elif left < right:
		raise ValueError("extract number is bigger than population size")
		
	acc = 1
	for x in range(right):
		acc *= left-x
	
	return acc
	
def factorial(num):
	'''
	calculate factorial
	not recursive structure
	'''
	return permutate(num, num)
	
def combinate(left, right):
	'''calculate combinations'''
	child = permutate(left, right)
	mother = factorial(right)
	
	return child/mother
	
def regression_analysis(xs, ys, test="single"):
	'''
	Regression analysis function.
	'''
	sxx = sqsum(xs)
	sxy = prosum(xs, ys)
	mx = mean(xs)
	my = mean(ys)
	
	a = sxy/sxx
	b = my-mx*a
	
	return [a,b]
	
def mul_cor(ms, ps):
	'''
	Multiple correlation coefficient.
	ms:Measured values.
	ps:Predicted values.
	'''	
	sm = sqsum(ms)
	sp = sqsum(ps)
	smp = prosum(ms, ps)
	
	return smp/math.sqrt(sm*sp)
	
def contribution(ms, ps, predictornum=1, freeadjust=False):
	'''
	Contribution for regression analysis.
	ms:Measured values.
	ps:Predicted values.
	'''
	if freeadjust == True:
		mslen = len(ms)
		nume = resisum(ms, ps)/(mslen-predictornum-1)
		deno = sqsum(ms)/(mslen-1)
		return 1-nume/deno
	else:
		return mul_cor(ms, ps)**2
	
def make_random_variable(coefs):
	'''
	Make random variable function.
	'''
	#TODO: Must be improved.
	def random_variable(nums):
		res = 0
		for pownum, base in coefs:
			if pownum == 0:
				res += base
			else:
				try:
					num = nums[pownum]
					res += base**pownum*num
				except KeyError as ex:
					continue

		return res
		
	return random_variable
	
class Graph():
	'''
	Graph class.
	'''
	#TODO:Implement now.
	def __init__(self, coefs, scope):
		'''
		coefs: coeffsient list
		scope: graph range object
		'''
		self.coefs = coefs
		self.scope = scope
	
def multiple_regression_analysis(x1s, x2s, ys):
	'''
	Multiple regression analysis.
	'''
	ones = ym.makelist(len(x1s), 1)
	
	vecs1 = [lr.Vector([x1,x2,one]) for x1,x2,one in zip(x1s,x2s,ones)]
	mat1 = lr.Matrix(vecs1)
	
	vx1 = lr.Vector(x1s)
	vx2 = lr.Vector(x2s)
	vone = lr.Vector(ones)
	vecs2 = [vx1,vx2,vone]
	mat2 = lr.Matrix(vecs2)
	
	vy = lr.Vector(ys)
	mat3 = lr.Matrix([vy])
	
	res = (mat1*mat2)**-1*mat1*mat3
	
	return res.rows[0].cols
	
def resisum(ms, ps):
	'''
	Residual square sum number caliculate.
	ms:Measured values.
	ps:Predicted values.
	'''
	pair = zip(ms, ps)
	respow = [(m-p)**2 for m, p in pair]
	
	return sum(respow)
	
def stdresi(ms, ps, predictornum=1):
	'''
	Standard residual.
	ms:Measured values.
	ps:Predicted values.
	predictornum:Predictor number.
	'''
	mlen = len(ms)
	pair = zip(ms, ps)
	
	resi = []
	resipow = []
	for m,p in pair:
		r = m-p
		resi.append(r)
		resipow.append(r**2)
		
	resisumvalue = sum(resipow)
	deno = math.sqrt(resisumvalue/(mlen-predictornum-1))
	
	stdresivalues = [r/deno for r in resi]
	
	return stdresivalues

def bayes(befores, results, target):
	'''
	Bayes' theorem
	befores: Before probability.
	results: Probability of that result reach.
	target: Number of test target.
	'''
	deno = 0
	lim = len(befores)
	for i in range(lim):
		 deno += befores[i]*results[i]
		
	nume = befores[target]*results[target]
	
	return nume/deno
	
#Entry point
if __name__ == '__main__':
	print("statistics module load")

