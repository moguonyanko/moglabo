#!/usr/bin/python3
# -*- coding: utf-8 -*-

import cgi

import moglabo.pychalle.util as ut
import moglabo.pychalle.geometry as gm

def get_test_points():
	'''
	Return test points.
	This points used geometry calculattion.
	'''	
	testps = '''
	{
		"0" : [120,100],
		"1" : [300, 50],
		"2" : [10, 400],
		"3" : [100, 60],
		"4" : [400, 350],
		"length" : 5
	}
	'''
	
	return testps

def get_test_segments():
	'''
	Return test segments.
	This segments used geometry calculattion.
	'''	
	segments = '''
	{
		"0" : [[25, 25, 0],[10, 450, 1],[550, 300, 1],[400, 100, 1],[400, 350, 4]],
		"1" : [[30, 50, 0],[50, 120, 1],[100, 450, 1],[450, 200, 1],[780, 55, 1],[780, 55, 4]],
		"2" : [[500, 15, 0],[500, 400, 1],[380, 545, 1],[380, 545, 4]],
		"length" : 3
	}
	'''
	
	return segments

def testprint():
	'''
	Test print for checking cgi and loading module.
	'''
	testdata = ut.makelist(10)
	
	return str(testdata)

def get_calc_func(typekey):
	CALC_TYPES = {
		"testpoint" : get_test_points,
		"testpolygon" : get_test_segments
	}
	
	return CALC_TYPES[typekey]

#Get function for calculation.
form = cgi.FieldStorage()
calc_type = form.getvalue("type")
func = get_calc_func(calc_type)

#Response to client.
print("Content-type: application/json; charset=UTF-8\n")
print(func())


