##Command Memo

#Execute main class
java -p ./mymod1 -m jp.org.moglabo.sample/jp.org.moglabo.sample.SampleLogger

#Create Jar
jar --create --file samplelog.jar --main-class jp.org.moglabo.sample.SampleLogger --module-version 1.0.0 -C mymod1 .
#Create Jar(not main class)
# -C の後には圧縮対象のディレクトリ名を指定する。
jar --create --file sampleservice.jar -C sampleservice .

#jarの内容確認
jar tvf my-service.jar

#Check structure of module
# -d == --describe-module, -f == --file
jar -d -f samplelog.jar

#Execute main class via jar
java -p mymod1/ -jar samplelog.jar
#Execute main class via jar(main class not defined in jar)
java -p samplelog.jar -m jp.org.moglabo.sample/jp.org.moglabo.sample.SampleLogger
#jarが複数の場合(my-serviceがライブラリでmy-clientがそれを利用するアプリ)
#my-service.jarが指定されないとjava.lang.ClassNotFoundExceptionとなり
#my-client.jarが指定されないとjava.lang.module.FindExceptionとなる。
java -p my-service.jar:my-client.jar -m my.client/app.App

#モジュールパスとメインクラスを指定してプログラムを実行
java -p ./mymod1 -m jp.org.moglabo.sample/jp.org.moglabo.sample.SampleLogger

#Compile module-info.java and Java program
javac mymod1/module-info.java mymod1/jp/org/moglabo/pkg/sample/SampleLogger.java 
cd mymod2
javac -p ../mymod1/ module-info.java jp/org/moglabo/pkg/client/SampleClient.java
#複数のモジュールのパスを指定してコンパイル
# module-source-path の後ろに . を指定してカレントディレクトリもパスに含めないと
#自身のモジュールを見つけられずにコンパイルエラーになる。
javac --module-source-path . modA/module-info.java modA/pkg1/SampleA.java -d .
javac --module-source-path . modB/module-info.java modB/pkg2/SampleB.java -d .
javac --module-source-path . modC/module-info.java modC/pkg3/InterfaceA.java modC/pkg3/InterfaceB.java -d .

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

#コンパイル対象にモジュール・ディスクリプタ(module-info.java)が含まれない場合のコンパイル
#参照するjarは  -p ではなく -cp で指定する。
javac -cp ../mylogger/mylogger.jar app/MyApp.java

#モジュール・ディスクリプタが存在しないアプリケーションとライブラリを指定した
#アプリケーション実行(myloggerが参照されるライブラリ、myappがアプリケーション)
java -cp mylogger/mylogger.jar:myapp/myapp.jar app.MyApp

##モジュールアプリケーションへのマイグレーション(top down)
##アプリケーション側(myapp)をモジュールアプリケーションにする。

##モジュール依存関係の出力
#最後のjarが依存関係出力対象となる。 -s を除けば詳細な出力になる。
jdeps --module-path mylogger/mylogger.jar -s myapp/myapp.jar
#モジュールアプリケーションを含まない場合
jdeps -cp service.jar -s client.jar 
jdeps -s service.jar
# -s と -summary は同じ。
jdeps --module-path my-service.jar:my-client.jar -summary --module my.client
jdeps --module-path my-service.jar:my-client.jar -summary --module my.service

#dotファイルに依存関係出力
#my-service.jar.dotとmy-client.jar.dotが出力される。
jdeps --module-path my-service.jar:my-client.jar --dot-output . *.jar
#最後のjarを明示すればそのjarのdotファイルだけ出力できる。
jdeps --module-path modA.jar:modB.jar:modC.jar --dot-output . modC.jar

#コンパイル対象にモジュール・ディスクリプタが存在する場合のコンパイル
javac -p ../mylogger/mylogger.jar module-info.java app/MyApp.java 

#モジュールアプリケーションとそうでないものが混在する場合の実行
#myloggerはモジュールアプリケーション「ではない」
#myappは実行対象のMyAppを含むモジュールアプリケーション「である」
# --module-path は -p と同じ。 --module は -m と同じ。
java --module-path mylogger/mylogger.jar:myapp_module/myapp.jar --module app/app.MyApp

##モジュールアプリケーションへのマイグレーション(bottom up)
##ライブラリ側(mylogger)をモジュールアプリケーションにする。

#モジュール・ディスクリプタ(module-info.java)の生成
jdeps --generate-module-info . mylogger.jar
#複数のjarに対してまとめて生成
jdeps --generate-module-info . *.jar
#対象のjarの名前にハイフンが含まれている場合はハイフンがドットに
#置換されそれがモジュール名とされる。この時module-info.javaは
#新規生成されたディレクトリ内に出力される。
#以下はmy-client.jarとmy-service.jarに対してmodule-info.javaを
#生成した際の出力である。
#writing to ./my.client/module-info.java
#writing to ./my.service/module-info.java

#生成したモジュールディスクリプタを含めてコンパイル
javac module-info.java logging/MyLogger.java
#モジュールになったjarの生成
jar --create --verbose --file mylogger.jar .

#モジュールになったmyloggerを参照する非モジュールアプリケーションmyapp実行
java --add-modules mylogger --module-path mylogger_module/mylogger.jar --class-path myapp/myapp.jar app.MyApp

-----

#モジュールアプリケーションのコンパイル及び実行コマンド例
cd myprovider
javac -p ../sampleservice.jar module-info.java p3/MyProvider.java 
cd ../
jar --create --file myprovider.jar -C myprovider .                     
cd sampleapp
java -p ../sampleservice.jar:../myprovider.jar:. -m app/myapp.MyAppMain
