#include <stdio.h>
#include <stdlib.h>

float initTest()
{
	return 50.0;
}

//static float lastTemperature = initTest();
static float lastTemperature = 50.0;

static float fahrenheitFromCelsius(float cel)
{
	lastTemperature = cel;
	float fahr = cel * 1.8 + 32.0;
	printf("%f Celsius is %f Fahrenheit\n", cel, fahr);
	
	return fahr;
}

int main(int argc, const char * argv[])
{
	float freezeInC = 0;
	float freezeInF = fahrenheitFromCelsius(freezeInC);
	printf("Water freezes at %f degrees Fahrrenheit\n", freezeInF);
	printf("The last temparature converted was %f\n", lastTemperature);

	return EXIT_SUCCESS;
}

