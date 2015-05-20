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
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;
import java.util.logging.Level;
import java.util.logging.Logger;

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

	private class Student {

		private final String name;
		private final int score;

		public Student(String name, int score) {
			this.name = name;
			this.score = score;
		}

		public int scoreDiff(Student other) {
			return score - other.score;
		}

		public int nameDiff(Student other) {
			return name.compareToIgnoreCase(other.name);
		}

		public String getName() {
			return name;
		}

		public int getScore() {
			return score;
		}

		@Override
		public String toString() {
			return name + ":" + score;
		}

		@Override
		public boolean equals(Object obj) {
			if (obj instanceof Student) {
				Student other = (Student) obj;
				return name.equals(other.name) && scoreDiff(other) == 0;
			}

			return false;
		}

		@Override
		public int hashCode() {
			return Objects.hash(name, score);
		}
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
	public void 文字列群の大文字を小文字を変換する() {
		List<String> sample = Arrays.asList("APPLE", "BANANA", "ORANGE");
		List<String> expected = Arrays.asList("apple", "banana", "orange");
		List<String> actual = Functions.toLowerCases(sample);
		assertThat(actual, is(expected));
	}

	@Test
	public void 文字列群の小文字を大文字に変換する() {
		List<String> sample = Arrays.asList("apple", "banana", "orange");
		List<String> expected = Arrays.asList("APPLE", "BANANA", "ORANGE");
		List<String> actual = Functions.toUpperCases(sample);
		assertThat(actual, is(expected));
	}

	@Test
	public void 文字列群から特定の文字列を抽出する() {
		List<String> sample = Arrays.asList("apple", "banana", "orange", "banana");
		String target = "banana";
		Collection<String> expected = Arrays.asList("banana", "banana");
		Collection<String> actual = Functions.extract(sample, target);
		assertThat(actual, is(expected));
	}

	@Test
	public void 文字列群から特定の文字列を大文字小文字を無視して1つ取得する() {
		List<String> sample = Arrays.asList("apple", "BANANA", "orange", "banana");
		String target = "banana";
		String expected = "BANANA";
		String actual = Functions.findIgnoreCase(sample, target);
		assertThat(actual, is(expected));
	}

	@Test
	public void 文字列群から特定の文字列を大文字小文字を無視して全て取得する() {
		List<String> sample = Arrays.asList("apple", "BANANA", "orange", "banana");
		String target = "banana";
		List<String> expected = Arrays.asList("BANANA", "banana");
		List<String> actual = Functions.findAllIgnoreCase(sample, target);
		assertThat(actual, is(expected));
	}

	@Test
	public void 文字列群から最長の文字を取得する() {
		List<String> sample = Arrays.asList("apple", "orange", "grapefruit", "banana");
		String expected = "grapefruit";
		String actual = Functions.maxElement(sample, (String name) -> name.length());
		assertThat(actual, is(expected));
	}

	@Test
	public void 文字列群の各要素を修飾して連結した文字列を得る() {
		List<String> sample = Arrays.asList("apple", "orange", "grapefruit", "banana");
		String separator = ",";
		String expected = "APPLE,ORANGE,GRAPEFRUIT,BANANA";
		String actual = Functions.join(sample, separator, String::toUpperCase);
		assertThat(actual, is(expected));
	}

	@Test
	public void コンパレータを指定してオブジェクトを昇順に並べ替える() {
		Collection<Student> sample = Arrays.asList(
			new Student("Foo", 50),
			new Student("Bar", 90),
			new Student("Baz", 20),
			new Student("Hoge", 70),
			new Student("Fuga", 30)
		);

		Collection<Student> expected = Arrays.asList(
			new Student("Baz", 20),
			new Student("Fuga", 30),
			new Student("Foo", 50),
			new Student("Hoge", 70),
			new Student("Bar", 90)
		);

		Collection<Student> actual = Functions.sorted(sample, Student::scoreDiff);

		assertThat(actual, is(expected));
	}

	@Test
	public void コンパレータを指定してオブジェクトを降順に並べ替える() {
		Collection<Student> sample = Arrays.asList(
			new Student("Foo", 50),
			new Student("Bar", 90),
			new Student("Baz", 20),
			new Student("Hoge", 70),
			new Student("Fuga", 30)
		);

		Collection<Student> expected = Arrays.asList(
			new Student("Bar", 90),
			new Student("Hoge", 70),
			new Student("Foo", 50),
			new Student("Fuga", 30),
			new Student("Baz", 20)
		);

		Collection<Student> actual = Functions.reverseSorted(sample, Student::scoreDiff);

		assertThat(actual, is(expected));
	}

	@Test
	public void 大文字小文字を無視して昇順に並べ替える() {
		Collection<Student> sample = Arrays.asList(
			new Student("Foo", 50),
			new Student("bar", 90),
			new Student("Baz", 20),
			new Student("Hoge", 70),
			new Student("fuga", 30)
		);

		Collection<Student> expected = Arrays.asList(
			new Student("bar", 90),
			new Student("Baz", 20),
			new Student("Foo", 50),
			new Student("fuga", 30),
			new Student("Hoge", 70)
		);

		Collection<Student> actual = Functions.sorted(sample, Student::nameDiff);

		assertThat(actual, is(expected));
	}

	@Test
	public void コンパレータを指定して最小値を持つ要素を得る() {
		Collection<Student> sample = Arrays.asList(
			new Student("Foo", 50),
			new Student("bar", 90),
			new Student("Baz", 20),
			new Student("Hoge", 70),
			new Student("fuga", 30)
		);

		Student expected = new Student("Baz", 20);

		Student actual = Functions.minElement(sample, Student::scoreDiff);

		assertThat(actual, is(expected));
	}

	@Test
	public void コンパレータを指定して最大値を持つ要素を得る() {
		Collection<Student> sample = Arrays.asList(
			new Student("Foo", 50),
			new Student("bar", 90),
			new Student("Baz", 20),
			new Student("Hoge", 70),
			new Student("fuga", 30)
		);

		Student expected = new Student("bar", 90);

		Student actual = Functions.maxElement(sample, Student::scoreDiff);

		assertThat(actual, is(expected));
	}

	@Test
	public void 大文字小文字を無視して昇順に並べ替え文字列が同じだった時は数値で昇順に並べ替える() {
		Collection<Student> sample = Arrays.asList(
			new Student("Foo", 50),
			new Student("bar", 90),
			new Student("bar", 45),
			new Student("Baz", 20),
			new Student("Hoge", 95),
			new Student("Hoge", 70),
			new Student("fuga", 30)
		);

		Collection<Student> expected = Arrays.asList(
			new Student("bar", 45),
			new Student("bar", 90),
			new Student("Baz", 20),
			new Student("Foo", 50),
			new Student("fuga", 30),
			new Student("Hoge", 70),
			new Student("Hoge", 95)
		);

		Collection<Comparator<Student>> comparators = Arrays.asList(
			Student::nameDiff,
			Student::scoreDiff
		);

		Collection<Student> actual = Functions.sorted(sample, comparators, ArrayList::new);

		assertThat(actual, is(expected));
	}

	@Test
	public void 数値毎にグループ化する() {
		Collection<Student> sample = Arrays.asList(
			new Student("A", 50),
			new Student("B", 50),
			new Student("C", 20),
			new Student("D", 20),
			new Student("E", 30),
			new Student("F", 30),
			new Student("G", 90),
			new Student("H", 20),
			new Student("I", 90),
			new Student("J", 30)
		);

		Map<Integer, List<Student>> expected = new HashMap<>();
		expected.put(50, Arrays.asList(
			new Student("A", 50),
			new Student("B", 50)
		));
		expected.put(20, Arrays.asList(
			new Student("C", 20),
			new Student("D", 20),
			new Student("H", 20)
		));
		expected.put(30, Arrays.asList(
			new Student("E", 30),
			new Student("F", 30),
			new Student("J", 30)
		));
		expected.put(90, Arrays.asList(
			new Student("G", 90),
			new Student("I", 90)
		));

		Map<Integer, List<Student>> actual = Functions.groupBy(sample, Student::getScore);

		assertThat(actual, is(expected));
	}

	@Test
	public void 数値毎にグループ化して特定のフィールドだけ得る() {
		Collection<Student> sample = Arrays.asList(
			new Student("A", 50),
			new Student("B", 50),
			new Student("C", 20),
			new Student("D", 20),
			new Student("E", 30),
			new Student("F", 30),
			new Student("G", 90),
			new Student("H", 20),
			new Student("I", 90),
			new Student("J", 30)
		);

		Map<Integer, List<String>> expected = new HashMap<>();
		expected.put(50, Arrays.asList(
			"A", "B"
		));
		expected.put(20, Arrays.asList(
			"C", "D", "H"
		));
		expected.put(30, Arrays.asList(
			"E", "F", "J"
		));
		expected.put(90, Arrays.asList(
			"G", "I"
		));

		Map<Integer, List<String>> actual = Functions.groupBy(sample, Student::getScore, Student::getName);

		assertThat(actual, is(expected));
	}

	@Test
	public void 文字列の一部でグループ化し各グループの最小値を抽出する() {
		Collection<Student> sample = Arrays.asList(
			new Student("Mike", 50),
			new Student("John", 50),
			new Student("Mee", 20),
			new Student("Cate", 30),
			new Student("Ame", 60),
			new Student("Joe", 30),
			new Student("Tole", 80),
			new Student("Hoge", 10),
			new Student("Con", 40),
			new Student("Agl", 30)
		);

		Map<String, Student> expected = new HashMap<>();
		expected.put("A", new Student("Agl", 30));
		expected.put("C", new Student("Cate", 30));
		expected.put("H", new Student("Hoge", 10));
		expected.put("J", new Student("Joe", 30));
		expected.put("M", new Student("Mee", 20));
		expected.put("T", new Student("Tole", 80));

		int upperLimitTestScore = 100;
		/* 縮約時の比較の基点に使うオブジェクト */
		Student defaultStudent = new Student("baseperson", upperLimitTestScore);

		Function<Student, String> classifier = student -> student.getName().substring(0, 1);
		Map<String, Student> actual = Functions.minGroupBy(sample, classifier, Student::scoreDiff, defaultStudent);

		assertThat(actual, is(expected));
	}

	@Test
	public void パスの一覧を表示する() {
		Path sample = Paths.get(".");

		try {
			Functions.comsumePath(sample, System.out::println);
		} catch (IOException exception) {
			fail(exception.getMessage());
		}
	}

	@Test
	public void 条件を満たすパスだけ取得する() {
		Path sample = Paths.get(".");

		try {
			Collection<Path> actual = Functions.collectPaths(sample, Files::isReadable);
			assertTrue(actual.size() > 0);
		} catch (IOException ex) {
			fail(ex.getMessage());
		}
	}

	@Test
	public void 指定したパス以下で条件を満たすファイルを全て取得する() {
		Path startPath = Paths.get(".");

		try {
			Collection<File> actual = Functions.collectFiles(startPath, File::isFile);
			assertTrue(actual.size() > 0);
		} catch (IOException ex) {
			fail(ex.getMessage());
		}
	}
	
}
