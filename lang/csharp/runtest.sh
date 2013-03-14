#!/bin/sh

NUNIT=`which nunit-console`

${NUNIT} test_statistics.dll test_linear.dll


