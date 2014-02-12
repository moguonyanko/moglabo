/* 
 * File:   main.c
 * Author: moguonyanko
 *
 * Created on 2013/10/30, 2:52
 */

#include <stdio.h>
#include <stdlib.h>

int add(int a, int b) {
	return a + b;
}

/*
 * 
 */
int main(int argc, char** argv) {
	
	printf("%d", add(1, 2));
	
	return (EXIT_SUCCESS);
}

