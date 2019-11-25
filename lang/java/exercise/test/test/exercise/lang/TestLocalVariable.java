package test.exercise.lang;

import java.util.Arrays;
import java.util.function.BiFunction;
import java.util.function.Predicate;
import java.util.stream.Collectors;

import org.junit.Test;
import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;

public class TestLocalVariable {

    @Test
    public void defineLocalVariable() {
        float x = 5.5F;
        var y = 5.5;
        assertThat(x, is((float)y));
    }

    @Test
    public void defineLambdaWithTypeInference() {
        BiFunction<Integer, Integer, Integer> add =
            (x, y) -> x + y;

        int expected = 10;
        int actual = add.apply(3, 7);
        assertThat(actual, is(expected));
    }

    @Test
    public void defineListByLocalVariable() {
        var list = Arrays.asList(1, 2, 3);
        var actual = list.stream().map(i -> i * i).collect(Collectors.toList());
        var expected = Arrays.asList(1, 4, 9);
        assertThat(actual, is(expected));
    }

    @FunctionalInterface
    private interface Adder {
        default int add(int a, int b) {
            return a + b;
        }

        private int getId() {
            return 1;
        }

        int calc(int x, int y);
    }

    /**
     * 参考:
     * https://medium.com/@afinlay/java-11-sneak-peek-local-variable-type-inference-var-extended-to-lambda-expression-parameters-e31e3338f1fe
     */
    @Test
    public void calcWithLocalVariablesInLambda() {
        Adder f1 = (final var x, final var y) -> x + y;

        //Adder f2 = (int x, int y) -> x + y;
        // f2をvarを使って書き換えたコードが以下になる。
        // Java11のコンパイラでは問題の無いコードである。
        //Adder f2 = (var x, var y) -> x + y;
        // varを指定する場合その前にfinalを指定することもできる。
        //Adder f2_1 = (final var x, final var y) -> x + y;
        // 片方のパラメータにだけvarを指定するような記述はコンパイルエラーとなる。
        //Adder f2_2 = (var x, int y) -> x + y;
        //Adder f2_3 = (var x, y) -> x + y;

        int expected = 10;
        int actual1 = f1.calc(1, 9);
        assertThat(actual1, is(expected));
        int actual2 = f1.calc(1, 9);
        assertThat(actual2, is(expected));
    }

    // varは予約された型名であるためインターフェース名前には使用できない。
    // 予約後ではないので変数名などに使用することはできる。
    //private interface var {}

    private static class SampleA {

        private static int ID;
        private String name;

        static {
            var x = 0;
            ID = x;
        }

        {
            var x = this.getClass().getSimpleName();
            this.name = x;
        }

    }

    @Test
    public void getLocalVariablesFromInitBlocks() {
        var s = new SampleA();
        //var s = (SampleA)null; // コンパイルは通るがやるべきでない。
        // varを使う場合は一度に複数の変数を宣言できない(同時に初期化してもダメ)。
        //var t = new SampleA(), u = new SampleA();

        //var a1 = { new SampleA(), new SampleA() }; // NG
        //var a2 = new SampleA[]{ new SampleA(), new SampleA() }; // OK

        assertThat(s.name, is("SampleA"));
        assertThat(SampleA.ID, is(0));
    }

    @Test
    public void canUseVarWithLambdaParameter() {
        // ラムダのパラメータにvarを指定できるようになったことで
        // finalやアノテーションが指定できる。しかし以下の例では
        // 実行時例外になってしまう。
        //Predicate<Integer> even = (@NotNull var i) -> i % 2 == 0;
        // NotNullアノテーションでコンパイルエラーにしたいがエラーにならない。
        //Integer sample = null;
        //even.test(sample);

        // 以下は全部コンパイルエラー
        //Predicate<Integer> even = var i -> i % 2 == 0;
        //Predicate<Integer> even = (var i, j) -> i % 2 == 0;
        //Predicate<Integer> even = (var i, int j) -> i % 2 == 0;

        Predicate<Integer> even = (final var i) -> i % 2 == 0;
        assertFalse(even.test(101));
    }

}
