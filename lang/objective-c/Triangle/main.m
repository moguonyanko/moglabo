#include <stdio.h>

static float remainingAngle(float angleA, float angleB)
{
	float angleC = 180.0 - (angleA + angleB);
	return angleC;
}

int main(int argc, const char * argv[])
{
	float angleA = 30.0;
	float angleB = 60.0;
	float angleC = remainingAngle(angleA, angleB);
	printf("The third angle is %.2f\n", angleC);

	return 0;
}

