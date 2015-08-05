package exercise.function.util;

import java.util.Map;

/**
 * Pairインターフェースから分離して定義することで
 * パッケージ外からComparablePairにアクセスできないようにしている。
 */
interface ComparablePair<X extends Comparable, Y extends Comparable>
	extends Pair<X, Y>, Comparable<ComparablePair<X, Y>> {
	
	static <T extends Comparable, U extends Comparable> Pair<T, U> of(T t, U u) {

		Pair<T, U> pair = new ComparablePair<T, U>() {

			private final Pair<T, U> p = Pair.of(t, u);

			@Override
			public Map get() {
				return p.get();
			}

			@Override
			public int compareTo(ComparablePair<T, U> that) {
				if (car().equals(that.car())) {
					return cdr().compareTo(that.cdr());
				} else {
					return car().compareTo(that.car());
				}
			}

			@Override
			public String toString() {
				return ComparablePair.super.str();
			}

			@Override
			public boolean equals(Object o) {
				if(o instanceof ComparablePair){
					return ComparablePair.super.eq((ComparablePair<T, U>)o);
				}
				
				return false;
			}

			@Override
			public int hashCode() {
				return ComparablePair.super.hash();
			}

		};

		return pair;
	}

}
