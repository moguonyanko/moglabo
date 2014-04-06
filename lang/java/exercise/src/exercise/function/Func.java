package exercise.function;

@FunctionalInterface
public interface Func<T, TResult> {
	TResult call(T arg);
}
