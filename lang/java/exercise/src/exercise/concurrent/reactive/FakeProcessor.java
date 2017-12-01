package exercise.concurrent.reactive;

import java.util.function.Consumer;
import java.util.function.Function;
import static java.util.concurrent.Flow.*;

/**
 * ProcessorをimplementsせずにProcessorと同じ処理を行わせることを
 * 試みたクラスである。
 *
 * 参考:
 * https://community.oracle.com/docs/DOC-1006738
 */
public class FakeProcessor<T, R> implements Subscriber<T>  {

    private final Function<T, R> function;
    private final Consumer<R> next;
    private final Consumer<Throwable> error;
    private Subscription subscription;

    public FakeProcessor(Function<T, R> function, Consumer<R> next,
                         Consumer<Throwable> error) {
        this.function = function;
        this.next = next;
        this.error = error;
    }

    @Override
    public void onSubscribe(Subscription subscription) {
        this.subscription = subscription;
        this.subscription.request(1);
    }

    @Override
    public void onNext(T item) {
        R result = function.apply(item);
        next.accept(result);
        subscription.request(1);
    }

    @Override
    public void onError(Throwable throwable) {
        error.accept(throwable);
    }

    @Override
    public void onComplete() {
        System.out.println("Completed: " + this.getClass().getName());
    }

}
