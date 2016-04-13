package exercise.function.util;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collector;
import java.util.stream.Stream;

public class CarefulStream<T> {

    private final Stream<T> stream;
    private final List<CheckedExceptionWrapper> exceptions = Collections.synchronizedList(new ArrayList<>());

    public CarefulStream(Stream<T> stream) {
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
    public <R> CarefulStream<R> map(CarefulFunction<? super T, ? extends R, ? extends Exception> mapper) {
        Stream<R> s = stream.map(e -> {
            R result = null;

            try {
                result = mapper.apply(e);
            } catch (Exception x) {
                exceptions.add(new CheckedExceptionWrapper(x));
            }

            return result;
        });

        return new CarefulStream(s);
    }

    public <R, A, X extends Exception> R collect(Collector<? super T, A, R> collector)
            throws X {
        if (exceptions.isEmpty()) {
            /**
             * @todo
             * mapを適用し終わっていない要素が存在するにも関わらずcollectが呼び出されてしまう。
             */
            return stream.collect(collector);
        } else {
            /**
             * @todo 
             * 最初にスローされたチェック例外以外は無視してしまっている。
             */
            X x = exceptions.get(0).getRealException();

            /**
             * collectは終端操作なので例外のリストをクリアする。
             * このクラスのオブジェクトがガベージコレクションされるなら必要無いかもしれない。
             */
            exceptions.clear();

            throw x;
        }
    }

}
