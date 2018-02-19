package test.exercise.lang;

import org.junit.Test;
import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;

public class TestLiteral {

    /**
     * 参考:
     * JavaMagazine36
     */
    @Test
    public void checkPrimitiveDefinition() {
        // 右辺の9999999999をコンパイルはint型として解釈しようとするが、
        // 大きすぎる値であるためコンパイルエラーを出す。
        // long型にキャストしたところでキャスト以前に行われるリテラルの解釈で
        // エラーが出されているためコンパイルエラーを抑えることができない。
        //long l1 = (long)9999999999;
        long l1 = 9999999999L;
        assertThat(l1, is(9999999999L));

        // finalを書かないとs3の宣言がコンパイルエラーになる。
        // s1 + s2の結果がint型として扱われるからである。
        // s1 + s2は未知のint値であるため何もなしにshort型の変数に割り当てることはできない。
        // s1とs2がfinalであれば short s3 = s1 + s2; は short s3 = 30; と記述したのと
        // 同じになるのでコンパイルに成功する。
        final short s1 = 10,
            s2 = 20;
        short s3 = s1 + s2;
        // 右辺の30はint型としてコンパイラに解釈される。30はint型の値として有効なので
        // コンパイルは成功する。さらにshort型の値としても有効なのでshort型の変数に
        // 代入することも問題なくできる。
        short expected = 30;
        assertThat(s3, is(expected));
        // s3はshort型であるためexpectedの値をshort型にキャストしないと
        // テストに失敗する。long型におけるLのようなshort型に対応した接尾辞は存在しない。
        assertThat(s3, is((short)30));

        // s4とs5の宣言にfinalがなくてもshort型へキャストすればコンパイルは成功する。
        // しかしs1 + s2が明らかにshortの範囲を超える場合でもキャストは成功してしまう。
        short s4 = Short.MAX_VALUE,
            s5 = Short.MAX_VALUE;
        short s6 = (short)(s4 + s5);
        assertThat(s6, is((short)-2));

        // float型へのキャストか接尾辞のFが無いとint型と判別されコンパイルエラー。
        float f1 = 1.5F;
        assertThat(f1, is(1.5F));
        assertThat(f1, is((float)1.5));
    }


}
