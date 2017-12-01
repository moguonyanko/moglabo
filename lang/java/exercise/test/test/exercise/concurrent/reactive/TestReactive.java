package test.exercise.concurrent.reactive;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.*;
import java.util.concurrent.Flow.Subscriber;
import java.util.function.Consumer;
import java.util.stream.IntStream;
import java.util.stream.Stream;
import static java.util.concurrent.Flow.*;
import static java.util.stream.Collectors.*;

import org.junit.Test;
import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;

import exercise.concurrent.reactive.*;

/**
 * 参考:
 * https://community.oracle.com/docs/DOC-1006738
 * http://www.baeldung.com/java-9-reactive-streams
 * http://download.java.net/java/jdk9/docs/api/index.html?java/util/concurrent/Flow.html
 * http://javasampleapproach.com/java/java-9-flow-api-example-publisher-and-subscriber
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

    @Test
    public void runWithSimpleProcessor() {
        try (SubmissionPublisher<String> publisher = new SubmissionPublisher<>()) {
            // Processorのcloseを自分で呼び出すとSubscriberの処理中にエラーになる。
            // SubmissionPublisherのcloseではonCompleteを実行しているのみなので，
            // ProcessorのonComplete内でcloseを呼び出していないとcloseし損なうことになる。
            SimpleProcessor<String, String> processor = new SimpleProcessor<>(String::toUpperCase);
            Subscriber<String> subscriber = new SimpleSubscriber<>();
            publisher.subscribe(processor);
            processor.subscribe(subscriber);
            Stream.of("hello".split("¥b")).forEach(publisher::submit);
        }
    }

    @Test
    public void runWithControlledSubscriber() throws Exception {
        CompletableFuture<Void> f1 = CompletableFuture.runAsync(() -> {
            LimitedSubscriber<Integer, List<Integer>> subscriber;

            try (SubmissionPublisher<Integer> publisher = new SubmissionPublisher<>()) {
                int limitConsume = 3;
                subscriber = new LimitedSubscriber<>(limitConsume);
                publisher.subscribe(subscriber);
                IntStream.range(0, 10).forEach(publisher::submit);
            }
        });

        Executor executor = CompletableFuture.delayedExecutor(100L, TimeUnit.MILLISECONDS);
        CompletableFuture<Void> f2 = f1.thenRunAsync(() ->
            System.out.println("FINISHED"), executor);

        f2.get();
    }

    @Test
    public void runWithCustomPublisher()
        throws ExecutionException, InterruptedException {
        CompletableFuture<Void> f1 = CompletableFuture.runAsync(() -> {
            CustomPublisher publisher = new CustomPublisher();
            CustomSubscriber sub1 = new CustomSubscriber("Sub1");
            CustomSubscriber sub2 = new CustomSubscriber("Sub2");
            publisher.subscribe(sub1);
            publisher.subscribe(sub2);
        });

        f1.get();
    }

    @Test
    public void useSimpleConsumerSubscriber() {
        List<Integer> values = new ArrayList<>();
        try (SubmissionPublisher<Integer> publisher = new SubmissionPublisher<>()) {
            // 右辺のダイヤモンド演算子<>が記述されていないと
            // EchoSubscriberのTはObject型になる。
            Subscriber<Integer> subscriber = new EchoSubscriber<>(
                i -> values.add(i),
                System.err::println);
            publisher.subscribe(subscriber);
            IntStream.rangeClosed(1, 10).forEach(publisher::submit);
        }

        CompletableFuture<Void> f = CompletableFuture.runAsync(() -> {
            System.out.println("Finished: useSimpleConsumerSubscriber");
            List<Integer> expected = IntStream.rangeClosed(1, 10)
                                    .mapToObj(i -> Integer.valueOf(i))
                                    .collect(toList());
            assertThat(values, is(expected));
            System.out.println(values);
        });

        f.join();
    }

    @Test
    public void canUseFakeProcessor() {
        List<String> results = new ArrayList<>();
        try (SubmissionPublisher<String> publisher = new SubmissionPublisher<>()) {
            Subscriber<String> subscriber = new FakeProcessor<>(
                s -> s.toUpperCase(),
                s -> results.add(s),
                System.err::println
            );
            publisher.subscribe(subscriber);
            Stream.of("hello".split("")).forEach(publisher::submit);
        }

        String expected = "HELLO";
        String actual = results.stream().collect(joining());
        assertThat(actual, is(expected));
    }

    @Test
    public void canUseRealProcessor() {
        List<Integer> results = new ArrayList<>();
        try (SubmissionPublisher<String> publisher = new SubmissionPublisher<>()) {
            // ProcessorはSubmissionPublisherを継承していたとしても
            // try-with-resources文に記述してはいけない。Processorの処理が
            // 完了する前にcloseされてしまうようである。
            Processor<String, Integer> processor = new RealProcessor<>(
                s -> s.length(),
                System.err::println
            );
            Subscriber<Integer> subscriber = new EchoSubscriber<>(
                i -> results.add(i),
                System.err::println
            );
            // Processorは既存のSubscriberの処理と直交する処理を追加したい時に
            // 便利かもしれない。
            publisher.subscribe(processor);
            processor.subscribe(subscriber);
            Stream.of("AB,CD,EFG,HIJ,K,LM,N".split(",")).forEach(publisher::submit);
            // Processorのcloseは自分で呼び出してはいけない。やはりProcessorの処理が
            // 完了する前にcloseされてしまう。Publisherのcloseは呼び出してもよい。
            // processor.close();
        }

        String expected = "2-2-3-3-1-2-1";
        String actual = results.stream()
            .map(i -> String.valueOf(i))
            .collect(joining("-"));
        assertThat(actual, is(expected));
    }

}
