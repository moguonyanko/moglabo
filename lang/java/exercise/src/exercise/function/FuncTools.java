package exercise.function;

import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

public class FuncTools {

	/**
	 * @todo
	 * FuncTools.fibが呼び出されたときにNote::getValueされるようにしないと
	 * メモ化の効果が現れない。
	 * @param n
	 * @return 
	 */
	public static int fib(int n) {
		if (n <= 2) {
			return 1;
		} else {
			return (FuncTools.fib(n - 1) + FuncTools.fib(n - 2));
		}
	}

	static class Note {

		private final Map<Integer, Integer> memoNote = new HashMap<>();
		private final Function<Integer, Integer> fn;

		public Note(Function<Integer, Integer> fn) {
			this.fn = fn;
		}

		private Integer getValue(Integer key) {
			if (memoNote.containsKey(key)) {
				return memoNote.get(key);
			} else {
				Integer value = fn.apply(key);
				memoNote.put(key, value);
				return value;
			}
		}
	}

	public static Function<Integer, Integer> memoize(Function<Integer, Integer> fn) {
		Note note = new Note(fn);
		return note::getValue;
	}

}
