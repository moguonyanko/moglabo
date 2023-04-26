package moglabo.practicejava.lang;

import java.io.BufferedWriter;
import java.io.PrintWriter;
import java.io.Writer;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class SealedTest {

    sealed class Animal permits Cat, Dog {
    }

    final class Cat extends Animal {
    }

    final class Dog extends Animal {
    }

    @Test
    void sealedクラスを使用できる() {
        var cat = new Cat();
        var dog = new Dog();
        assertNotNull(cat);
        assertNotNull(dog);
    }

    private interface ISample {
    }

    private sealed class MySample permits MySubSample {
    }

    private non-sealed class MySubSample extends MySample {
    }

    /**
     * BufferedWriterがfinalクラスではなくサブクラスがISampleを実装している可能性がある
     * ためinstanceofによるチェックがコンパイルエラーにならない。
     */
    private boolean checkISample(BufferedWriter bw) {
        return bw instanceof ISample;
    }

    /**
     * MySampleを継承したMySubSampleがnon-sealedなのでサブクラスが存在し得る。
     * そのサブクラスがISampleを実装する可能性があるので、ここのinstanceofも
     * コンパイルエラーにならない。MySubSampleがfinalクラスならコンパイルエラーになる。
     */
    private boolean checkISamlpe2(MySample ms) {
        return ms instanceof ISample;
    }

    private class ISampleWriter extends BufferedWriter implements ISample {

        public ISampleWriter(Writer out) {
            super(out);
        }

    }
    
    // sealedクラスはpremitsがなくてもコンパイルエラーにならない。
    private abstract sealed class A {
    }

    // final、sealed、non-sealedがないとコンパイルエラーになる。
    private non-sealed class B extends A {
    }

    /**
     * 参考:
     * https://blogs.oracle.com/javamagazine/post/java-quiz-instanceof-sealed-final
     */
    @Test
    void instanceofで型をチェックできる() {
        assertTrue(checkISample(new ISampleWriter(new PrintWriter(System.out))));
        assertFalse(checkISamlpe2(new MySubSample()));
    }

}
