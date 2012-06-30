#include<stdio.h>
#include<math.h>
#include"calculation.h"

//a行目の行ベクトルとb行めの行ベクトルを交換する
static void ExchangeRowvector(Matrix *m, int a, int b);

Matrix *CreateMatrix(int width, int height)
{
	Matrix *temp;

	if((temp = (Matrix*)malloc(sizeof(Matrix))) == NULL){
		fprintf(stderr, "Allocation Error\n");
		exit(1);
	}

	if((temp->a = (double*)malloc(sizeof(double)*width*height)) == NULL){
		fprintf(stderr, "Allocation Error\n");
		exit(1);
	}

	temp->width = width;
	temp->height = height;

	return temp;
}

void FreeMatrix(Matrix* matrix)
{
	free(matrix->a);
	free(matrix);
}

int* LU(Matrix* m)
{
	int i, j, k;
	int width, height;
	int d;
	double max;
	int temp, *order;

	width = m->width;
	height = m->height;

	if((order = (int*)malloc(sizeof(int)*height)) == NULL){
		fprintf(stderr, "Allocation Error\n");
		exit(1);
	}

	for(i=0; i<height; i++) order[i] = i;

	for(i=0; i<height-1; i++){
		d = i;
		max = fabs(m->a[i*width + i]);

		for(j=i+1; j<height; j++){
			if(max < fabs(m->a[j*width + i])){
				d = j;
				max = fabs(m->a[j*width + i]);
			}
		}

		if(d!=i){
			temp = order[i];
			order[i] = order[d];
			order[d] = temp;

			ExchangeRowvector(m, i, d);
		}

		if(!(m->a[i*width + i])) continue;

		for(j=i+1; j<height; j++){
			m->a[j*width + i] /= m->a[i*width + i];
			for(k=i+1; k<width; k++){
				m->a[j*width + k] -= m->a[j*width + i]*m->a[i*width + k];
			}
		}
	}
	return order;
}

static void ExchangeRowvector(Matrix *m, int a, int b)
{
	int i;
	double temp;

	for(i=0; i<m->height; i++){
		temp = m->a[a*m->width + i];
		m->a[a*m->width + i] = m->a[b*m->width + i];
		m->a[b*m->width + i] = temp;
	}
}

