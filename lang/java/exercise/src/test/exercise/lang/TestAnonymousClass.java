package test.exercise.lang;

import org.junit.Test;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.*;

public class TestAnonymousClass {

    private interface A {
        int getValue();
        // FunctionalInterfaceの条件を満たすには宣言する抽象メソッドは1つのみとする。
        //int getV();
        // defaultメソッドは定義してもFunctionalInterfaceの条件を満たせる。
        default String getMessage() {
            return "Interface A";
        }
    }

    private abstract class B {
        int x;
        B() {
            this(0, 0);
        }
        B(int a, int b) {
            this.x = a + b;
        }
        abstract int getValue();
    }

    @Test
    public void createAnonymousInstance() {
        var a = new A() {
            @Override
            public int getValue() {
                return 1;
            }
        };
        assertThat(a.getValue(), is(1));
    }

    @Test
    public void getValueByAnonymousLambda() {
        // ラムダ式の左辺に対してはvarを使用することはできない。
        A a2 = () -> 2;
        assertThat(a2.getValue(), is(2));
    }

    @Test
    public void getValueByAbstractClass() {
        var b = new B() {
            @Override
            int getValue() {
                return 1;
            }
        };
        assertThat(b.getValue(), is(1));

        // ラムダ式に置き換えられるのはFunctionalInterfaceの条件を満たす
        // インターフェースだけ。
        //B b2 = () -> 2;
    }

    @Test
    public void getValueByParamAbstractClass() {
        // 匿名クラスにパラメータを渡して初期化することもできる。
        // インターフェースはコンストラクタを定義できないため
        // 抽象クラスを基底としていなければこの方法は使用できない。
        var b = new B(30, 70) {
            @Override
            int getValue() {
                return this.x;
            }
        };
        assertThat(b.getValue(), is(100));
    }

}
