!----------------------------------------------------------------------------------------------
!20120622 MoguoNyanko fortran studying
!Reference:
!	Introduction to FORTRAN 90, Second Edition:Larry Nyhoff, Sanford Leestma
!----------------------------------------------------------------------------------------------

PROGRAM Temparature_Conversion
!--------------------
!Celsius to Fahrenheit
!
!Arguments:
!Celsius -> Celsius Temparatur
!Fahrenheit -> Fahrenheit Temparatur
!
!Input:Celsius
!Output:Fahrenheit
!----------------------

	IMPLICIT NONE
	REAL :: Celsius, Fahrenheit 
	
	PRINT *, "Enter temparetur in degrees Celsius:"
	READ *, Celsius
	
	Fahrenheit = 1.8 * Celsius + 32.0
	
	PRINT *, Celsius, "degree Celsius = ", Fahrenheit, "degree Fahrenheit."

END PROGRAM Temparature_Conversion

