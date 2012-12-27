#include <stdio.h>
#include <math.h>

typedef struct {
	float heightInMeters;
	int weightInKilos;
} Person; 

float bodyMathIndex(Person p)
{
	return p.weightInKilos / pow(p.heightInMeters, 2);
}

int main(int argc, const char * argv[])
{
	Person person;
	person.weightInKilos = 96;
	person.heightInMeters = 1.8;
	printf("person weights %d kilograms\n", person.weightInKilos);
	printf("person is %.2f meters tall\n", person.heightInMeters);
	float bmi = bodyMathIndex(person);
	printf("person has a BMI of %f\n", bmi);

	return 0;
}

