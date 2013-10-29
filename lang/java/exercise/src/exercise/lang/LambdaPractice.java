package exercise.lang;

import java.util.*;

public class LambdaPractice {

	public static <T> List<T> map(List<T> targets, Func<T, T> fn) {
		List<T> result = new ArrayList<>();

		targets.stream().map((target) -> fn.call(target)).forEach((res) -> {
			result.add(res);
		});

		return result;
	}
	
	public static <T> T reduce(List<T> targets, Func<T, T> fn){
		T result = null;
		
		for(T target : targets){
			result = fn.call(target);
		}
		
		return result;
	}

}
