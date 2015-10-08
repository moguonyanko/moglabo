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
	 * defaultメソッドでObjectクラスのメソッドをオーバーライドするkとはできない。
	 * すなわちインターフェースがデフォルトのequalsを提供することはできない。
	 * 同じことは他のObjectクラスのメソッドについても言える。
	 */
//	@Override
//	default boolean equals(Object obj){
//		return true;
//	}
	
}
