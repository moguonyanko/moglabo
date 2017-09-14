package exercise.concurrent.reactive;

import java.util.Objects;
import java.util.Optional;
import java.util.concurrent.Flow;
import java.util.concurrent.ThreadLocalRandom;
import java.util.concurrent.atomic.AtomicInteger;

import static java.util.concurrent.Flow.*;

/**
 * 参考:
 * http://javasampleapproach.com/java/java-9-flow-api-example-publisher-and-subscriber
 */
public class CustomSubscriber implements Subscriber<Integer> {

    private static final int DEMAND = 3;
    private final String name;
    private Subscription subscription;
    private final AtomicInteger count = new AtomicInteger();

    private static final String LOG_FORMAT = "Subscriber %s: [%s] %s%n";

    public CustomSubscriber(String name) {
        this.name = name;
    }

    @Override
    public void onSubscribe(Subscription subscription) {
        this.subscription = subscription;
        count.set(DEMAND);
        requestValues(DEMAND);
        logInfo("Subscribed");
    }

    private void requestValues(int demand) {
        subscription.request(demand);
        logInfo("Requested new value: " + demand);
    }

    @Override
    public void onNext(Integer item) {
        if (Objects.nonNull(item)) {
            logInfo("Got item: " + item.toString());
            int c = count.decrementAndGet();
            if (c == 0) {
                if (ThreadLocalRandom.current().nextBoolean()) {
                    requestValues(count.updateAndGet(i -> DEMAND));
                } else {
                    count.set(0);
                    subscription.cancel();
                    logInfo("Cancel subscription");
                }
            }
        } else {
            logInfo("Item is null");
        }
    }

    @Override
    public void onError(Throwable throwable) {
        logInfo("Subscriber error: " + throwable.getMessage());
    }

    @Override
    public void onComplete() {
        logInfo("Completed");
    }

    private void logInfo(String content) {
        log(content, name);
    }

    private static void log(String content, String subscriberName) {
        String formattedContent = String.format(LOG_FORMAT,
            subscriberName,
            Thread.currentThread().getName(),
            content);
        System.out.printf(formattedContent);
    }

}
