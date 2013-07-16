package test.exercise.concurrent;

import exercise.concurrent.GcdTask;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import static org.junit.Assert.*;

public class TestForkJoinPractice {

	public TestForkJoinPractice() {
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
	public void testCompute() {
		int a = 10;
		int b = 5;
		int expResult = 5;
		GcdTask task = new GcdTask(a, b);
		int result = task.calc();
		assertEquals(expResult, result);
	}
}