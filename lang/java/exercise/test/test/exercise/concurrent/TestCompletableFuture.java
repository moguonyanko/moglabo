package test.exercise.concurrent;

import java.io.IOException;
import java.util.concurrent.*;
import java.util.function.Consumer;
import java.util.function.Supplier;
import java.util.stream.Stream;

import org.junit.Test;
import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;

/**
 * 参考サイト:
 * https://community.oracle.com/docs/DOC-995305
 * http://www.baeldung.com/java-completablefuture
 * http://www.deadcoderising.com/java8-writing-asynchronous-code-with-completablefuture/
 * http://www.journaldev.com/13121/java-9-features-with-examples
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

    @Test
    public void Future実行中に例外を処理する() {
        int score = -100;

        CompletableFuture<Integer> future = CompletableFuture.supplyAsync(() -> {
            if (score < 0) {
                throw new IllegalArgumentException("This is illegal score");
            }
            return score;
        }).handle((sc, t) -> sc != null ? sc : 0);

        try {
            int actual = future.get();
            int expected = 0;
            assertThat(actual, is(expected));
        } catch (InterruptedException | ExecutionException ex) {
            fail(ex.getMessage());
        }
    }

    private static class User {

        private final String name;
        private final int age;

        public User(String name, int age) {
            this.name = name;
            this.age = age;
        }

        @Override
        public String toString() {
            return "My name is " + name + ", I am " + age + " years old.";
        }
    }

    @Test
    public void Future実行中の例外を回復する() {
        User user = new User("", 45);

        CompletableFuture<User> f = CompletableFuture.supplyAsync(() -> {
            if (user.name.isEmpty()) {
                throw new IllegalStateException("name cannot empty");
            }
            return user;
        }).exceptionally(ex -> new User("nanasi", user.age));

        CompletableFuture<Void> resultFuture
                = f.thenAcceptAsync(u -> System.out.println(u));

        try {
            resultFuture.get();
        } catch (InterruptedException | ExecutionException ex) {
            fail(ex.getMessage());
        }
    }

    @Test
    public void Futureの完了前に処理を追加する() {
        CompletableFuture<String> f1 = CompletableFuture.supplyAsync(() -> "Hello");
        CompletableFuture<String> f2 = CompletableFuture.supplyAsync(() -> {
            System.out.println("Future 2");
            return "World";
        });
        /**
         * applyToEitherの第1引数に渡したFutureが先に実行される。しかしそのFutureが
         * 返した値を後続のFuture(ここではf1)で参照する術が無い。
         */
        CompletableFuture<String> resultFuture = f1.applyToEither(f2, s -> s);
        try {
            String result = resultFuture.get();
            System.out.println(result);
        } catch (InterruptedException | ExecutionException ex) {
            fail(ex.getMessage());
        }
    }

    @Test
    public void getResultByDelayedCompletableFuture() throws
            ExecutionException, InterruptedException {
        Executor executor = CompletableFuture.delayedExecutor(1L, TimeUnit.SECONDS);
        CompletableFuture<String> future = CompletableFuture.supplyAsync(
                () -> "Hello, World", executor
        );

        String expected = "Hello, World";
        String actual = future.get();
        assertThat(actual, is(expected));
    }

    @Test
    public void useCompletedFuture() {
        int expected = 100;
        CompletableFuture<Integer> f = CompletableFuture.completedFuture(expected);

        System.out.println("is Done?: " + f.isDone());

        int actual = f.join();
        assertThat(actual, is(expected));
    }

    @Test
    public void useCompletableFutureWithExecutor() {
        int expected = 100;
        Supplier<Integer> supplier = () -> {
            System.out.println("supplier:" + Thread.currentThread().getName());
            return expected;
        };
        ExecutorService executor = Executors.newSingleThreadScheduledExecutor();

        CompletableFuture<Integer> f =
            CompletableFuture.supplyAsync(supplier, executor);
        f.thenAccept(actual -> {
            System.out.println("thenAccept:" + Thread.currentThread().getName());
            assertThat(actual, is(expected));
        });

        // main threadを待たせる。
        System.out.println("main:" + Thread.currentThread().getName());
        f.join();

        executor.shutdown();
    }

    @Test
    public void chainOneToOneCompletableFutures() {
        CompletableFuture<Integer> f1 = CompletableFuture.supplyAsync(() -> 2);
        CompletableFuture<Integer> f2 = f1.thenApply(i -> i * i);
        CompletableFuture<Void> f3 = f2.thenAccept(i -> assertThat(i, is(4)));
        CompletableFuture<Void> f4 = f3.thenRun(() -> {
            System.out.println("thenRun:" + Thread.currentThread().getName());
        });
        CompletableFuture<Void> f5 = f4.thenRunAsync(() -> {
            // thenRunAsyncの場合スレッドにForkJoinPoolが使用されている。
            System.out.println("thenRunAsync:" + Thread.currentThread().getName());
        });

        f5.join();
    }

    @Test
    public void composeCompletionStage() {
        CompletableFuture<String> f0 = CompletableFuture.supplyAsync(() -> "TEST:");

        CompletableFuture<String> f1 =
            f0.thenCompose(s -> CompletableFuture.supplyAsync(() -> s + "Hello"));

        String expected = "TEST:Hello";
        String actual = f1.join();
        assertThat(actual, is(expected));
    }

    @Test
    public void combineCompletionStage() {
        CompletableFuture<Integer> f1 = CompletableFuture.supplyAsync(() -> 1);
        CompletableFuture<String> f2 = CompletableFuture.supplyAsync(() -> ":value");
        CompletableFuture<String> f3 = f1.thenCombine(f2,
            (f1Result, f2Result) -> f1Result.toString() + f2Result);

        String expected = "1:value";
        String actual = f3.join();
        assertThat(actual, is(expected));

        // joinされ結果を取得されたCompletableFutureを再利用して
        // 新しいCompletableFutureを作成することができる。
        CompletableFuture<Void> f4 = f3.thenAccept(System.out::println);
        f4.join();
    }

    @Test
    public void acceptEitherCompletionStages() {
        int v1 = 1, v2 = 100;

        CompletableFuture<Integer> lateFuture = CompletableFuture.supplyAsync(() -> v1,
            CompletableFuture.delayedExecutor(150L, TimeUnit.MILLISECONDS));

        CompletableFuture<Integer> earlyFuture = CompletableFuture.supplyAsync(() -> {
            boolean flag = true;
            if (flag) {
                return v2;
            } else {
                throw new RuntimeException("f2 error!");
            }
        }, CompletableFuture.delayedExecutor(50L, TimeUnit.MILLISECONDS));

        CompletableFuture<Void> f = lateFuture.acceptEither(earlyFuture,
            earlierFinishedResult -> {
            // 関数の引数として渡されるのは『より早く完了した』CompletableFutureの結果である。
            // ここではf1よりf2の方が早く処理が完了するのでf2の結果が引数として渡される。
            // CompletableFuture.anyOfと振る舞いは似ている。
            // なお他のCompletableFutureの結果はgetを呼ぶなりして自分で取得する必要がある。
            System.out.println("Is f1 done?: " + lateFuture.isDone());
            System.out.println("Is f2 done?: " + earlyFuture.isDone());
            assertThat(earlierFinishedResult, is(v2));
        });

        f.join();
    }

    @Test
    public void anyOfCompletionStages() {
        // anyOfにCompletableFuture<T>を返すバージョンが存在しないのはAPIの欠陥と思われる。
        CompletableFuture<Object> f = CompletableFuture.anyOf(
            CompletableFuture.supplyAsync(() -> "FOO",
                CompletableFuture.delayedExecutor(150, TimeUnit.MILLISECONDS)),
            CompletableFuture.supplyAsync(() -> "BAR",
                CompletableFuture.delayedExecutor(50, TimeUnit.MILLISECONDS)),
            // allOfの戻り値がCompletableFuture<Object>なので以下のように型の異なる
            // CompletableFutureも混在させることができてしまう。このCompletableFutureが
            // 最も早く完了するとClassCastExceptionが発生する。
            //CompletableFuture.supplyAsync(() -> 100,
            //    CompletableFuture.delayedExecutor(20, TimeUnit.MILLISECONDS)),
            CompletableFuture.supplyAsync(() -> "BAZ",
                CompletableFuture.delayedExecutor(200, TimeUnit.MILLISECONDS))
        );

        String expected = "BAR";
        // 型安全なanyOfがあれば不要なキャスト
        String actual = (String)f.join();
        assertThat(actual, is(expected));
    }

    @Test
    public void allOfCompletionStages() {
        // CompletableFuture.allOfの戻り値はCompletableFuture<Void>なので，
        // allOfの引数もCompletableFuture<Void>など結果が返らないものか，結果を
        // 必要としないCompletableFutureになる。
        CompletableFuture<Void> f = CompletableFuture.allOf(
            CompletableFuture.runAsync(() -> System.out.println("One")),
            CompletableFuture.runAsync(() -> System.out.println(2)),
            CompletableFuture.runAsync(() -> System.out.println(3)),
            CompletableFuture.runAsync(() -> System.out.println("Four"))
        );

        f.join();
    }

}
