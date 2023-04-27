package moglabo.practicejava.lang;

import java.util.function.Consumer;
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
    
}
