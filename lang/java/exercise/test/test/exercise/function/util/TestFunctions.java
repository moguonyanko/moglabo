package test.exercise.function.util;

import java.util.Arrays;
import java.util.List;
import java.util.Collection;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.function.Predicate;
import java.util.function.Supplier;
import java.util.stream.IntStream;
import java.math.BigInteger;
import java.nio.charset.Charset;
import java.util.function.BiFunction;
import java.util.Random;
import static java.util.stream.Collectors.*;

import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;

import exercise.function.Tower;
import exercise.function.util.Functions;
import exercise.function.util.CarefulFunction;
import exercise.function.util.Memoizer;
import exercise.function.util.Node;
import exercise.function.util.NodeColor;
import exercise.function.util.Grapher;
import exercise.function.util.NthFunction;
import exercise.function.util.Pair;
import exercise.function.util.ParamSupplier;
import exercise.function.util.TailCall;
import exercise.function.util.TailCalls;

/**
 * 参考：
 * 「Javaによる関数型プログラミング」(オライリー・ジャパン)
 * 「アルゴリズムとデータ構造」(SoftbankCreative)
 */
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

	private static class Student {

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

	private static class MiniPrinter {

		private final String value;
		private final String prefix;
		private final String suffix;

		public static class Builder {

			private final String value;
			private String prefix = "";
			private String suffix = "";

			public Builder(String value) {
				this.value = value;
			}

			public Builder prefix(String prefix) {
				this.prefix = prefix;
				return this;
			}

			public Builder suffix(String suffix) {
				this.suffix = suffix;
				return this;
			}

			public MiniPrinter build() {
				return new MiniPrinter(this);
			}

			public String getValue() {
				return value;
			}
		}

		public MiniPrinter(Builder builder) {
			this.value = builder.value;
			this.prefix = builder.prefix;
			this.suffix = builder.suffix;
		}

		@Override
		public String toString() {
			return prefix + value + suffix;
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

	@Test
	public void 条件を満たす要素の数値を合計した整数値を得る() {
		Collection<Student> sample = Arrays.asList(
			new Student("Mike", 50),
			new Student("Mee", 20),
			new Student("Cate", 30),
			new Student("Ame", 60),
			new Student("Con", 40),
			new Student("Agl", 40)
		);

		long expected = 100;
		long actual = Functions.sum(sample, s -> s.getName().charAt(0) == 'A',
			Student::getScore);

		assertThat(actual, is(expected));
	}

	@Test
	public void 複数の関数によって修飾された文字列を得る() {
		String pref = "+++";
		String suff = "---";
		String expected = "+++sample---";

		String actual = Functions.getDecoratedValue(
			new MiniPrinter.Builder("sample"),
			bb -> {
				bb.prefix(pref);
				return bb;
			},
			bb -> {
				bb.suffix(suff);
				return bb;
			}
		).build().toString();

		assertThat(actual, is(expected));
	}

	private static class InvalidStringException extends Exception {

		private final String value;

		public InvalidStringException(String value) {
			super("Invalid string:");
			this.value = value;
		}

		@Override
		public String toString() {
			return getMessage() + value;
		}

	}

	@Test(expected = InvalidStringException.class)
	public void FunctionalInterfaceでチェック例外を送出する() throws InvalidStringException {
		CarefulFunction<String, String, InvalidStringException> upper = s -> {
			if (s == null) {
				throw new InvalidStringException(s);
			}

			return s.toUpperCase();
		};

		upper.apply(null);
	}

	private static class HeavyObject {

		public HeavyObject() {
			try {
				Thread.sleep(1000);
			} catch (InterruptedException ex) {
				System.err.println("Interrupted.");
			}
		}

		@Override
		public String toString() {
			return "Heavy object created.";
		}
	}

	@Test
	public void 必要になるまでオブジェクトの生成を遅延する() {
		class HeavyObjectUser {

			private final String name;
			private final int age;
			/**
			 * Supplierがキャッシュされる。
			 */
			private Supplier<HeavyObject> heavySupplier = () -> createHeavyObject();

			private HeavyObject createHeavyObject() {
				/**
				 * Functions.getDelayCacheSupplier呼び出し以降は
				 * DelayCacheSupplierにキャッシュされたオブジェクトが返される。
				 */
				if (!Functions.DelayCacheSupplier.class.isInstance(heavySupplier)) {
					/* Functions.getDelayCacheSupplierがテスト対象である。 */
					heavySupplier = Functions.getDelayCacheSupplier(HeavyObject::new);
				}

				return heavySupplier.get();
			}

			public HeavyObjectUser(String name, int age) {
				this.name = name;
				this.age = age;
			}

			public int getAge() {
				return age;
			}

			public String getName() {
				return name;
			}

			public HeavyObject getHeavyObject() {
				return heavySupplier.get();
			}
		}

		long timeoutThreshold = 100;
		long startTime = System.currentTimeMillis();

		HeavyObjectUser heavyUser = new HeavyObjectUser("HeavyUser", 50);
		/* 遅延生成が行えていれば以下の2行の結果はすぐに得られる。 */
		System.out.println("Heavy user name:" + heavyUser.getName());
		System.out.println("Heavy user age:" + heavyUser.getAge());

		long checkPointTime = System.currentTimeMillis();
		if (checkPointTime - startTime > timeoutThreshold) {
			fail("HeavyObject timeout! Threshold is " + timeoutThreshold + " ms.");
		}

		/**
		 * HeavyObjectUser::getHeavyObjectを呼び出しHeavyObjectを遅延生成する。
		 * 遅延生成の仕組みが正常に動作して<em>いない<em>時は，
		 * HeavyObjectUser::getHeavyObjectを呼び出さなくてもタイムアウトする。
		 */
		boolean callHeavyInitializer = false;
		if (callHeavyInitializer) {
			System.out.println("Heavy object state:" + heavyUser.getHeavyObject());
		}
	}

	private static class DelayArg {

		private final int arg;

		public DelayArg(int arg) {
			this.arg = arg;
		}

		public int getArg() {
			return arg;
		}
	}

	private static boolean fastPredicate(DelayArg arg) {
		return arg.getArg() > 0;
	}

	private static boolean slowPredicate(DelayArg arg) {
		try {
			Thread.sleep(60000);
		} catch (InterruptedException ex) {
			throw new IllegalThreadStateException(ex.getMessage());
		}

		return arg.getArg() >= 0;
	}

	private static boolean getResult(boolean p1, boolean p2) {
		return p1 && p2;
	}

	@Test(timeout = 3000)
	public void メソッドを遅延評価して実行時間を短縮する() {
		boolean result = Functions.allMatchPredidates(
			(Predicate<DelayArg> p) -> fastPredicate(new DelayArg(-1)),
			/* slowPredicateが評価されたらタイムアウトする。 */
			(Predicate<DelayArg> p) -> slowPredicate(new DelayArg(1))
		);

		System.out.println("Delay predicates result:" + result);
	}

	private int fib(int n) {
		if (n <= 1) {
			return n;
		} else {
			return fib(n - 1) + fib(n - 2);
		}
	}

	private static boolean isPrime(int n) {
		if (n <= 1) {
			return false;
		} else {
			IntStream targetRange = IntStream.rangeClosed(2, (int) Math.sqrt(n));
			return targetRange.noneMatch(div -> n % div == 0);
		}
	}

	private static int primeAfter(int n) {
		int nextNumber = n + 1;

		if (isPrime(nextNumber)) {
			return nextNumber;
		} else {
			return primeAfter(nextNumber);
		}
	}

	@Test
	public void ストリームを遅延評価して値を得る() {
		int startNumber = 1;
		int limitSize = 10;
		Collection<Integer> result = null;

		try {
			result = Functions.collectValues(primeAfter(startNumber - 1),
				TestFunctions::primeAfter,
				limitSize);
		} catch (StackOverflowError error) {
			fail("Fail delay stream operation:" + error.getMessage());
		}

		System.out.println(result);
	}

	private static int factorialNotTCO(int n) {
		if (n == 1) {
			return n;
		} else {
			return n * factorialNotTCO(n - 1);
		}
	}

	private static class Factorial {

		/**
		 * 算術オーバーフローが発生する。
		 */
		private static int calc(int number, int result) {
			if (number == 0) {
				return result;
			} else {
				return calc(number - 1, result * number);
			}
		}

		/**
		 * この書き方はSchemeなどではスタックオーバーフローにならないが， Javaのような言語ではスタックオーバーフローになってしまう。
		 */
		private static BigInteger bigCalc(BigInteger n, BigInteger accumulator) {
			if (n.equals(BigInteger.ZERO)) {
				return accumulator;
			} else {
				return bigCalc(n.subtract(BigInteger.ONE), accumulator.multiply(n));
			}
		}
	}

	private static BigInteger factorialTCO(int requestNumber) {
		if (requestNumber < 0) {
			throw new IllegalArgumentException("Number must be greater than 0 but "
				+ requestNumber);
		}

		BigInteger n = new BigInteger(String.valueOf(requestNumber));

		return Factorial.bigCalc(n, BigInteger.ONE);
	}

	private static TailCall<BigInteger> factorialTailRec(BigInteger fractorial,
		BigInteger n) {
		if (n.equals(BigInteger.ONE)) {
			return TailCalls.done(fractorial);
		} else {
			return TailCalls.call(() -> factorialTailRec(fractorial.multiply(n),
				n.subtract(BigInteger.ONE)));
		}
	}

	private static BigInteger factorial(int requestNumber) {
		BigInteger number = new BigInteger(String.valueOf(requestNumber));
		return factorialTailRec(BigInteger.ONE, number).invoke();
	}

	@Test
	public void 末尾呼び出し最適化できる() {
		try {
			int n = 20000;
			BigInteger result = factorial(n);
			System.out.println("Factorial result by TailCall interface ... " + result);
		} catch (StackOverflowError error) {
			fail(error.getMessage());
		}
	}

	/**
	 * FunctionalInterfaceアノテーションが無くても条件さえ満たしていれば 関数インタフェースとして扱える。
	 */
	private interface FunctionalSample<T> {

		T getValue();
	}

	@Test
	public void 条件を満たしていれば関数インタフェースとして扱える() {
		int expected = 100;
		FunctionalSample<Integer> sample = () -> expected;
		int result = sample.getValue();

		assertThat(result, is(expected));
	}

	private static class RodCutterBasic {

		private final Map<Integer, Integer> prices;

		public RodCutterBasic(Map<Integer, Integer> prices) {
			this.prices = prices;
		}

		private int maxProfit(int rodLength) {
			int profit = 0;
			Integer lengthKey = Integer.valueOf(rodLength);
			if (prices.containsKey(lengthKey)) {
				profit = prices.get(lengthKey);
			}

			for (int idx = 1; idx < rodLength; idx++) {
				int priceWhenCut = maxProfit(idx) + maxProfit(rodLength - idx);
				if (profit < priceWhenCut) {
					profit = priceWhenCut;
				}
			}

			return profit;
		}

		private int maxProfitByMemoize(int rodLength) {
			BiFunction<Function<Integer, Integer>, Integer, Integer> compute
				= (func, lengthKey) -> {
					int profit = 0;
					if (prices.containsKey(lengthKey)) {
						profit = prices.get(lengthKey);
					}

					for (int idx = 1; idx < lengthKey; idx++) {
						int priceWhenCut = func.apply(idx) + func.apply(lengthKey - idx);
						if (profit < priceWhenCut) {
							profit = priceWhenCut;
						}
					}

					return profit;
				};

			return Memoizer.callMemoized(compute, rodLength);
		}
	}

	@Test(timeout = 1000)
	public void メモ化して高速化する() {
		Map<Integer, Integer> prices = new HashMap<>();
		prices.put(1, 2);
		prices.put(2, 1);
		prices.put(3, 1);
		prices.put(4, 2);
		prices.put(5, 2);
		prices.put(6, 2);
		prices.put(7, 1);
		prices.put(8, 8);
		prices.put(9, 9);
		prices.put(10, 15);

		RodCutterBasic rodCutter = new RodCutterBasic(prices);

		int actual5 = rodCutter.maxProfitByMemoize(5);
		int expected5 = 10;
		assertThat(actual5, is(expected5));

		int actual22 = rodCutter.maxProfitByMemoize(22);
		int expected22 = 44;
		assertThat(actual22, is(expected22));
	}

	/**
	 * @todo
	 * 既存のコードにこのようなメソッドがあったとして，
	 * これに手を加えずにラムダ式によるメモ化等のテクニックを
	 * 利用することはできるだろうか。
	 */
	private static BigInteger originalCalcFib(int n) {
		if (n <= 1) {
			return new BigInteger(String.valueOf(n));
		} else {
			return originalCalcFib(n - 1).add(originalCalcFib(n - 2));
		}
	}

	private static BigInteger calcFibForMemoized(
		Function<Integer, BigInteger> func, int n) {
		if (n <= 1) {
			return new BigInteger(String.valueOf(n));
		} else {
			return func.apply(n - 1).add(func.apply(n - 2));
		}
	}

	@Test(timeout = 1000)
	public void メモ化して高速化する_フィボナッチ数列() {
		BiFunction<Function<Integer, BigInteger>, Integer, BigInteger> fib
			= (func, number) -> {
				if (number <= 1) {
					return new BigInteger(String.valueOf(number));
				} else {
					return func.apply(number - 1).add(func.apply(number - 2));
				}
			};

		int number = 100;
		String expectedStr = "354224848179261915075";
		BigInteger expected = new BigInteger(String.valueOf(expectedStr));
		BigInteger actual = Memoizer.callMemoized(fib, number);

		assertThat(actual, is(expected));
	}

	@Test(timeout = 1000)
	public void メモ化して高速化する_フィボナッチ数列_既存メソッド利用検証版() {
		int number = 100;
		String expectedStr = "354224848179261915075";
		BigInteger expected = new BigInteger(String.valueOf(expectedStr));
		BigInteger actual = Memoizer.callMemoized(TestFunctions::calcFibForMemoized, number);

		assertThat(actual, is(expected));
	}

	@Test
	public void 特定の条件下で最も多く現れる単語を求める() {
		List<Path> sources = Arrays.asList(
			Paths.get("./sample/countword1.txt"),
			Paths.get("./sample/countword2.txt"),
			Paths.get("./sample/countword3.txt")
		);
		Charset cs = Charset.forName("UTF-8");

		String expected = "eating";
		List<String> notCountWords = Arrays.asList(
			"i", "is", "am", "are", "were", "was", "my"
		);
		Predicate<String> condition = word -> !notCountWords.contains(word.toLowerCase());
		String actual = Functions.countWord(sources, cs, condition);

		assertThat(actual, is(expected));

		System.out.println("最も多かった単語は " + actual + " でした。");
	}

	private void printTowers(String prefix, List<Tower> towers) {
		System.out.print(prefix + "=");
		towers.stream().forEach(t -> {
			System.out.print(t.getIndex() + ":" + t);
		});
		System.out.println("");
	}

	@Test
	public void ハノイの塔の円盤を並べ替える() {
		int towserSize = 3;
		int diskSize = 5;

		List<Tower> towers = IntStream.range(0, towserSize)
			.mapToObj(Tower::new)
			.collect(toList());

		Tower src = towers.get(0);
		Tower dest = towers.get(2);
		Tower buff = towers.get(1);

		Tower expected = new Tower(towserSize - 1);

		IntStream.range(0, diskSize)
			.forEach(diskIdx -> {
				src.add(diskIdx);
				expected.add(diskIdx);
			});

		printTowers("before", towers);

		src.moveDisks(diskSize, dest, buff);

		printTowers("after", towers);

		assertThat(dest, is(expected));
	}

	private static Node getSampleGraph() {
		Node l1 = new Node();
		Node l2 = new Node();
		Node l3 = new Node();

		Node n2 = new Node(Arrays.asList(
			new Node(),
			new Node(),
			new Node()
		));
		Node ns1 = new Node(Arrays.asList(
			l1, l2, l3, n2
		));
		Node ns2 = new Node(Arrays.asList(
			new Node(Arrays.asList(
					l1, l2
				))
		));
		Node l4 = new Node();
		Node l5 = new Node();
		Node n3 = new Node(Arrays.asList(
			l3, l4
		));
		Node l6 = new Node(Arrays.asList(
			n3, new Node(Arrays.asList(
					l5, new Node(Arrays.asList(
							n2, l2
						))
				))
		));

		Node ns3 = new Node(Arrays.asList(
			l6
		));

		Node root = new Node(Arrays.asList(
			ns1, ns2, ns3
		));

		return root;
	}

	@Test
	public void 深さ優先探索で全ての節点を巡回できる() {
		Node expected = getSampleGraph();
		expected.setAllColors(NodeColor.BLACK);

		Node actual = Functions.depthFirstSearch(getSampleGraph());

		assertThat(actual, is(expected));
	}

	@Test
	public void ダイクストラ法で最短経路を求める() {
		int startStation = 0;

		String[] stations = {
			"横浜", "武蔵小杉", "品川", "渋谷", "新橋", "溜池山王"
		};

		/**
		 * 重み付きグラフが隣接行列として表現されている。
		 */
		int[][] adjacencyMatrix = {
			new int[]{0, 12, 28, 0, 0, 0},
			new int[]{12, 0, 10, 13, 0, 0},
			new int[]{28, 10, 0, 11, 7, 0},
			new int[]{0, 13, 11, 0, 0, 0},
			new int[]{0, 0, 7, 0, 0, 4},
			new int[]{0, 0, 0, 9, 4, 0}
		};

		int[] cost = new int[stations.length];

		try {
			cost = Grapher.routeSearch(adjacencyMatrix, startStation);
		} catch (Exception ex) {
			fail(ex.getMessage());
		}

		for (int i = 0; i < stations.length; i++) {
			System.out.println(stations[startStation] + " -> "
				+ stations[i] + " : " + cost[i]);
		}
	}

	private static List<Integer> makeSampleList(int size) {
		Random rand = new Random();

		List<Integer> sample = new ArrayList<>(size);
		for (int i = 0; i < size; i++) {
			sample.add(rand.nextInt(size));
		}

		return sample;
	}

	@Test
	public void クイックソートで並べ替える() {
		List<Integer> sample = Arrays.asList(
			8, 2, 5, 1, 9, 0, 4, 7, 6, 3
		);

		List<Integer> expected = Arrays.asList(
			0, 1, 2, 3, 4, 5, 6, 7, 8, 9
		);

		List<Integer> actual = Functions.quickSort(sample, ArrayList::new);

		assertThat(actual, is(expected));
	}

	@Test
	public void マージソートで並べ替える() {
		List<Integer> sample = Arrays.asList(
			8, 2, 5, 1, 9, 0, 4, 7, 6, 3
		);

		List<Integer> expected = Arrays.asList(
			0, 1, 2, 3, 4, 5, 6, 7, 8, 9
		);

		List<Integer> actual = Functions.mergeSort(sample, ArrayList::new);

		assertThat(actual, is(expected));
	}

	@Test
	public void 単純挿入ソートで並べ替える() {
		List<Integer> sample = Arrays.asList(
			8, 2, 5, 1, 9, 0, 4, 7, 6, 3
		);

		List<Integer> expected = Arrays.asList(
			0, 1, 2, 3, 4, 5, 6, 7, 8, 9
		);

		List<Integer> actual = Functions.insertSort(sample, ArrayList::new);

		assertThat(actual, is(expected));
	}

	@Test
	public void リストの各数値を改行しながら表示する() {
		List<Integer> sample = Arrays.asList(1, 2, 3);

		try {
			Functions.printlnIntergers(sample);
		} catch (Exception ex) {
			fail(ex.getMessage());
		}
	}

	@Test
	public void リストの各要素に関数を適用したリストを返す() {
		List<Integer> sample = Arrays.asList(1, 2, 3);
		Function<Integer, Integer> square = i -> i * i;

		List<Integer> expected = Arrays.asList(1, 4, 9);
		List<Integer> actual = Functions.mapcar(square, sample, ArrayList::new);

		assertThat(actual, is(expected));
	}

	@Test
	public void リストの各要素に関数を適用した結果をリストで得てそれらを連結する() {
		List<Integer> sample = Arrays.asList(1, 2, 3);
		Function<Integer, List<Integer>> mapper = i -> Arrays.asList(i, i * i);

		List<Integer> expected = Arrays.asList(1, 1, 2, 4, 3, 9);
		List<Integer> actual = Functions.mapcan(mapper, sample, ArrayList::new);

		assertThat(actual, is(expected));
	}

	@Test
	public void リストが1要素のリストであるかどうかを調べる() {
		List<Integer> sample1 = Arrays.asList(1);
		List<Integer> sample2 = Arrays.asList(1, 2, 3);
		List<Integer> sample3 = Arrays.asList();

		boolean actual1 = Functions.isSingle(sample1);
		assertTrue(actual1);

		boolean actual2 = Functions.isSingle(sample2);
		assertFalse(actual2);

		boolean actual3 = Functions.isSingle(sample3);
		assertFalse(actual3);
	}

	@Test
	public void 可変長引数を扱う関数型インターフェースで計算できる() {
		NthFunction<Integer, Integer> sumFunc
			= (Integer... nums)
			-> Arrays.asList(nums).stream().reduce(0, (n, m) -> n + m);

		int expected = 15;
		int actual = sumFunc.apply(1, 2, 3, 4, 5);

		assertThat(actual, is(expected));
	}
	
	@Test
	public void 引数を取るSupplierでインスタンスを生成できる(){
		String sampleName = "TestUser";
		int sampleScore = 100;
		
		ParamSupplier<Student, String, Integer> supplier = Student::new;
		Student actual = supplier.get(sampleName, sampleScore);
		Student expected = new Student(sampleName, sampleScore);
		
		assertThat(actual, is(expected));
	}
	
	@Test
	public void 対を関数で表現できる(){
		String name = "Foo";
		int score = 100;
		
		Pair<String, Integer> cons = Pair.of(name, score);
		
		String actual1 = cons.car();
		assertThat(actual1, is(name));
		
		int actual2 = cons.cdr();
		assertThat(actual2, is(score));
	}

	@Test
	public void 対の等値性を調査できる(){
		String name = "Foo";
		int score = 100;
		
		Pair<String, Integer> cons1 = Pair.of(name, score);
		Pair<String, Integer> cons2 = Pair.of(name, score);
		
		assertEquals(cons1, cons2);
	}
	
	@Test
	public void 対の文字列表現を取得できる(){
		String name = "Foo";
		int score = 100;
		
		Pair<String, Integer> cons = Pair.of(name, score);
		
		String expected = name + ":" + score;
		String actual = cons.toString();
		
		System.out.println(actual);
		
		assertThat(actual, is(expected));
	}
	
	@Test
	public void 対を比較することができる(){
		String fooName = "foo", barName = "bar", bazName = "baz", fooName2 = "foo";
		int fooAge = 18, barAge = 17, bazAge = 30, fooAge2 = 17;

		List<Pair<String, Integer>> expected = Arrays.asList(
			Pair.ofComparable(barName, barAge), 
			Pair.ofComparable(bazName, bazAge), 
			Pair.ofComparable(fooName2, fooAge2),
			Pair.ofComparable(fooName, fooAge)
		);
		
		List<Pair<String, Integer>> pairs = Arrays.asList(
			Pair.ofComparable(fooName, fooAge), 
			Pair.ofComparable(barName, barAge), 
			Pair.ofComparable(bazName, bazAge), 
			Pair.ofComparable(fooName2, fooAge2)
		);
		
		List<Pair<String, Integer>> actual = pairs.stream()
			.sorted()
			.collect(toList());
		
		assertThat(actual, is(expected));
	}
	
}
