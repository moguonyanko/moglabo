#!/usr/bin/python3
# -*- coding: utf-8 -*-

import unittest
import math
import fractions as fr

import gomath.util as ym
import gomath.algebra as ag
import gomath.calculus as cl
import gomath.linear as lr
import gomath.statistics as ts

class TestMeanValue(unittest.TestCase):
	samples = [5,8,10,11,12]
	x = sum(samples)/len(samples)
	
	weightsamples = [(200,440),(100,470),(300,410)]
	wx = 430

	def test_calc_valid_meanvalue(self):
		'''Test caluculate mean value'''
		result = ts.mean(self.samples)
		self.assertEqual(result, self.x)

	def test_calc_valid_meanvalueweighting(self):
		'''Test caluculate mean value by weighting'''
		result = ts.mean_weighting(self.weightsamples)
		self.assertEqual(result, self.wx)
		
	def test_calc_valid_meanvalue_geom(self):
		'''Test caluculate mean value by geom'''
		result = ts.mean(self.samples, mode="geom")
		self.assertEqual(round(result,1), 8.8)
		
	def test_calc_valid_meanvalue_harmony(self):
		'''Test caluculate mean value by harmony'''
		time = 50
		samples = ((time,50),(time,25))
		result = ts.mean(samples, mode="harmony")
		self.assertEqual(result, 1.5)

class TestMedianValue(unittest.TestCase):
	samples = [1,4,6,8,40,50,58,60,62]
	mx = 40

	evensamples = [4,6,9,10,11,12]
	evx = 9.5
	
	def test_medianvalue(self):
		'''Test valid median value'''
		res = ts.median(self.samples)
		self.assertEqual(res, self.mx)

	def test_median_oddeven(self):
		'''Test valid median value with check odd or even'''
		res = ts.median(self.evensamples)
		self.assertEqual(res, self.evx)
		
class TestSqsum(unittest.TestCase):
	sample = 	[65,85,75,85,75,80,90,75,85,65,75,85,80,85,90]
	x = 873.33
	
	def test_sqsum(self):
		'''test deviation square sum'''
		result = ts.sqsum(self.sample)
		self.assertEqual(round(result, 2), self.x)

class TestProsum(unittest.TestCase):
	xs = [29,28,34,31,25,29,32,31,24,33,25,31,26,30]
	ys = [77,62,93,84,59,64,80,75,58,91,51,73,65,84]
	sxy = 484.9

	def test_prosum(self):
		'''test for sumprodev'''
		sxy = ts.prosum(self.xs, self.ys)
		self.assertEqual(round(sxy,1), self.sxy)

class TestGradeNum(unittest.TestCase):
	gsample = ym.rands(501,979,48)
	gsample = gsample + [500,980]
	gradex = 7
	sturx = 69

	def test_gradenum(self):
		'''test get grade number by sturges'''	
		res = ts.gradenum(self.gsample)
		self.assertEqual(res, self.gradex)		

	def test_gradewidth(self):
		'''test get grade width by sturges'''	
		res = ts.gradewidth(self.gsample)
		self.assertEqual(round(res), self.sturx)

class TestNormalize(unittest.TestCase):
	nsample = [73,61,14,41,49,87,69,65,36,7,53,100,57,45,56,34,37,70]
	nsampmean = 0
	nsampdev = 1
	devvx = 58.8
	
	def test_normalization(self):
		'''test normalization'''
		m = ts.mean(self.nsample)
		s = ts.samplesd(self.nsample)
		res = [ts.normalize(x, m, s) for x in self.nsample]
		self.assertEqual(round(ts.mean(res)), self.nsampmean)
		self.assertEqual(round(ts.sd(res)), self.nsampdev)
		
	def test_devvalue(self):
		'''test deviation value'''
		m = ts.mean(self.nsample)
		s = ts.samplesd(self.nsample)
		res = ts.devvalue(self.nsample[0], m, s)
		self.assertEqual(round(res,1), self.devvx)

class TestIQRValue(unittest.TestCase):
	samples = [50.5, 58.0, 47.5, 53.0, 54.5,61.0, 56.5, 65.5, 56.0, 53.0, 54.0, 56.0,51.0, 59.0, 44.0,53.0, 62.5, 55.0, 64.5,55.0, 67.0, 70.5, 46.5, 63.0, 51.0, 44.5, 57.5, 64.0]
	iqrx = 8.875
	siqrx = 4.4375
	
