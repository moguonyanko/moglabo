package exercise.stream;

import java.util.Collection;
import java.util.Iterator;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;

public class StreamUtil {

	public static int sum(Collection<? extends Number> cols) {
		int result = 0;

		result = cols.stream().map((n) -> n.intValue()).reduce(result, Integer::sum);

		return result;
	}

	/**
	 * イテレータからストリームを得るにはSpliteratorが必要になる。
	 * 
	 * 参考:
	 * http://stackoverflow.com/questions/24511052/java8-iterator-to-stream
	 */
	public static <T> Stream<T> stream(Iterator<T> iterator, boolean parallel) {
		Iterable<T> iterable = () -> iterator;
		return StreamSupport.stream(iterable.spliterator(), parallel);
	}

}
