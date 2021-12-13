package test.exercise.concurrent;

import exercise.lang.TestOnMain;

import java.lang.reflect.InvocationTargetException;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.junit.Test;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.*;

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
        assertThat(t.isVirtual(), is(true));
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
    public void 仮想スレッドをExecutorで扱える() throws ExecutionException, 
            InterruptedException {
        try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
            var value = 11;
            var f = executor.submit(new Pow(value));
            assertThat(f.get(), is(value * value));
        } 
    }

    @TestOnMain
    @Test
    public void Callableなタスク群と仮想スレッドをExecutorで扱える() throws InterruptedException {
        try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
            // 左辺の方は明示しないとコンパイルエラー。型推論はできない。
            List<Callable<String>> tasks = Arrays.asList(
                () -> "H",
                () -> "E",
                () -> "L",
                () -> "L",
                () -> "O"
            );

            var actual = executor.invokeAll(tasks)
                .stream()
                .map(f -> {
                    try {
                        // Future::getだとどちらのgetを呼び出すのかが不明瞭なためコンパイルエラー。
                        return f.get();
                    } catch (ExecutionException | InterruptedException e) {
                        throw new IllegalStateException(e);
                    }
                })
                .collect(Collectors.joining());

            assertThat(actual, is("HELLO"));
        } 
    }
    
    public static void main(String[] args) throws IllegalAccessException, 
            InvocationTargetException {
        var targetName = "exercise.lang.TestOnMain";
        var obj = new TestExecutor();
        for (var method : TestExecutor.class.getMethods()) {
            for (var annotation : method.getAnnotations()) {
                var annotationName = annotation.toString();
                System.out.println(annotationName);
                if (annotationName.contains(targetName)) {
                    method.invoke(obj);
                }
            }
        }
    }
}
