package exercise.function.util;

import java.util.HashMap;
import java.util.Map;
import java.util.function.BiFunction;
import java.util.function.Function;

/**
 * 参考：「Javaによる関数型プログラミング」(オライリー・ジャパン)
 */
public class Memoizer {

	public static <T, R> R callMemoized(BiFunction<Function<T, R>, T, R> func,
		T input) {
		/**
		 * memoized変数を宣言している行の右辺の<T, R>は省略すると
		 * コンパイルエラーになる。
		 * 匿名内部クラスではダイヤモンド演算子を使用できない。
		 */
		Function<T, R> memoized = new Function<T, R>() {
			private final Map<T, R> store = new HashMap<>();

			@Override
			public R apply(T checkKey) {
				Function<T, R> mapper = key -> func.apply(this, key);
				R result = store.computeIfAbsent(checkKey, mapper);
				return result;
			}
		};

		return memoized.apply(input);
	}

}
