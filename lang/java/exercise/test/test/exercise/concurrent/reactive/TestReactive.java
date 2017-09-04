package test.exercise.concurrent.reactive;

import java.util.List;
import java.util.concurrent.*;
import java.util.concurrent.Flow.Subscriber;
import java.util.function.Consumer;
import java.util.stream.IntStream;

import exercise.concurrent.reactive.SimpleSubscriber;
import org.junit.Test;

import exercise.concurrent.reactive.SampleSubscriber;

/**
 * 参考:
 * https://community.oracle.com/docs/DOC-1006738
 * http://www.baeldung.com/java-9-reactive-streams
 * http://download.java.net/java/jdk9/docs/api/index.html?java/util/concurrent/Flow.html
 */
public class TestReactive {

    @Test
    public void canPublishBySampleSubscriber() throws Exception {
        Consumer<List<String>> consumer = items -> {
            try (SubmissionPublisher<String> publisher = new SubmissionPublisher<>()) {
                Subscriber<String> subscriber = new SampleSubscriber<>(
                    item -> System.out.println("Got : " + item),
                    subscription -> System.out.println("Completed"),
                    Throwable::printStackTrace
                );
                publisher.subscribe(subscriber);

                System.out.println("Try to submit");
                items.forEach(publisher::submit);
            }
        };

        CompletableFuture<List<String>> f1 = CompletableFuture.supplyAsync(() ->
            List.of("h", "e", "l", "l", "o"));
        CompletableFuture<Void> f2 = f1.thenAcceptAsync(consumer);


        // 『このメソッドでは』待機する処理をメインスレッドで実行しない限り
        // Flow APIのコードが正常に実行されない。
        // 例: Thread.sleep, CompletableFuture.delayedExecutor
        Executor executor = CompletableFuture.delayedExecutor(100L,
            TimeUnit.MILLISECONDS);
        CompletableFuture<Void> f3 =
            f2.thenRunAsync(() -> System.out.println("Future finished"), executor);
        // 時間を指定してf2の非同期処理完了を待たない場合，f2の処理結果は安定しない。
        //CompletableFuture<Void> f3 = f2.thenRun(() -> System.out.println("Future finished"));
        f3.get();
    }

    @Test
    public void runWithSimpleSubscriber() {
        try (SubmissionPublisher<Integer> publisher = new SubmissionPublisher<>()) {
            Subscriber<Integer> subscriber = new SimpleSubscriber<>();
            publisher.subscribe(subscriber);
            IntStream.range(0, 10).forEach(publisher::submit);
        }

        System.out.println("この行の実行順序は一定しない");
    }
}