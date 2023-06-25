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
    
    /**
     * 参考:
     * https://blogs.oracle.com/javamagazine/post/java-text-block-string-line-separator-hashcode
     */
    @Test
    void 文章をindentで整形できる() {
        var s = """
                こんにちは
                こんばんわ
                𩸽を𠮟る𠮷野家と髙﨑
                """;
        
        s = s.indent(4);
        System.out.println(s);
        
        var s2 = "Hello" + System.lineSeparator() + "World" + System.lineSeparator();
        s2 = s2.indent(4);
        System.out.println(s2);
    }
    
    /**
     * 参考:
     * https://blogs.oracle.com/javamagazine/post/java-text-block-string-indent-whitespace
     */
    @Test
    public void indentで文字列の空白を除去できる() {
        /**
         * テキストブロックは行頭の空白を自動的に削除する。indentと組み合わせると直感と
         * 反する挙動を示す可能性がある。
         */
        var s = """
  A
   \
    \s
     B""";
        System.out.println("---");
        System.out.println(s);
        System.out.println("---");
        
        s = s.indent(-2); // line n1
        s = s.indent(-2); // line n2
        
        System.out.println("---");
        System.out.println(s);
        System.out.println("---");
    }    
    
}
