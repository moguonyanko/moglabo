package test.exercise.lang;

import org.junit.Test;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.*;

public class TestClone {

    private class A {
        @Override
        public A clone() throws CloneNotSupportedException {
            super.clone();
            return this;
        }
    }

    private class B implements Cloneable {
        @Override
        public B clone() throws CloneNotSupportedException {
            super.clone();
            return this;
        }
    }

    @Test(expected = CloneNotSupportedException.class)
    public void CloneableをimplementsせずにObjectのcloneメソッドを呼び出して例外がスローされる()
        throws CloneNotSupportedException {
        var a = new A();
        assertNotNull(a.clone());
    }

    @Test
    public void CloneableをimplementsしてObjectのcloneメソッドを呼び出せる() {
        var b = new B();
        try {
            assertNotNull(b.clone());
        } catch (CloneNotSupportedException e) {
            fail(e.getMessage());
        }
    }

}
