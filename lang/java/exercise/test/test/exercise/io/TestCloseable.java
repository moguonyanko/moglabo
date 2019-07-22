package test.exercise.io;

import org.junit.Test;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.*;

public class TestCloseable {

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

}
