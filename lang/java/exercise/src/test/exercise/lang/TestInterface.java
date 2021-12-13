package test.exercise.lang;

import org.junit.Test;
import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;

/**
 * 参考:
 * http://java.boot.by/ocpjd11-upgrade-guide/ch03.html
 */
public class TestInterface {

    // インターフェース宣言にsynchronizedやnativeは指定できない。
    // strictfpは指定できる。
    // JDK17以降strictfpは付与する必要がない。
    @FunctionalInterface
    private /*strictfp*/ interface Calcable<T> {

        // メソッドにsynchronizedやnative、strictfp等を指定することはできない。
        T calc(T x, T y);

    }

    @FunctionalInterface
    private interface ISampleA {

        // 強制的にpublic static
        class ISampleException extends Exception {
            ISampleException(String msg) {
               super(msg);
            }
        }

        void test() throws ISampleException;

    }

    @Test
    public void canDefineInterfaceWithStrictfp() {
        Calcable<Double> c = (x, y) -> x / y;

        var expected = 10d;
        var actual = c.calc(100d, 10d);

        assertThat(actual, is(expected));
    }

    @Test(expected = ISampleA.ISampleException.class)
    public void throwInnerInterfaceException() throws Exception {
        ISampleA sample = () -> {
            throw new ISampleA.ISampleException("Error!");
        };

        sample.test();
    }

    private interface DefaultISample {
        // 暗黙でpublic
        // privateやprotectedは指定できない。
        default int getV() {
            return square(9);
        }

        // staticメソッドも暗黙でpublicになる。パッケージスコープではない！
        // privateも指定可能。protectedは指定できない。
        static String hello() {
            return prefix() + "Hello" + suffix();
        }

        private int square(int v) {
            return v * v;
        }

        private static String prefix() {
            return "*** ";
        }

        private static String suffix() {
            return " !!!";
        }
    }

    private static class CSample {
        // インターフェースの同シグネチャメソッドより優先される。
        public int getV() {
            return 1;
        }

        static String hello() {
            return "こんにちは！";
        }
    }

    private static class CCSample extends CSample implements DefaultISample {

        // 意図的にメソッド名を間違えている。
        // 正しくhelloとしていてもコンパイルエラーにはならない。
        // staticメソッドはオーバーライドされず実装クラスによって変更されることもないので
        // シャドウできてしまう。しかしそれが好ましいわけではない。
        static String helloo() {
            return DefaultISample.hello();
        }

        String doHello() {
            // 混乱を招くのでstaticメソッドはクラス名を明示して呼び出すこと。
            // 以下は悪い例である。CSampleのhelloが呼び出されることが分かりにくい。
            return hello();
        }

    }

    @Test
    public void ignoreDefaultMethod() {
        var cc = new CCSample();

        var expected = 1;
        var actual = cc.getV();

        assertThat(actual, is(expected));
    }

    @Test
    public void callMultiDefinedStaticMethod() {
        var cc = new CCSample();

        var expected = "こんにちは！";
        var actual = cc.doHello();

        assertThat(actual, is(expected));

        System.out.println(CCSample.helloo());
    }

    // 暗黙でstatic
    @FunctionalInterface
    private interface ISampleB {

        String getS();

        //int getI();

        // Objectのpublicメソッドは宣言してもFunctionalInterfaceとしては
        // 有効なままである。逆にこれらしか宣言されていないとエラーになる。
        boolean equals(Object o);

        int hashCode();

        // cloneはprotectedメソッドなので宣言するとFunctionalInterfaceとして
        // 無効になりコンパイルエラーとなる。
        //Object clone();

    }
    
    private @interface DefaultSample {
        
        // @interfaceでなければコンパイルエラーとなる文法である。
        String getName() default "";
        
    }
}
