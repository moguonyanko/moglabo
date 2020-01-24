package test.exercise.concurrent;

import java.util.Arrays;
import java.util.Set;
import java.util.concurrent.Callable;
import java.util.concurrent.Executors;
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

}
