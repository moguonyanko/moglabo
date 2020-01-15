package test.exercise.lang;

import org.junit.Test;

import java.lang.invoke.MethodHandles;
import java.lang.invoke.VarHandle;

import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;

/**
 * 参考:
 * http://openjdk.java.net/jeps/193
 */
public class TestVarHandle {

    private static class IcCard {
        private long code;

        private IcCard(long code) {
            this.code = code;
        }

        public long getCode() {
            return code;
        }
    }

    private static class IcCardHandler {
        private static VarHandle VF_ICCARD_FIELD_CODE;

        static {
            try {
                VF_ICCARD_FIELD_CODE = MethodHandles.lookup()
                    .in(IcCard.class)
                    .findVarHandle(IcCard.class, "code", long.class);
            } catch (NoSuchFieldException | IllegalAccessException e) {
                e.printStackTrace();
            }
        }

        static VarHandle getIcCardCode() {
            return VF_ICCARD_FIELD_CODE;
        }
    }

    @Test
    public void getValueByMethodHandles() {
        IcCard icCard = new IcCard(100L);

        long expected = 200L;

        // VarHandleはアトミックな操作をサポートするリフレクションということか？
        VarHandle varHandle = IcCardHandler.getIcCardCode();
        // IcCardのcodeがfinalだとUnsupportedOperationExceptionがスローされる。
        varHandle.getAndSet(icCard, 200L);
        long actual = icCard.getCode();

        assertThat(actual, is(expected));
    }
}
