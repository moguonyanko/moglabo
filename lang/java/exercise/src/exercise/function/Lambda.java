package exercise.function;

@LambdaInterface(id="MyLambda")
public interface Lambda<T, R> {
	R funcall(T t);
	
	/**
	 * メソッドを複数定義すると関数インターフェースとしての規則を破ることになるため，
	 * ラムダ式とともにこのインターフェースを使用するとコンパイルエラーになる。
	 */
	//int id();
	
	/**
	 * defaultメソッドでObjectクラスのメソッドをオーバーライドすることはできない。
	 * すなわちインターフェースがデフォルトのequalsを提供することはできない。
	 * 同じことは他のObjectクラスのメソッドについても言える。
	 * Objectクラスのメソッドのデフォルト実装を提供したい時は，
	 * 従来通り抽象クラスを用いた骨格実装を用意する。
	 */
//	@Override
//	default boolean equals(Object obj){
//		return true;
//	}
	
}
