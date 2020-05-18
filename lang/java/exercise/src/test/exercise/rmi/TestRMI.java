package test.exercise.rmi;

import org.junit.Test;
import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.is;

import exercise.rmi.IntCalcClient;
import exercise.rmi.RemoteCalculatorException;

/**
 * 参考:
 * https://docs.oracle.com/javase/8/docs/technotes/guides/rmi/hello/hello-world.html
 */
public class TestRMI {

    @Test
    public void canCallRemoteMethod() {
        try {
            var client = new IntCalcClient();
            var expected = 100;
            var actual = client.addInt(35, 65);
            assertThat(actual, is(expected));
        } catch (RemoteCalculatorException e) {
            fail(e.getMessage());
        }
    }

}
