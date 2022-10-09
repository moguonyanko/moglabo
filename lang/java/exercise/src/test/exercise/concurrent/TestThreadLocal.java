package test.exercise.concurrent;

import java.util.Arrays;
import java.util.concurrent.Callable;
import java.util.concurrent.Executors;
import java.util.concurrent.ExecutionException;

import org.junit.Test;
import org.junit.Assert;
import static org.hamcrest.CoreMatchers.*;
import static org.hamcrest.MatcherAssert.*;

/**
 * 参考:
 * https://www.baeldung.com/java-threadlocal
 * https://docs.oracle.com/javase/jp/18/docs/api/java.base/java/lang/ThreadLocal.html#get()
 */
public class TestThreadLocal {
    
    private static class MyIntThread implements Callable<Integer> {
        
        private final ThreadLocal<Integer> local;

        public MyIntThread(int number) {
            this.local = new ThreadLocal<>() {
                @Override
                protected Integer initialValue() {
                    return number;
                }
            };
            // setしてもcall時にgetされる値はnullになってしまう。
            //this.local.set(number);
        }

        @Override
        public Integer call() {
            var number = this.local.get();
            return number;
        }
        
    }
    
    @Test
    public void ThreadLocalから値を取得できる() throws Exception {
        int a = 100, b = 200, c = 300;
        var ta = new MyIntThread(a);
        var tb = new MyIntThread(b);
        var tc = new MyIntThread(c);

        var tasks = Arrays.asList(ta, tb, tc);
        
        try (var executor = Executors.newFixedThreadPool(tasks.size())) {
            var actual = executor.invokeAll(tasks).stream()
                    .mapToInt(f -> {
                        try {
                            var n = f.get();
                            return n;
                        } catch (ExecutionException | InterruptedException e) {
                            throw new IllegalStateException(e);
                        }
                    })
                    .sum();
            assertThat(actual, is(a + b + c));
        } catch (InterruptedException ie) {
            Assert.fail(ie.getMessage());
        }
    }
    
}
