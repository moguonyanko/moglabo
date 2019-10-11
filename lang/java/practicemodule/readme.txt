##Command Memo

#Execute main class
java -p ./mymod1 -m jp.org.moglabo.sample/jp.org.moglabo.sample.SampleLogger

#Create Jar
jar --create --file samplelog.jar --main-class jp.org.moglabo.sample.SampleLogger --module-version 1.0.0 -C mymod1 .
#Create Jar(not main class)
jar --create --file sampleservice.jar -C sampleservice .

#Check structure of module
jar -d -f samplelog.jar

#Execute main class via jar
java -p mymod1/ -jar samplelog.jar
#Execute main class via jar(main class not defined in jar)
java -p samplelog.jar -m jp.org.moglabo.sample/jp.org.moglabo.sample.SampleLogger

#モジュールパスとメインクラスを指定してプログラムを実行
java -p ./mymod1 -m jp.org.moglabo.sample/jp.org.moglabo.sample.SampleLogger

#Compile module-info.java and Java program
javac mymod1/module-info.java mymod1/jp/org/moglabo/pkg/sample/SampleLogger.java 
cd mymod2
javac -p ../mymod1/ module-info.java jp/org/moglabo/pkg/client/SampleClient.java

#他のモジュールをパスで指定してプログラムを実行
#実行対象クラスのモジュールがあるディレクトリ(ここではmymod2)にも -p オプションで
#パスを通すこと。たとえモジュールがカレントディレクトリにあってもパスを通す必要がある。
# -m オプションを指定しないとClassNotFoundExceptionとなる。
java -p mymod1:mymod2 -m jp.org.moglabo.mod.client/jp.org.moglabo.pkg.client.SampleClient
#複数のjarを参照している場合
java -p ../sampleservice.jar:../sampleprovider.jar:. -m app/myapp.MyAppMain

#相互に依存している場合のコンパイルの例
javac -p mymod2 mymod1/module-info.java mymod1/jp/org/moglabo/pkg/sample/SampleLogger.java 
javac -p mymod1:mymod2 mymod2/module-info.java mymod2/jp/org/moglabo/pkg/client/AccessLog.java
cd sampleprovider
javac -p ../sampleservice.jar module-info.java pkg1/Greeter.java
