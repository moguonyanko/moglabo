package test.exercise.io;

import java.util.Arrays;

import org.junit.Test;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.*;

public class TestCloseable {

    private static class MyException extends Exception {
        private static final String MESSAGE = "My Exception";

        @Override
        public String getMessage() {
            return MESSAGE;
        }
    }

    private static class MyCloser implements AutoCloseable {
        private boolean closed;

        @Override
        public void close() {
            closed = true;
            System.out.println("MyCloser is closed");
        }

        public boolean isClosed() {
            return closed;
        }

        public void throwEx() throws Exception {
            var me = new MyException();
            var ie = new IllegalStateException("ILLEGAL");
            me.addSuppressed(ie);
            throw me;
        }
    }

    @Test
    public void callCloseMethodWhenReturnOnTheWay() {
        MyCloser closer;
        while (true) {
            try (var mc = new MyCloser()) {
                closer = mc;
                break;
            }
        }
        assertTrue(closer.isClosed());
    }

    @Test
    public void canCloseWithAutoCloseable() {
        // tryの外で宣言してもよい。
        var closer = new MyCloser();
        // tryの外で宣言する場合実質的finalでなければならないので代入はエラー。
        //closer = null;
        try (closer) {
            closer.throwEx();
        } catch (Exception e) {
            // addSuppressed呼び出し元の例外は
            // getSuppressedでは得られない。
            System.out.println(e.getMessage());
            var suppressedExceptions = e.getSuppressed();
            Arrays.asList(suppressedExceptions).stream()
                .map(Throwable::getMessage)
                .forEach(System.out::println);
        }
    }

}
