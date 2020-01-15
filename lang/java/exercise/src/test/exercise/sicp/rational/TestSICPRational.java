package test.exercise.sicp.rational;

import exercise.sicp.rational.Rational;
import static org.hamcrest.CoreMatchers.is;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import static org.junit.Assert.*;

import exercise.sicp.rational.RationalNumber;
import exercise.sicp.rational.Calculator;
import java.util.function.BiFunction;
import java.util.function.Supplier;

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
		Rational r1 = new RationalNumber(1, 3);
		Rational r2 = new RationalNumber(1, 2);

		BiFunction<Integer, Integer, RationalNumber> bi = 
			(Integer a, Integer b) -> new RationalNumber(a, b);
		Calculator calculator = new Calculator(bi);
		
		Rational actual = calculator.addRat(r1, r2);
		Rational expected = new RationalNumber(5, 6);

		assertThat(actual, is(expected));
	}
}
