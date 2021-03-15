package test.exercise.lang;

import org.junit.Test;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

sealed interface Greetable permits JapanGreeter, EnglishGreeter {
    String greet();
}

// Greetableがsealedの場合はfinal宣言されていないとコンパイルエラー
final record JapanGreeter(String name) implements Greetable {

    public String greet() {
        return name + "です。こんにちは";
    }
}

final record EnglishGreeter(String name) implements Greetable {

    public String greet() {
        return "I am " + name + ", Hello";
    }
}

// DummyはGreetableの宣言でpermitsに含まれていないため
// implementsしようとするとコンパイルエラーとなる。
//final class Dummy implements Greetable {
//    public String greet() {
//        return "Dummy";
//    }
//}

/**
 * sealed Greetableに近い働きをするenumである。
 * ただしJapanGreeterやEnglishGreeterはシングルトンではない。
 * 実装を列挙できる程度に制限したいがシングルトンにはしたくない場合にsealedは有効といえる。
 * またenumではインスタンス生成自体行えないので外部からパラメータを渡して初期化ということも
 * 当然不可能である。
 * enumとsealedのどちらを使うかと考えた場合、将来の拡張性を考慮するならばsealedを
 * 選択する方が安全かもしれない。ただし将来実装するべきクラスが増えた場合はsealedな
 * インターフェースや抽象クラスの変更が必要になってしまう。とはいえpermitsの要素が
 * 増えただけで既存の実装クラスに問題を及ぼすことは考えにくい。
 * 結論を言うとシングルトンを扱う目的以外で複雑な構造を持つenumを記述している箇所は
 * sealedで置換するべきである。
 */
enum GreetableEnum {
    JAPAN{
        private String name = "まさお";

        @Override
        String greet() {
            return this.name + "です。こんにちは";
        }
    },
    ENGLISH{
        private final String name = "Masao";

        @Override
        String greet() {
            return "I am " + this.name + ", Hello";
        }
    };

    // private宣言すると各列挙しないからアクセスできない。
    //final String name;
    abstract String greet();
}

public class TestSealed {

    @Test
    public void canMakeSealedInstance() {
        var jg = new JapanGreeter("まさお");
        assertThat(jg.greet(), is("まさおです。こんにちは"));
        var eg = new EnglishGreeter("Masao");
        assertThat(eg.greet(), is("I am Masao, Hello"));

        System.out.println("----- GreetableEnum sample output -----");
        System.out.println(GreetableEnum.JAPAN.greet());
        System.out.println(GreetableEnum.ENGLISH.greet());
    }

}
