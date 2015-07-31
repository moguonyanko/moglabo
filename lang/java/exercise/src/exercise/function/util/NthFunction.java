package exercise.function.util;

import java.util.Objects;

@FunctionalInterface
public interface NthFunction<T, R> {

	/**
	 * 可変長の引数群に対し関数を適用します。
	 * 引数群の型が全て同じである必要があります。
	 *
	 */
	R apply(T... t);
	
    default <V> NthFunction<V, R> compose(NthFunction<? super V, ? extends T> before) {
		/**
		 * Function.composeがラムダ式内ではなくその前でObjects.requireNonNullを
		 * 呼び出しているのは，ラムダ式の外側で例外を発生させた方が後々追跡しやすく
		 * なるからではないか？
		 */
		Objects.requireNonNull(before);
        return (V... v) -> apply(before.apply(v));
    }
	
	/**
	 * @todo
	 * 実装中
	 * 
	 */
    default <V> NthFunction<T, V> andThen(NthFunction<? super R, ? extends V> after) {
        Objects.requireNonNull(after);
		throw new UnsupportedOperationException("多値か可変長戻り値が返せないと実装不可？");
		
		//compile error
        //return (T... t) -> after.apply(apply(t));
    }
	
	/**
	 * 引数をそのまま返す関数を返します。
	 *
	 * @todo
	 * 多値が返せないので配列を返している。可変長「戻り値」は存在しない。
	 * 従って引数をそのまま返すことができていない。
	 *
	 */
	static <T> NthFunction<T, T[]> identity() {
		return (T... t) -> t;
	}

}
