package exercise.concurrent.reactive;

import java.util.concurrent.SubmissionPublisher;
import java.util.function.Consumer;
import java.util.function.Function;
import static java.util.concurrent.Flow.*;

/**
 * SubmissionPublisherを継承しないとsubscribeを自分で実装する必要が生じる。
 *
 * 参考:
 * https://community.oracle.com/docs/DOC-1006738
 * http://www.baeldung.com/java-9-reactive-streams
 */
public class RealProcessor<T, R> extends SubmissionPublisher<R>
    implements Processor<T, R> {

    private final Function<T, R> function;
    private final Consumer<Throwable> error;
    private Subscription subscription;

    public RealProcessor(Function<T, R> function, Consumer<Throwable> error) {
        super();
        this.function = function;
        this.error = error;
    }

    @Override
    public void onSubscribe(Subscription subscription) {
        this.subscription = subscription;
        this.subscription.request(1);
    }

    @Override
    public void onNext(T item) {
        submit(function.apply(item));
        subscription.request(1);
    }

    @Override
    public void onError(Throwable throwable) {
        error.accept(throwable);
    }

    @Override
    public void onComplete() {
        // このcloseは呼び出されない可能性がある。
        close();
        System.out.println("Completed: " + this.getClass().getName());
    }

}
