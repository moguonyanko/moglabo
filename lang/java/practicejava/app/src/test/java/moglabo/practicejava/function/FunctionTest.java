package moglabo.practicejava.function;

import java.util.Arrays;
import java.util.OptionalInt;
import java.util.function.IntFunction;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class FunctionTest {

    /**
     * 参考
     * https://blogs.oracle.com/javamagazine/post/java-functional-interfaces-checked-exceptions
     */
    @FunctionalInterface
    private interface CustomFunction {

        int checkPositive(int x) throws Exception;
    }

    private static class FunctionSample implements
            /*Function<Integer, Integer>*/ CustomFunction {

        /**
         * Functionはthrows句を定義していない。チェック例外をスローしたければ
         * 独自のFunctionInterfaceを実装する必要がある。
         */
//        @Override
//        public Integer apply(Integer x) throws Exception {
//            if (x < 0) {
//                
//            }
//            return x;
//        }
        @Override
        public int checkPositive(int x) throws Exception {
            if (x < 0) {
                throw new Exception("NEGATIVE!");
            }
            return x;
        }

        /**
         * 例外をスローさせたくない場合はOptionalを使えるとのことだが普通にcheckPositiveの
         * 例外を握りつぶすのとどれだけに違いがあるのだろうか？
         * OptionalInt.empty()を返せるので失敗したということを明確にユーザーに伝えやすい。
         * 例外時も適当なint値を返すとしたらどれを選んでいいのか難しい。例えば-999を返した
         * としてそれは正常に処理が行われた結果得られた値なのか例外を示す値なのか区別が付かない。
         * NaNの濫用も避けたい。正常な値と同じ型の値を失敗を通知する目的で使うべきではない。
         * エラーコードと正常な値が混ざるようなものである。仕様として負の値はエラーであると
         * 決めているなら問題はないがそもそも例外が使える状況でエラーコードを使うのはよくない。
         */
        private final IntFunction<OptionalInt> checkPositiveNoException = x -> {
            try {
                return OptionalInt.of(checkPositive(x));
            } catch (Exception e) {
                return OptionalInt.empty();
            }
        };

    }

    @Test
    void 独自のFunctionInterfaceを実装できる() throws Exception {
        var fs = new FunctionSample();
        assertEquals(fs.checkPositive(1), 1);
        var opt = fs.checkPositiveNoException.apply(-1);
        // Optionalが空であれば失敗したことを確信できる。
        assertTrue(opt.isEmpty());
    }

    /**
     * 参考
     * https://blogs.oracle.com/javamagazine/post/java-streams-flatmap-peek
     */
    @Test
    void peekをストリームに挟み込むことができる() {
        int[][] sample = {{1, 2}, {3, 4}, {5, 6}};
        var result = Arrays.stream(sample)
                // peekに渡したラムダに副作用がある場合は結果に影響が出る。
                // peekは引数にConsumerを求めているが戻り値のあるラムダを渡しても
                // コンパイルエラーにはならない。単に戻り値が無視される。
                .peek(value -> Arrays.equals(value, new int[]{3,4}))
                .flatMapToInt(value -> Arrays.stream(value))
                .sum();
        assertEquals(21, result);
    }

}
