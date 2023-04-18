package test.exercise.concurrent;

import java.util.List;

import org.junit.Test;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.*;

public class TestThread {
    
    /**
     * 参考:
     * https://blogs.oracle.com/javamagazine/post/java-quiz-stream-api-side-effects
     */
    private class MyGreeting implements Runnable {
        
        private final String value;

        public MyGreeting(String value) {
            this.value = value;
        }

        @Override
        public void run() {
            /**
             * MyGreetingインスタンスが幾つ存在しても以下のブロックには
             * 一つのスレッドしか存在できないようになる。これにより出力される
             * 文字列の順序が固定される。
             */
            synchronized (MyGreeting.class) {
                System.out.println(value);
            }
        }
        
    }
    
    @Test
    public void classを指定して同期できる() {
        List.of(new MyGreeting("こんにちは"), new MyGreeting("こんばんは"))
                .stream()
                .forEach(mg -> {
                    new Thread(mg).start();
                });
    }
}
