package exercise.concurrent.reactive;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.concurrent.Flow.Subscriber;
import java.util.concurrent.Flow.Subscription;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.function.Supplier;
import static java.util.stream.Collectors.*;

/**
 * 参考:
 * https://community.oracle.com/docs/DOC-1006738
 * http://www.baeldung.com/java-9-reactive-streams
 */
public class LimitedSubscriber<T, C extends Collection<T>>
    implements Subscriber<T> {

    private final Supplier<C> supplier;
    private final C consumedElements;
    private final AtomicInteger limitConsume;
    private Subscription subscription;

    public LimitedSubscriber(Supplier<C> supplier, int limitConsume) {
        this.supplier = supplier;
        // onNextでの遅延初期化は『間に合わない』。
        consumedElements = supplier.get();
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
        consumedElements.add(item);
        if (count > 0) {
            subscription.request(1);
        }
    }

    @Override
    public void onError(Throwable throwable) {
        System.err.println("ERROR: " + throwable.getMessage());
    }

    @Override
    public void onComplete() {
        System.out.println("COMPLETE: " + LocalDateTime.now());
    }

    public C getConsumedElements() {
        return consumedElements
            .stream()
            .collect(toCollection(supplier));
    }
}
