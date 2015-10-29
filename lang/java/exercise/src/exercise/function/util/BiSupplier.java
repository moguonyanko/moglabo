package exercise.function.util;

import java.util.function.Supplier;

/**
 * 引数を2つ受け取ることができるSupplierです。
 */
@FunctionalInterface
public interface BiSupplier<R, T, U> extends Supplier<R> {
	
	R get(T t, U u);

	/**
	 * スーパーインターフェースのメソッド名とstaticメソッド名が 
	 * 衝突したらコンパイルエラーとなる。
	 */
	//static R get(){
	//}
	
	@Override
	default R get(){
		return get(null, null);
	}
	
}
