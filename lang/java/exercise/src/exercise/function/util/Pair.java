package exercise.function.util;

import java.util.Map;

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
 */
@FunctionalInterface
public interface Pair<K extends Comparable, V extends Comparable> {

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
	static <T extends Comparable, U extends Comparable> Pair<T, U> of(T t, U u) {
		
		/**
		 * ここでComparablePairを定義することでもComparablePairを
		 * 隠蔽することは可能である。しかし読みにくくなる。
		 * Comparableを実装させたいので無名クラスでは定義できない。
		 */
//		class ComparablePair<X extends Comparable, Y extends Comparable>
//			implements Pair<X, Y>, Comparable<ComparablePair<X, Y>> {
//
//			/**
//			 * 1組の値の対だけ保持するのでコンストラクタの引数にサイズ1を指定する。
//			 */
//			private final Map<X, Y> m = new HashMap<>(1);
//
//			ComparablePair(X x, Y y) {
//				m.put(x, y);
//			}
//
//			@Override
//			public Map<X, Y> get() {
//				return new HashMap<>(m);
//			}
//
//			@Override
//			public int compareTo(ComparablePair<X, Y> that) {
//				if (this.car().equals(that.car())) {
//					return this.cdr().compareTo(that.cdr());
//				} else {
//					return this.car().compareTo(that.car());
//				}
//			}
//
//			@Override
//			public String toString() {
//				return car() + ":" + cdr();
//			}
//
//			@Override
//			public boolean equals(Object o) {
//				if (o instanceof Pair) {
//					Pair<X, Y> other = (Pair<X, Y>) o;
//					return car().equals(other.car()) && cdr().equals(other.cdr());
//				} else {
//					return false;
//				}
//			}
//
//			@Override
//			public int hashCode() {
//				return Objects.hash(m);
//			}
//
//		}

		return new ComparablePair(t, u);
	}

}
