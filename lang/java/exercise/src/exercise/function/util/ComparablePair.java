package exercise.function.util;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

/**
 * Pairインターフェースから分離して定義することで
 * パッケージ外からComparablePairにアクセスできないようにしている。
 */
class ComparablePair<X extends Comparable, Y extends Comparable>
	implements Pair<X, Y>, Comparable<ComparablePair<X, Y>> {

	/**
	 * 1組の値の対だけ保持するのでコンストラクタの引数にサイズ1を指定する。
	 */
	private final Map<X, Y> m = new HashMap<>(1);

	ComparablePair(X x, Y y) {
		m.put(x, y);
	}

	@Override
	public Map<X, Y> get() {
		return new HashMap<>(m);
	}

	@Override
	public int compareTo(ComparablePair<X, Y> that) {
		if (this.car().equals(that.car())) {
			return this.cdr().compareTo(that.cdr());
		} else {
			return this.car().compareTo(that.car());
		}
	}

	@Override
	public String toString() {
		return car() + ":" + cdr();
	}

	@Override
	public boolean equals(Object o) {
		if (o instanceof Pair) {
			Pair<X, Y> other = (Pair<X, Y>) o;
			return car().equals(other.car()) && cdr().equals(other.cdr());
		} else {
			return false;
		}
	}

	@Override
	public int hashCode() {
		return Objects.hash(m);
	}
	
}
