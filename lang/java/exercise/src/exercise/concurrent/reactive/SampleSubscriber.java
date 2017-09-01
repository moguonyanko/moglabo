package exercise.concurrent.reactive;

import java.util.concurrent.Flow.Subscriber;
import java.util.concurrent.Flow.Subscription;
import java.util.function.Consumer;

/**
 * 参考:
 * https://community.oracle.com/docs/DOC-1006738
 * http://www.baeldung.com/java-9-reactive-streams
 */
public class SampleSubscriber<T> implements Subscriber<T> {

    private Subscription subscription;
    private final Consumer<T> nextHandler;
    private final Consumer<Subscription> completeHandler;
    private final Consumer<Throwable> errorHandler;
    private final long maxRequestSize;
    private long nowRequestCount = 0;

    public SampleSubscriber(Consumer<T> nextHandler,
                            Consumer<Subscription> completeHandler,
                            Consumer<Throwable> errorHandler,
                            long maxRequestSize) {
        this.nextHandler = nextHandler;
        this.completeHandler = completeHandler;
        this.errorHandler = errorHandler;
        this.maxRequestSize = maxRequestSize;
    }

    @Override
    public void onSubscribe(Subscription subscription) {
        this.subscription = subscription;
        System.out.println("Subscribed");
        if (nowRequestCount < maxRequestSize) {
            subscription.request(++nowRequestCount);
        }
    }

    @Override
    public void onNext(T item) {
        nextHandler.accept(item);
        if (nowRequestCount < maxRequestSize) {
            subscription.request(++nowRequestCount);
        }
    }

    @Override
    public void onError(Throwable throwable) {
        errorHandler.accept(throwable);
    }

    @Override
    public void onComplete() {
        completeHandler.accept(subscription);
    }
}
