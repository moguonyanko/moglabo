#!/bin/sh

MCS=`which gmcs`
${MCS} --version

NUNITFRAMEWORK=/usr/lib/mono/gac/nunit/framework/nunit.framework.dll

echo "Try to make modules from all C# files..."

${MCS} -target:library statistics.cs
${MCS} -r:${NUNITFRAMEWORK} -r:./statistics.dll -target:library test_statistics.cs
echo "statistics module has compiled."

${MCS} -target:library linear.cs
${MCS} -r:${NUNITFRAMEWORK} -r:./linear.dll -target:library test_linear.cs
echo "linear module has compiled."

echo "All module making finished!"

