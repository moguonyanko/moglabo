#!/bin/sh

sphinx-apidoc -F -f -o docs/ .
cd docs/
make html
