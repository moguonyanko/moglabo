#include <stdio.h>

int main(int argc, const char * argv[])
{
	float f = 1.1;
	float *fp = &f;
	printf("An float in %zu bytes\n", sizeof(f));
	printf("An float pointer in %zu bytes\n", sizeof(fp));

	printf("An short in %zu bytes\n", sizeof(short));
	short maxShort = 2 << 14;
	printf("Max short number is %d\n", maxShort);
	short minShort = 2 << 14;
	printf("Min short number is %d\n", minShort);
	unsigned short maxUnsignedShort = 2 << 14;
	printf("Max unsigned short number is %d\n", maxUnsignedShort);

	return 0;
}

