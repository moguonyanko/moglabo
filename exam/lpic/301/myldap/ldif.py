#!/usr/bin/python3
# -*- coding: utf-8 -*-

#
#Referense:
#LPICレベル3(SHOEISHA)
#

class BaseEntry():
	
	def __init__(self, dn, objectClass):
		self.dn = dn
		self.objectClass = objectClass
		
class OrganizationEntry(BaseEntry):
	pass
	
class PeopleEntry(BaseEntry):
	pass

#Entry point
if __name__ == '__main__':
	print("LDIF output start.")	
	print("LDIF output finish.")	




