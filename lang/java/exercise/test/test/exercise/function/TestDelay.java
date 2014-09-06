package test.exercise.function;

import java.util.function.Function;
import static org.hamcrest.CoreMatchers.is;
import org.junit.After;
import org.junit.AfterClass;
import static org.junit.Assert.assertThat;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;

import exercise.function.Delay;

public class TestDelay {

	public TestDelay() {
	}

	@BeforeClass
	public static void setUpClass() {
	}

	@AfterClass
	public static void tearDownClass() {
	}

	@Before
	public void setUp() {
	}

	@After
	public void tearDown() {
	}

	@Test
	public void delayは遅延評価を行う() {
		Function<Integer, Integer> inc = (x) -> x + 1;
		Delay delay = new Delay(inc);

		int initial = 0;
		
		/* @todo キャストを無くしたい。 */
		int actual = (int)delay.force(initial);
		int expected = 1;

		assertThat(actual, is(expected));
	}

}
