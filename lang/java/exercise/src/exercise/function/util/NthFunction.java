package exercise.function.util;

/**
 * @todo
 * andThenやcompose，identityが不足している。
 * 
 */
@FunctionalInterface
public interface NthFunction<T, R> {

	/**
	 * 可変長の引数群に対し関数を適用します。
	 * 
	 * @todo
	 * 引数群の型が全て同じである必要がある。
	 * 
	 */
	R apply(T... t);

}
