#!/bin/sh

gcc -o hello hello.m -I/usr/include/GNUstep -L/usr/lib/GNUStep -lobjc -lgnustep-base -fconstant-string-class=NSConstantString -Wall

