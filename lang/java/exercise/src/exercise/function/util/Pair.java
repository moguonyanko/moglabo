package exercise.function.util;

import java.util.Map;
import java.util.HashMap;
import java.util.Objects;

/**
 * Mapを使って値の対を表現する関数型インターフェースです。
 * 関数型インターフェースで定義する必要は無いですが，
 * 調査・学習のため関数型インターフェースで定義しています。
 *
 * 参考：
 * 「計算機プログラムの構造と解釈 第2版」（ピアソン）
 *
 * @todo
 * 述語を受け取るcarやcdrをPairのdefaultメソッドとして定義することも
 * 可能だが未実装である。
 * Pair自身を直接Comparableにはできない。
 * Pairが関数型インターフェースだからである。
 * 関数型インターフェースはミックスインしにくい。
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

	default String str() {
		return car() + ":" + cdr();
	}

	default boolean eq(Pair<K, V> o) {
		return car().equals(o.car()) && cdr().equals(o.cdr());
	}
	
	default int hash(){
		return Objects.hash(get());
	}

	static <T, U> Pair<T, U> of(T t, U u) {
		Pair<T, U> pair = new Pair<T, U>() {

			/**
			 * 1組の値の対だけ保持するのでコンストラクタの引数にサイズ1を指定する。
			 */
			private final Map<T, U> m = new HashMap<>(1);

			{
				m.put(t, u);
			}

			@Override
			public Map<T, U> get() {
				return new HashMap<>(m);
			}

			@Override
			public String toString() {
				return str();
			}

			@Override
			public boolean equals(Object o) {
				if (o instanceof Pair) {
					return eq((Pair<T, U>) o);
				}
				
				return false;
			}

			@Override
			public int hashCode() {
				return hash();
			}

		};

		return pair;
	}

	/**
	 * staticメソッドから型変数KやVを参照することはできない。
	 */
	static <T extends Comparable, U extends Comparable> Pair<T, U> ofComparable(T t, U u) {
		return ComparablePair.of(t, u);
	}

}
