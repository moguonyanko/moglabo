#include <stdio.h>
#include <time.h>

/*
typedef struct {
	int tm_sec;
	int tm_min;
	int tm_hour;
	int tm_mday;
	int tm_mon;
	int tm_year;
	int tm_wday;
	int tm_yday;
	int tm_isdst;
	int tm_zone;
	int tm_gmtoff;
} Tm; 
*/

int main(int argc, const char * argv[])
{
	long secondsSince1970 = time(NULL);
	printf("It has been %ld seconds since 1970\n", secondsSince1970);
	
	struct tm now;
	localtime_r(&secondsSince1970, &now);
	printf("The time is %d:%d:%d\n", now.tm_hour, now.tm_min, now.tm_sec);

	secondsSince1970 += 4000000;
	localtime_r(&secondsSince1970, &now);
	printf("The time is %d-%d-%d\n", now.tm_mon+1, now.tm_mday, 1900+now.tm_year);

	return 0;
}

