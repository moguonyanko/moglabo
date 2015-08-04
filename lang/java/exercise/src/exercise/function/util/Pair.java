package exercise.function.util;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

/**
 * Mapを使って値の対を表現する関数型インターフェースです。
 *
 * 参考：
 * 「計算機プログラムの構造と解釈 第2版」（ピアソン）
 * 
 * @todo
 * 述語を受け取るcarやcdrをPairのdefaultメソッドとして定義することも
 * 可能だが未実装である。
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
		Pair<T, U> pair = new Pair<T, U>() {
			/**
			 * 1組の値の対だけ保持するのでコンストラクタの引数にサイズ1を指定する。
			 */
			private final Map<T, U> m = new HashMap<>(1);

			/**
			 * ここでPairの値の設定を行わないと，
			 * get呼び出し前にtoString等が呼び出された時
			 * 意図しない振る舞いを示す可能性がある。
			 */
			{
				m.put(t, u);
			}

			@Override
			public Map<T, U> get() {
				return m;
			}

			@Override
			public String toString() {
				return car() + ":" + cdr();
			}

			@Override
			public boolean equals(Object o) {
				if(o instanceof Pair){
					Pair<T, U> other = (Pair<T, U>)o;
					return car().equals(other.car()) && cdr().equals(other.cdr());
				}else{
					return false;
				}
			}

			@Override
			public int hashCode() {
				return Objects.hash(m);
			}

		};

		return pair;
	}

	/**
	 * Objectクラスのメソッドのオーバーライドでもコンパイルエラーになる。
	 */
//	@Override
//	public String toString(){
//		return car() + ":" + cdr();
//	}
}
