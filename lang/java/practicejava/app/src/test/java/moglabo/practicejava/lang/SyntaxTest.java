package moglabo.practicejava.lang;

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
    
}