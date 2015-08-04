package exercise.function.util;

import java.util.HashMap;
import java.util.Map;

/**
 * 述語を受け取るcarやcdrをPairのdefaultメソッドとして定義することも可能である。
 * 
 * 参考：
 * 「計算機プログラムの構造と解釈 第2版」（ピアソン）
 */
@FunctionalInterface
public interface Pair<K, V> {

	Map<K, V> get();
	
	/**
	 * carとcdrはNoSuchElementExceptionを送出しないように
	 * 値が無いときはnullを返している。
	 * Pair.ofを介してPair関数を生成した場合，値が無いことはあり得ない。
	 */
	default K car() {
		return get().keySet().stream()
			.findFirst()
			.orElse(null);
	}

	default V cdr() {
		return get().values().stream()
			.findFirst()
			.orElse(null);
	}

	/**
	 * staticメソッドから型変数KやVを参照することはできない。
	 */
	static <T, U> Pair<T, U> of(T t, U u) {
		return () -> {
			/**
			 * 1つのPairしか保持しないのでコンストラクタにサイズ1を指定する。 
			 */
			Map<T, U> m = new HashMap<>(1);
			m.put(t, u);
			return m;
		};
	}

}
