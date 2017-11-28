package exercise.lang;

import java.time.Duration;
import java.time.temporal.Temporal;

public interface TimeMachine<T extends Temporal, U extends TimeMachine>
	extends Comparable<U> {

	/**
	 * インターフェースは現在のオブジェクトのフィールドにアクセスできない。従って
	 * デフォルトメソッドを定義すると現在のオブジェクトのフィールドに保存された値を
	 * 参照する際にはアクセッサメソッドが必要になる。
	 * 即ちデフォルトメソッドを定義するためにインターフェースのメソッドとして
	 * アクセッサメソッドを定義せざる得なくなる。
	 * インターフェースのメソッドは暗黙でpublicなのでアクセス可能範囲を
	 * 狭くすることができない。また具象クラスにアクセッサメソッドを必ず
	 * オーバーライドさせなければならない設計も問題があるかもしれない。
	 * アクセッサメソッドは基本的にどの具象クラスでも似たような実装になる。
	 * 抽象クラスによる骨格実装が提供されなければ具象クラスに毎回同じような
	 * アクセッサメソッドを定義することになる。
	 */
	
	T getTime();
	
	void setTime(T time);
	
	default T now(){
		return getTime();
	}

	private Duration between(T base, T time) {
		return Duration.between(base, time);
	}
	
	default T toPast(T time){
		T base = now();
		
		/**
		 * setTimeの宣言にTの型宣言が無い場合，Tにキャストしないと
		 * コンパイルが通らない。
		 * <pre>T extends Temporal</pre>
		 */
		setTime((T)base.minus(between(base, time)));
		
		return now();
	}
	
	default T toFuture(T time){
		T base = now();
		
		setTime((T)base.plus(between(base, time)));
		
		return now();
	}
	
}
