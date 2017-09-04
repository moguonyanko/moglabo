package exercise.concurrent.reactive;

import java.util.concurrent.Flow.Processor;
import java.util.concurrent.Flow.Subscription;
import java.util.concurrent.SubmissionPublisher;
import java.util.function.Function;

/**
 * 参考:
 * https://community.oracle.com/docs/DOC-1006738
 * http://www.baeldung.com/java-9-reactive-streams
 */
public class SimpleProcessor<T, R> extends SubmissionPublisher<R>
    implements Processor<T, R> {

    private final Function<? super T, ? extends R> function;
    private Subscription subscription;

    public SimpleProcessor(Function<? super T, ? extends R> function) {
        super();
        this.function = function;
    }

    @Override
    public void onSubscribe(Subscription subscription) {
        this.subscription = subscription;
        subscription.request(1);
    }

    @Override
    public void onNext(T item) {
        R result = function.apply(item);
        submit(result);
        subscription.request(1);
    }

    @Override
    public void onError(Throwable throwable) {
        System.err.println("ERROR: " + throwable.getMessage());
    }

    @Override
    public void onComplete() {
        close();
    }
}
