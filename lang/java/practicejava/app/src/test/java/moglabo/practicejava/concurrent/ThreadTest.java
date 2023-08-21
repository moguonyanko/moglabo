package moglabo.practicejava.concurrent;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.BrokenBarrierException;
import java.util.concurrent.Callable;
import java.util.concurrent.CyclicBarrier;
import java.util.concurrent.Executors;
import java.util.concurrent.ExecutionException;
import java.util.logging.Level;
import java.util.logging.Logger;

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

    private static class MyCalc {

        private static final List<Integer> targetValues
                = Collections.synchronizedList(new ArrayList<>());
        private int result;

        private static class Calculator extends Thread {

            private final CyclicBarrier barrier;
            private final int param;

            public Calculator(CyclicBarrier barrier, int param) {
                this.barrier = barrier;
                this.param = param;
            }

            @Override
            public void run() {
                targetValues.add(param * 100);
                try {
                    barrier.await();
                } catch (InterruptedException | BrokenBarrierException ex) {
                    ex.printStackTrace();
                }
            }
        }

        int getResult() {
            return result;
        }

        void execute(List<Integer> values) {
            var partySize = values.size();
            var br = new CyclicBarrier(partySize, () -> {
                result = targetValues.stream().mapToInt(v -> v).sum();
            });
            values.stream().forEach(value -> new Calculator(br, value).start());
        }

    }

    /**
     * 参考
     * https://blogs.oracle.com/javamagazine/post/quiz-yourself-happens-before-thread-synchronization-in-java-with-cyclicbarrier
     * 
     * @todob テストが成功していない。
     */
    @Test
    void CyclicBarrierで並列処理の結果を結合できる() {
        var mc = new MyCalc();
        mc.execute(List.of(1, 2, 3));
        assertEquals(600, mc.getResult());
    }

}
