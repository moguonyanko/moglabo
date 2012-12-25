#include <stdio.h>

int main(int argc, const char * argv[])
{
	int i = 17;
	int *addressOfI = &i;
	printf("i stores its value at %p\n", addressOfI);
	*addressOfI = 89;
	printf("the int stored at addressOfI is %d\n", *addressOfI);

	return 0;
}

