#!/bin/sh

# Reference: http://webassembly.org/

mkdir hello
cd hello
echo '#include <stdio.h>' > hello.c
echo 'int main(int argc, char ** argv) {' >> hello.c
echo 'printf("Hello, world!\n");' >> hello.c
echo '}' >> hello.c
emcc hello.c -s WASM=1 -o hello.html
