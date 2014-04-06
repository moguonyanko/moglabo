package exercise.lang.eight;

@FunctionalInterface
public interface Func<T, TResult> {
	TResult call(T arg);
}
