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

	/**
	 * @todo
	 * メモ化できていない。
	 */
	public static Function<Integer, Integer> memo(final Function<Integer, Integer> fn) {
		class Note{
			private final Map<Integer, Integer> memoNote = new HashMap<>();
			
			private Integer checkout(Integer key, Integer n){
				if(memoNote.containsKey(key)){
					return memoNote.get(key);
				}else{
					Integer v = fn.apply(n);
					memoNote.put(key, v);
					return v;
				}
			}
		}
		
		Note note = new Note();
		
		Function<Integer, Integer> f = (n) -> note.checkout(n, n);
		
		return f;
	}
}
