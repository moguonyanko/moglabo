#include <stdio.h>
#include <stdlib.h>
#include <math.h>

typedef struct {
	float heightInMeters;
	int weightInKilos;
} Person; 

float bodyMathIndex(Person *p)
{
	return p->weightInKilos / pow(p->heightInMeters, 2);
}

int main(int argc, const char * argv[])
{
	Person *person = (Person *)malloc(sizeof(Person));
	
	person->weightInKilos = 81;
	person->heightInMeters = 2.0;
	printf("person weights %d kilograms\n", person->weightInKilos);
	printf("person is %.2f meters tall\n", person->heightInMeters);
	float bmi = bodyMathIndex(person);
	printf("person has a BMI of %f\n", bmi);

	free(person);

	person = NULL;

	return 0;
}

