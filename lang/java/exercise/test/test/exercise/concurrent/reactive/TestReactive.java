package test.exercise.concurrent.reactive;

import java.util.Arrays;
import java.util.concurrent.Flow.*;
import java.util.concurrent.SubmissionPublisher;
import java.util.List;
import java.util.stream.Collectors;

import org.junit.Test;

import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;

import exercise.concurrent.reactive.SampleSubscriber;

/**
 * 参考:
 * https://community.oracle.com/docs/DOC-1006738
 * http://www.baeldung.com/java-9-reactive-streams
 * http://download.java.net/java/jdk9/docs/api/index.html?java/util/concurrent/Flow.html
 */
public class TestReactive {

    @Test
    public void canPublishBySampleSubscriber() {
        List<String> items = List.of("h", "e", "l", "l", "o");

        SubmissionPublisher<String> publisher = new SubmissionPublisher<>();
        /**
         * TODO:
         * onNext, onComplete内にはデバッグで止めることはできるものの
         * 処理が実行されない。
         */
        Subscriber<String> subscriber = new SampleSubscriber<>(
            item -> {
                System.out.println("Got : " + item);
                // 例外をスローしても標準出力に結果が出力されない。
                //throw new IllegalStateException("Exception");
                // 強制的に終了すると最初の文字だけ出力される。
                //System.exit(0);
            },
            subscription -> {
                System.out.println("Completed");
            },
            Throwable::printStackTrace,
            items.size()
        );
        publisher.subscribe(subscriber);

        System.out.println("Try to submit");
        items.forEach(publisher::submit);

        publisher.close();

        //items.stream().map(String::toUpperCase).forEach(System.out::print);
        //publisher.getExecutor().execute(() -> {
        //    System.out.println("Running");
        //});
    }
}