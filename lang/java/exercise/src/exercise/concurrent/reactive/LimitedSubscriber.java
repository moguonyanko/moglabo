package exercise.concurrent.reactive;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.concurrent.Flow.Subscriber;
import java.util.concurrent.Flow.Subscription;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * 参考:
 * https://community.oracle.com/docs/DOC-1006738
 * http://www.baeldung.com/java-9-reactive-streams
 * http://javasampleapproach.com/java/java-9-flow-api-example-publisher-and-subscriber
 */
public class LimitedSubscriber<T, C extends Collection<T>>
    implements Subscriber<T> {

    private final AtomicInteger limitConsume;
    private Subscription subscription;

    public LimitedSubscriber(int limitConsume) {
        this.limitConsume = new AtomicInteger(limitConsume);
    }

    @Override
    public void onSubscribe(Subscription subscription) {
        System.out.println("SUBSCRIBE");
        this.subscription = subscription;
        subscription.request(1);
    }

    @Override
    public void onNext(T item) {
        System.out.println("NEXT: " + item);
        int count = limitConsume.decrementAndGet();
        if (count > 0) {
            subscription.request(1);
        }
    }

    @Override
    public void onError(Throwable throwable) {
        System.err.println("ERROR: " + throwable.getMessage());
    }

    /**
     * TODO: このonCompleteが呼び出されていない。
     */
    @Override
    public void onComplete() {
        System.out.println("COMPLETE: " + LocalDateTime.now());
    }

}
