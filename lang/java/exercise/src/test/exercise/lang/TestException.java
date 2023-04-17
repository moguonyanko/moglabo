package test.exercise.lang;

import org.junit.Test;
import static org.junit.Assert.*;

public class TestException {

    private static class FooException extends Exception {
    }

    private static class BarException extends Exception {
    }

    private void checkFoo() throws FooException {
        throw new FooException();
    }

    private void checkBar() throws BarException {
        throw new BarException();
    }

    /**
     * 常に空文字が返される。
     * 参考:
     * https://blogs.oracle.com/javamagazine/post/java-quiz-try-catch-finally-exception
     */
    private String checkMyExceptions() {
        try {
            checkFoo();
            checkBar();
        } catch (FooException fe) {
            // finallyのreturnによりここの例外処理自体は行われるものの結果は無視されてしまう。
            return fe.getClass().getCanonicalName();
        } finally {
            // finallyでreturnしているのでBarExceptionのチェックがなくても
            // コンパイルエラーにならない。例外のチェックが漏れていることについて
            // IDEの警告は出る。
            return "";
        }
    }

    @Test
    public void finallyで終了すると例外がスローされない() {
        assertTrue(checkMyExceptions().isEmpty());
    }

}
