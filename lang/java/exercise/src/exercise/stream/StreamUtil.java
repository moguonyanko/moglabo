package exercise.stream;

import java.util.Collection;
import java.util.Iterator;
import java.util.function.Predicate;
import java.util.function.Supplier;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;

public class StreamUtil {

    public static int sum(Collection<? extends Number> cols) {
        int result = 0;

        result = cols.stream().map(Number::intValue).reduce(result, Integer::sum);

        return result;
    }

    /**
     * イテレータからストリームを得るにはSpliteratorが必要になる。
     * <p>
     * 参考:
     * http://stackoverflow.com/questions/24511052/java8-iterator-to-stream
     */
    public static <T> Stream<T> stream(Iterator<T> iterator, boolean parallel) {
        Iterable<T> iterable = () -> iterator;
        return StreamSupport.stream(iterable.spliterator(), parallel);
    }

    private static <T, C extends Collection<T>> C collect
        (Stream<T> stream, Supplier<C> supplier) {
            return stream.collect(Collectors.toCollection(supplier));
    }

    public static <T, C extends Collection<T>> C take
        (C source, Predicate<T> predicate, Supplier<C> supplier) {
        return collect(source.stream().takeWhile(predicate), supplier);
    }

    public static <T, C extends Collection<T>> C drop
        (C source, Predicate<T> predicate, Supplier<C> supplier) {
        return collect(source.stream().dropWhile(predicate), supplier);
    }
}
