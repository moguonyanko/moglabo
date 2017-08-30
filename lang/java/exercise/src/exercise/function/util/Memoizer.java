package exercise.function.util;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.BiFunction;
import java.util.function.Function;

/**
 * 参考：
 * 「Javaによる関数型プログラミング」(オライリー・ジャパン)
 * http://www.journaldev.com/13121/java-9-features-with-examples
 */
public class Memoizer {

	public static <T, R> R callMemoized(BiFunction<Function<T, R>, T, R> func,
		T input) {
		/**
		 * Java8ではmemoized変数を宣言している行の右辺の<T, R>を<>とすると
		 * コンパイルエラーになっていたがJava9からはエラーにならない。
		 */
		Function<T, R> memoized = new Function<>() {
            /**
             * 右辺のMapをConcurrentHashMapではなくHashMapにすると
             * Java9以降ではConcurrentModificationExceptionがスローされる。
             */
			private final Map<T, R> store = new HashMap<>();

			@Override
			public R apply(T checkKey) {
			    if (!store.containsKey(checkKey)) {
			        R result = func.apply(this, checkKey);
                    store.put(checkKey, result);
                    return result;
                } else {
			        return store.get(checkKey);
                }
                /**
                 * Java(build 9+181)でcomputeIfAbsentを使うとConcurrentModificationExceptionが発生する。
                 * ConcurrentHashMapを使うとIllegalStateExceptionが発生しやすくなる。
                 */
				//Function<T, R> mapper = key -> func.apply(this, key);
				//R result = store.computeIfAbsent(checkKey, mapper);
				//return result;
			}
		};

		return memoized.apply(input);
	}

	/**
	 * @todo
	 * not working
	 */
	public static <T, R> R callMemoized(Function<T, R> func, T input) {
		BiFunction<Function<T, R>, T, R> bfn
			= (f, arg) -> f.apply(arg);
		
		return callMemoized(bfn, input);
		
//		Function<T, R> memoized = new Function<T, R>() {
//			private final Map<T, R> store = new HashMap<>();
//
//			@Override
//			public R apply(T checkKey) {
//				Function<T, R> mapper = key -> func.apply(key);
//				R result = store.computeIfAbsent(checkKey, mapper);
//				return result;
//			}
//		};
//
//		return memoized.apply(input);
	}
	
}