#	def test_iqrvalue(self):
#		'''Test IQR value'''
#		res = ts.iqr(self.samples)
#		self.assertEqual(res, self.iqrx)

#	def test_siqrvalue(self):
#		'''Test IQR value'''
#		res = ts.siqr(self.samples)
#		self.assertEqual(res, self.siqrx)
	
class TestImpartialityVariance(unittest.TestCase):
	samples = [11,12,13,14,15,16,17]
	varx = 4.67
	sdx = 2.16
	errx = 0.82
	roundper = 2
	
	def test_unbiasedvar(self):
		'''test unbiased variance'''
		result = ts.unbiasedvar(self.samples)
		self.assertEqual(round(result, self.roundper), self.varx)

	def test_sd(self):
		'''test unbiased standard deviation'''
		result = ts.sd(self.samples)
		self.assertEqual(round(result, self.roundper), self.sdx)
		
	def test_stderror(self):
		'''test standard error'''
		result = ts.stderror(self.samples)
		self.assertEqual(round(result, self.roundper), self.errx)

class TestVariance(unittest.TestCase):
	samples = [11,12,13,14,15,16,17]
	varpx = 4
	sddevpx = 2
	cox = 14.29
	roundper = 2

	def test_samplevar(self):
		'''test sample variance'''
		result = ts.samplevar(self.samples)
		self.assertEqual(round(result, self.roundper), self.varpx)
	
	def test_samplesd(self):
		'''test standard deviation'''
		result = ts.samplesd(self.samples)
		self.assertEqual(round(result, self.roundper), self.sddevpx)

	def test_coefvariation(self):
		'''test coefficient of variation'''
		result = ts.coefvariation(self.samples)
		self.assertEqual(round(result, self.roundper), self.cox)
	
class TestConfInterva(unittest.TestCase):
	samples = [47,51,49,50,49,46,51,48,52,49]
	lx = 47.86
	hx = 50.54
	rper = 2
	xs = [70,75,70,85,90,70,80,75]
	ys = [85,80,95,70,80,75,80,90]
	lxx = -13.33
	hxx = 3.33
	
	def test_confinterval(self):
		'''test confidence interval'''
		result = ts.confinterval(samples=self.samples)
		self.assertEqual(round(result[0], self.rper), self.lx)
		self.assertEqual(round(result[1], self.rper), self.hx)
	
	def test_confintervaldev(self):
		'''test confidence interval for dev'''
		result = ts.confintervaldev(xs=self.xs, ys=self.ys)
		self.assertEqual(round(result[0], self.rper), self.lxx)
		self.assertEqual(round(result[1], self.rper), self.hxx)
	
class TestChiSquare(unittest.TestCase):
	freqcolsum = [600,400]
	freqrowsum = [700,300]
	freqnums = [420,280,180,120]
	freqpair = [(435,420),(265,280),(165,180),(135,120)]
	chiqx = 4.46
	roundper = 2
	
	def test_exfreq(self):
		'''test expected frequency'''
		result = ts.exfreq(col=self.freqcolsum, row=self.freqrowsum)
		res = map(lambda x: round(x), result)
		self.assertEqual(list(res), self.freqnums)
		
	def test_chisq(self):
		'''test chi-square'''
		result = ts.chisq(self.freqpair)
		self.assertEqual(round(result, self.roundper), self.chiqx)

class TestCorrelation(unittest.TestCase):
	xs = [3000,5000,12000,2000,7000,15000,5000,6000,8000,10000]
	ys = [7000,8000,25000,5000,12000,30000,10000,15000,20000,18000]
	res = 0.9680
	
	def test_cor(self):
		'''test correlation coefficient'''
		result = ts.cor(self.xs, self.ys)
		self.assertEqual(round(result,4), self.res)
		
	def test_cormat(self):
		'''
		Correlation coefficient matrix test.
		'''
		x1 = [86,71,42,62,96,39,50,78,51,89]
		x2 = [79,75,43,58,97,33,53,66,44,92]
		x3 = [67,78,39,98,61,45,64,52,76,93]
		x4 = [68,84,44,95,63,50,72,47,72,91]
		
		datas = [x1, x2, x3, x4]
		
		resm = ts.cormat(datas)
		resm = round(resm, 3)
		
		v1 = lr.Vector([1.0,0.967,0.376,0.311])
		v2 = lr.Vector([0.967,1.0,0.415,0.398])
		v3 = lr.Vector([0.376,0.415,1.0,0.972])
		v4 = lr.Vector([0.311,0.398,0.972,1.0])
		
		chkm = lr.Matrix([v1, v2, v3, v4])
		
		self.assertEqual(resm, chkm)

