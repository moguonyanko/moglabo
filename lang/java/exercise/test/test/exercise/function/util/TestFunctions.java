package test.exercise.function.util;

import java.util.Arrays;
import java.util.List;

import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;

import exercise.function.util.Functions;
public class TestFunctions {

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
	public void オブジェクトのまとめて文字列表現をダンプする() {
		List<String> sample = Arrays.asList("りんご", "バナナ", "みかん");

		try {
			Functions.dump(sample, System.out::println);
		} catch (Exception e) {
			fail(e.getMessage());
		}
	}

}
