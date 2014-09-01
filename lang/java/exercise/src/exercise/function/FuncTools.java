package exercise.function;

import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

public class FuncTools {

	public static int fib(int n) {
		if (n <= 2) {
			return 1;
		} else {
			return (FuncTools.fib(n - 1) + FuncTools.fib(n - 2));
		}
	}

	public static Function<Integer, Integer> memo(final Function<Integer, Integer> fn) {
		final Map<Integer, Integer> note = new HashMap<>();
		final Function<Integer, Integer> f = (n) -> note.containsKey(n) ? 
			note.get(n) : note.put(n, fn.apply(n));
		
		return f;
	}
}
