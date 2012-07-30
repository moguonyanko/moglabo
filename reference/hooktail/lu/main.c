#include<stdio.h>
#include<math.h>
#include"calculation.h"

#define SIZE 3

void DisplayMatrix(Matrix *m);

int main()
{
	Matrix *m;
	int *order;

	m = CreateMatrix(SIZE, SIZE);

	m->a[0*m->width + 0] = 3.0;
	m->a[0*m->width + 1] = 3.0;
	m->a[0*m->width + 2] = -3.0;

	m->a[1*m->width + 0] = 3.0;
	m->a[1*m->width + 1] = 4.0;
	m->a[1*m->width + 2] = -4.0;

	m->a[2*m->width + 0] = 3.0;
	m->a[2*m->width + 1] = 2.0;
	m->a[2*m->width + 2] = 3.0;

	printf("Original Matrix:\n");
	DisplayMatrix(m);

	order = LU(m);

	printf("LU Matrix;\n");
	DisplayMatrix(m);

	FreeMatrix(m);

	return 0;
}


void DisplayMatrix(Matrix *m)
{
	int i, j;

	for(i=0; i<m->height; i++){
		for(j=0; j<m->width; j++){
			printf("%f ", m->a[i*m->width + j]);
		}
		printf("\n");
	}
	printf("\n");
	printf("\n");
}

