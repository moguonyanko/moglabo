package moglabo.practicejava.lang;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class StringTest {
    
    /**
     * 参考:
     * https://blogs.oracle.com/javamagazine/post/java-text-blocks-variable-length-argument-lists
     */
    @Test
    void 文字列をfotmattedで整形できる() {
        var s = """
                %s
                """;
        s = s.concat("%s").stripIndent();
        var actual = s.formatted("X", "Y").replace("\n", "");
        assertTrue(actual.equals("XY"));
    }
    
}
