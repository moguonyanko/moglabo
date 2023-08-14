package moglabo.practicejava.lang;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class ObjectTest {

    private static class MemberSample {

        private final int id;
        private final String name;

        private MemberSample(int id, String name) {
            this.id = id;
            this.name = name;
        }

        /**
         * cloneと異なり未だに引数の型はObjectでないといけない。
         */
        @Override
        public boolean equals(Object other) {
            if (other instanceof MemberSample m) {
                return m.id == id && m.name.equals(name);
            }
            return false;
        }

        @Override
        public int hashCode() {
            return Objects.hash(id, name);
        }
    }

    private record MemberRecord(int id, String name) {

        // Does nothing.
    }

    /**
     * 参考
     * https://blogs.oracle.com/javamagazine/post/java-method-override-annotation
     */
    @Test
    void オブジェクトの重複をSetで排除することができる() {
        // Set.ofは等しいオブジェクトを渡されるとIllegalArgumantExceptionをスローする。
        // すなわちequalsの実装に誤りがなければ実行時に失敗する。
//        var members = Set.of(new MemberSample(0, "Taro"),
//                new MemberSample(0, "Taro"));
        var members = new HashSet(Arrays.asList(new MemberSample(0, "Taro"),
                new MemberSample(0, "Taro")));
        assertTrue(members.stream().count() == 1);

        // レコードでも同様の実行時例外が発生する。すなわち重複を排除してもらうために
        // Set.ofを使うのは適切ではない。逆にいうと重複要素を含むかどうかはSet.ofで
        // 実行時例外が発生するかどうかをチェックすることで判定できる。例外の使い方としては
        // 好ましくないかもしれない。
//        var records = Set.of(new MemberRecord(0, "Taro"),
//                new MemberRecord(0, "Taro"));
        var records = new HashSet(Arrays.asList(new MemberRecord(0, "Taro"),
                new MemberRecord(0, "Taro")));
        assertTrue(records.stream().count() == 1);
    }
}
