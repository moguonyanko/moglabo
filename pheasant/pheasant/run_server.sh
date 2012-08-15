#!/bin/sh

PYTHONPATH=${PYTHONPATH}:~/src/
export PYTHONPATH

PYPATH=`which python3`

${PYPATH} server.py

