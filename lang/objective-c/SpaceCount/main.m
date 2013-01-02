#include <stdio.h>
#include <string.h>

int spaceCount(const char * sentense)
{
	int count = 0;

	for(int i = 0, len = strlen(sentense); i < len; i++){
		if(sentense[i] == ' '){
			count++;
		}
	}

	return count;
}

int main(int argc, const char * argv[])
{
	const char *sentense = "He was not in the cab at the time.";
	printf("\"%s\" has %d spaces\n", sentense, spaceCount(sentense));

	return 0;
}

