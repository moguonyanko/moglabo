#include <stdio.h>
#include <stdint.h>

int main(int argc, const char * argv[])
{
	uint64_t a = UINT64_C(0x0101010101010101);
	printf("Decimal: The alternate 0 and 1 bit is %qu\n", a);

	return 0;
}

