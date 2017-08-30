package test.exercise.collection;

import org.junit.*;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;

/**
 * 参考:
 * http://www.journaldev.com/13121/java-9-features-with-examples
 */
public class TestCollection {

    /**
     * 以下のテストは不変なコレクションに対して要素を追加するメソッドを呼び出した時に
     * UnsupportedOperationExceptionがスローされることを確認している。
     * しかしputやaddといったメソッドはその名の通り本来は要素が追加されるのが
     * 自然な動作であり，これを実装していながらUnsupportedOperationExceptionを
     * スローするのはインターフェースの実装を事実上拒否しているに等しい。
     * あるインターフェースを実装するならば，そのインターフェースで定義されている振る舞いは
     * クライアントの入力に問題が無い限り提供しなければならない。
     * この問題の原因はオブジェクトの不変性をAPIの内部で制御する仕組みにしてしまったことだが，
     * おそらく旧バージョンとの互換性を取るために現在の形にならざる得なかったものと思われる。
     */

    @Test(expected = UnsupportedOperationException.class)
    public void 不変なMapを生成できる(){
        Map<String, Integer> map = Map.of("foo", 20, "bar", 30);
        map.put("baz", 40);
    }

    @Test(expected = UnsupportedOperationException.class)
    public void 不変なListを生成できる(){
        List<String> list = List.of("foo", "bar", "baz");
        list.add("hoge");
    }

    @Test(expected = UnsupportedOperationException.class)
    public void 不変なSetを生成できる(){
        Set<String> set = Set.of("foo", "bar", "baz");
        set.add("hoge");
    }
}
