package test.practicejsf.util;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.junit.Test;
import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;

import practicejsf.util.Faces;

public class TestFaces {
	
	@Test
	public void 文字列がnullか空文字になっていることを判定できる(){
		String emptyString = "";
		String nullString = null;
		String string = "Hello";
		
		assertTrue(Faces.isNullOrEmpty(emptyString));
		assertTrue(Faces.isNullOrEmpty(nullString));
		assertFalse(Faces.isNullOrEmpty(string));
	}
	
	@Test
	public void List2つからMap1つを生成できる_既存のキーと値は上書き(){
		List<String> names = Arrays.asList(
			"foo", "bar", "baz", "bar", "foo"
		);
		
		List<Integer> scores = Arrays.asList(
			100, 90, 80, 70, 60, 50, 40
		);
		
		Map<String, Integer> expected = new HashMap<>();
		expected.put("foo", 60);
		expected.put("bar", 70);
		expected.put("baz", 80);
		
		Map<String, Integer> actual = Faces.toMap(names, scores);
		
		assertThat(actual, is(expected));
	}
	
	@Test
	public void List2つからMap1つを生成できる_値の総数がキーの総数より少ない場合はnullで埋める(){
		List<String> names = Arrays.asList(
			"foo", "bar", "baz", "foo", "hoge"
		);
		
		List<Integer> scores = Arrays.asList(
			100, 90
		);
		
		Map<String, Integer> expected = new HashMap<>();
		expected.put("foo", null);
		expected.put("bar", 90);
		expected.put("baz", null);
		expected.put("hoge", null);
		
		Map<String, Integer> actual = Faces.toMap(names, scores);
		
		assertThat(actual, is(expected));
	}
	
	@Test
	public void 指定した集合からランダムな値を取得できる(){
		List<String> src = Arrays.asList("foo", "bar", "baz");
		
		String actual = Faces.getRandomElement(src);
		
		System.out.println(actual);
		
		assertTrue(src.contains(actual));
	}
	
}
