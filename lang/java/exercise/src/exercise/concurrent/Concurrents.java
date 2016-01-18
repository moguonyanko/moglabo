package exercise.concurrent;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;
import java.util.function.Supplier;
import static java.util.stream.Collectors.*;

public class Concurrents {

	public static <T, C extends Collection<T>> C getResults(Collection<Future<T>> src,
		T defaultValue, Supplier<C> supplier) {
		C results = src.stream()
			/**
			 * メソッド参照を使うとFuture.getでスローされる例外が
			 * Function.applyの定義に適合しないためコンパイルエラーになる。
			 *
			 * ExceptionまたはThrowableが型パラメータを受け取れるようになっていれば
			 * Function.applyがチェック例外をスローできるように定義できたのでは
			 * ないだろうか。
			 */
			//.map(Future::get)
			.map(future -> {
				try {
					/**
					 * タイムアウトされたタスクはキャンセルされる。
					 */
					if (!future.isCancelled()) {
						return future.get();
					}
				} catch (InterruptedException | ExecutionException ex) {
					throw new IllegalStateException(ex.getMessage());
				}
				return defaultValue;
			})
			.collect(toCollection(supplier));

		return results;
	}

	public static <T> Set<T> getResultSet(Collection<Future<T>> src,
		T defaultValue) {
		return getResults(src, defaultValue, HashSet::new);
	}

	public static <T> List<T> getResultList(Collection<Future<T>> src,
		T defaultValue) {
		return getResults(src, defaultValue, ArrayList::new);
	}

}
