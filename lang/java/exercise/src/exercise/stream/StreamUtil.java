package exercise.stream;

import java.util.Collection;

public class StreamUtil {
	
	public static int sum(Collection<? extends Number> cols){
		int result = 0;
		
		result = cols.stream().map((n) -> n.intValue()).reduce(result, Integer::sum);
		
		return result;
	}
	
}
