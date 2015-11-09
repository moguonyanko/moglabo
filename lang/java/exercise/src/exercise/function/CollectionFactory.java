package exercise.function;

import java.util.Collection;

@FunctionalInterface
public interface CollectionFactory {
	
	/**
	 * 関数型インターフェースのメソッドも型パラメータを宣言することができる。
	 */
	<T> Collection<T> make(); 

}
