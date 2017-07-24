package test.exercise.concurrent;

import java.io.IOException;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.stream.Stream;

import org.junit.Test;
import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;

/**
 * 参考サイト: http://www.baeldung.com/java-completablefuture
 * http://www.deadcoderising.com/java8-writing-asynchronous-code-with-completablefuture/
 */
public class TestCompletableFuture {

    @Test
    public void CompletableFutureで計算結果を得る() {
        int a = 10;
        int b = 20;

        CompletableFuture<Integer> future
                = CompletableFuture.supplyAsync(() -> a + b);

        try {
            int actual = future.get();
            int expected = 30;
            assertThat(actual, is(expected));
        } catch (InterruptedException | ExecutionException e) {
            fail(e.getMessage());
        }
    }

    @Test
    public void 計算を組み合わせて結果を得る() {
        int a = 2;
        int b = 3;

        CompletableFuture<Integer> future1
                = CompletableFuture.supplyAsync(() -> a + b);

        CompletableFuture<Integer> future2
                = future1.thenApply(n -> n * n);

        try {
            int actual = future2.get();
            int expected = 25;
            assertThat(actual, is(expected));
        } catch (InterruptedException | ExecutionException e) {
            fail(e.getMessage());
        }
    }

    @Test
    public void thenComposeでCompletableFutureを合成できる() {
        int a = 2;
        int b = 3;

        CompletableFuture<Integer> future1
                = CompletableFuture.supplyAsync(() -> a + b);
        // 合成するCompletableFutureをthenComposeの外側に宣言することができない。
        // thenComposeは前のFutureの結果を引数に取るFunctionを引数として要求してくるが，
        // supplyAsyncがSupplierしか引数に取れないためである。
        // 以下の例では変数nを参照できるスコープ内に合成するCompletableFutureが
        // 宣言されなければならない。つまりthenComposeの外側には宣言できない。
        CompletableFuture<Integer> composedFuture
                = future1.thenCompose(n -> CompletableFuture.supplyAsync(() -> n * n));

        try {
            int actual = composedFuture.get();
            int expected = 25;
            assertThat(actual, is(expected));
        } catch (InterruptedException | ExecutionException e) {
            fail(e.getMessage());
        }
    }

    @Test
    public void thenCombineでCompletableFutureを合成できる() {
        int a = 3;
        int b = 4;

        CompletableFuture<Integer> f1 = CompletableFuture.supplyAsync(() -> a + b);
        CompletableFuture<Integer> f2 = CompletableFuture.supplyAsync(() -> a * b);
        // thenComposeと異なり第2引数に合成方法を指定することができる。
        CompletableFuture<Integer> f3 = f1.thenCombine(f2, (x, y) -> x + y);

        try {
            int actual = f3.get();
            int expected = 19;
            assertThat(actual, is(expected));
        } catch (InterruptedException | ExecutionException e) {
            fail(e.getMessage());
        }
    }

    @Test
    public void 複数のタスクを非同期で実行できる() {
        int a = 2;
        int b = 3;

        CompletableFuture<Integer> future1
                = CompletableFuture.supplyAsync(() -> a + b);

        CompletableFuture<Integer> future2 = future1.thenApplyAsync(n -> {
            System.out.println("Future 2");
            return n + 20;
        });
        CompletableFuture<Integer> future3 = future2.thenApplyAsync(n -> {
            System.out.println("Future 3");
            return n - 10;
        });

        try {
            int actual = future3.get();
            int expected = 15;
            assertThat(actual, is(expected));
        } catch (InterruptedException | ExecutionException e) {
            fail(e.getMessage());
        }
    }

    @Test
    public void 複数のFutureを並列に実行できる() {
        int a = 2;
        int b = 3;

        CompletableFuture<Integer> future1
                = CompletableFuture.supplyAsync(() -> a + b);
        CompletableFuture<Integer> future2
                = CompletableFuture.supplyAsync(() -> a + 3);
        CompletableFuture<Integer> future3
                = CompletableFuture.supplyAsync(() -> b - 2);

        /**
         * CompletableFuture.allOfはCompletableFuture<Void>を返すため
         * Future.getで計算結果を得ることができない。
         */
        //CompletableFuture<Void> resultFuture
        //        = CompletableFuture.allOf(future1, future2, future3);
        //int actual = resultFuture.get();
        int actual = Stream.of(future1, future2, future3)
                .parallel()
                .map(CompletableFuture::join)
                .reduce(0, (x, y) -> x + y);
        int expected = 11;
        assertThat(actual, is(expected));
    }

    @Test(expected = ExecutionException.class)
    public void Future実行中に例外をスローできる() throws ExecutionException {
        CompletableFuture<String> future = new CompletableFuture<>();
        // 値が返される場合，completeExceptionallyを指定していても例外はスローされない。
        //CompletableFuture<String> future = CompletableFuture.supplyAsync(() -> "Hello world!");
        /**
         * completeExceptionallyの引数にどんな例外オブジェクトを渡しても最終的には
         * ExecutionExceptionがスローされる。チェック例外か非チェック例外かは関係無い。
         */
        future.completeExceptionally(new IllegalStateException("RuntimeException test!"));
        future.completeExceptionally(new IOException("Exception test!"));
        try {
            future.get();
        } catch (InterruptedException ex) {
            fail(ex.getMessage());
        }
    }

}
