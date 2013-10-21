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

}
