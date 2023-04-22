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
    
}
