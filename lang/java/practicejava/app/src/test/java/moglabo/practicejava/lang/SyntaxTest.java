package moglabo.practicejava.lang;

import java.util.Arrays;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class SyntaxTest {
    
    @Test
    void テキストブロックで文字列を出力できる() {
        var s = """
                Hello My Text Block
                """;
        
        System.out.println(s);
    }
    
    @Test
    void 定数をswitchに使用できる() {
        var i = 0;
        final var c = 'a';
        
        // intからcharへの暗黙の変換は行われない。
        var result = switch (i) {
            case c -> "Char";
            default -> "Default";
        };
        
        assertSame("Default", result);
    }    
    
    Object getSampeValue() {
        var message = "HelloWorld";
        return message;
    }
    
    /**
     * 参考:
     * https://blogs.oracle.com/javamagazine/post/java-pattern-matching-instanceof-flow-scoping
     */
    @Test
    void instanceofでパターンマッチングできる() {
        // この時点で型推論ができていればinstanceofはコンパイルエラーになる。
        //var message = "Hello";
        Object message = getSampeValue();
        
        if (!(message instanceof String v)) {
            // vは参照できない。
            // if (message instanceof String v) なら参照できる。
            //assertTrue(message.equals(v)); 
            assertFalse(((String)message).isEmpty());
        } 
        
        if (!(message instanceof Number v)) { // String vと同じ変数名でもコンパイルエラーにならない。
            // Does nothing
        }
    }
    
//    private record Student(String name, int age, int score) {
//        
//    }
    
    // JDK21まではプレビュー機能
//    private boolean isMatchRecordStudent(Object o) {
//        return o instanceof Student(String name, int age, int score);
//    }
 
    // switchのパターンマッチはJDK21までプレビュー機能
//    @Test
//    void whenでマッチできる() {
//        var i = 1;
//        
//        var result = switch (i) {
//            case 0 -> "ZERO";
//            case Integer n when n > 0 -> "PLUS";
//            case Integer n when n < 0 -> "MINUS";
//            default -> "Undefined";
//        };
//        
//        assertEquals("PLUS", result);
//    }

}