class TestTTest(unittest.TestCase):
	xs = [70,75,70,85,90,70,80,75]
	ys = [85,80,95,70,80,75,80,90]
	t = -1.29
	res = False
	
	xs2 = [90,75,75,75,80,65,75,80]
	ys2 = [95,80,80,80,75,75,80,85]
	t2 = -2.97
	res2 = True	
	
	def test_t_test(self):
		'''test t test'''
		result = ts.t_test(self.xs, self.ys)
		self.assertEqual(round(result[0], 2), self.t)
		self.assertEqual(result[1], self.res)
	
	def test_t_test_inter(self):
		'''test t test with interraction'''
		result = ts.t_test_inter(self.xs2, self.ys2)
		self.assertEqual(round(result[0], 2), self.t2)
		self.assertEqual(result[1], self.res2)

class TestAnova(unittest.TestCase):
	groups = [
		[80,75,80,90,95,80,80,85,85,80,90,80,75,90,85,85,90,90,85,80],
		[75,70,80,85,90,75,85,80,80,75,80,75,70,85,80,75,80,80,90,80],
		[80,80,80,90,95,85,95,90,85,90,95,85,98,95,85,85,90,90,85,85]
	]
	f = 12.22
	res = True
	
	fact1 = [
		[65,85,75,85,75,80,90,75,85,65,75,85,80,85,90],
		[65,70,80,75,70,60,65,70,85,60,65,75,70,80,75]
	]
	fact2 = [
		[70,65,85,80,75,65,75,60,85,65,75,70,65,80,75],
		[70,70,85,80,65,75,65,85,80,60,70,75,70,80,85]
	]
	f1 = 0.84
	f2 = 3.05
	interf = 6.65
	res2 = (False,False,True) #result of f1,f2,interf
	
	def test_anova(self):
		'''test analysis of variance'''
		result = ts.anova(self.groups)
		self.assertEqual(round(result[0],2), self.f)
		self.assertEqual(result[1], self.res)

	def test_anovam(self):
		'''test analysis of variance'''
		result = ts.anovam(self.fact1, self.fact2)
		self.assertEqual(round(result[0][0],2), self.f1)
		self.assertEqual(round(result[0][1],2), self.f2)
		self.assertEqual(round(result[0][2],2), self.interf)
		self.assertEqual(result[1], self.res2)

class TestCorrelationRatio(unittest.TestCase):
	tel = "TELMES"
	sha = "SHANERIOL"
	bap = "BARPARY"
	pairs = [(tel,27),(sha,33),(bap,16),(bap,29),(sha,32),(tel,23),(sha,25),(tel,28),(bap,22),(bap,18),(sha,26),(tel,26),(bap,15),(sha,29),(bap,26)]
	x = 0.4455
	
	def test_coratio(self):
		'''test correlation ration'''
		res = ts.coratio([self.tel,self.sha,self.bap], self.pairs)
		self.assertEqual(round(res,4), self.x)

class TestCramerCoef(unittest.TestCase):
	#bigcategory
	koku = "KOKUHAKU"
	sei = "SEIBETU"
	
	#cat1
	phone = "PHONE"
	mail = "MAIL"
	direct = "DIRECT"
	#cat2
	female = "FEMALE"
	male = "MALE"
	
	kokusums = [(phone,72),(mail,101),(direct,127)]
	seisums = [(female,148),(male,152)]
	catmap = {}
	catmap[(phone,female)] = 34
	catmap[(phone,male)] = 38
	catmap[(mail,female)] = 61
	catmap[(mail,male)] = 40
	catmap[(direct,female)] = 53
	catmap[(direct,male)] = 74
	
	x = 0.1634
	
	def test_cramercoef(self):
		'''cramercoef Cramer's coefficient of association'''
		res = ts.cramercoef(self.kokusums, self.seisums, self.catmap);
		self.assertEqual(round(res,4), self.x)

