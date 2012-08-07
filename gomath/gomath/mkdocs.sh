#!/bin/sh

PYTHONPATH=${PYTHONPATH}:~/src/
export PYTHONPATH

cd ~/src

#Ocuur error for Sphinx adapt Python3.
sphinx-apidoc -F -f -o `pwd`/docs/ gomath

cd `pwd`/docs/

make html

