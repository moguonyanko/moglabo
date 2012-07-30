#!/bin/sh

PYTHONPATH=${PYTHONPATH}:~/src/
export PYTHONPATH

#echo $PYTHONPATH

PYPATH=`which python3`

cd test/

${PYPATH} `pwd`/test_util.py
${PYPATH} `pwd`/test_logic.py
${PYPATH} `pwd`/test_algebra.py
${PYPATH} `pwd`/test_linear.py
${PYPATH} `pwd`/test_calculus.py
${PYPATH} `pwd`/test_algorithm.py
${PYPATH} `pwd`/test_geometry.py
${PYPATH} `pwd`/test_statistics.py

