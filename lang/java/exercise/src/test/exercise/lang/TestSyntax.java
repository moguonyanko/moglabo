package test.exercise.lang;

import org.junit.Test;
import org.junit.Ignore;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.*;

import exercise.lang.EnumFruits;
import exercise.lang.StaticFruits;
import java.util.Arrays;

// 一部のテストクラスは--enable-previewが指定されないとコンパイルできず、--enable-previewが
// 指定されると他のクラス含めて実行できなくなるのでコメントアウトしている。
public class TestSyntax {

    @Test
    public void 三項演算子の優先度を調べる(){
        boolean expected = false;
        boolean actual = true ? false : true == true ? false: true;

        assertThat(actual, is(expected));
    }

    @Test
    public void enumは定数変数かどうかを調べる(){
        String actual = EnumFruits.APPLE.name();
        String expected = "APPLE";

        assertThat(actual, is(expected));
    }

    @Test
    public void public_static_finalは定数変数かどうかを調べる(){
        String actual = StaticFruits.APPLE;
        String expected = "APPLE";

        assertThat(actual, is(expected));
    }

    /**
     * 参考:
     * https://www.infoq.com/news/2018/03/Java10GAReleased
     */
    @Test
    public void canRunAnonymousClassInstanceMethod() {
        Object obj = new Object() {
            public void runTest() {
                System.out.println("Hello test");
            }
        };
        // 以下のコードはObject型を介してrunTestメソッドを見つけることができないため
        // コンパイルエラーになる。変数objがJava10以降で使用可能であるvarで宣言されて
        // いればコンパイルに成功する。
        //obj.runTest();
    }

    // 参考:
    // JavaMagazine Vol.40
    private static class Calc {
        public static void execute() {
            int i = 0;
            Calc c = new Calc();
            // incを呼び出す前にi++が評価されてその結果がincに渡される。
            // しかしこの行での加算は後置インクリメントであるため「評価前」の
            // 値が用いられる。すなわち 0 + 2 となる。
            System.out.print(i++ + c.inc(i));
            System.out.print(i);
        }
        private int inc(int i) {
            // 引数のiをインクリメントしているが値渡しであるため
            // 呼び出し元のiには影響がない。
            System.out.print(i++);
            return i;
        }
    }

    @Test
    public void checkIncrementSequence() {
        Calc.execute();
    }

    /**
     * 参考:
     * https://openjdk.java.net/jeps/325
     */
    @Test
    public void outputValueWithSwitchExpressions() {
        var x = 10;
        switch (x) {
            case 1 -> System.out.println("A");
            case 10 -> System.out.println("B");
            case 100 -> System.out.println("C");
            default ->  System.out.println("Default");
        }
    }

    @Test
    public void getValueFromSwitchExpressions() {
        var v = 1;
        var actual = switch (v) {
            case 0, 1 -> "Zero or One";
            case 2 -> "Two";
            case 3 -> "Three";
            // caseに続く値の型はswitch式の引数の値の型と一致しなければならない。
            //case 3 < v && v < 10 -> "3 < v < 10";
            default -> {
                System.out.println("Unsupported Value");
                yield "Any";
            }
        };
        var expected = "Zero or One";
        assertThat(actual, is(expected));
    }

    private enum ProgramLang {
        CPP, JAVA, JAVASCRIPT, CSHARP, RUST;
    }

    @Test
    public void getValueWithSwitchStatement() {
        var lang = ProgramLang.RUST;
        // case x -> y と case x: yield y の書式を混ぜるとコンパイルエラー
        var actual = switch(lang) {
            case JAVA:
                // breakではなくyieldでなければコンパイルエラー
                yield "Java";
            case CSHARP:
                yield "C#";
            case JAVASCRIPT, RUST:
                System.out.println("Web lang");
                yield "Web";
            case CPP:
                System.out.println("Complex lang");
                yield "C++";
            default:
                System.out.println("Unsupported lang");
                yield "Unsupported";
        };
        var expected = "Web";
        assertThat(actual, is(expected));
    }

    /**
     * 参考：
     * https://www.vojtechruzicka.com/java-enhanced-switch/
     */
    @Test(expected = NullPointerException.class)
    public void throwNullPointerExceptionWhenGotNullValue() {
        var value = (Integer)null;

        // valueがnullな時点で即例外がスローされる。
        var result = switch (value) {
            case 50 -> "OK";
            case 70 -> "Good";
            case 90 -> "Excellent";
            // defaultが無いとコンパイルエラー
            default -> throw new IllegalArgumentException("Not null");
        };

        System.out.println(result);
    }

    /**
     * 参考:
     * https://blog.codefx.org/java/text-blocks/https://blog.codefx.org/java/text-blocks/
     */
    @Test
    public void canCreateTextBlocks() {
        var s = "test";
        var s2 = """
        This is test
        """;
        System.out.println(s2);
    }

    /**
     * 参考:
     * https://openjdk.java.net/jeps/406
     * @todo
     * IDEの問題で型を指定したswitch式自体がコンパイルが通らない。
     * switch式で変換された型を型変数に束縛することができずコンパイルエラーになる。
     */
//    private <T> T casting(Object o) {
//        return switch (o) {
//            case Number n -> n;
//            case String s -> s;
//            case null, default -> o;
//        };
//    }
//
//    @Test
//    public void switchでパターンマッチングできる() {
//        var n = 123;
//        var result = casting(n);
//        var actual = result.getClass().getTypeName();
//        assertThat(actual, is("Number"));
//    }
    
    /**
     * 参考:
     * https://github.com/hannotify/eleven-crazy-java-things/blob/main/src/main/java/com/github/hannotify/elevencrazyjavathings/number5/Number5CrazyStuffInSwitchStatements.java
     */
    @Test
    public void ビット演算をswitch式に利用できる() {
        var value = 'g';
        
        var result = switch (value) {
            case 'a' -> "Java";
            case 'b' -> "JavaScript";
            case 'c' | 'd' -> "PHP"; // char型なので意図せずビット演算が行われる。
            default -> "undefined";
        };
        
        // ビット演算が適用される型の値をswitchで使うと意図しない結果を招く。
        assertSame("PHP", result);
    }
    
    /**
     * 参考:
     * https://openjdk.org/jeps/433
     */
    private <T> void testMultiPatternLabels(T value) {
        switch (value) {
            case Character c: // パターンラベルその1
            //when c.charValue() > 10:
                if (c.charValue() > 10) {
                    System.out.println("test character over 10:" + value + "!");
                }
                // 複数のパターンラベルを使う場合breakがないとコンパイルエラーになる。
                // 複数回初期化される恐れがあるから？
                break; 
            case Integer i: // パターンラベルその2
                throw new IllegalArgumentException("Invalid arg :" + i.intValue());
            default:
                System.out.println("nothing");
        }
    }
    
    @Test
    public void 複数のパターンラベルを使ったメソッドを呼び出せる() {
        var value = 11;
        testMultiPatternLabels(value);        
    }  

}
