#!/bin/sh

RDOCPATH=`which rdoc`
RDOCTITLE="Moguo-Studying-Programing"
RDOCTARGET="math.rb algo.rb"

rm -r doc/
${RDOCPATH} ${RDOCTARGET} -S -N -c UTF-8 -t ${RDOCTITLE} --main GroupTheory::Element

