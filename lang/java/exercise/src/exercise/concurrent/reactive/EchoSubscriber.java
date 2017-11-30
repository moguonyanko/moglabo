package exercise.concurrent.reactive;

import java.util.function.Consumer;
import static java.util.concurrent.Flow.*;

/**
 * 参考:
 * http://www.baeldung.com/java-9-reactive-streams
 */
public class EchoSubscriber<T> implements Subscriber<T> {

    private Subscription subscription;

    private final Consumer<T> nextListener;
    private final Consumer<Throwable> errorListener;

    public EchoSubscriber(Consumer<T> nextListener,
                          Consumer<Throwable> errorListener) {
        this.nextListener = nextListener;
        this.errorListener = errorListener;
    }

    @Override
    public void onSubscribe(Subscription subscription) {
        this.subscription = subscription;
        subscription.request(1);
    }

    @Override
    public void onNext(T item) {
        nextListener.accept(item);
        subscription.request(1);
    }

    @Override
    public void onError(Throwable throwable) {
        errorListener.accept(throwable);
    }

    /**
     * onCompleteの呼び出しは安定しない。
     * 安定させる方法が不明なうちはリソースの解放などをonCompleteで行うのは避ける。
     */
    @Override
    public void onComplete() {
        System.out.println("Completed: " + this.getClass().getName());
    }

}
