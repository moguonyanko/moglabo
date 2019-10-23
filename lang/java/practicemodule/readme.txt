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
javac -p sampleservice.jar sampleapp/module-info.java sampleapp/myapp/MyAppMain.java
cd sampleapp
java -p ../sampleservice.jar:../sampleprovider.jar:. -m app/myapp.MyAppMain

#相互に依存している場合のコンパイルの例
javac -p mymod2 mymod1/module-info.java mymod1/jp/org/moglabo/pkg/sample/SampleLogger.java 
javac -p mymod1:mymod2 mymod2/module-info.java mymod2/jp/org/moglabo/pkg/client/AccessLog.java
cd sampleprovider
javac -p ../sampleservice.jar module-info.java pkg1/Greeter.java

#jarファイルのモジュール依存関係出力
#Service
jar --describe-module --file=sampleservice.jar
#Provider
jar --describe-module --file=sampleprovider.jar
#Client
#ここでProviderの情報が出力されない(＝コンパイル時にProviderに依存しない)ことが肝要。
#Providerの実装を直接使うのではなくインターフェース(サービス)を通して機能を使わせる。
jar --describe-module --file=sampleapp.jar

-----

#以下コンパイル及び実行コマンド例
cd myprovider
javac -p ../sampleservice.jar module-info.java p3/MyProvider.java 
cd ../
jar --create --file myprovider.jar -C myprovider .                     
cd sampleapp
java -p ../sampleservice.jar:../myprovider.jar:. -m app/myapp.MyAppMain
