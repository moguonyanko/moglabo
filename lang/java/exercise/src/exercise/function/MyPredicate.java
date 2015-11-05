package exercise.function;

import java.util.Objects;
import java.util.function.Function;

@FunctionalInterface
public interface MyPredicate<T> extends Function<T, Boolean> {
	
	boolean test(T t);
	
	@Override
	default Boolean apply(T t){
		/**
		 * インターフェースの宣言部が
		 * <pre>
		 * public interface MyPredicate<T, Boolean> extends Function<T, Boolean>
		 * </pre>
		 * となっていると，Function<T, Boolean>のBooleanクラスが
		 * MyPredicate<T, Boolean>の<em>型変数</em>Booleanにシャドウイングされる。
		 * この時警告は一切表示されない。
		 * シャドウイングの結果Booleanクラスは不可視になり
		 * Booleanクラスを参照するコードは全てコンパイルエラーとなる。
		 */
		return Boolean.valueOf(test(t));
	}
	
	default MyPredicate<T> and(MyPredicate<? super T> other){
		Objects.requireNonNull(other);
		return t -> test(t) && other.test(t);
	}
	
	default MyPredicate<T> or(MyPredicate<? super T> other){
		Objects.requireNonNull(other);
		return t -> test(t) || other.test(t);
	}
	
	default MyPredicate<T> negate(){
		return t -> !test(t);
	}
	
	/**
	 * staticメソッドからクラス宣言部の型変数を参照することはできない。
	 * そのため以下のコードはコンパイルエラーとなる。
	 * <pre>
	 * static MyPredicate<T> isEqual()
	 * </pre>
	 * 型変数をあらためて宣言する必要がある。
	 */
	static <T> MyPredicate<T> isEqual(Object target){
		return self -> Objects.equals(self, target);
	}
	
}
