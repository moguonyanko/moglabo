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
	
	static class MemoFunction {
		private final Map<String, Note> fnHash = new HashMap<>();

		public MemoFunction(String fnName, Note note) {
			fnHash.put(fnName, note);
		}
		
		public Function<Integer, Integer> memo(String fnName){
			return fnHash.get(fnName)::getValue;
		}
		
		public void clear(String fnName){
			fnHash.remove(fnName);
		}
	}

	public static Function<Integer, Integer> memo(Function<Integer, Integer> fn) {
		Note note = new Note(fn);
		String fnName = fn.getClass().getName();
		MemoFunction mf = new MemoFunction(fnName, note);
		
		return mf.memo(fnName);
	}
	
}
