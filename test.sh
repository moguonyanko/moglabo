#!/bin/sh

PYPATH=`which python3`

${PYPATH} `pwd`/test_util.py
${PYPATH} `pwd`/test_formula.py
${PYPATH} `pwd`/test_algorithm.py
${PYPATH} `pwd`/test_linear.py
${PYPATH} `pwd`/test_calculus.py
${PYPATH} `pwd`/test_statistics.py

cd `pwd`/crowds/

${PYPATH} ./test_recommendations.py
#${PYPATH} ./test_optimization.py

