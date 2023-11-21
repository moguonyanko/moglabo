package moglabo.practicejava.lang;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class ClassTest {
    
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
    
    private record MyId(int value) {
    }
    
    private class MyParent {
        private final MyId id;

        public MyParent(MyId id, MyId defaultId) {
            this.id = id == null ? defaultId : id;
        }

        public final MyId getId() {
            return id;
        }

        @Override
        public String toString() {
            return String.valueOf(id);
        }
    }
    
    /**
     * 参考
     * https://openjdk.org/jeps/447
     */
    private class MyChild extends MyParent {

        public MyChild(String param) {
            //setup(); // インスタンスメソッドなので書けない。
            //parseId(id); // 将来書けるようになるかもしれない。
            //var defaultId = new MyId(0); // これも将来はOKになるかもしれない。
            super(new MyId(parseId(param)), new MyId(0)); // これは現状でもOK。
        }
        
        private void setup() {
            // Does nothing.
        }
        
        private static int parseId(String param) {
            try {
                var id = Integer.parseInt(param);
                return id;
            } catch (NumberFormatException nex) {
                throw new IllegalArgumentException(nex);
            }
        }
        
    }
    
    @Test
    void super呼び出し時にインスタンスを参照しないコードは事前に呼び出せる() {
        var ex = assertThrows(IllegalArgumentException.class, () -> new MyChild("ERROR"));
        System.out.println(ex.getMessage());
    }
}
