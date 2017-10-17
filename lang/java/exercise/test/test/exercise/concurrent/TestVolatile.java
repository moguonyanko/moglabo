package test.exercise.concurrent;

import org.junit.Test;

import java.util.concurrent.*;
import java.util.function.Supplier;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

/**
 * 参考:
 * JavaMagazine Vol.34
 */
public class TestVolatile {

    private static void delay() {
        try {
            int i = ThreadLocalRandom.current().nextInt(1000);
            Thread.sleep(i);
        } catch (InterruptedException e) {
            System.err.println(e.getMessage());
        }
    }

    // volatile修飾子を変数宣言に指定することで，別スレッドからthreadFlag変数が
    // 参照された時にthreadFlag変数が変更された後の値が読み取られることを促せる。
    // つまり「happens-before関係」が作成される。
    private static volatile boolean threadFlag = true;
    // 以下でも問題は発生しなかったが，配列ではなく変更される変数自体がvolatileに
    // なるように宣言した方が安全そうではある。
    //private static volatile boolean[] threadFlag = {true};

    @Test(timeout = 3000)
    public void makeHappensBeforeRelationByVolatile()
        throws ExecutionException, InterruptedException {
        int[] values = {0};
        // ローカル変数にvolatileは指定できない。
        // flagsの変更はsupplierの関数内で見えない可能性がある。
        // 見えなかった時，flags[0]はtrueのままなので無限ループとなり
        // プログラムは終了しなくなる。
        boolean[] flags = {true};
        // flagsはrunner内で変更されるため単純な変数に書き換えることはできない。
        // 「実質的にfinal」ではなくなる。
        //boolean flags = true;

        Runnable runner = () -> {
            delay();
            values[0] = 1000;
            //flags[0] = false;
            threadFlag = false;
        };

        Supplier<Integer> supplier = () -> {
            delay();
            //while(flags[0]);
            while(threadFlag);
            return values[0];
        };

        new Thread(runner).start();
        Future<Integer> f1 = CompletableFuture.supplyAsync(supplier);

        int expected = 1000;
        int actual = f1.get();
        assertThat(actual, is(expected));
    }

    @Test(timeout = 3000)
    public void makeHappensBeforeRelationByCompletableFuture()
        throws ExecutionException, InterruptedException {
        int[] values = {0};
        boolean[] flags = {true};

        Runnable runner = () -> {
            System.out.println("RUNNER");
            delay();
            values[0] = 1000;
            flags[0] = false;
        };

        Executor executor = Executors.newFixedThreadPool(4);

        // CompletableFutureを使って最終的な変数の参照前(before)に
        // 変更が行われている(happen)ことを保証する。
        Future<Integer> f2 = CompletableFuture.runAsync(runner, executor)
            .thenApply((fn) -> {
            System.out.println("APPLIER");
            delay();
            while(flags[0]);
            return values[0];
        });

        int expected = 1000;
        int actual = f2.get();
        assertThat(actual, is(expected));
    }
}
