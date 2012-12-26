#include <stdio.h>

int main(int argc, const char * argv[])
{
	int i = 17;
	int *addressOfI = &i;
	printf("i stores its value at %p\n", addressOfI);
	*addressOfI = 89;
	printf("Now i is %d\n", i);
	printf("An int in %zu bytes\n", sizeof(i));
	printf("An pointer in %zu bytes\n", sizeof(addressOfI));

	return 0;
}

