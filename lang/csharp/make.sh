#!/bin/sh

MCS=`which gmcs`
${MCS} --version

NUNITFRAMEWORK=/usr/lib/mono/gac/nunit/framework/nunit.framework.dll

echo "Try to make modules from all C# files..."

#${MCS} -target:library linear.cs
#echo "linear module has compiled."

#${MCS} -target:library statistics.cs
#echo "statistics module has compiled."

${MCS} -r:./MongoDB.Bson.dll,./MongoDB.Driver.dll -target:library resource.cs
echo "Resource module has compiled."

${MCS} -r:./MongoDB.Bson.dll,./MongoDB.Driver.dll,./resource.dll -target:library ci.cs
echo "CI module has compiled."

echo "Target module making finished!"

#${MCS} -r:${NUNITFRAMEWORK} -r:./linear.dll -target:library test_linear.cs
#${MCS} -r:${NUNITFRAMEWORK} -r:./statistics.dll -target:library test_statistics.cs
${MCS} -r:${NUNITFRAMEWORK} -r:./ci.dll -target:library test_ci.cs
${MCS} -r:${NUNITFRAMEWORK} -r:./resource.dll -target:library test_resource.cs
${MCS} -r:./MongoDB.Bson.dll,./MongoDB.Driver.dll mongo_simple_test.cs
echo "Test module making finished!"

