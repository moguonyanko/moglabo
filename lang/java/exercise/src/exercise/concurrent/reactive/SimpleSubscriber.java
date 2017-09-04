package exercise.concurrent.reactive;

import java.time.LocalDateTime;
import java.util.concurrent.Flow.*;

public class SimpleSubscriber<T> implements Subscriber<T> {

    private Subscription subscription;

    @Override
    public void onSubscribe(Subscription subscription) {
        this.subscription = subscription;
        subscription.request(1);
    }

    @Override
    public void onNext(T item) {
        System.out.println(item);
        subscription.request(1);
    }

    @Override
    public void onError(Throwable throwable) {
        System.err.println(throwable.getMessage());
    }

    @Override
    public void onComplete() {
        System.out.println("Completed: " + LocalDateTime.now());
    }
}