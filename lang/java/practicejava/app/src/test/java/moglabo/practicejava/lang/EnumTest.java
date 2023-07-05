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

    private enum Direction {
        LEFT, RIGHT, UP, DOWN
    }
    
    /**
     * 参考:
     * https://blogs.oracle.com/javamagazine/post/java-switch-expressions-arrow-break-yield
     */
    @Test
    void enumとアロー式を組み合わせる() {
        var direction = Direction.RIGHT;
        
        // 左辺がなければswitch式とは見なされない。
        // これはswitch文になる。swicth文ではenumを網羅していなくても
        // コンパイルエラーにならない。->を使おうがcaseを使おうがそれは変わらない。
        // ->を使って変わるのはbreakを書かなくても1つのcaseしか実行されなくなる点。
        // switch式であれば網羅していない値があればコンパイルエラーになる。
        switch (direction) {
            case UP -> System.out.println("UP!");
            case DOWN -> System.out.println("UP!");
                // defaultを指定するとコンパイルエラー
//            default:
//                throw new AssertionError();
        }       
    }
    
    /**
     * 参考
     * https://blogs.oracle.com/javamagazine/post/java-enums-extends-interfaces
     */
    private interface IMark {
        String getMark();
    }
    
    private enum Kaomoji implements IMark {
        NICO {
            @Override
            public String getMark() {
                return "(^_^)";
            }
        },
        IKARI {
            @Override
            public String getMark() {
                return "(￣^￣)";
            }
        };
        
        @Override
        public String toString() {
            return getMark();
        }
    }
    
    private enum Kigou implements IMark {
        STAR {
            @Override
            public String toString() {
                return getMark();
            }
        },
        CIRCLE {
            @Override
            public String getMark() {
                return "○";
            }
        };
        
        @Override
        public String getMark() {
            return "★";
        }
    }
    
    @Test
    void enumでインタフェースを実装できる() {
        var actual = "RESULT:" + Kaomoji.NICO + "," + Kigou.STAR + "," + Kigou.CIRCLE;
        System.out.println(actual);
    }
}
