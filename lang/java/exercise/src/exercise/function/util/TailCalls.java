package exercise.function.util;

/**
 * 参考：「Javaによる関数型プログラミング」(オライリー・ジャパン)
 */
public class TailCalls {

	public static <T> TailCall<T> call(TailCall<T> nextCall) {
		return nextCall;
	}

	public static <T> TailCall<T> done(T value) {
		TailCall<T> caller = new TailCall<T>() {

			@Override
			public boolean isCompelete() {
				return true;
			}

			@Override
			public T result() {
				return value;
			}

			@Override
			public TailCall<T> apply() {
				throw new IllegalStateException("Tail call iteration had finished.");
			}
		};

		return caller;
	}
}
