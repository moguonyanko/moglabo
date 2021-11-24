package test.exercise.concurrent;

import java.util.Set;
import java.util.concurrent.Callable;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.junit.Test;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.*;

public class TestExecutor {

    private static class PowTask<T extends Number> implements Callable<Double> {

        private final T value;

        private PowTask(T value) {
            this.value = value;
        }

        @Override
        public Double call() {
            return Math.pow(value.doubleValue(), 2d);
        }
    }

    @Test
    /**
     * 参考:
     * JavaMagazine 201912
     */
    public void executeCachedThreadPool() {
        var s = Stream.of(
            new PowTask<>(3L),
            new PowTask<>(4d),
            new PowTask<>(5f)
        );
        var executor = Executors.newCachedThreadPool();

        var actual = s.sequential()
            .mapToDouble(task -> {
                try {
                    return executor.submit(task).get();
                } catch (Exception e) {
                    throw new RuntimeException(e.getMessage());
                }
            })
            .boxed()
            .collect(Collectors.toSet());

        // Streamはsequentialされているが各スレッドの実行順序は固定ではない。
        // そのためStreamへの追加順序とは異なる順序の結果が得られる可能性もある。
        // Setで比較を行っているのはそのためである。
        var expected = Set.of(9d, 16d, 25d);

        assertThat(actual, is(expected));
    }

    class MyHello implements Runnable {
        @Override
        public void run() {
            System.out.println("Hello, Virtual Thread!");
        }
    }

    @Test
    public void 仮想スレッドを作成できる() {
        var t = Thread.ofVirtual().start(new MyHello());
        assertTrue(t.isVirtual());
    }

    // CallableなタスクはVirtualThreadに渡せない。
    //private class Mul(int x, int y) implements Callable<Integer> {
    private class Mul implements Runnable {
        private final int x;
        private final int y;
        private final AtomicInteger z = new AtomicInteger(0);

        private Mul(int x, int y) {
            this.x = x;
            this.y = y;
        }

        @Override
        public void run() {
            z.set(x * y);
        }

        public int getZ() {
            return z.get();
        }
    }

    @Test
    public void 仮想スレッドを開始できる() {
        var x = 10;
        var y = 20;
        var task = new Mul(x, y);

        var t = Thread.startVirtualThread(task);
        CompletableFuture.runAsync(t)
            .thenAccept(vd -> assertThat(task.getZ(), is(x * y)));
    }

    private record Pow(int x) implements Callable<Integer> {
        @Override
        public Integer call() throws Exception {
            return x * x;
        }
    }

    @Test
    public void 仮想スレッドをExecutorで扱える() {
        var executor = Executors.newVirtualThreadPerTaskExecutor();

        var value = 11;
        var f = executor.submit(new Pow(value));
        try {
            assertThat(f.get(), is(value * value));
        } catch (ExecutionException | InterruptedException e) {
            fail(e.getMessage());
        }
    }
}
