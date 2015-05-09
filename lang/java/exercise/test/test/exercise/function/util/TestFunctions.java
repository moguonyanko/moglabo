package test.exercise.function.util;

import java.util.Arrays;
import java.util.List;
import java.util.Collection;

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
	public void 文字列群の大文字を小文字を変換する(){
		List<String> sample = Arrays.asList("APPLE", "BANANA", "ORANGE");
		List<String> expected = Arrays.asList("apple", "banana", "orange");
		List<String> actual = Functions.toLowerCases(sample);
		assertThat(actual, is(expected));
	}
	
	@Test
	public void 文字列群の小文字を大文字に変換する(){
		List<String> sample = Arrays.asList("apple", "banana", "orange");
		List<String> expected = Arrays.asList("APPLE", "BANANA", "ORANGE");
		List<String> actual = Functions.toUpperCases(sample);
		assertThat(actual, is(expected));
	}
	
	@Test
	public void 文字列群から特定の文字列を抽出する(){
		List<String> sample = Arrays.asList("apple", "banana", "orange", "banana");
		String target = "banana";
		Collection<String> expected = Arrays.asList("banana", "banana");
		Collection<String> actual = Functions.extract(sample, target);
		assertThat(actual, is(expected));
	}
	
	@Test
	public void 文字列群から特定の文字列を大文字小文字を無視して1つ取得する(){
		List<String> sample = Arrays.asList("apple", "BANANA", "orange", "banana");
		String target = "banana";
		String expected = "BANANA";
		String actual = Functions.findIgnoreCase(sample, target);
		assertThat(actual, is(expected));
	}
	
	@Test
	public void 文字列群から特定の文字列を大文字小文字を無視して全て取得する(){
		List<String> sample = Arrays.asList("apple", "BANANA", "orange", "banana");
		String target = "banana";
		List<String> expected = Arrays.asList("BANANA", "banana");
		List<String> actual = Functions.findAllIgnoreCase(sample, target);
		assertThat(actual, is(expected));
	}
}
