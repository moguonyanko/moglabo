package test.exercise.stream;

import java.util.Arrays;
import java.util.List;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

import exercise.stream.StreamUtil;

public class TestStreamUtil {
	
	public TestStreamUtil() {
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
	public void sumは合計を計算する(){
		Integer[] src = new Integer[]{1, 2, 3, 4, 5};
		List<Integer> sample = Arrays.asList(src);
		
		int actual = StreamUtil.sum(sample);
		int expected = 15;
		
		assertThat(actual, is(expected));
	}

}
