#include <stdio.h>

int main(int argc, const char * argv[])
{
	for(int i = 99; i >= 0; i--){
		printf("%d\n", i);
		if(i % 5 == 0){
			printf("Found one!\n");
		}
	}

	return 0;
}

