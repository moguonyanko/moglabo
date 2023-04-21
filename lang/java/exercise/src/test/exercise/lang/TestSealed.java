package test.exercise.lang;

import org.junit.Test;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.*;

/**
 * 参考:
 * https://blogs.oracle.com/javamagazine/post/java-sealed-types-subtypes-final
 */
sealed interface Greetable permits JapanGreeter, EnglishGreeter, UnknownGreeter,
       SealedEnumGreeter, FinalEnumGreeter {
    String greet();
}

/**
 * recordはfinalがなくてもコンパイルエラーにならない。recordは暗黙的にfinalである。
 */
record JapanGreeter(String name) implements Greetable {

    @Override
    public String greet() {
        return name + "です。こんにちは";
    }
}

record EnglishGreeter(String name) implements Greetable {

    @Override
    public String greet() {
        return "I am " + name + ", Hello";
    }
}

/**
 * classはsealed、non-sealedあるいはfinalがないとコンパイルエラー
 */
non-sealed class UnknownGreeter implements Greetable {

    @Override
    public String greet() {
        return "?????????";
    }
}

/**
 * UnknownGreeterはnon-sealedなので継承可能。
 */
class SubUnknownGreeter extends UnknownGreeter {

    @Override
    public String greet() {
        return super.greet() + "★★★★★★★★★★★★★★★";
    }
}

/**
 * enumもrecord同様何も付けなくてもコンパイルエラーにならない。
 * クラスボディ({}のこと)を持つenum定数を1つでも含む場合そのenumクラスはsealedになる。
 */
enum SealedEnumGreeter implements Greetable {

    /**
     * 以下の3つの列挙子はSealedEnumGreeterのサブクラスになる。
     */
    FOO{
        @Override
        public String greet() {
            return "FOO!";
        }
    }, 
    BAR{
        @Override
        public String greet() {
            return "BAR!";
        }
    }, 
    BAZ{
        @Override
        public String greet() {
            return "BAZ!";
        }
    };

    @Override
    public String greet() {
        return "SEALED ENUM";
    }
}

/**
 * クラスボディを持つenum定数を1つも含んでいないのでこのenumクラスはfinalになる。
 */
enum FinalEnumGreeter implements Greetable {

    FOO, BAR, BAZ;

    @Override
    public String greet() {
        return "FINAL ENUM";
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
        private final String name = "まさお";

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

/**
 * 参考：
 * https://www.infoq.com/articles/data-oriented-programming-java/?itm_source=infoq&itm_medium=popular_widget&itm_campaign=popular_content_list&itm_content=
 * 
 * CommandOptionの内部が空だとコンパイルエラーになる。
 */
sealed interface CommandOption {
    record Version() implements CommandOption {} 
    record DebugLevel(String level) implements CommandOption {} 
}

enum OperatorEnum {
    ADD(){
        @Override
        int execute(int x, int y) {
            return x + y;
        }
    },
    SUB(){
        @Override
        int execute(int x, int y) {
            return x - y;
        }
    },
    MUL(){
        @Override
        int execute(int x, int y) {
            return x * y;
        }
    },
    DIV(){
        @Override
        int execute(int x, int y) {
            return x / y;
        }
    };
    
    abstract int execute(int x, int y);
}

sealed interface IOpearator<T extends Number> {
    record Add(int x, int y) implements IOpearator {

        @Override
        public Number execute() {
            return this.x + this.y;
        }
    }
    record Sub(int x, int y) implements IOpearator {

        @Override
        public Number execute() {
            return this.x - this.y;
        }
    }
    record Mul(int x, int y) implements IOpearator {

        @Override
        public Number execute() {
            return this.x * this.y;
        }
    }
    record Div(int x, int y) implements IOpearator {

        @Override
        public Number execute() {
            return this.x / this.y;
        }
    }
    
    T execute();
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
        
        System.out.println(new SubUnknownGreeter().greet());
        System.out.println(SealedEnumGreeter.FOO.greet());
        System.out.println(FinalEnumGreeter.FOO.greet());
    }
    
    @Test
    public void recordを含むsealedクラスを使用できる() {
        var version = new CommandOption.DebugLevel("warn"); 
        assertNotNull(version);
        System.out.println(version);
    }

    @Test
    public void enumとsealedを比較できる() {
        // テストする変数がbyte型の範囲に含まれればassertSameで正しく比較できるが、
        // byte型の範囲を超えてしまうと参照が同じでない限り両者は異なるものと判定されてしまう。
        // そのようなミスを避けられるようassertEqualsを使った方が安全である。
        var x = 10; 
        var y = 200;
        
        var adde = OperatorEnum.ADD;
        switch (adde) {
            case ADD -> {
                // パターンマッチングと組み合わせられることを確認するテスト
            }
            case SUB -> {}
            case MUL -> {}
            case DIV -> {}
        }
        assertEquals(210, adde.execute(x, y));
        
        var adds = new IOpearator.Add(x, y);
        // TODO: コンパイルエラーになってしまう。エディタが未対応？
//        var result = switch (adds) {
//            case Add(var x, var y) -> "add";
//            case Sub(var x, var y) -> "sub";
//            case Mul(var x, var y) -> "mul";
//            case Div(var x, var y) -> "div";
//        }
        
        assertEquals(210, adds.execute());
    }
}
