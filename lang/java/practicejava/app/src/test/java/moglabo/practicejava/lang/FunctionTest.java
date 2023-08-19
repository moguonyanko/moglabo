package moglabo.practicejava.lang;

import java.util.function.Consumer;
import java.util.function.Function;
import java.util.function.Supplier;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class FunctionTest {
    
    /**
     * 参考:
     * https://blogs.oracle.com/javamagazine/post/java-lambda-nested-functional-interfaces
     */
    @Test
    void SupplierとConsumerを使用できる() {
        Supplier<Consumer<String>> sp = () -> s -> System.out.println(s);
        sp.get().accept("Hello");
    }
    
    private static class MyValue {
        private static Integer counterC = 1;
        private static Integer counterF = 1;
    }
    
    /**
     * 参考
     * https://blogs.oracle.com/javamagazine/post/java-consumer-function-andthen
     */
    @Test
    void andThenでラムダを連結できる() {
        Consumer<Integer> addC = i -> MyValue.counterC += i;
        Consumer<Integer> showC = i -> System.out.print(i);
        Function<Integer, Integer> addF = i -> MyValue.counterF += i;
        Function<Integer, Integer> showF = i -> {
            System.out.println(i);
            return i;
        };
        
        // 標準出力で表示される値は100となる。ConsumerのandThenでは最初のラムダによる
        // 副作用を受けたオブジェクトを後続のラムダが参照しないためである。
        addC.andThen(showC).accept(100);
        // 最初のラムダの副作用自体は反映されるのでcounterCは101になっている。
        assertEquals(101, MyValue.counterC);
        
        // FunctionのandThenでは最初のラムダの影響を受けたオブジェクトが後続のラムダに
        // 参照される。結論としてはラムダに副作用を混ぜると混乱の元を生じかねないので
        // 極力避けるべきということである。
        var result = addF.andThen(showF).apply(100);
        assertEquals(101, result);
    }
    
}
