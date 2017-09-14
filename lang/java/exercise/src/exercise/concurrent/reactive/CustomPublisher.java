package exercise.concurrent.reactive;

import java.util.List;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.LongStream;

import static java.util.concurrent.Flow.*;

/**
 * 参考:
 * http://javasampleapproach.com/java/java-9-flow-api-example-publisher-and-subscriber
 */
public class CustomPublisher implements Publisher<Integer> {

    private final ExecutorService executor = Executors.newFixedThreadPool(4);
    private static final List<Subscription> SUBSCRIPTIONS = new CopyOnWriteArrayList<>();

    private static final String LOG_FORMAT = "Publisher: [%s] %s%n";

    @Override
    public void subscribe(Subscriber<? super Integer> subscriber) {
        SampleSubscription subscription = new SampleSubscription(subscriber, executor);
        SUBSCRIPTIONS.add(subscription);
        subscriber.onSubscribe(subscription);
    }

    private static class SampleSubscription implements Subscription {

        private final Subscriber<? super Integer> subscriber;
        private final ExecutorService executor;
        private final AtomicInteger value = new AtomicInteger();
        private final AtomicBoolean canceled = new AtomicBoolean();

        private SampleSubscription(Subscriber<? super Integer> subscriber,
                                   ExecutorService executor) {
            this.subscriber = subscriber;
            this.executor = executor;
        }

        @Override
        public void request(long n) {
            if (canceled.get()) {
                return;
            }

            if (n >= 0) {
                publishValues(n);
            } else {
                Throwable t = new IllegalArgumentException("Parameter is negative: " + n);
                executor.execute(() -> subscriber.onError(t));
            }
        }

        private void publishValues(long times) {
            Runnable task = () -> {
                int v = value.incrementAndGet();
                log("Publish: " + v);
                subscriber.onNext(v);
            };
            LongStream.range(0, times).forEach(i -> executor.execute(task));
        }

        @Override
        public void cancel() {
            canceled.set(true);
            SUBSCRIPTIONS.remove(this);
            if (SUBSCRIPTIONS.isEmpty()) {
                shutdown();
            }
        }

        private void shutdown() {
            log("Shutdown executor");
            executor.shutdown();
            CompletableFuture.runAsync(() -> log("Finished shutdown"));
        }
    }

    private static void log(String content) {
        String formattedContent = String.format(LOG_FORMAT,
            Thread.currentThread().getName(),
            content);
        System.out.printf(formattedContent);
    }
}
