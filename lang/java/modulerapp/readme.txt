##Command Memo

This sample module name is "modulerapp" and sample main class name is "MyApp".

#Compile
javac -p . module-info.java app/MyApp.java

#Create jar
jar cf app.jar .

#Check neessary modules
jdeps --list-deps app.jar

#Create custom runtime
jlink --add-modules java.base --output myapp-runtime

#Execute application via custom runtime
myapp-runtime/bin/java -p app.jar --module modulerapp/app.MyApp

#Create custom runtime with executable launcher scripts
jlink -p app.jar --add-modules java.base,modulerapp --output myapp-runtime --launcher myapp=modulerapp/app.MyApp
