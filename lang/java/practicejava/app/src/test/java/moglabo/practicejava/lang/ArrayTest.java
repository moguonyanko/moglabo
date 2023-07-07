package moglabo.practicejava.lang;

import java.util.Arrays;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class ArrayTest {
    
    /**
     * 参考
     * https://blogs.oracle.com/javamagazine/post/java-array-copy-values-references
     */
    @Test
    void Arrays_copyOfでコピーできる() {
        // ここのsrcはvarで宣言できない。
        int[][] src = {{1}, {2, 3}, {4, 5, 6}};
        // Arrays.copyOfはシャローコピー
        var dest = Arrays.copyOf(src, 3);
        src[2][2] = 100;
        assertSame(src[2], dest[2]);
    }
    
}
