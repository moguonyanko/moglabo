package exercise.function;

@FunctionalInterface
public interface Calculator<T, U, R> {
	
	R calc(T t, U u);
	
}
