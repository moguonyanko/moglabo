package test.exercise.lang;

import org.junit.Test;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

// TODO:
// IDEの設定がどこか足りないのかコンパイルエラーになってしまうので
// コメントアウトしている。
//sealed interface Greetable permits JapanGreeter, EnglishGreeter {
interface Greetable {
    String greet();
}

// Greetableがsealedの場合はfinal宣言されていないとコンパイルエラー
final class JapanGreeter implements Greetable {
    public String greet() {
        return "こんにちは";
    }
}

final class EnglishGreeter implements Greetable {
    public String greet() {
        return "Hello";
    }
}

// DummyはGreetableの宣言でpermitsに含まれていないため
// implementsしようとするとコンパイルエラーとなる。
//final class Dummy implements Greetable {
//    public String greet() {
//        return "Dummy";
//    }
//}

public class TestSealed {

    @Test
    public void canMakeSealedInstance() {
        var jg = new JapanGreeter();
        assertThat(jg.greet(), is("こんにちは"));
        var eg = new EnglishGreeter();
        assertThat(eg.greet(), is("Hello"));
    }

}
