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
	
	@Test
	public void 文字列群の小文字を大文字に変換する(){
		List<String> toUpperSample = Arrays.asList("apple", "banana", "orange");
		List<String> toUpperExpected = Arrays.asList("APPLE", "BANANA", "ORANGE");
		
		List<String> toUpperActual = Functions.toUpperCases(toUpperSample);
		assertThat(toUpperActual, is(toUpperExpected));
	}
	
}
