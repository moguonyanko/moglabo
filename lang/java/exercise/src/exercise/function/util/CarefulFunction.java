package exercise.function.util;

import java.util.Objects;

/**
 * チェック例外を送出することができる関数インタフェース。
 * 
 * Function::applyにはthrowsが無いのでFunctionインタフェースを拡張する場合に
 * R apply(T t) throws X
 * とは定義できない。
 * またFunctionインタフェースを拡張する場合は
 * R eval(T t) throws X
 * と定義することもできない。Function::applyと合わせて2つ以上のメソッドが
 * 定義されることになり@FunctionalInterfaceの要件を満たさなくなるからである。
 *
 */
@FunctionalInterface
public interface CarefulFunction<T, R, X extends Throwable> {

	R apply(T t) throws X;

	/**
	 * @todo
	 * Functionインタフェースの再発明になってしまっている。
	 */
	
	default <V> CarefulFunction<V, R, X>
		compose(CarefulFunction<? super V, ? extends T, X> before) throws X {
		Objects.requireNonNull(before);
		return (V v) -> apply(before.apply(v));
	}

	default <V> CarefulFunction<T, V, X>
		andThen(CarefulFunction<? super R, ? extends V, X> after) {
		Objects.requireNonNull(after);
		return (T t) -> after.apply(apply(t));
	}

	static <T, X extends Throwable> CarefulFunction<T, T, X> identitiy() {
		return t -> t;
	}

}
