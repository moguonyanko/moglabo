#include <stdio.h>
#include <objc/objc.h>

int main(int argc, const char * argv[])
{
	int i = 20;
	int j = 25;

	int k = (i > j) ? 10 : 5;

	BOOL result = 5 < j - k;

	if(result){
		printf("The first expression is true.\n");
	}else if(j > i){
		printf("The second expression is ture.\n");
	}else{
		printf("Neither expression is true.\n");
	}

	return 0;
}
	
	
