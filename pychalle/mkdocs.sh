#!/bin/sh

PYTHONPATH=${PYTHONPATH}:~/src/
export PYTHONPATH

cd ~/src

#Ocuur error for Sphinx adapt Python3.
sphinx-apidoc -F -f -o `pwd`/moglabo/pychalle/docs/ moglabo

cd `pwd`/moglabo/pychalle/docs/

make html

