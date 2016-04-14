package exercise.function.util;

import java.util.stream.Collectors;
import java.util.stream.Stream;

public class CheckedStream<T> {

    private final Stream<T> stream;

    public CheckedStream(Stream<T> stream) {
        this.stream = stream;
    }

    /**
     * Stream.mapはチェック例外をスローするメソッドを引数に取ることができない。
     * そこでチェック例外をラップした一時的な非チェック例外を作成する。
     */
    public <R, X extends Exception> CheckedStream<R> map(CheckedFunction<? super T, ? extends R, X> mapper)
            throws X {
        try {
            Stream<R> newStream = stream.map(e -> mapper.apply(e))
                    /**
                     * 終端操作を呼び出さないと例外をcatchできない。
                     */
                    .collect(Collectors.<R>toList())
                    .stream();
            
            return new CheckedStream<>(newStream);
        } catch (CheckedExceptionWrapper ex) {
            X x = ex.getRealException();
            throw x;
        }
    }

    public static <T> CheckedStream<T> of(T... values) {
        return new CheckedStream(Stream.of(values));
    }
    
    public Stream<T> unchecked(){
        return stream;
    }

}
