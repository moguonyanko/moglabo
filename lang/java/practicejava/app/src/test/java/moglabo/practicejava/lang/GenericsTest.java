package moglabo.practicejava.lang;

import java.util.concurrent.Callable;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class GenericsTest {
    
    /**
     * 参考
     * https://blogs.oracle.com/javamagazine/post/java-generic-object-type-erasure
     */
    
    // Stringという名前の型変数が宣言された状態になっている。
    private static class MyRunner<T extends Callable<Integer>, String> {
        // Stringが型変数扱いになってしまうため本来のStringを参照できずコンパイルエラー
        //String s = "MYRUNNER";
        
        int execute(T t) {
            try {
                return t.call();
            } catch (Exception ex) {
                throw new IllegalStateException(ex);
            }
        }
    }
    
    @Test
    void 型変数を宣言したクラスからオブジェクト生成できる() {
        var r = new MyRunner();
        var result = r.execute(() -> 1);
        assertEquals(1, result);
    }
    
}
