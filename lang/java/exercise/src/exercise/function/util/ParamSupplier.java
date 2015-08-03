package exercise.function.util;

/**
 * 引数を受け取れるSupplierです。
 * Supplierを拡張して定義することはできません。
 * 複数のメソッドが定義された状態になるため
 * コンパイルエラーになります。
 */
@FunctionalInterface
public interface ParamSupplier<T, U, V> {

	T get(U u, V v);

}
