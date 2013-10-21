package exercise.lang;

@FunctionalInterface
public interface Func<T, TResult> {
	TResult call(T arg);
}
