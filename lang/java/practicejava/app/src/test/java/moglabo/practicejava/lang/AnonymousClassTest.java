package moglabo.practicejava.lang;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class AnonymousClassTest {
    
    /**
     * 参考
     * https://blogs.oracle.com/javamagazine/post/java-anonymous-inner-class
     */
    static class MyHandler {
        int handle() {
           return 1; 
        }
    }
    
    private static class MyHandlerApp {
        private int main() {
            // MyHandlerがfinalクラスだとコンパイルエラーになる。
            return new MyHandlerApp().doIt(new MyHandler() {
               @Override
               int handle() {
                   return 1000;
               } 
            });
        }
        
        private int doIt(MyHandler handler) {
            return handler.handle();
        }
    }
    
    @Test
    void 無名クラスを用いて継承できる() {
        var actual = new MyHandlerApp().main();
        assertEquals(1000, actual);
    }
    
}
