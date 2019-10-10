/**
 * 参考:
 * http://java.boot.by/ocpjd11-upgrade-guide/ch01s02.html
 * 
 * module-info.javaを修正してコンパイルし直してもこのモジュールを利用している
 * 別のモジュールはコンパイルし直す必要はない。
 */

module jp.org.moglabo.mod.sample {
	// このモジュール内のクラスからjava.util.loggingパッケージのクラスが含まれる
	// java.loggingモジュールを参照可能にする。
	// requires に transitive も追加することで、このモジュールを利用する
	// 別のモジュールでも当該モジュールを参照することが可能になる。 
	requires transitive java.logging;
	// コンパイル時のみ当該モジュールを必要とする場合はstaticを指定することもできる。
	//requires static java.logging;

	// コンパイルで生成されたclassファイルが他のモジュールから参照できるように
	// パッケージをexportsする。exportsするのはモジュールではなく「パッケージ」である。
	//exports jp.org.moglabo.pkg.sample;
	// パッケージを公開するモジュールを限定したい場合はexports ... to ... を使う。
	// コンパイル時は to の右辺で指定されるモジュールに以下のようにパスを通さないとエラーになる。
	// javac -p mymod2 mymod1/module-info.java mymod1/jp/org/moglabo/pkg/sample/SampleLogger.java
	exports jp.org.moglabo.pkg.sample to jp.org.moglabo.mod.client;
	// モジュール内の特定のパッケージのみopenにする場合は opens ... を使う。
	// to ... を組み合わせれば特定のモジュールに対してのみopenにできる。
	opens jp.org.moglabo.pkg.sample to jp.org.moglabo.mod.client;
}
