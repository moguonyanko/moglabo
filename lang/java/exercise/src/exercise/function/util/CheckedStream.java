package exercise.function.util;

import java.util.List;
import java.util.stream.Collector;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class CheckedStream<T> {

    private final Stream<T> stream;

    public CheckedStream(Stream<T> stream) {
        this.stream = stream;
    }

    /**
     * Throwableを継承したクラスはジェネリッククラスにできない。
     */
    private static class CheckedExceptionWrapper extends RuntimeException {

        private final Exception realException;

        public <X extends Exception> CheckedExceptionWrapper(X realException) {
            this.realException = realException;
        }

        private <X extends Exception> X getRealException() {
            return (X) realException;
        }

    }

    /**
     * Stream.mapはチェック例外をスローするメソッドを引数に取ることができない。
     * そこでチェック例外をラップした一時的な非チェック例外を作成する。
     */
    public <R, X extends Exception> CheckedStream<R> map(CheckedFunction<? super T, ? extends R, X> mapper) 
            throws X {
        Stream<R> s = null;

        try {
            /**
             * 終端操作を呼び出さないと実行時例外を外側のcatch句でcatchできない。
             */
            List<R> tmpStream = stream.map(e -> {
                R result = null;

                try {
                    result = mapper.apply(e);
                } catch (Exception x) {
                    throw new CheckedExceptionWrapper(x);
                }

                return result;
            }).collect(Collectors.toList());

            s = tmpStream.stream();
        } catch (CheckedExceptionWrapper ex) {
            X x = ex.getRealException();
            throw x;
        }

        return new CheckedStream(s);
    }

    public <R, A, X extends Exception> R collect(Collector<? super T, A, R> collector)
            throws X {
        return stream.collect(collector);
    }

    public static <T> CheckedStream<T> of(T... values) {
        return new CheckedStream(Stream.of(values));
    }

}
