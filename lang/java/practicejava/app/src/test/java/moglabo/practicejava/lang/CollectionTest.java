package moglabo.practicejava.lang;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class CollectionTest {

    /**
     * 参考:
     * https://blogs.oracle.com/javamagazine/post/java-lists-view-unmodifiable-immutable
     */
    @Test
    void リストの要素を変更できる() {
        var arr = new String[]{"A1", "A2"};
        
        var ls = new ArrayList<>();
        ls.add("A1");
        ls.add("A2");
        
        var la = Arrays.asList(arr); // ArrayListが返される。
        var lf = List.of(arr);
        var lc = List.copyOf(ls);
        // unmodifiableListは引数のリストへの変更が反映される。
        var lu = Collections.unmodifiableList(ls);
        
        arr[1] = "A3";
        ls.set(1, "A3");
        
        /**
         * List.ofはImmutableCollectionsのListを返すので変更しようとすると
         * UnsupportedOperationExceptionが発生する。しかしこれはインターフェースの
         * 実装を拒否しているわけであまり良い例ではないだろう。とはいえ変更不可能な
         * リストを求めているならCollections.unmodifiableListではなくList.ofを
         * 使うのが最善ではある。
         */
        //lf.set(1, "A3");
        
        // 上と同様に例外。
        //lc.set(1, "A4");
        //lu.set(1, "A4");

        // laはArrayListなので問題なく変更可能。
        la.set(1, "A3");
                
        System.out.println("la=" + la);
        System.out.println("lf=" + lf);
        System.out.println("lc=" + lc);
        System.out.println("lu=" + lu);        
    }
    
}
