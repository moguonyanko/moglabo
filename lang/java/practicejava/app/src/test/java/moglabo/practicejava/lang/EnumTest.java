package moglabo.practicejava.lang;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class EnumTest {

    /**
     * 参考:
     * https://blogs.oracle.com/javamagazine/post/java-enums-final-abstract-protected-extends
     */
    private enum Shape {
        Polygon {
            @Override
            protected boolean isClose() {
                return true;
            }

        }, Line {
            @Override
            protected boolean isClose() {
                return false;
            }
        };

        /**
         * enumのフィールドにStringBuilderやコレクションなどを使う場合、それらに
         * 含まれる要素は変更可能なので完全に不変なenumだとは言えなくなる。
         */
        private final StringBuilder descriptions = new StringBuilder(this.getName());

        // enumにfinalメソッドを実装できる。
        final String getName() {
            return this.name();
        }

        private StringBuilder appendDesc(String desc) {
            descriptions.append(desc);
            return descriptions;
        }

        abstract protected boolean isClose();

        // equalsなどはオーバーライドできない。
//        @Override
//        public boolean equals(Shape s) {
//            return this == s;
//        }

        @Override
        public String toString() {
            return descriptions.toString();
        }
    }
    
    @Test
    void enumのprotectedメソッドを呼び出す() {
        var s = Shape.Polygon;
        s.appendDesc("Foo").append("bar").append("Baz");
        System.out.println(s);
    }

}
