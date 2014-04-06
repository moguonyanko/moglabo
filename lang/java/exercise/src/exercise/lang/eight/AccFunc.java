package exercise.lang.eight;

@FunctionalInterface
public interface AccFunc<T, TResult> {
	TResult call(T arg, T acc);
}
