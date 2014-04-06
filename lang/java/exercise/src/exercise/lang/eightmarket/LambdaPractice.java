package exercise.lang.eightmarket;

import exercise.lang.AccFunc;
import exercise.lang.Func;
import java.util.*;

public class LambdaPractice {

	public static <T> List<T> map(List<T> targets, Func<T, T> fn) {
		List<T> result = new ArrayList<>();

		targets.stream().map((target) -> fn.call(target)).forEach((res) -> {
			result.add(res);
		});

		return result;
	}
	
	public static <T> T reduce(List<T> targets, AccFunc<T, T> fn){
		T acc = null;
		
		for(T target : targets){
			acc = fn.call(target, acc);
		}
		
		return acc;
	}

}
