#!/usr/bin/python3
# -*- coding :  utf-8 -*-

'''
 normal distribution limit value
'''
NORMAL_DIST_LIMIT = 1.96

'''
	t distribution table
	95 percent level
	key : value = degree of freedom : value of distribution
'''
T_TABLE = {
	1 : 12.706,
	2 : 4.303,
	3 : 3.182,
	4 : 2.776,
	5 : 2.571,
	6 : 2.447,
	7 : 2.365,
	8 : 2.306,
	9 : 2.262,
	10 : 2.226,
	11 : 2.201,
	12 : 2.179,
	13 : 2.16,
	14 : 2.145,
	15 : 2.131,
	16 : 2.12,
	17 : 2.11,
	18 : 2.100922,
	19 : 2.093,
	20 : 2.086,
	21 : 2.08,
	22 : 2.074,
	23 : 2.069,
	24 : 2.064,
	25 : 2.06,
	26 : 2.056,
	27 : 2.052,
	28 : 2.048,
	29 : 2.045,
	30 : 2.042,
	40 : 2.021,
	60 : 2,
	120 : 1.98,
	float("inf") : 1.96
}

'''
	chi-square distribution table
	95 percent level
	key : value = degree of freedom : value of distribution
'''
CHI_TABLE = {
	1 : 3.84,
	2 : 5.99,
	3 : 7.81,
	4 : 9.49,
	5 : 11.07
}

'''
	F distribution table
	95 percent level
	key : value = inner group degree of freedom : value of distribution
'''
F_TABLE = {
	10 : [4.96,4.10,3.71,3.48,3.33],
	56 : [4.00,3.15,2.76,2.53,2.37],
	57 : [4.00,3.15,2.76,2.53,2.37]
#	60 : [4.00,3.15,2.76,2.53,2.37]
}

#Entry point
if __name__ == '__main__':
	print("conststat module load")

