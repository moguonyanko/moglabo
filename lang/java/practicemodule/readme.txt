##Command Memo

#Execute main class
java -p ./mymod1 -m jp.org.moglabo.sample/jp.org.moglabo.sample.SampleLogger

#Create Jar
jar --create --file samplelog.jar --main-class jp.org.moglabo.sample.SampleLogger --module-version 1.0.0 -C mymod1 .

#Check structure of module
jar -d -f samplelog.jar

#Execute main class via jar
java -p mymod1/ -jar samplelog.jar
#Execute main class via jar(main class not defined in jar)
java -p samplelog.jar -m jp.org.moglabo.sample/jp.org.moglabo.sample.SampleLogger

#モジュールパスとメインクラスを指定してプログラムを実行する
java -p ./mymod1 -m jp.org.moglabo.sample/jp.org.moglabo.sample.SampleLogger

#Compile module-info.java and Java program
javac mymod1/module-info.java mymod1/jp/org/moglabo/pkg/sample/SampleLogger.java 
cd mymod2
javac -p ../mymod1/ module-info.java jp/org/moglabo/pkg/client/SampleClient.java

#他のモジュールをパスで指定してプログラムを実行する
#「-p ../mymod1:.」の「.」でカレントディレクトリにパスを通していないと
#自分のモジュール(ここではjp.org.moglabo.mod.client)を見つけられず実行時エラーになる。
cd mymod2
java -p ../mymod1:. -m jp.org.moglabo.mod.client/jp.org.moglabo.pkg.client.SampleClient
