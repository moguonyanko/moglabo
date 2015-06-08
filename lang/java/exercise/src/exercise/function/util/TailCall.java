package exercise.function.util;

import java.util.stream.Stream;

/**
 * 参考：「Javaによる関数型プログラミング」(オライリー・ジャパン)
 */
@FunctionalInterface
public interface TailCall<T> {

	TailCall<T> apply();

	default boolean isCompelete() {
		return false;
	}

	default T result() {
		throw new IllegalStateException("Can't get result yet.");
	}

	default T invoke() {
		T result = Stream.iterate(this, TailCall::apply)
			.filter(TailCall::isCompelete)
			.findFirst()
			.get()
			.result();
		
		return result;
	}
}
