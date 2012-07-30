#ifndef __CALCULATION_H_INCLUDED__
#define __CALCULATION_H_INCLUDED__

typedef struct{
	int height;
	int width;
	double *a;
}Matrix;

Matrix *CreateMatrix(int width, int height);
void FreeMatrix(Matrix* matrix);

//LU分解。行列mを下三角行列と上三角行列に分解ベクトルvは行を交換するときに合わせて交換する。
int* LU(Matrix* m);
#endif /* __CALCULATION_H_INCLUDED__ */
