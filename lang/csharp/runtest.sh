#!/bin/sh

NUNIT=`which nunit-console`

#${NUNIT} test_statistics.dll test_linear.dll test_resource.dll test_ci.dll
${NUNIT} test_resource.dll test_ci.dll


