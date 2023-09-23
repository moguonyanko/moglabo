package moglabo.practicejava.concurrent;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.concurrent.BrokenBarrierException;
import java.util.concurrent.Callable;
import java.util.concurrent.CyclicBarrier;
import java.util.concurrent.Executors;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

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

        private static class Calculator implements Runnable {

            private final CyclicBarrier barrier;
            private final int param;

            public Calculator(CyclicBarrier barrier, int param) {
                this.barrier = barrier;
                this.param = param;
            }

            /**
             * runはthrowsが宣言されていない。すなわちrun内で発生したチェック例外は
             * runの中で責任持って対処せよという設計思想だと思われる。
             */
            @Override
            public void run() {
                targetValues.add(param * 100);
                try {
                    barrier.await();
                } catch (InterruptedException | BrokenBarrierException ex) {
                    // ログを書く以外のことができるだろうか？
                    ex.printStackTrace(System.err);

                    // クリアっぽい処理を行ってみる。
                    targetValues.clear();
                    barrier.reset();
                }
            }
        }

        int getResult() {
            return result;
        }

        void execute(List<Integer> values) throws InterruptedException {
            var partySize = values.size();
            var br = new CyclicBarrier(partySize, () -> {
                result = targetValues.stream().mapToInt(v -> v).sum();
            });

            var threads = new ArrayList<Thread>(partySize);
            values.stream().forEach(value -> {
                var thread = new Thread(new Calculator(br, value));
                threads.add(thread);
                thread.start();
            });

            // チェック例外のために以下の書き方はコンパイルエラーになる。
            // ラムダ導入時にチェック例外を投げないjoinなどが実装されればよかったのではないか？
            // しかしそれをやり始めたら同じようなメソッド追加を他のAPIに対しても大量にやることに
            // なりかねない。
            //threads.forEach(Thread::join);
            // joinしないとresultはゼロのままである。
            for (Thread thread : threads) {
                thread.join();
            }
        }

    }

    /**
     * 参考
     * https://blogs.oracle.com/javamagazine/post/quiz-yourself-happens-before-thread-synchronization-in-java-with-cyclicbarrier
     *
     * @todob テストが成功していない。
     */
    @Test
    void CyclicBarrierで並列処理の結果を結合できる() throws Exception {
        var mc = new MyCalc();
        mc.execute(List.of(1, 2, 3));
        assertEquals(600, mc.getResult());
    }

    @Test
    void 仮想スレッド群をExecutorServiceに渡して結果を得られる() throws InterruptedException {
        try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
            Callable<String> hello = () -> "Hello";
            Callable<String> world = () -> "World";
            var result = executor.invokeAll(List.of(
                    hello, world
            )).stream().map(future -> {
                try {
                    return future.get();
                } catch (InterruptedException | ExecutionException ex) {
                    throw new IllegalStateException(ex);
                }
            }).collect(Collectors.toSet());

            // 結果の順序は保証されないと考えた方が安全だろう。
            // 少なくともExecutorServiceのAPIドキュメントには順序の保証について
            // 何も記述されていない。
            assertTrue(Set.of("Hello", "World").equals(result));
        }
    }
}
