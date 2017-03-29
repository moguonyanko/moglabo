package exercise.lang;

import java.util.List;

public class OverloadPractice<X extends CharSequence> {

	int foo() {
		return 0;
	}

	/**
	 * 以下はシグネチャが先に定義された同名のメソッドと衝突するためコンパイルできない。
	 * 戻り値の型はシグネチャに含まれない。
	 */	
//	double foo() {
//		return 0d;
//	}
	
	<T> int bar(T t) {
		return 0;
	}
	
	/**
	 * 以下のメソッドも先に定義されたbarとシグネチャが衝突するのでコンパイルできない。
	 */	
//	<U> double bar(U u) {
//		return 0d;
//	}
	
	int baz(List<X> l) {
		return 0;
	}

	/**
	 * コレクションに指定されたジェネリックスの型情報は実行時には消えているので，
	 * 以下のメソッドも先に定義された同名メソッドとシグネチャが衝突することになり
	 * コンパイルエラーとなる。引数の型がList<Y>ではなくYであればコンパイル可能になる。
	 */	
//	<Y extends Integer> double baz(List<Y> l) {
//		return 0d;
//	}
	
	<A extends String> int hoge(A a) {
		return 0;
	}
	
	/**
	 * 型変数Bは実行時にIntegerとなるため先に定義されたhogeとはシグネチャが異なる。
	 * したがって以下のメソッドはコンパイルできる。
	 */
	<B extends Integer> double hoge(B b) {
		return 0d;
	}
	
	<C extends CharSequence> int fuga(C c) {
		return 0;
	}
	
	/**
	 * 先に定義された同名のメソッドと実行時の型が親子関係になるが
	 * シグネチャは異なる。従ってコンパイルできる。
	 */
	<D extends String> double fuga(D d) {
		return 0d;
	}
	
}
