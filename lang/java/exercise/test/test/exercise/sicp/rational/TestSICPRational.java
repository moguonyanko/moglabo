package test.exercise.sicp.rational;

import static org.hamcrest.CoreMatchers.is;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import static org.junit.Assert.*;

import exercise.sicp.rational.Rational;
import exercise.sicp.rational.RationalProcess;

public class TestSICPRational {

	public TestSICPRational() {
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
	public void 有理数の可算() {
		Rational r1 = new Rational(1, 3);
		Rational r2 = new Rational(1, 2);

		Rational actual = RationalProcess.addRat(r1, r2);
		Rational expected = new Rational(5, 6);

		assertThat(actual, is(expected));
	}
}
