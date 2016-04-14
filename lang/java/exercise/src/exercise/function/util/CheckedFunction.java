package exercise.function.util;

import java.util.Objects;
import java.util.function.Function;

/**
 * チェック例外を送出することができる関数インタフェース。
 *
 * 参考: https://dzone.com/articles/java-8-functional-interfaces-0
 */
@FunctionalInterface
public interface CheckedFunction<T, R, X extends Exception> extends Function<T, R> {

    @Override
    default R apply(T t) {
        try {
            return applyMaybeThrows(t);
        } catch (Exception ex) {
            throw new CheckedExceptionWrapper(ex);
        }
    }

    R applyMaybeThrows(T t) throws X;

    default <V> CheckedFunction<V, R, X>
            compose(CheckedFunction<? super V, ? extends T, X> before) throws X {
        Objects.requireNonNull(before);
        try {
            return (V v) -> apply(before.apply(v));
        } catch (Exception ex) {
            throw new CheckedExceptionWrapper(ex);
        }
    }

    default <V> CheckedFunction<T, V, X>
            andThen(CheckedFunction<? super R, ? extends V, X> after) {
        Objects.requireNonNull(after);
        try {
            return (T t) -> after.apply(apply(t));
        } catch (Exception ex) {
            throw new CheckedExceptionWrapper(ex);
        }
    }

    static <T, X extends Exception> CheckedFunction<T, T, X> identitiy() {
        return t -> t;
    }

}