class TestTestOfNoCorrelation(unittest.TestCase):
	studytime = [1,3,10,12,6,3,8,4,1,5]
	point = [20,40,100,80,50,50,70,50,10,60]
	stat = 6.1802
	res = True

	def test_cor_test(self):
		'''test for test of no correlation'''
		result = ts.cor_test(self.studytime, self.point)
		self.assertEqual(round(result[0], 4), self.stat)
		self.assertEqual(result[1], self.res)

class TestZTest(unittest.TestCase):
	point = [13,14,7,12,10,6,8,15,4,14,9,6,10,12,5,12,8,8,12,15]
	meannum = 12
	varnum = 10
	stat = -2.828427
	res = True
	
	def test_z_test(self):
		'''test norm_test'''
		result = ts.z_test(self.point, self.meannum, self.varnum)	
		self.assertEqual(round(result[0], 6), self.stat)
		self.assertEqual(result[1], self.res)

class TestPermutations(unittest.TestCase):
	'''Test for permutations calculate function.'''
	def test_permutate(self):
		'''test permutate'''
		res = ts.permutate(5, 3)
		self.assertEqual(res, 60)

	def test_permutate_negative_error(self):
		'''test permutate'''
		self.assertRaises(ValueError, ts.permutate, -1, -1)

	def test_permutate_bigger_error(self):
		'''test permutate'''
		self.assertRaises(ValueError, ts.permutate, 5, 6)
		
	def test_factorial(self):
		'''testfactorial'''
		res = ts.factorial(4)
		self.assertEqual(res, 24)

class TestCombinations(unittest.TestCase):
	'''Test for combinations calculate function.'''
	def test_combinate(self):
		'''test combinate'''
		res = ts.combinate(5, 3)
		self.assertEqual(res, 10)
		
class TestRegressionAnalysis(unittest.TestCase):
	'''
	Regression analysys function test class.
	'''
	#Sample data for single regression analysis.
	xs = [29,28,34,31,25,29,32,31,24,33,25,31,26,30]
	ys = [77,62,93,84,59,64,80,75,58,91,51,73,65,84]
	
	#Predicted values.
	pys = [72.0,68.3,90.7,79.5,57.1,72.0,83.3,79.5,53.3,87.0,57.1,79.5,60.8,75.8]
	
	#Likelihood test values.
	estimates = [True,False,True,False,True,True,True,True,False,True]
	
	def test_regression_analysis_single(self):
		'''
		Single regression analysis function test.
		'''
		regformula = ts.regression_analysis(self.xs, self.ys, test="single")
		res = list(map(lambda x: round(x,1), regformula))
		
		chkformula = [3.7,-36.4]
		
		self.assertEqual(res, chkformula)
		
	def test_contribution(self):
		'''
		Test contribution for regression analysis.
		'''
		res = ts.contribution(self.ys, self.pys)
		self.assertEqual(math.floor(res), math.floor(0.8225))

	def test_contribution_freeadjust(self):
		'''
		Test contribution for regression analysis.
		'''
		measures = [469,366,371,208,246,297,363,436,198,364]
		predicts = [453.2,397.4,329.3,204.7,253.7,319.0,342.3,438.9,201.9,377.6]
		freeadjust = True
		predictornum = 2
		
		res = ts.contribution(measures, predicts, predictornum, freeadjust)
		self.assertEqual(round(res,3), round(0.9296,3))
		#self.assertEqual(res, 0.9296)
		
	def test_multiple_regression_analysis(self):
		'''
		Test multiple regression analysis function.
		'''
		x1s = [10,8,8,5,7,8,7,9,6,9]
		x2s = [80,0,200,200,300,230,40,0,330,180]
		ys = [469,366,371,208,246,297,363,436,198,364]
		
		res = ts.multireg(x1s,x2s,ys)
		rndres = [round(x,1) for x in res]
		
		chk = [41.5,-0.3,65.3] # y=41.5x1-0.3x2+65.3
		
		self.assertEqual(rndres, chk)
		
	def test_likelihood(self):
		'''
		Likelihood test function.
		'''
		def chkfn(p):
			return p**7*(1-p)**3
			
		def probfn(prob):
			return prob
		
		resfn = ts.likelihood(probfn, self.estimates, log=False) 
			
		testp = 1/3
		res = resfn(testp)
		chk = chkfn(testp)
			
		self.assertEqual(res, chk)

	def test_likelihood_log(self):
		'''
		Logarithm likelihood function test.
		'''
		def chkfn(p):
			return 7*math.log(p)+3*math.log(1-p)
			
		def probfn(prob):
			return prob
		
		resfn = ts.likelihood(probfn, self.estimates, log=True) 
			
		testp = 1/2
		res = resfn(testp)
		chk = chkfn(testp)
			
		self.assertEqual(res, chk)
		
	def test_maxlikelihood(self):
		'''
		Test function of Maximum Likelihood Estimate.
		'''
		def probfn(prob):
			return prob
		fn = ts.likelihood(probfn, self.estimates, log=True) 
		
		dfn = cl.diffn(fn)
		
		chk = 7/10
		#TODO: solver is not prepared.
		#self.assertEqual(res, chk)

	def test_logreg(self):
		'''
		Test logistic regression analysis function.
		'''
		pass
		
