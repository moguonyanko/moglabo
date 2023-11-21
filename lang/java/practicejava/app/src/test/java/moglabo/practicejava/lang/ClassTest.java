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
    
    private class MyParent {
        private final int id;

        public MyParent(int id) {
            this.id = id;
        }

        public final int getId() {
            return id;
        }

        @Override
        public String toString() {
            return String.valueOf(id);
        }
    }
    
    private class MyChild extends MyParent {

        public MyChild(String param) {
            //setup(); // インスタンスメソッドなので書けない。
            //parseId(id); // 将来書けるようになるかもしれない。
            super(parseId(param)); // これは現状でもOK。
            //super(id);
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
    void super呼び出し時に静的メソッドは事前に呼び出せる() {
        var ex = assertThrows(IllegalArgumentException.class, () -> new MyChild("ERROR"));
        System.out.println(ex.getMessage());
    }
}
