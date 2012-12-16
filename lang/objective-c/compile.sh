#!/bin/sh

gcc hello.m -o hello -lobjc -lgnustep-base -I /usr/include/GNUstep -fconstant-string-class=NSConstantString

