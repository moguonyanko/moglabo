package moglabo.practicejava.lang;

import java.util.concurrent.Callable;
import java.util.concurrent.Executors;
import java.util.concurrent.ExecutionException;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class ThreadTest {

    private record Sum(int a, int b) implements Callable<Integer> {

        @Override
        public Integer call() {
            return a + b;
        }

    }

    @Test
    void Executorを使用できる() throws InterruptedException, ExecutionException {
        // var executor = Executors.newVirtualThreadPerTaskExecutor();        
        var executor = Executors.newWorkStealingPool();
        var f = executor.submit(new Sum(100, 200));
        assertTrue(300 == f.get()); // assertSameではequalsで比較されるからかfalseになる。
    }

}
