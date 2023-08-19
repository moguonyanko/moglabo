package moglabo.practicejava.lang;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class InitializeTest {
    
    private static class MyCar {
        // static初期化子で初期化していればfinalでもコンパイルエラーにならない。
        private static final char code;
        
        static {
            code = '1';
        }
        
        // charの'1'はintに変換されると49になる。
        private transient final char num = '1';
        
        private String getValue() {
            return "[" + code + num + "]";
        }
    }
    
    private static class MyCar2 {
        // char型のzeroはnull文字(半角スペースとは異なる)で初期化される。しかしこれはプラットフォーム依存である。
        private static char zero;
        // '1'はintでは49
        private static final char one = '1';
        
        private String getValue() {
            // ()で囲んで加算することによりcharがintになり計算される。zeroは0になる。
            // oneは49になる。そのため"[49]"が戻り値になる。
            return "[" +  (zero + one) + "]";
            // ()で囲まないとzeroはnull文字で表現される。[ 1]とは異なる値になる。
            //return "[" +  zero + one + "]";
        }
    }
    
    /**
     * 参考
     * https://blogs.oracle.com/javamagazine/post/java-variable-initialize-final
     */
    @Test
    void finalで初期化を強制できる() {
        var car = new MyCar();
        assertEquals(car.getValue(), "[11]");
        
        var car2 = new MyCar2();
        assertEquals(car2.getValue(), "[49]");
    }
}
