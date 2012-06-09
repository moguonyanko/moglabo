#!/bin/sh

RDOCPATH=`which rdoc`
RDOCTITLE="Kouichi_Studying_Programing"
RDOCTARGET="ksp_*.rb"

rm -r doc/
${RDOCPATH} ${RDOCTARGET} -S -N -c UTF-8 -t ${RDOCTITLE} --main GroupTheory::Element

