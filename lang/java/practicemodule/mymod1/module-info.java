/**
 * 参考:
 * http://java.boot.by/ocpjd11-upgrade-guide/ch01s02.html
 */

module jp.org.moglabo.mod.sample {
	// このモジュール内のクラスからjava.util.loggingパッケージのクラスが含まれる
	// java.loggingモジュールを参照可能にする。
	requires java.logging;
	// コンパイル時のみ当該モジュールを必要とする場合はstaticを指定することもできる。
	//requires static java.logging;

	// 他のモジュールから参照できるようにパッケージをexportsする。
	// exportsするのはモジュールではなくパッケージである。
	//exports jp.org.moglabo.pkg.sample;
	// パッケージを公開するモジュールを限定したい場合はexports ... to ... を使う。
	exports jp.org.moglabo.pkg.sample to jp.org.moglabo.mod.client;
}
