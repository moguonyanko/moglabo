#include<stdio.h>
#include<math.h>
#include"calculation.h"

int main()
{
	int i, j;

	Matrix *eig;
	Matrix *test;
	Vector *eigenvec;

	eig = CreateMatrix(2, 2);
	test = CreateMatrix(2, 2);

	test->a[0*test->width + 0] = 2.5;
	test->a[0*test->width + 1] = 1.5;
	test->a[1*test->width + 0] = 1.5;
	test->a[1*test->width + 1] = 2.5;

	printf("Input Matrix\n");
	for(i=0; i<test->height; i++){
		for(j=0; j<test->width; j++){
			printf("%f ", test->a[i*test->width + j]);
		}
		printf("\n");
	}

	printf("\n");

	eigenvec = Jacobi(test, eig); 

	printf("Eigenvector Matrix\n");
	for(i=0; i<eig->height; i++){
		for(j=0; j<eig->width; j++){
			printf("%f ", eig->a[i*eig->width + j]);
		}
		printf("\n");
	}

	printf("\n");

	printf("Eigennum Vector\n");
	for(i=0; i<eigenvec->size; i++){
		printf("%f ", eigenvec->v[i]);
	}

	printf("\n");

	FreeVector(eigenvec);
	FreeMatrix(test);
	FreeMatrix(eig);

	return 0;
}