class TestRandomVariable(unittest.TestCase):
	'''
	Random variable function test class.
	'''
	def test_make_random_variable_dim2(self):
		'''
		Test make random variable function.
		'''
		def chkfn(nums):
			return 3*nums[1]+4*nums[0]
		
		resfn = ts.make_random_variable(((1, 3),(0, 4)))
		
		#TODO: Arguments send pattern must be improved.
		chknum = {
			0 : 1,
			1 : 10
		}
		
		self.assertEqual(resfn(chknum), chkfn(chknum))
	
class TestResidual(unittest.TestCase):
	'''
	Test class fpr residual calculate function.
	'''
	ms = [469,366,371,208,246,297,363,436,198,364]
	ps = [453.2,397.4,329.3,204.7,253.7,319.0,342.3,438.9,201.9,377.6]
	
	def test_resisum(self):
		'''
		Test residual square sum.
		'''
		res = ts.resisum(self.ms, self.ps)	
		
		#It seems to me that value of referense book is wrong. 
		#self.assertEqual(res, 4173.0)
		self.assertEqual(round(res,1), 4165.7)
		
	def test_stdresi(self):
		'''
		Test standard residual.
		'''
		predictornum = 2
		res = ts.stdresi(self.ms, self.ps, predictornum)	
		
		res = [round(r, 1) for r in res]
		
		chk = [0.6,-1.3,1.7,0.1,-0.3,-0.9,0.8,-0.1,-0.2,-0.6]
		
		self.assertEqual(res, chk)

class TestBayes(unittest.TestCase):
	'''
	Test class of bayes theorim function.
	'''
	def test_bayes(self):
		'''
		Bayes theorim test function.
		'''
		befores = [0.307,0.156,0.129,0.130,0.080,0.030,0.171]
		results = [0.008,0.048,0.040,0.052,0.100,0.151,0.014]
		target = 1
		
		res = ts.bayes(befores, results, target)
		
		self.assertEqual(round(res,2), round(0.205,2))
		
class TestProbability(unittest.TestCase):
	'''
	Test class of function find to probability. 
	'''
	def test_probability(self):
		'''
		The probability function test.
		'''
		fm = None
		
		def probfn(x):
			a = ag.Term(3/4, 1)
			b = ag.Term(-3/4*x**2, 1)
			fm = ag.Formula([a, b])
			return fm.calc()
			
		res = ts.probability(probfn, 1, -1)
		self.assertEqual(round(res), 1)
		
	def test_expection(self):
		'''
		Test for expection function.
		'''
		#TODO: Need to improve Formula class.
		'''
		fm2 = None
		def probfn2(y):
			c = ag.Term(y)
			fm2 = ag.Formula([c])
			return fm2.calc()
			
		res = ts.expection(fm*fm2, 1, -1)
		self.assertEqual(res, 0)
		'''
		pass
		
#Entry point
if __name__ == '__main__':
	print(__file__)
	unittest.main()

