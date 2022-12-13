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
import java.util.Set;
import java.util.function.UnaryOperator;
import java.util.stream.Stream;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.Collections;
import java.util.function.BiPredicate;
import java.io.PrintStream;
import java.util.Optional;
import java.util.HashSet;
import java.util.concurrent.Callable;
import java.util.TreeSet;
import java.util.TreeMap;
import java.util.function.IntBinaryOperator;
import java.util.function.IntConsumer;
import java.util.function.IntFunction;
import java.util.function.IntPredicate;
import java.util.function.DoubleToIntFunction;
import java.util.function.IntSupplier;
import java.util.function.ObjIntConsumer;
import java.util.function.ToIntBiFunction;
import java.util.function.ToIntFunction;
import java.util.function.Consumer;
import java.nio.charset.StandardCharsets;
import java.util.function.BiConsumer;
import java.util.concurrent.ConcurrentHashMap;
import java.io.EOFException;
import java.sql.SQLTransientException;
import java.util.concurrent.TimeoutException;
import java.util.concurrent.atomic.AtomicInteger;
import java.sql.SQLException;
import static java.util.stream.Collectors.*;

import org.junit.*;
import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;

import exercise.function.Tower;
import exercise.function.util.Functions;
import exercise.function.util.Memoizer;
import exercise.function.util.Node;
import exercise.function.util.NodeColor;
import exercise.function.util.Grapher;
import exercise.function.util.NthFunction;
import exercise.function.util.Pair;
import exercise.function.util.ParamSupplier;
import exercise.function.util.TailCall;
import exercise.function.util.TailCalls;
import exercise.function.Lambda;
import exercise.function.MyPredicate;
import exercise.function.util.BiSupplier;
import exercise.function.CollectionFactory;
import exercise.function.util.CheckedExceptionWrapper;
import exercise.function.util.CheckedStream;
import exercise.function.util.CheckedFunction;
import exercise.function.HTMLElement;

/**
 * 参考：
 * 「Javaによる関数型プログラミング」(オライリー・ジャパン)
 * 「アルゴリズムとデータ構造」(SoftbankCreative)
 * 「Java Tutorial」(オラクル)
 * 「Java Language Specification Java SE 8 Edition」(オラクル)
 */
public class TestFunctions {

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

    @Test
    public void FunctionalInterfaceでチェック例外を送出する() {
        CheckedFunction<String, String, InvalidStringException> upper = s -> {
            if (s == null) {
                throw new InvalidStringException(s);
            }

            return s.toUpperCase();
        };

        try {
            upper.apply(null);
        } catch (CheckedExceptionWrapper wrapper) {
            Exception ex = wrapper.getRealException();
            if (!(ex instanceof InvalidStringException)) {
                fail();
            }
        }
    }

	private static class HeavyObject {

		private static final long HEAVY_OBJECT_CREATE_TIME = 1000L;

		public HeavyObject() {
			try {
				Thread.sleep(HEAVY_OBJECT_CREATE_TIME);
			} catch (InterruptedException ex) {
				System.err.println("Interrupted.");
			}
		}

		@Override
		public String toString() {
			return "Heavy object created.";
		}
	}

	/**
	 * HeavyObjectの遅延生成が行えていれば，HeavyObjectUser.getHeavyObjectを
	 * 呼び出さない限り，HeavyObject.HEAVY_OBJECT_CREATE_TIMEよりテスト実行時間が
	 * 掛かることはないはずである。以下のテストケースではそれを確認する。
	 */
	@Test(timeout = HeavyObject.HEAVY_OBJECT_CREATE_TIME)
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

		HeavyObjectUser heavyUser = new HeavyObjectUser("HeavyUser", 50);
		/* 遅延生成が行えていれば以下の2行の結果はすぐに得られる。 */
		System.out.println("Heavy user name:" + heavyUser.getName());
		System.out.println("Heavy user age:" + heavyUser.getAge());

		/**
		 * HeavyObjectUser::getHeavyObjectを呼び出しHeavyObjectを遅延生成する。
		 * 遅延生成の仕組みが正常に動作して<em>いない<em>時は，
		 * HeavyObjectUser::getHeavyObjectを呼び出さなくてもタイムアウトする。
		 */
		boolean callHeavyObjectInitializer = false;
		if (callHeavyObjectInitializer) {
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
		 * この書き方はSchemeなどではスタックオーバーフローにならないが， 
         * Javaのような言語ではスタックオーバーフローになってしまう。
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

    /**
     * 末尾呼び出し最適化を実現しているわけではない。
     * 末尾呼び出し最適化すればできることを別の手段で実現している。
     */
	private static TailCall<BigInteger> factorialTailRec(BigInteger factorial,
		BigInteger n) {
		if (n.equals(BigInteger.ONE)) {
			return TailCalls.done(factorial);
		} else {
			return TailCalls.call(() -> factorialTailRec(factorial.multiply(n),
				n.subtract(BigInteger.ONE)));
		}
	}

	private static BigInteger factorial(int requestNumber) {
		BigInteger number = new BigInteger(String.valueOf(requestNumber));
		return factorialTailRec(BigInteger.ONE, number).invoke();
	}

    @Test(expected = StackOverflowError.class)
    public void 再帰の回数が多いとスタックオーバーフローが起きる() {
        int n = 20000;
        BigInteger result = factorialTCO(n);
        System.out.println("n = " + n + ", result = " + result);
    }
    
	@Test
	public void 直接再帰せず遅延呼び出しすればスタックオーバーフローは起きない() {
		try {
			int n = 20000;
			BigInteger result = factorial(n);
            System.out.println("n = " + n + ", result = " + result);
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

		int actual1 = rodCutter.maxProfitByMemoize(1);
		int expected1 = 2;
		assertThat(actual1, is(expected1));

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
	public void 引数を取るSupplierでインスタンスを生成できる() {
		String sampleName = "TestUser";
		int sampleScore = 100;

		ParamSupplier<Student, String, Integer> supplier = Student::new;
		Student actual = supplier.get(sampleName, sampleScore);
		Student expected = new Student(sampleName, sampleScore);

		assertThat(actual, is(expected));
	}

	@Test
	public void 対を関数で表現できる() {
		String name = "Foo";
		int score = 100;

		Pair<String, Integer> cons = Pair.of(name, score);

		String actual1 = cons.car();
		assertThat(actual1, is(name));

		int actual2 = cons.cdr();
		assertThat(actual2, is(score));
	}

	@Test
	public void 対の等値性を調査できる() {
		String name = "Foo";
		int score = 100;

		Pair<String, Integer> cons1 = Pair.of(name, score);
		Pair<String, Integer> cons2 = Pair.of(name, score);

		assertEquals(cons1, cons2);
	}

	@Test
	public void 対の文字列表現を取得できる() {
		String name = "Foo";
		int score = 100;

		Pair<String, Integer> cons = Pair.of(name, score);

		String expected = name + ":" + score;
		String actual = cons.toString();

		System.out.println(actual);

		assertThat(actual, is(expected));
	}

	@Test
	public void 対を比較することができる() {
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

	@Test
	public void Streamを引数で渡して処理を連結し結果を得る()
		throws IOException {
		Path path = Paths.get("./sample/countword1.txt");

		Function<String, String> func = s -> s.replace(".", "!");
		Predicate<String> pred = s -> s.startsWith("F");
		String expected = "Foo is my friend!";

		/**
		 * Stream.filterやStream.mapを分離して実行しているだけである。
		 *
		 * Streamは中間処理を行うためのオブジェクトなので公開APIの
		 * 戻り値や引数にはしたくない。
		 */
		Stream<String> lines = Files.lines(path);
		Stream<String> appended = Functions.map(lines, func);
		Stream<String> result = Functions.select(appended, pred);

		String actual = result.findFirst().get();

		assertThat(actual, is(expected));
	}

	private enum Favorite {
		EGG(10),
		TOAST(80),
		RICE(100),
		BANANA(30),
		NONE(0);

		private final int calorie;

		private Favorite(int calorie) {
			this.calorie = calorie;
		}

		public int getCalorie() {
			return calorie;
		}
	}

	private static class Person {

		private final String name;
		private final Set<Favorite> favorites;

		public Person(String name, Favorite[] fatorites, boolean ordered) {
			this.name = name;
			
			if(fatorites == null){
				fatorites = new Favorite[0];
			}
			
			if (ordered) {
				this.favorites = Arrays.stream(fatorites).collect(toCollection(TreeSet::new));
			} else {
				this.favorites = Arrays.stream(fatorites).collect(toSet());
			}
		}

		public Person(String name, Favorite[] fatorites) {
			this(name, fatorites, false);
		}

		public Set<Favorite> getFavorites() {
			return favorites;
		}

		public String getName() {
			return name;
		}

		@Override
		public String toString() {
			return name + ":" + favorites.toString();
		}
		
	}

	@Test
	public void Streamを平坦化して最も多く現れる要素を得る() {
		Person foo = new Person("foo", new Favorite[]{
			Favorite.EGG, Favorite.TOAST
		});

		Person bar = new Person("bar", new Favorite[]{
			Favorite.RICE, Favorite.BANANA, Favorite.EGG
		});

		Person baz = new Person("baz", new Favorite[]{
			Favorite.EGG, Favorite.RICE, Favorite.TOAST
		});

		List<Person> persons = Arrays.asList(foo, bar, baz);

		Favorite expected = Favorite.EGG;
		Favorite actual = Functions.most(persons, Person::getFavorites, Favorite.NONE);

		assertThat(actual, is(expected));
	}

	@Test
	public void Collectorsのリダクション操作で合計値を計算できる() {
		int expected = 55;
		int actual = Functions.ranegClosedSum(0, 10);

		assertThat(actual, is(expected));
	}

	@Test
	public void Collectorsのリダクション操作で文字列連結できる() {
		List<String> sample = Arrays.asList(
			"foo", "bar", "baz"
		);

		String expected = "pre_foo|bar|baz_suff";
		String actual = Functions.concat("|", "pre_", "_suff", sample);

		assertThat(actual, is(expected));
	}

	@Test
	public void 条件に該当しない要素を排除したコレクションを得る() {
		List<String> sample = Arrays.asList(
			"foo", "bar", "baz"
		);

		List<String> expected = Arrays.asList(
			"foo"
		);

		Predicate<String> filter = el -> el.startsWith("b");
		List<String> actual = Functions.removeIf(sample, filter, ArrayList::new);

		assertThat(actual, is(expected));

		/* 副作用が無いことの確認 */
		System.out.println(sample);
	}

	@Test
	public void コレクションの全要素に引数の関数を適用したコレクションを得る() {
		List<String> sample = Arrays.asList(
			"foo", "bar", "baz"
		);

		List<String> expected = Arrays.asList(
			"FOO", "BAR", "BAZ"
		);

		UnaryOperator<String> op = String::toUpperCase;
		List<String> actual = Functions.replaceAll(sample, op, ArrayList::new);

		assertThat(actual, is(expected));

		/* 副作用が無いことの確認 */
		System.out.println(sample);
	}

	@Test
	public void マップの各値に関数を適用した結果を得る() {
		Map<String, Integer> persons = new HashMap<>();
		persons.put("foo", 10);
		persons.put("bar", 30);
		persons.put("baz", 50);

		BiFunction<String, Integer, Integer> func
			= (k, v) -> v * 2;

		Map<String, Integer> expected = new HashMap<>();
		persons.forEach((k, v) -> expected.put(k, v * 2));

		Map<String, Integer> actual = Functions.replaceAll(persons, func, HashMap::new);

		assertThat(actual, is(expected));
	}

	@Test
	public void Collectorsで合計値を計算する() {
		Student foo = new Student("foo", 50);
		Student bar = new Student("bar", 80);
		Student baz = new Student("baz", 70);

		List<Student> students = Arrays.asList(
			foo, bar, baz
		);

		int expected = 200;
		int actual = Functions.sum(students, Student::getScore);

		assertThat(actual, is(expected));
	}

	private enum Student2Class {
		A, B, C
	}

	private static class Student2 implements Comparable<Student2> {

		private final String name;
		private final int score;
		private final Student2Class studentClass;

		public Student2(String name, int score, Student2Class className) {
			this.name = name;
			this.score = score;
			this.studentClass = className;
		}

		public String getName() {
			return name;
		}

		public int getScore() {
			return score;
		}

		public Student2Class getStudentClass() {
			return studentClass;
		}

		@Override
		public String toString() {
			return name + ":" + score + ":" + studentClass;
		}

		@Override
		public int compareTo(Student2 o) {
			return name.compareTo(o.name);
		}

		@Override
		public boolean equals(Object obj) {
			if (obj instanceof Student2) {
				Student2 other = (Student2) obj;

				return name.equalsIgnoreCase(other.name)
					&& score == other.score
					&& studentClass == other.studentClass;
			} else {
				return false;
			}
		}

		@Override
		public int hashCode() {
			return Objects.hash(name, score, studentClass);
		}

	}

	@Test
	public void 分類して平均値を得る() {
		Student2 foo = new Student2("foo", 100, Student2Class.A);
		Student2 bar = new Student2("bar", 50, Student2Class.A);
		Student2 hoge = new Student2("hoge", 70, Student2Class.B);
		Student2 baz = new Student2("baz", 80, Student2Class.B);
		Student2 mike = new Student2("mike", 40, Student2Class.C);
		Student2 neko = new Student2("neko", 80, Student2Class.C);

		Map<Student2Class, Double> expected = new HashMap<>();
		expected.put(Student2Class.A, 75.0);
		expected.put(Student2Class.B, 75.0);
		expected.put(Student2Class.C, 60.0);

		List<Student2> sample = Arrays.asList(
			foo, bar, baz, hoge, mike, neko
		);

		Collections.shuffle(sample);

		Map<Student2Class, Double> actual = Functions.averagingBy(sample,
			Student2::getStudentClass, Student2::getScore);

		assertThat(actual, is(expected));
	}

	@Test
	public void 指定した区切り文字で文字列連結する() {
		List<String> terms = Arrays.asList(
			"foo", "bar", "baz"
		);

		String expected = "foo,bar,baz";
		String actual = Functions.join(terms, ",");

		assertThat(actual, is(expected));
	}

	@Test
	public void 指定した条件で集団を分類する() {
		Student2 foo = new Student2("foo", 100, Student2Class.A);
		Student2 bar = new Student2("bar", 50, Student2Class.A);
		Student2 mochi = new Student2("mochi", 35, Student2Class.A);
		Student2 hoge = new Student2("hoge", 70, Student2Class.B);
		Student2 baz = new Student2("baz", 20, Student2Class.B);
		Student2 fuga = new Student2("fuga", 80, Student2Class.B);
		Student2 mike = new Student2("mike", 10, Student2Class.C);
		Student2 neko = new Student2("neko", 80, Student2Class.C);
		Student2 buzz = new Student2("buzz", 80, Student2Class.C);

		List<Student2> sample = Arrays.asList(
			foo, bar, baz, hoge, mike, neko, mochi, fuga, buzz
		);
		sample.sort(Student2::compareTo);

		int borderScore = 40;
		Predicate<Student2> passed = s -> s.getScore() >= borderScore;

		Map<Boolean, List<Student2>> expected = new HashMap<>();

		List<Student2> passStudents = Arrays.asList(
			foo, bar, hoge, fuga, neko, buzz
		);
		passStudents.sort(Student2::compareTo);
		expected.put(true, passStudents);

		List<Student2> notPassStudents = Arrays.asList(
			mochi, baz, mike
		);
		notPassStudents.sort(Student2::compareTo);
		expected.put(false, notPassStudents);

		Map<Boolean, List<Student2>> actual = Functions.partitioning(sample, passed);

		assertThat(actual, is(expected));
	}

	@Test
	public void 指定した条件で集団をグループ化しつつ分類する() {
		Student2 foo = new Student2("foo", 100, Student2Class.A);
		Student2 poo = new Student2("poo", 20, Student2Class.A);
		Student2 bar = new Student2("bar", 50, Student2Class.A);
		Student2 mochi = new Student2("mochi", 35, Student2Class.A);
		Student2 hoge = new Student2("hoge", 70, Student2Class.B);
		Student2 baz = new Student2("baz", 20, Student2Class.B);
		Student2 fuga = new Student2("fuga", 80, Student2Class.B);
		Student2 peko = new Student2("peko", 15, Student2Class.B);
		Student2 mike = new Student2("mike", 10, Student2Class.C);
		Student2 neko = new Student2("neko", 80, Student2Class.C);
		Student2 buzz = new Student2("buzz", 80, Student2Class.C);
		Student2 qwerty = new Student2("qwerty", 0, Student2Class.C);

		List<Student2> allStudents = Arrays.asList(
			foo, bar, baz, hoge, mike, neko, mochi, fuga, buzz, poo,
			peko, qwerty
		);
		allStudents.sort(Student2::compareTo);

		int borderScore = 40;
		Predicate<Student2> passedPredicate = s -> s.getScore() >= borderScore;

		Map<Boolean, Map<Student2Class, List<Student2>>> expected = new HashMap<>();

		Map<Student2Class, List<Student2>> passStudents = new HashMap<>();

		List<Student2> passStudentsA = Arrays.asList(foo, bar);
		Collections.sort(passStudentsA);
		passStudents.put(Student2Class.A, passStudentsA);
		List<Student2> passStudentsB = Arrays.asList(hoge, fuga);
		Collections.sort(passStudentsB);
		passStudents.put(Student2Class.B, passStudentsB);
		List<Student2> passStudentsC = Arrays.asList(neko, buzz);
		Collections.sort(passStudentsC);
		passStudents.put(Student2Class.C, passStudentsC);

		Map<Student2Class, List<Student2>> notPassStudents = new HashMap<>();

		List<Student2> notPassStudentsA = Arrays.asList(poo, mochi);
		Collections.sort(notPassStudentsA);
		notPassStudents.put(Student2Class.A, notPassStudentsA);
		List<Student2> notPassStudentsB = Arrays.asList(baz, peko);
		Collections.sort(notPassStudentsB);
		notPassStudents.put(Student2Class.B, notPassStudentsB);
		List<Student2> notPassStudentsC = Arrays.asList(mike, qwerty);
		Collections.sort(notPassStudentsC);
		notPassStudents.put(Student2Class.C, notPassStudentsC);

		expected.put(true, passStudents);
		expected.put(false, notPassStudents);

		/* 生徒をクラス毎に分類するFunction */
		Function<Student2, Student2Class> classfier = s -> s.getStudentClass();
		/**
		 * 合格ライン以上のスコアを持つ生徒とそうでない生徒を
		 * クラスごとに分類する。
		 */
		Map<Boolean, Map<Student2Class, List<Student2>>> actual
			= Functions.partitioningGroupingBy(allStudents, passedPredicate, classfier);

		assertThat(actual, is(expected));
	}

	@Test
	public void 条件を満たすパスを検索する() throws IOException {
		Path path = Paths.get(".");
		int maxDepth = 10;
		BiPredicate<Path, BasicFileAttributes> matcher
			= (p, attrs) -> p.toFile().getName().startsWith("filessample");

		Path actual = Functions.findPath(path, maxDepth, matcher);

		Path expected = Paths.get("./sample/foo/bar/baz/filessample.txt");

		assertThat(actual, is(expected));
	}

	@Test
	public void 条件を満たすパスをフィルタで絞り込んで検索する() throws IOException {
		Path path = Paths.get(".");
		int maxDepth = 10;
		Predicate<Path> matcher = p -> p.toFile().getName().startsWith("filessample");

		Path actual = Functions.findPath(path, maxDepth, matcher);

		Path expected = Paths.get("./sample/foo/bar/baz/filessample.txt");

		assertThat(actual, is(expected));
	}

	@Test
	public void 既存のマップの値を新しい値に置き換える() {
		Map<String, Integer> sample = new HashMap<>();
		sample.put("foo", 100);
		sample.put("bar", 50);
		sample.put("baz", 75);

		String key = "bar";
		Integer value = 10;
		BiFunction<Integer, Integer, Integer> func
			= (orgValue, newValue) -> orgValue + newValue;

		Integer expected = sample.get(key) + value;
		Integer actual = sample.merge(key, value, func);

		assertThat(actual, is(expected));

		/* Map.mergeに副作用があることの確認 */
		System.out.println(sample);
	}

	@Test
	public void 既存のマップに別のマップをマージする() {
		Map<String, Integer> self = new HashMap<>();
		self.put("foo", 100);
		self.put("bar", 50);
		self.put("baz", 75);
		Map<String, Integer> forTestMap = new HashMap<>(self);

		Map<String, Integer> other = new HashMap<>();
		other.put("hoge", 30);
		other.put("bar", 90);
		other.put("piko", 40);

		Map<String, Integer> expected = new HashMap<>();
		expected.put("foo", 100);
		expected.put("baz", 75);
		expected.put("hoge", 30);
		expected.put("bar", 90);
		expected.put("piko", 40);

		BiFunction<Integer, Integer, Integer> func
			= (orgValue, newValue) -> orgValue < newValue ? newValue : orgValue;

		Map<String, Integer> actual = Functions.merge(self, other, func, HashMap::new);

		assertThat(actual, is(expected));

		/* Functions.mergeに副作用が無いことの確認 */
		assertThat(self, is(forTestMap));
	}

	@Test
	public void 自前の関数インターフェースで計算できる() {
		Lambda<Integer, Integer> square = n -> n * n;

		int expected = 100;
		int actual = square.funcall(10);

		assertThat(actual, is(expected));
	}

	@Test
	public void 配列から任意の型のリストを得る() {
		Integer[] nums = {1, 2, 3, 4, 5};

		List<Integer> expected = new ArrayList<>();
		Arrays.stream(nums)
			.forEach(expected::add);

		List<Integer> actual = Functions.asList(nums, ArrayList::new);

		assertThat(actual, is(expected));
	}

	private static class IntPrinter {

		private static final String PREFIX = "***";

		private final String suffix;
		private final List<Integer> src;

		public IntPrinter(List<Integer> src, String suffix) {
			this.src = src;
			this.suffix = suffix;
		}

		private void print(PrintStream out) {
			src.forEach(out::println);
		}

		private void println(Integer i) {
			System.out.println(i + suffix);
		}

		private static void printWithPrefix(Integer i) {
			System.out.println(PREFIX + i);
		}

	}

	@Test
	public void メソッド参照でラムダ式を置き換えできる() {
		List<Integer> sample = Arrays.asList(1, 4, 2, 5, 7, 0);

		/* PrintStreamクラスのインスタンスメソッドのメソッド参照 */
		sample.forEach(System.out::println);

		IntPrinter ip = new IntPrinter(sample, "!!!");

		ip.print(System.out);

		/* インスタンスメソッドのメソッド参照 */
		sample.forEach(ip::println);

		/* staticメソッドのメソッド参照 */
		sample.forEach(IntPrinter::printWithPrefix);

		String[] sample2 = {"foo", "bar", "baz"};

		/**
		 * 以下のStream.mapの引数は同じ意味。
		 * (String s)はsだけでよいが，後のコードとの比較のため
		 * わざと冗長に書いている。
		 */
		Arrays.stream(sample2)
			.map((String s) -> s.toUpperCase())
			.forEach(System.out::println);

		Arrays.stream(sample2)
			.map(String::toUpperCase)
			.forEach(System.out::println);
	}

	@Test
	public void ストリームから重複を排除した結果を得る() {
		List<String> sample = Arrays.asList("baz", "foo", "baz", "foo", "bar", "bar");

		List<String> expected = Arrays.asList("foo", "bar", "baz");
		/* String::compareToと同義。 */
		//expected.sort((a, b) -> a.compareTo(b));
		expected.sort(String::compareTo);

		List<String> actual = sample.stream()
			.distinct()
			.sorted()
			.collect(toList());

		assertThat(actual, is(expected));
	}

	@Test
	public void 任意の型のオブジェクトを任意の数だけ受け取ってストリームを得る() {
		Person mike = new Person("mike", new Favorite[]{
			Favorite.BANANA, Favorite.EGG, Favorite.RICE
		});

		Person neko = new Person("neko", new Favorite[]{
			Favorite.EGG, Favorite.TOAST
		});

		Function<Person, IntStream> calorieStream = person -> {
			Set<Favorite> fs = person.getFavorites();
			return fs.stream().mapToInt(Favorite::getCalorie);
		};

		int expectedMaxCalorie = 100;

		/**
		 * Stream.ofは単一の要素または可変長引数を受け取ってストリームを生成する。
		 */
		int actualMaxCalorie = Stream.of(mike, neko)
			.flatMapToInt(calorieStream)
			.max()
			.orElse(Favorite.NONE.getCalorie());

		assertThat(actualMaxCalorie, is(expectedMaxCalorie));
	}

	@Test
	public void 短絡終端操作で結果を得る() {
		List<String> names = Arrays.asList(
			"foo", "bar", "baz", "hoge", "neko", "mike"
		);

		Predicate<String> toEmptyStreamFilter = s -> s.length() < 0;

		/**
		 * AbstractList.addを呼び出すとUnsupportedOperationExceptionになる。
		 * AbstractList.removeIfは引数のPredicateを適用して真になる要素が無ければ
		 * 呼び出しても例外は発生しない。真になる要素がある場合は
		 * AbstractList.removeが呼び出されることにより
		 * UnsupportedOperationExceptionがスローされる。
		 * 正確にはdefaultメソッドとして定義されているCollection.removeIfが
		 * 呼び出され，その後AbstractList.removeが呼び出された時に例外が発生する。
		 *
		 * AbstractListがCollection.removeIfをオーバーライドして，常に
		 * UnsupportedOperationExceptionをスローするように
		 * 実装されていた方が一貫性はあったと思う。
		 * Collection.removeIfはJava8から追加されたメソッドなので，後方互換を
		 * 考慮する必要性は少なかったはずである。
		 *
		 * さらに言えばAbstractListのような実質的に固定サイズのコレクションと
		 * 固定でないサイズのコレクションが同じインターフェースを実装しているのが
		 * 問題に思われる。
		 * 固定サイズのコレクションがUnsupportedOperationExceptionを
		 * スローするだけのaddやremoveといったメソッドを持っているのは
		 * 事実上インターフェースを実装拒否している。
		 * 固定サイズのコレクションがaddやremoveをそもそも持っていなければ，
		 * 不正な要素の追加・削除操作に対してコンパイル時にエラーを通知することができる。
		 * APIの使い勝手や後方互換を考慮した結果，今のようになっているのかもしれないが…。
		 */
		names.removeIf(toEmptyStreamFilter);
		//names.removeIf(s -> s.startsWith("f"));
		//names.add("ponko");

		String name = names.stream()
			.parallel()
			/* String::startsWith("b")のような書き方はできない。 */
			.filter(s -> s.startsWith("b"))
			/**
			 * findAnyは並列処理でのパフォーマンスを上げるように
			 * 実装されているので結果は不定になる。安定した結果を得るには
			 * findFirstを用いる必要がある。
			 *
			 * 並列ストリームを途中で順次ストリームにしたり，
			 * その逆をしても例外は発生しない。
			 */
			.sequential()
			.parallel()
			.findAny()
			.orElseGet(String::new);

		assertTrue(name.equals("bar") || name.equals("baz"));

		System.out.println(names + "のうちbから始まる名前を1つ挙げると" + name + "です。");

		boolean resultAnyMatch = names.parallelStream()
			.map(String::toUpperCase)
			.filter(toEmptyStreamFilter)
			/**
			 * 空のストリームに対してanyMatchするとfalseが返される。
			 */
			.anyMatch(s -> s.equalsIgnoreCase("mike"));

		assertFalse(resultAnyMatch);

		boolean resultAllMatch = names.parallelStream()
			.map(String::toUpperCase)
			.filter(toEmptyStreamFilter)
			/**
			 * 空のストリームに対してallMatchするとtrueが返される。
			 */
			.allMatch(s -> s.equalsIgnoreCase("mike"));

		assertTrue(resultAllMatch);

		boolean resultNoneMatch = names.parallelStream()
			.map(String::toUpperCase)
			.filter(toEmptyStreamFilter)
			/**
			 * 空のストリームに対してnoneMatchするとtrueが返される。
			 */
			.noneMatch(s -> s.equalsIgnoreCase("mike"));

		assertTrue(resultNoneMatch);
	}

	private static class MyOptionalException extends Exception {

		public MyOptionalException() {
			super("My exception message");
		}

	}

	@Test(expected = MyOptionalException.class)
	public void 空のOptionalから値を得る時の振る舞いを変える() throws MyOptionalException {
		String[] names = {};

		Optional<String> sample = Arrays.stream(names)
			.parallel()
			.findAny();

		Functions.optionalGet(sample, MyOptionalException::new);
	}

	@Test
	public void マッピング関数の結果によってMapの値が変化する() {
		Map<String, Integer> sample = new HashMap<>();
		sample.put("foo", 90);
		sample.put("bar", 10);
		sample.put("baz", 35);
		sample.put("abc", 15);
		sample.put("hoge", 70);
		/**
		 * sample.keySet()から直接Streamを得てMap.computeIfPresent等を
		 * 呼び出すとConcurrentModificationExceptionがスローされる。
		 * これを避けるためにHashSetのコンストラクタを呼び出してキーのSetを
		 * 再生成している。
		 */
		Set<String> keys = new HashSet<>(sample.keySet());

		List<Integer> actual0 = keys.stream()
			/**
			 * Map.computeIfPresentの第2引数のBiFunctionが
			 * 常にnullを返すのでMapのマッピングは全て削除される。
			 * Map.computeも同様の振る舞いをする。
			 */
			.map(s -> sample.computeIfPresent(s, (key, value) -> null))
			.collect(toList());

		/**
		 * ストリーム処理中のMap.computeIfPresentによる副作用により
		 * 元のMapのマッピングは全て削除されている。
		 */
		assertTrue(sample.isEmpty());
		assertTrue(actual0.stream().allMatch(i -> i == null));

		List<Integer> actual1 = keys.stream()
			/**
			 * Map.computeIfAbsentの第2引数のFunctionが
			 * 常にnullを返すのでMapのマッピングは一切登録されない。
			 */
			.map(s -> sample.computeIfAbsent(s, key -> null))
			.collect(toList());

		assertTrue(actual1.stream().allMatch(i -> i == null));

		Map<String, Integer> actual = new HashMap<>();
		actual.put("momo", 30);
		actual.put("popo", 25);
		actual.put("koko", 80);

		HashMap<String, Integer> expected = new HashMap<>(actual);

		try {
			List<Integer> actual2 = new HashSet<>(actual.keySet()).stream()
				/**
				 * マッピング関数が非チェック例外をスローした場合，元のMapの
				 * マッピングは変更されない。マッピング関数からチェック例外を
				 * スローして伝搬させることはできない。Functionインターフェースが
				 * チェック例外をスローできるように定義されていないからである。
				 */
				.map(s -> sample.compute(s, (key, value) -> {
					throw new RuntimeException("マッピング中の例外テスト");
				}))
				.collect(toList());

			System.out.println(actual2);
		} catch (Exception ex) {
			System.out.println(ex.getMessage());
		}

		assertThat(actual, is(expected));
	}

	@Test
	public void 外部からキー抽出メソッドを指定してソートする() {
		List<Student> students = Arrays.asList(
			new Student("foo", 70),
			new Student("bar", 65),
			new Student("baz", 100),
			new Student("hoge", 35),
			new Student("mike", 10)
		);

		List<Student> expected = Arrays.asList(
			new Student("mike", 10),
			new Student("hoge", 35),
			new Student("bar", 65),
			new Student("foo", 70),
			new Student("baz", 100)
		);

		List<Student> actual = Functions.sorted(students, Student::getScore, ArrayList::new);

		assertThat(actual, is(expected));
	}

	@Test
	public void 空のストリームを比較する() {
		Stream s0 = Stream.of();
		Stream s1 = Stream.empty();

		assertTrue(s0.count() == 0);
		assertTrue(s1.count() == 0);

		System.out.println("Stream.ofによる空のストリームの型:" + s0.getClass().getCanonicalName());
		System.out.println("Stream.emptyによる空のストリームの型:" + s1.getClass().getCanonicalName());

		/**
		 * 空のコレクション同士は等しいと判定される。
		 * Streamを同じように考えないこと。
		 */
		List lst0 = Arrays.asList();
		List lst1 = Arrays.asList();
		assertTrue(lst0.equals(lst1));

		/**
		 * Stream.ofやStream.emptyで返されるクラスは
		 * equals及びhashCodeを実装していないため
		 * 両者の比較はObject.equalsが使われる。その結果
		 * 2つの空のストリームは等しくないと判定される。
		 *
		 * 滅多に無いはずだが，Streamの等しさを厳密に判定しなければ
		 * ならない状況(例えばStreamをMapのキーにする等)が発生した時は，
		 * Streamを保持した別のクラスを用意して，そのクラスに
		 * equalsとhashCodeを実装させる必要がある。
		 */
		assertFalse(s0.equals(s1));
	}

	private static class MyNaN {

		private final String id;
		private static final double NAN = Double.NaN;

		public MyNaN(String id) {
			this.id = id;
		}

		/**
		 * equalsとhashCodeをオーバーライドしていない。
		 */
		@Override
		public String toString() {
			return id + ":" + NAN;
		}
	}

	@Test
	public void 重複する要素の判定方法を調査する() {
		List<Student> students = Arrays.asList(
			new Student("mike", 10),
			new Student("hoge", 35),
			new Student("hoge", 35),
			new Student("hoge", 35),
			new Student("baz", 100)
		);

		List<Student> expected = Arrays.asList(
			new Student("mike", 10),
			new Student("hoge", 35),
			new Student("baz", 100)
		);

		List<Student> actual = students.stream()
			.distinct()
			.collect(toList());

		assertThat(actual, is(expected));

		List<MyNaN> orgNans = Arrays.asList(
			new MyNaN("foo"),
			new MyNaN("duplicate"),
			new MyNaN("duplicate"),
			new MyNaN("duplicate"),
			new MyNaN("bar")
		);

		List<MyNaN> actualNans = orgNans.stream()
			/**
			 * Stream.distinctはストリームの要素のクラスに
			 * equalsがオーバーライドされていない時は
			 * Object.equalsを使用する。こうなると(x == y)を
			 * 満たす要素しかdistinctで削除されなくなり，
			 * 結果としてMyNaNのストリームからは何も削除されない。
			 *
			 * equalsの実装方法が不適切であったときも当然distinctは
			 * 意図されたようには重複を削除してくれなくなる。
			 *
			 * 予期せぬ事故を防ぐためにも，Streamの要素として
			 * 想定されるクラスは，equalsとhashCodeをオーバーライド
			 * して一般契約を守り実装されるべきである。
			 */
			.distinct()
			.collect(toList());

		assertThat(actualNans, is(orgNans));
	}

	private interface Invoker {

		default void invoke(Runnable r) {
			System.out.println("Runnable.run");
			r.run();
		}

		default <T> T invoke(Callable<T> c) throws Exception {
			System.out.println("Callable.call");
			return c.call();
		}

		default void print() {
			System.out.println("Invoker test");
		}

	}

	@Test
	public void 引数からターゲット型を推論できる() throws Exception {
		List<Integer> sample = new ArrayList<>();
		sample.add(100);
		/**
		 * Java7までは以下は無効。Arrays.<Integer>asListと記述する必要があった。
		 */
		sample.addAll(Arrays.asList(1, 2, 3, 4, 5));
		System.out.println(sample);

		Invoker invoker = new Invoker() {
		};

		/**
		 * invokeの引数は値を返しているのでinvoke(Callable)が呼び出される。
		 */
		int resultCallable = invoker.invoke(() -> sample.stream().reduce(0, Integer::sum));
		System.out.println(resultCallable);

		/**
		 * 以下のコードでは呼び出すinvokeを特定できずにエラーとなる。
		 * invoker.invoke(System.out::println);
		 *
		 * invokeの引数は値を返していないのでinvoke(Runnable)が呼び出される。
		 */
		invoker.invoke(invoker::print);
	}

	@FunctionalInterface
	private interface MyFunction<T, R> extends Comparable<MyFunction<T, R>> {

		R apply(T t);

		int ID = 100;

		/**
		 * Objectクラスのメソッドでないメソッドの宣言が2つ以上あると
		 * FunctionalInterfaceではなくなる。
		 */
		//int getId();
		/**
		 * Objectクラスのメソッドのオーバーライドは行っても
		 * FunctionalInterfaceを維持できる。
		 */
		@Override
		boolean equals(Object o);

		@Override
		int hashCode();

		/**
		 * Objectクラス以外のメソッドのオーバーライドを行うと
		 * FunctionalInterfaceでなくなる。
		 * Comparableインターフェースを拡張し，compareToを
		 * オーバーライドも実装もしていない場合もFunctionalInterfaceでなくなる。
		 */
		//@Override
		//int compareTo(MyFunction<T, R> o);
		/**
		 * Objectクラス以外のメソッドをデフォルトメソッドとして実装すれば
		 * FunctionalInterfaceを維持できる。
		 */
		@Override
		default int compareTo(MyFunction<T, R> o) {
			return 1;
		}

		/**
		 * デフォルトメソッドは記述してもFunctionalInterfaceを維持できる。
		 */
		default String getInfo(T t) {
			String info = apply(t).toString();

			return info;
		}

		/**
		 * staticメソッドは記述してもFunctionalInterfaceを維持できる。
		 */
		static int divId(int factor) {
			return ID / factor;
		}

		/**
		 * Objectクラスのメソッドをデフォルトメソッドとして実装すると
		 * FunctionalInterface云々は関係無くコンパイルエラーになる。
		 */
		//@Override
		//default String toString(){
		//	return "test";
		//}
		@Override
		String toString();

	}

	@FunctionalInterface
	private interface MySubFunction<T, U extends CharSequence, R> extends MyFunction<T, R> {

		R apply(T t, U u);

		String FAVORITE_NAME = "EGG";

		/**
		 * スーパーインターフェースの唯一のメソッドをデフォルトメソッドで
		 * 実装しないとFunctionalInterfaceではなくなる。
		 * FAVORITE_NAMEはString型でありCharSequenceを実装しているが
		 * Uにキャストしなければコンパイルエラーになってしまう。
		 */
		@Override
		default R apply(T t) {
			return apply(t, (U) FAVORITE_NAME);
		}

		/**
		 * スーパーインターフェースでデフォルトメソッドとして実装されている
		 * メソッドをオーバーライドするとFunctionalInterfaceではなくなる。
		 */
		//@Override
		//int compareTo(MyFunction<T, R> o);
	}

	@Test
	public void FunctionalInterfaceのデフォルトメソッドを実行する() {
		String personName = "hogehoge";

		Favorite[] favorites0 = {
			Favorite.BANANA, Favorite.TOAST, Favorite.RICE
		};

		boolean ordered = true;

		Person p0 = new Person(personName, favorites0, ordered);

		BiFunction<Person, String, Favorite[]> toFavs = (p, s) -> {
			Set<Favorite> favorites = p.getFavorites();
			favorites.add(Favorite.valueOf(s));
			Favorite[] fs = favorites.toArray(new Favorite[favorites.size()]);

			return fs;
		};

		/**
		 * サブインターフェースでデフォルトメソッドにより実装した
		 * スーパーインタフェースのメソッドから，サブインターフェースの
		 * 「関数」(ここではMySubFunction.apply(T, U))を呼び出す。
		 */
		MySubFunction<Person, String, Collection<Favorite>> mf = (p, s) -> {
			Favorite[] fs = toFavs.apply(p, s);
			return new Person(p.name, fs, ordered).getFavorites();
		};

		Favorite[] favorites1 = toFavs.apply(p0, MySubFunction.FAVORITE_NAME);
		Person p1 = new Person(personName, favorites1, ordered);

		String expected = p1.getFavorites().toString();

		String actual = mf.getInfo(p0);

		assertThat(actual, is(expected));

		System.out.println(actual);
	}

	private static class StudentComparison {

		private static final Comparator<Student> BY_NAME_COMPARATOR
			= (s1, s2) -> s1.getName().compareTo(s2.getName());
		private static final Comparator<Student> BY_SCORE_COMPARATOR
			= (s1, s2) -> s1.getScore() - s2.getScore();

		public int compareByName(Student s1, Student s2) {
			return BY_NAME_COMPARATOR.compare(s1, s2);
		}

		public int compareByScore(Student s1, Student s2) {
			return BY_SCORE_COMPARATOR.compare(s1, s2);
		}
	}

	@Test
	public void メソッド参照に置き換えられる基準を調べる() {
		List<Student> students = Arrays.asList(
			new Student("baz", 80),
			new Student("foo", 100),
			new Student("bar", 50)
		);

		StudentComparison comparison = new StudentComparison();

		List<String> expected = Arrays.asList(
			"bar", "baz", "foo"
		);

		List<String> actual = students.stream()
			//.sorted((s1, s2) -> comparison.compareByName(s1, s2))
			/**
			 * <pre>
			 * (s1, s2) -> comparison.compareByName(s1, s2)
			 * </pre>
			 * 上記をメソッド参照で置き換えると
			 * <pre>comparison::compareByName</pre>
			 * になる。
			 * メソッド呼び出し元のオブジェクトがコレクションの要素ではない。
			 */
			.sorted(comparison::compareByName)
			/**
			 * 以下はcomparison::compareByNameを指定した時と同じになる。
			 */
			//.sorted(StudentComparison.BY_NAME_COMPARATOR)
			/**
			 * <pre>StudentComparison::compareByName</pre>ではコンパイルエラーになる。
			 *
			 * メソッド参照を使わない場合に次のように書けるのであれば
			 * コンパイルエラーにならない。
			 *
			 * <pre>
			 * (TypeA a1, TypeA a2) -> a1.method(a2);
			 * </pre>
			 *
			 * あるいは
			 *
			 * <pre>
			 * (TypeA a1) -> a1.method();
			 * </pre>
			 *
			 * いずれも<pre>TypeA::method</pre>と置き換えられる。
			 */
			//.sorted(StudentComparison::compareByName)
			.map(Student::getName)
			.collect(toList());

		assertThat(actual, is(expected));
	}

	@Test
	public void 複数種類のストリームから最大値と最小値を得る() {
		List<Integer> nums = Arrays.asList(
			0, 6, 4, 5, 7, 8, 9, 3, 1, 2
		);

		int start = 0;
		int end = 9;

		int expectedMax = 9;
		int expectedMin = 0;

		BiFunction<Integer, Integer, IntStream> getIntStream
			= (s, e) -> IntStream.rangeClosed(s, e);

		/**
		 * IntStreamから最大値や最小値を得る時はmax及びminに引数は不要。
		 * IntegerのComparatorを使えばよいことが分かっているからである。
		 * maxとminはOptionalIntを返す。値を得るメソッドはgetではなく
		 * getAsIntとなる。OptionalIntである時点で返される値はintに
		 * 決まっているのでgetでよかったように思える。orElse等はOptionalクラスと
		 * 同じ名前なのでなおさらgetAsIntが特殊に見える。
		 *
		 * OptionalIntはOptionalのサブクラスではない。
		 * IntStream等もそうだが基本データ型で特殊化したクラスは
		 * 特殊化されていないクラスのサブクラスになっていない。
		 */
		int actualMax = getIntStream.apply(start, end).max().getAsInt();
		assertThat(actualMax, is(expectedMax));

		/**
		 * 終端操作が呼び出されたストリームは閉じられる(消費済になる)ので
		 * 再利用不可能である。参照するとIllegalStateExceptionがスローされる。
		 */
		//int actualMin = is.min().getAsInt();
		int actualMin = getIntStream.apply(start, end).min().getAsInt();
		assertThat(actualMin, is(expectedMin));

		/**
		 * IntStreamをStream<Integer>に置き換えると以下のようになる。
		 * max，minにComparator<? super Integer>型の引数が必要になる。
		 */
		int actualMaxBoxed = getIntStream.apply(start, end).boxed()
			.max(Integer::compareTo)
			.get();
		assertThat(actualMaxBoxed, is(expectedMax));

		int actualMinBoxed = getIntStream.apply(start, end).boxed()
			.min(Integer::compareTo)
			.get();
		assertThat(actualMinBoxed, is(expectedMin));
	}

	@Test
	public void 引数を受け取れるSupplierでオブジェクトを生成する() {
		Map<String, Integer> data = new TreeMap<>();
		data.put("foo", 30);
		data.put("bar", 100);
		data.put("baz", 50);
		data.put("hoge", 80);
		data.put("mike", 40);

		List<Student> expected = new ArrayList<>();
		data.keySet().forEach(
			k -> expected.add(new Student(k, data.get(k)))
		);

		BiSupplier<Student, String, Integer> bs = Student::new;
		/**
		 * メソッド参照を使わない場合は以下のようになる。
		 */
		//BiSupplier<Student, String, Integer> bs = (name, score) -> new Student(name, score);

		List<Student> actual = data.keySet().stream()
			.map(k -> bs.get(k, data.get(k)))
			.collect(toList());

		assertThat(actual, is(expected));
	}

	@Test
	public void 特殊化された関数で結果を得る() {
		/**
		 * IntFunctionはFunctionの特殊化とされているが
		 * Functionを拡張したインターフェースではない。
		 */
		IntFunction<String> i2s = i -> String.valueOf(i);
		assertThat(i2s.apply(100), is("100"));

		/**
		 * BinaryOperatorはBiFunctionを継承している。しかし
		 * IntBinaryOperatorはIntFunctionを継承していない。
		 * IntBiFunctionが存在していたらそれを継承していたのかもしれない。
		 */
		IntBinaryOperator add = (a, b) -> a + b;
		assertThat(add.applyAsInt(100, 200), is(300));

		/**
		 * <pre>
		 * IntConsumer inc = i -> i + 1;
		 * </pre>
		 * 上のように書くと
		 * <pre>
		 * IntConsumer inc = i -> { return i + 1; };
		 * </pre>
		 * と同じになりintを返すことになる。
		 * Comsumerは値を返さないラムダ式しか受け付けないので
		 * コンパイルエラーになる。
		 */
		IntConsumer inc = i -> i++;
		/* カッコを付けると以下のようになる。 */
		//IntConsumer inc = i -> { i++; };

		int incTarget = 1;
		inc.accept(incTarget);
		/**
		 * IntConsumer.acceptを実行してもincTargetの値は変わらない。
		 * Consumerは入出力のような副作用を介して動作することが期待されるが，
		 * ラムダ式のスコープ外の値に副作用を及ぼすわけではない。
		 */
		assertThat(incTarget, is(incTarget));

		IntPredicate even = i -> i % 2 == 0;
		IntPredicate odd = even.negate();
		assertTrue(odd.test(11));

		Random rand = new Random();
		int bound = 10;
		IntSupplier randInt = () -> rand.nextInt(bound);
		int randResult = randInt.getAsInt();
		assertTrue(randResult < bound);
		System.out.println("Random.nextInt(int) returned " + randResult);

		ToIntFunction<String> s2i = s -> Integer.parseInt(s);
		assertThat(s2i.applyAsInt("100"), is(100));

		ToIntBiFunction<Student, Student2> sumScore
			= (s1, s2) -> s1.getScore() + s2.getScore();
		Student hoge = new Student("hoge", 40);
		Student2 mike = new Student2("mike", 60, Student2Class.A);
		assertThat(sumScore.applyAsInt(hoge, mike), is(100));

		List<Student> students = Arrays.asList(
			new Student("foo", 20),
			new Student("bar", 70),
			new Student("baz", 10)
		);

//		IntSupplier getZero = () -> 0;
		int sumResult = students.stream()
			.mapToInt(Student::getScore)
			/**
			 * 合計値の単位元はゼロでも許されるからか，sumはmaxやminと異なり
			 * OptionalIntではなくint型の値を返してくる。
			 */
			.sum();
			/**
			 * sumはreduce(0, Integer::sum)と同じ。
			 * つまり以下のコードとも同じである。
			 */
//			.reduce((s1, s2) -> s1 + s2)
//			.orElseGet(getZero);

		assertThat(sumResult, is(100));

		/**
		 * FloatToIntFunctionは存在しない。
		 * 
		 * プリミティブ特殊化といいつつbyteやshort，floatといった
		 * プリミティブ型はサポートされていないため，
		 * それらの型を扱う既存のAPIは，プリミティブ特殊化された
		 * 関数型インターフェースやストリームと相性が悪いかもしれない。
		 */
		DoubleToIntFunction round = d -> (int) Math.round(d);
		assertThat(round.applyAsInt(1.5), is(2));

		ObjIntConsumer<Student> dispScore = (student, bonusPoint) -> {
			/**
			 * 以下のコードでは文字列連結が優先されてしまうので誤った得点が表示される。
			 */
			//System.out.println(student.getName() + " score is " + student.getScore() + bonusPoint); 
			int result = student.getScore() + bonusPoint;
			System.out.println(student.getName() + " score is " + result);
		};
		dispScore.accept(new Student("foo", 95), 5);
	}

	@Test
	public void 単項演算子を使った計算を様々な型に適用する() {
		int a = 10;
		int actualInc = Functions.vary(a, n -> ++n);
		/**
		 * 後置インクリメントでは更新された値がUnaryOperator.applyの戻り値として
		 * 得られない。したがって以下のコードはテストに失敗する。
		 */
		//int actualInc = Functions.vary(a, n -> n++);
		/**
		 * 後置インクリメント版のコードを詳細に記述すると以下のようになる。
		 * インクリメント後の値が返されないことは明確である。
		 *
		 * またラムダ式の<pre>Integer n</pre>を<pre>int n</pre>にすると，
		 * int型がUnaryOperatorの型変数の上限(Object)以下に収まらないため
		 * コンパイルエラーになる。Integerへのオートボクシングは行われない。
		 * これはただ煩わしいだけなので，特に事情が無い限りはラムダ式で型は
		 * 明示しない方がいい。
		 */
		//int actualInc = Functions.vary(a, (Integer n) -> {
		//	return n++;
		//});
		/**
		 * 以下は変数aが既に利用されているためコンパイルエラーになる。
		 * ラムダ式外のスコープの変数がラムダ式内の変数でシャドウイングされることは
		 * 許されない。
		 */
		//int actualInc = Functions.vary(a, a -> a++);

		assertThat(actualInc, is(11));

		String greet = "Hello";
		String actualGreet = Functions.vary(greet, s -> {
			return s.toUpperCase().replaceAll("\\B", "_");
		});

		assertThat(actualGreet, is("H_E_L_L_O"));
	}

	@Test
	public void プリミティブ特殊化されたストリームで平均値を求める() {
		List<Integer> sample = Arrays.asList(
			1, 6, 5, 3, 2, 4, 8, 7, 9, 10
		);
		
		double expected = 5.5;
		
		double actual = sample.stream()
			/**
			 * Streamにはmaxとminはあるがsumやaverageは存在しないので
			 * map系メソッドによってIntStream等のプリミティブ特殊化された
			 * ストリームに変換する必要がある。
			 * 
			 * ToIntFunctionにはidentityメソッドが存在しない。
			 * 従ってToIntFunction型の関数を要求される場面で
			 * <pre>i -> i</pre>を<pre>ToIntFunction::identity</pre>
			 * とは置き換えられない。
			 * 少なくともjava.util.functionパッケージに含まれる
			 * 関数型インターフェースはidentityメソッドを持っているべきだと思う。
			 * BiFunction等引数を複数取る関数型インターフェースは難しかったかも
			 * しれないが。
			 * 
			 * IntFunctionにもidentityメソッドは存在しない。
			 * プリミティブ特殊化されたインターフェースには
			 * 特殊化の元となったインターフェースのメソッドのうち
			 * 1つしか持っていないか全く持っていない。
			 * 特殊化の元となったインターフェースが
			 * スーパーインターフェースでないことにも注意が必要である。
			 * Functionに関していえばFunctionを継承している
			 * インターフェースの方が少ない。PredicateもFunction<T, Boolean>を
			 * 継承してはいない。
			 */
			.mapToInt(i -> i)
			.average()
			/**
			 * To***Functionのgetメソッドは全てgetAs***になる。
			 * Optional***のgetメソッドも同じようにgetAs***になる。
			 * しかし他のメソッド名は何故かOptionalに準じている。
			 * またXXXTo***Functionのapplyメソッドは全てapplyAs***になる。
			 * 
			 * プリミティブ特殊化が絡んだAPIの設計はオブジェクト指向を
			 * 放棄しているように見える。単に似たような名前のメソッドを
			 * 持たせることで調整している感がありダック・タイピング的である。
			 * しかも特殊化されていないメソッドと同じ名前で良さそうなメソッドも
			 * getAsInt等のように微妙に変えられており混乱を招きそうである。
			 * さらにプリミティブ特殊化によってFunctionやStream，Optional等に似た
			 * インターフェースやクラスの数がむやみに増えてしまっている。
			 * しかし一部のプリミティブ型は無視されているので，やはり混乱を
			 * 招きそうである。
			 * 
			 * これらはパフォーマンスを維持するための設計なのだろうか。
			 * Functionのような関数型インターフェースは多態を表現するための
			 * インターフェースではないだろうが，些か無駄や不自然さが多い設計に思える。
			 * いずれにせよAPIドキュメントにある「特殊化」は「具象化」等とは
			 * 区別して考えるべきである。
			 */
			.orElseGet(() -> Double.NaN);
		
		assertThat(actual, is(expected));
	}
	
	@Test
	public void 自前の述語関数でテストできる(){
		int borderLine = 70;
		MyPredicate<Student> passed = s -> s.getScore() >= borderLine;
		
		Student hoge = new Student("hoge", 65);
		assertFalse(passed.test(hoge));
		
		Student mike = new Student("mike", 75);
		assertTrue(passed.test(mike));
		
		Student poo = new Student("poo", 99);
		int fullMarks = 100;
		MyPredicate<Student> perfect = s -> s.getScore() == fullMarks;
		assertFalse(passed.and(perfect).test(poo));
		assertTrue(passed.or(perfect).test(poo));
		assertFalse(passed.negate().test(poo));
		
		Student poo2 = new Student("poo", 99);
		MyPredicate<Student> eq = MyPredicate.isEqual(poo);
		assertTrue(eq.test(poo2));
	}
	
	@Test
	public void 実質的finalな変数に値を設定する(){
		
		class Modifier{
			private String word;

			public Modifier(String word) {
				this.word = word;
			}

			public void setWord(String word) {
				this.word = word;
			}
			
			String modify(Function<String, String> modifier){
				/**
				 * applyの引数は実質的finalである必要は無い。
				 */
				return modifier.apply(word);
			}
		}
		
		String sample = "Hello, ";
		String suffix = "♪";
		
		Modifier m = new Modifier(sample);
		/**
		 * 変数sampleは最終的にラムダ式で参照される値を提供するが，
		 * ラムダ式で直接参照しているわけではないので実質的finalである必要は無い。
		 */
		sample += "MODIFIED";
		
		/**
		 * ラムダ式で直接参照する変数は実質的finalでなければならない。
		 */
		//suffix = "!!";
		
		int suffNumber;
		suffNumber = 10;
		
		/**
		 * 分岐が利用されなければ実質的finalは保持される。
         * =>JDK21以降は分岐が利用されなくてもfinalとみなされなくなる。
		 */
		if(false){
			//suffNumber = 10000;
		}
		
		String prefix;
		/**
		 * ラムダ式の変数が初期化されていない可能性がある場合は
		 * コンパイルエラーになる。これはラムダ式関係無く発生する
		 * エラーである。
		 */
		//String actual = m.modify(s -> s + "World" + suffix + suffNumber);
		String actual = m.modify(s -> {
			/**
			 * ラムダ式の内部で実質的finalでなければならない変数を変更するのも
			 * コンパイルエラーになる。
			 */
			//suffix = "!!";
			/**
			 * ラムダ式の内部で初めて値を設定するのもコンパイルエラーになる。
			 * 変数はラムダ式で参照される前には値が設定されていなければならない。
			 */
			//prefix = "***";
			return s + "World" + suffix + suffNumber;
		});
		
		/**
		 * 実質的finalでなければならない変数をラムダ式の後で変更しても
		 * コンパイルエラーになる。
		 */
		//suffix = "!!";
		
		String expected = "Hello, World♪10";
		assertThat(actual, is(expected));
	}
	
	@Test
	public void ループ内でラムダ式を扱う(){
		Student[] students = {
			new Student("hoge", 90),
			new Student("mike", 50),
			new Student("baz", 75)
		};
		
		Student[] expected = {
			new Student("HOGE", 100),
			new Student("MIKE", 60),
			new Student("BAZ", 85)
		};
		
		List<Supplier> studentSuppliers = new ArrayList<>();
		for(Student s : students){
			studentSuppliers.add(() -> new Student(s.getName().toUpperCase(), 
			s.getScore() + 10));
		}
		
		/**
		 * 以下のループにてインデックスを示す変数iはループの度に
		 * インクリメントされており実質的finalではない。
		 * そのためコンパイルエラーになる。
		 */
		//for(int i = 0; i < students.length; i++){
		//	studentSuppliers.add(() -> new Student(students[i].getName().toUpperCase(), 
		//	students[i].getScore() + 10));
		//}
		
		Student[] actual = studentSuppliers.stream()
			.map(Supplier::get)
			/**
			 * 以下のようなメソッド参照も有効。
			 * ここでは左辺のジェネリックス型の指定は何を書いてもエラーにならない。
			 */
			//.map(Supplier<Student>::<String, Integer>get)
			/**
			 * IntFunction<A[]>型のオブジェクトが要求された時は
			 * 配列のコンストラクタのメソッド参照を渡すことができる。
			 * コレクションではなく配列を利用しないといけない時でも
			 * コレクションのようにストリームを利用して処理を行うことは
			 * 可能だということである。
			 */
			.toArray(Student[]::new);
		
		assertThat(actual, is(expected));
	}
	
	private static interface Addition<T extends Number>{
		
		T add(T a, T b);
		
		T getLeft();
		
		T getRight();
		
		default List<T> getParameters(){
			List<T> params = Arrays.asList(getLeft(), getRight());
			
			return params;
		}
		
	}
	
	private static class IntAddition implements Addition<Integer> {
		
		private final int left;
		private final int right;

		public IntAddition(int left, int right) {
			this.left = left;
			this.right = right;
		}

		@Override
		public Integer add(Integer a, Integer b) {
			return a + b;
		}

		@Override
		public Integer getLeft() {
			return left;
		}

		@Override
		public Integer getRight() {
			return right;
		}
		
		public void printParameters(){
			Function<IntAddition, List<Integer>> f = ia -> {
				List<Integer> params = Addition.super.getParameters();
				return params;
			};
			/**
			 * 以下はコンパイルエラーだがsuperキーワードを介して
			 * メソッド参照が利用できないわけではない。
			 * 型変数や文字列のリテラルを介したメソッド参照も可能。
			 * Java言語仕様の「15.13 Method Reference Expressions」を参考にすること。
			 */
			//Function<IntAddition, Integer[]> f = Addition.super::getParameters;
			
			System.out.println(f.apply(this));
		}
		
	}
	
	@Test
	public void メソッド参照の形式を調べる(){
		List<Person> persons = Arrays.asList(
			new Person("hoge", new Favorite[]{
				Favorite.BANANA, Favorite.RICE
			}),
			new Person("poko", new Favorite[]{
				Favorite.EGG, Favorite.TOAST
			}),
			new Person("mike", new Favorite[]{
				Favorite.RICE
			})
		);
		
		//Function<List<Person>, Integer> getSize = (List<Person> lst) -> lst.size();
		/**
		 * ジェネリックス型を明示的に指定したメソッド参照も可能。
		 */
		Function<List<Person>, Integer> getSize = List<Person>::size;
		/**
		 * 以下はコンパイルエラー。
		 * コレクションやラムダ式の左辺で<em>現れない</em>オブジェクトのメソッドを
		 * 呼び出す時にJava Tutorialで言うところの
		 * 「Reference to an Instance Method of a Particular Object」
		 * にあたるメソッド参照が可能になる。
		 */
		//Function<List<Person>, Integer> getSize = persons::size;
		
		assertThat(getSize.apply(persons), is(persons.size()));
		
		IntAddition ia = new IntAddition(3, 7);
		ia.printParameters();
	}
	
	@Test
	public void 戻り値の無いラムダ式を実行する(){
		Consumer<String> print = s -> System.out.println(s);
		/**
		 * もちろん上のコードは下と同じである。
		 */
		//Consumer<String> print = System.out::println;
		
		print.accept("Hello, Consumer world!");
	}
	
	@Test
	public void 数値以外に対して最大最小を求める(){
		List<Student> students = Arrays.asList(
			new Student("hoge", 30),
			new Student("popo", 75),
			new Student("mike", 10),
			new Student("bar", 20),
			new Student("baz", 65)
		);
		
		/**
		 * 文字列の自然順で比較するコンパレータを得る。ここでは
		 * Stream.maxを呼び出しているのでもっとも自然順で後ろになる
		 * 名前を持つオブジェクトがOptional.getで得られる。
		 */
		Comparator<Student> comparator = Comparator.comparing(Student::getName);
		
		Student expectedMax = new Student("popo", 75);
		Student actualMax = students.stream()
			.max(comparator)
			.get();
		
		assertThat(actualMax, is(expectedMax));
		
		Student expectedMin = new Student("bar", 20);
		Student actualMin = students.stream()
			.min(comparator)
			.get();
		
		assertThat(actualMin, is(expectedMin));
	}
	
	@Test(expected = ClassCastException.class)
	public void 比較できないオブジェクト群をストリームで並べ替えると例外が起きる(){
		Stream<Person> sortedStream = Stream.of(
			new Person("hoge", new Favorite[]{ Favorite.RICE }),
			new Person("foo", null),
			new Person("hoge", null),
			new Person("pipi", null)
		)
		.sorted();
		/**
		 * Comparatorを引数で渡してやれば例外は発生しない。
		 * 以下のコンパレータはまず名前で比較し昇順で並べ，名前が同じだったら
		 * 好物の数を比較して昇順で並べるコンパレータである。
		 */
		//.sorted(Comparator.comparing(Person::getName).thenComparing(p -> p.getFavorites().size()));
		
		System.out.println("終端操作collectを呼び出す前です。");
			
		/**
		 * collectを実行するとComparableでないPersonのストリームで
		 * 並べ替え処理が行われる。その結果ClassCastExceptionがスローされる。
		 */
		List<Person> sortedPersons = sortedStream.collect(toList());
		
		/**
		 * 終端操作であるcollectを呼び出した時に例外が発生するため
		 * 以下のコードは実行されない。
		 */
		System.out.println("並べ替え結果 -> " + sortedPersons);
	}
	
	@Test
	public void Mapの内容をダンプする(){
		Map<String, Integer> sample = new HashMap<>();
		sample.put("foo", 30);
		sample.put("bar", 20);
		sample.put("baz", 10);
		
		/**
		 * ラムダ式内の変数名をアンダースコア<strong>_</strong>だけにすることは
		 * 許されずコンパイルエラーになる。
		 * 今後のバージョンのJavaではラムダ式関係無くアンダースコアだけの変数名は
		 * コンパイルエラーとされる可能性がある。
		 */
		BiConsumer<String, Integer> action = 
			(key, value) -> System.out.println(key + ":" + value);
		
		sample.forEach(action);
	}
	
	@Test
	public void ファイルの内容を全て読み込む() throws IOException{
		Path path = Paths.get("./sample/foo/bar/baz/filessample.txt");
		
		List<String> result = Files.readAllLines(path, StandardCharsets.UTF_8);
		
		result.forEach(System.out::println);
	}
	
	@Test
	public void 関数型インターフェースのメソッドで型パラメータを用いる(){
		/**
		 * 以下ではコンパイルエラーになる。
		 * <pre>
		 * CollectionFactory factory = ArrayList<Student>::new;
		 * </pre>
		 */
		CollectionFactory factory = ArrayList::new;
		
		/**
		 * 変数にラムダ式を代入する時点で関数型インターフェースの
		 * 型パラメータの値を宣言するような文法は存在しない。
		 * 参照:
		 * 「Java Language Specification Java SE 8 Edition」15.13.2
		 * 
		 * 以下は全てコンパイルエラーになる。
		 */
		//CollectionFactory factory = () -> new ArrayList();
		//CollectionFactory factory = () -> new ArrayList<>();
		//CollectionFactory factory = () -> new ArrayList<Student>();
		//CollectionFactory factory = () -> new ArrayList<Person>();
		
		/**
		 * CollectionFactory.makeの型パラメータを省略している。
		 * 
		 * CollectionFactory型の変数factoryへの代入をメソッド参照で行っていれば
		 * コレクションの要素の型(ここではStudent)の決定をCollectionFactory.makeで
		 * コレクションを生成する時まで延ばすことができる。
		 */
		Collection<Student> c0 = factory.make();
		/**
		 * 以下も有効だが，Collection.add呼び出しの際，誤った型のオブジェクトを
		 * 追加しようとした時にコンパイルエラーを発生させることができないので
		 * 好ましくない。
		 */
		//Collection c0 = factory.make();
		
		/**
		 * <pre>
		 * factory.<Person>make()
		 * </pre>
		 * の<Person>ように，CollectionFactory.makeの型パラメータを
		 * ターゲット型付けで明示的に指定することも可能である。
		 * <pre>
		 * Collection<Person> c1 = factory.<Student>make()
		 * </pre>
		 * ではコンパイルエラーになる。
		 */
		Collection<Person> c1 = factory.<Person>make();

		/**
		 * ArrayList.addが実行される。
		 */
		c0.add(new Student("foo", 10));
		c0.add(new Student("bar", 20));
		c0.add(new Student("baz", 30));
		/**
		 * c0がCollection<Student>型ではなくCollection型だと
		 * 以下のコードもコンパイルが通ってしまう。
		 */
		//c0.add(100);

		c1.add(new Person("foo", new Favorite[]{ Favorite.RICE }));
		c1.add(new Person("bar", new Favorite[]{ Favorite.EGG }));
		c1.add(new Person("baz", new Favorite[]{ Favorite.NONE }));
		
		System.out.println(c0);
		System.out.println(c1);
	}
	
	@FunctionalInterface
	private static interface Eatable<T, R> {
		R eat(T t);
	}

	private static class Food {

		private final String name;

		public Food(String name) {
			this.name = name;
		}

		public String getEatenName() {
			return name;
		}

		public String getEatenName(Object f) {
//		public static String getEatenName(Object f){
			if (f instanceof Food) {
				return ((Food) f).name;
			} else {
				return "";
			}
		}

		public String getEatenName(Food f) {
			return f.name;
		}

		void eating() {
			/**
			 * staticなgetEatenNameが定義されていると，どのgetEatenNameも
			 * シグネチャが異なるのにメソッド参照が実際にどのメソッドを参照するのか
			 * 決定できないとしてコンパイルエラーになる。
			 * staticなgetEatenNameのstaticを外せばコンパイルできる。
			 */
			Eatable<Food, String> eatable = Food::getEatenName;
			System.out.println(eatable.eat(this));
		}
	}

	@Test
	public void メソッド参照とオーバーロードを組み合わせる() {
		Food f = new Food("orange");
		f.eating();
	}
	
	@Test
	public void マッピングを中断した時の結果を調べる(){
		/**
		 * ConcurrentHashMapではなくHashMapにすると
		 * Stream.forEach呼び出し時にConcurrentModificationExceptionが
		 * スローされる。
		 * ただしforEachでキーを出力するだけなどMapを変更する処理を
		 * 行っていなければConcurrentModificationExceptionはスローされない。
		 */
		Map<String, Integer> mapObj = new ConcurrentHashMap<>();
		mapObj.put("foo", 3);
		mapObj.put("baz", 5);
		mapObj.put("hoge", 1);
		mapObj.put("mike", 2);
		mapObj.put("bar", 4);
		
		BiFunction<String, Integer, Integer> f = (key, value) -> {
			if(key.equalsIgnoreCase("foo")){
				throw new RuntimeException("Map.compute中に例外発生！");
			}else if(key.equalsIgnoreCase("mike")){
				System.out.println(key + "はマッピングから削除");
				return null;
			}else{
				System.out.println(key + "の値を10倍");
				return value * 10;
			}
		};
		
		System.out.println(mapObj);
	
		try {
			mapObj.keySet().stream()
				/**
				 * Mapの値で並べ替える。
				 * メソッド参照を使うならばMap::getではなく
				 * mapObj::getと書かなくてはならない。
				 * mapObjはラムダ式外に存在する既存のオブジェクトだからである。
				 */
				.sorted(Comparator.comparing(mapObj::get))
				/**
				 * ラムダ式で記述すると以下のようになる。
				 */
				//.sorted(Comparator.comparing(k -> mapObj.get(k)))
				/**
				 * 現在注目されているキーを出力する。
				 */
				.peek(System.out::println)
				/**
				 * 例外で中断される直前までの副作用はMapに残る。
				 */
				.forEach(k -> mapObj.compute(k, f));
				/**
				 * 以下のメソッド参照はコンパイルエラーになる。
				 * Map.cumputeの第2引数として必要なBiFunctionを
				 * cumputeに渡せないからである。Map.cumputeが
				 * 第1引数のキーだけを要求するメソッドであれば
				 * Map.getと同じであり以下のコードは問題無くなる。
				 */
				//.forEach(mapObj::compute);
		} catch (RuntimeException ex) {
			System.err.println(ex);
		}
		
		Map<String, Integer> expected = new ConcurrentHashMap<>();
		/* 中断される前の副作用は残ることの確認 */
		expected.put("hoge", 10);
		/* 中断された後は値が変更されていないことの確認 */
		expected.put("foo", 3);
		expected.put("bar", 4);
		expected.put("baz", 5);
		
		assertThat(mapObj, is(expected));
		
		System.out.println(mapObj);
	}
	
	@Test
	public void サイズの一致しないコレクション群に対しflatMapを適用する(){
		List<String> sample1 = Arrays.asList("foo", "bar", "baz");
		List<String> sample2 = Arrays.asList("hoge", "mike");
		List<String> sample3 = Arrays.asList("koma", "gome", "pike");
		
		Stream<List<String>> source = Stream.of(sample1, sample2, sample3);
		
		List<String> expected = Arrays.asList(
			"FOO", "BAR", "BAZ", "HOGE", "MIKE", "KOMA", "GOME", "PIKE"
		);
		
		/**
		 * sample2の要素数は他のリストに比べて1つ少ない。
		 * しかしflapMap実行時に少ない部分がnullで埋められるようなことはない。
		 */
		List<String> actual = source.flatMap(sample -> sample.stream().parallel())
			.map(String::toUpperCase)
			.collect(toList());
		
		assertThat(actual, is(expected));
		
		System.out.println(actual);
	}
	
	@Test
	public void 複数の条件を満たすパスをまとめて得る() throws IOException{
		BiPredicate<Path, BasicFileAttributes> regularFile = 
			(path, attr) -> attr.isRegularFile();
		BiPredicate<Path, BasicFileAttributes> textExt = 
			(path, attr) -> String.valueOf(path).endsWith(".txt");
		BiPredicate<Path, BasicFileAttributes> notEmpty = 
			(path, attr) -> attr.size() > 0;
		
		Set<Path> expected = new HashSet<>();
		expected.add(Paths.get("./sample/countword1.txt"));
		expected.add(Paths.get("./sample/countword2.txt"));
		expected.add(Paths.get("./sample/countword3.txt"));
		expected.add(Paths.get("./sample/foo/bar/baz/filessample.txt"));
		
		Path base = Paths.get(".");
		Set<Path> actual = Functions.findPathSet(base, 10, regularFile, textExt, notEmpty);
		
		assertThat(actual, is(expected));
		
		System.out.println(actual);
	}
	/**
	 * 参考：
	 * 「Java Language Specification Java SE 8 Edition」(オラクル)
	 * 「9.8 Functional Interfaces」
	 */
	@FunctionalInterface
	private static interface SampleFunction {
		
		int call();
		
		@Override
		String toString();
		
		@Override
		boolean equals(Object obj);
		
		@Override
		int hashCode();
		
		/**
		 * SampleFunctionインターフェースはObjectクラスを継承できないため
		 * protectedであるcloneメソッドをオーバーライドできない。
		 * Overrideアノテーションが無いと通常の新規メソッド宣言になる。
		 * その結果SampleFunctionインターフェースは2つの抽象メソッドを
		 * 持つことになり，関数型インターフェースではなくなってしまう。
		 */
		//@Override
		//Object clone();
	}
	
	@Test
	public void Objectクラスのメソッドをオーバーライドした関数型インターフェースを利用する(){
		SampleFunction func = () -> 100;
		
		int expected = 100;
		
		int actual = func.call();
		
		assertThat(actual, is(expected));
	}
	
	/**
	 * 「Java Language Specification Java SE 8 Edition」(オラクル)
	 * 「9.8 Functional Interfaces」
	 */
	
	@FunctionalInterface
	private static interface ISampleX {
		int call(Callable<String> arg);
	}
	
	@FunctionalInterface
	private static interface ISampleY {
		int call(Callable<String> arg);
	}
	
	@FunctionalInterface
	private static interface ISampleZ extends ISampleX, ISampleY {
		/**
		 * ISampleZはインターフェースなのでスーパーインターフェースの
		 * 抽象メソッドを実装する義務が無い。
		 * スーパーインターフェースのメソッドはいずれも抽象メソッドなので
		 * デフォルトメソッドの時のようにオーバーライドを要求されない。
		 * 
		 * スーパーインターフェースのメソッドのシグネチャは衝突しているが
		 * 抽象メソッドなのでエラーにならない。
		 */
	}
	
	private static class SampleImpl implements ISampleZ {

		@Override
		public int call(Callable<String> arg) {
			try {
				return Integer.parseInt(arg.call());
			} catch (Exception ex) {
				throw new IllegalStateException(ex);
			}
		}
		
	}
	
	@FunctionalInterface
	private static interface ISampleX2 {
		Comparable call(Comparable<Integer> arg);
	}
	
	@FunctionalInterface
	private static interface ISampleY2 {
		Comparable<Integer> call(Comparable arg);
	}

	@FunctionalInterface
	private static interface ISampleZ2 extends ISampleX2, ISampleY2 {
		/**
		 * 2つのスーパーインターフェースのメソッドの引数や戻り値の型が
		 * 置換可能であるため，ISampleZ2は関数型インターフェースとみなされる。
		 */
	}
	
	@FunctionalInterface
	private static interface ISampleX3 {
		int call(Comparable<Integer> arg);
	}
	
	@FunctionalInterface
	private static interface ISampleY3 {
		int call(Comparable<String> arg);
	}
	
	//@FunctionalInterface
	//private static interface ISampleZ3 extends ISampleX3, ISampleY3 {
		/**
		 * Comparable<Integer>とComparable<String>は置換可能でないため
		 * ISampleZ3は複数のオーバーライドしない抽象メソッドを持つとされる。
		 * そのため関数型インターフェースにならない。
		 * 
		 * それ以前にメソッド名の競合エラーになる。
		 */
	//}
	
	@FunctionalInterface
	private static interface ISampleX4<T> {
		void call(Comparable<T> arg);
	}
	
	@FunctionalInterface
	private static interface ISampleY4<T> {
		void call(Comparable<T> arg);
	}
	
	//@FunctionalInterface
	//private static interface ISampleZ4<A, B> extends ISampleX4<A>, ISampleY4<B> {
		/**
		 * 2つのスーパーインターフェースのメソッドの引数の型は
		 * ISampleZ4の宣言により置換可能でなくなる。
		 * したがってISampleZ4は関数型インターフェースでなくなるし
		 * メソッド名の競合によりコンパイルエラーになる。
		 */
	//}
	
	@FunctionalInterface
	private static interface ISampleZ4_1<A> extends ISampleX4<A>, ISampleY4<A> {
		/**
		 * これはオーバーライドできるメソッドのシグネチャが
		 * <pre>
		 * void call(Comparable<A> arg);
		 * </pre>
		 * のみに決まるのでコンパイルエラーにならないし，
		 * 関数型インターフェースとしても有効になる。
		 */
	}
	
	@FunctionalInterface
	private static interface ISampleX5 {
		int call();
	}
	
	@FunctionalInterface
	private static interface ISampleY5 {
		long call();
	}
	
	//@FunctionalInterface
	//private static interface ISampleZ5 extends ISampleX5, ISampleY5 {
		/**
		 * スーパーインターフェースのメソッドの戻り値の型に指定されている
		 * intとlongが一致していないためコンパイルエラーになる。
		 * やはり関数型インターフェースにはならない。
		 * 
		 * <strong>
		 * オーバーライドできるメソッドのシグネチャがただ1つに決定できるかどうか
		 * </strong>
		 * が関数型インターフェースになれるかどうかのポイントである。
		 */
	//}
	
	private static interface ISample<T, N extends Number>{
		void call(T arg);
		void call(N arg);
	}
	
	//@FunctionalInterface
	private static interface ISampleX6 extends ISample<String, Integer> {
		/**
		 * ISampleX6はコンパイルは可能だが，オーバーライドできるメソッドが
		 * <pre>
		 * void call(String arg)
		 * </pre>
		 * と
		 * <pre>
		 * void call(Integer arg)
		 * </pre>
		 * 2つになるため関数型インターフェースとしては認められない。
		 */
	}
	
	@FunctionalInterface
	private static interface ISampleY6 extends ISample<Integer, Integer> {
		/**
		 * オーバーライドできるメソッドのシグネチャが
		 * <pre>
		 * void call(Integer arg)
		 * </pre>
		 * のただ1つに決まるためISampleY6は関数型インターフェースである。
		 * ISample
		 */
	}
	
	@FunctionalInterface
	private static interface MyCallable<V> extends Callable<V>{
		
		@Override
		V call();
		
	}
	
	@FunctionalInterface
	private static interface ISampleX7 {
		<T> T exec(MyCallable<T> r);
	}
	
	@FunctionalInterface
	private static interface ISampleY7 {
		<S> S exec(MyCallable<S> r);
	}	
	
	@FunctionalInterface
	private static interface ISampleZ7 extends ISampleX7, ISampleY7 {
		/**
		 * オーバーライドできるメソッドは
		 * <pre>
		 * <AnyType> AnyType exec(Callable<AnyType> r);
		 * </pre>
		 * のただ1つになるため，ISampleZ7は関数型インターフェースである。
		 * AnyTypeは実行時の型を示す。
		 */
	}
	
	@Test
	public void ジェネリックメソッドで関数型インターフェースを扱う(){
		/**
		 * 以下はメソッド参照で書き換えることができる。
		 */
		//ISampleZ7 sample0 = new ISampleZ7(){
		//	@Override
		//	public <T> T exec(MyCallable<T> c) {
		//		return c.call();
		//	}
		//};	
		
		/**
		 * 以下は型変数Tを解決できないためコンパイルエラーになる。
		 * 書き換え元の無名クラスのメソッドがISampleZ7.execのように
		 * ジェネリックメソッドだった時はラムダ式に書き換えられない可能性がある。
		 */
		//ISampleZ7 sample1 = (MyCallable<T> c) -> c.call();
		
		/**
		 * MyCallable.callがチェック例外をスローしないので
		 * 以下は有効である。
		 */
		ISampleZ7 sample = MyCallable::call;
		/**
		 * 以下のように実行時の方を明示的に指定しても問題無い。
		 */
		//ISampleZ7 sample = MyCallable::<Integer>call;
		
		assertThat(sample.exec(() -> 1), is(1));
	}
	
	@FunctionalInterface
	private static interface ISampleY7_2 {
		<S, T> S exec(Callable<S> r);
	}	
	
	//@FunctionalInterface
	//private static interface ISampleZ7_2 extends ISampleX7, ISampleY7_2 {
		/**
		 * <pre>
		 * <T> T exec(Callable<T> r)
		 * </pre>
		 * と
		 * <pre>
		 * <S, T> S exec(Callable<S> r)
		 * </pre>
		 * は
		 * シグネチャが異なっているとされコンパイルエラーになる。
		 * 型変数の数が異なる場合はISampleZ7のように型変数に具体的な型を
		 * 指定しないようにしてもシグネチャが異なると見なされてしまう。
		 */
	//}
	
	/**
	 *  参考：
	 * 「Java Language Specification Java SE 8 Edition」(オラクル)
	 * 「9.9 Function Types」
	 */
	
	@FunctionalInterface
	private static interface IOFunction {
		int call() throws IOException;
	}
	
	@FunctionalInterface
	private static interface EOFunction {
		int call() throws EOFException;
	}
	
	@FunctionalInterface
	private static interface ClassNotFoundFunction {
		int call() throws ClassNotFoundException;
	}
	
	@FunctionalInterface
	private static interface IOFEOFFunction extends IOFunction, EOFunction {
		/**
		 * throws以下の違いはシグネチャの違いとして扱われないため，
		 * IOFEOFFunctionは関数型インターフェースとして有効である。
		 */
		
		/**
		 * EOFExceptionはIOExceptionのサブクラスであるため
		 * EOFExceptionしかthrowsに指定できない。
		 * 
		 * 最も共通するサブクラスの例外(ここではEOFException)をスローするか，
		 * 何もスローしないように指定できる。
		 */
		//@Override
		//int call() throws IOException, EOFException;
		
		/**
		 * EOFExceptionをスローするように指定していないので
		 * 以下はコンパイルエラーになる。
		 */
		//@Override
		//int call() throws IOException;
		
		/**
		 * 何もメソッドを宣言していないと以下を宣言したのと同じ状態になる。
		 */
		//@Override
		//int call() throws EOFException;
		
		//@Override
		//int call();
		
	}
	
	@FunctionalInterface
	private static interface NotExFunction extends IOFunction, EOFunction, ClassNotFoundFunction {
		/**
		 * スーパーインターフェースはそれぞれ異なる例外クラスを
		 * throwsに指定されているが，やはりその違いは無視され
		 * NotExFunctionは関数型インターフェースとして認められる。
		 */
		
		/**
		 * スーパーインターフェースのメソッドのthrowsに指定された各例外で
		 * 共通するサブクラスの例外は存在しないので，このインターフェースで
		 * オーバーライドされるcallメソッドは何もthrowsに指定できない。
		 */
		//@Override
		//int call() throws ClassNotFoundException;
		
		/**
		 * 例外をthrowsに指定しない宣言のみが有効である。
		 */
		//@Override
		//int call();
	}
	
	@FunctionalInterface
	private static interface ISampleA {
		Set<String> getSet(Set<String> arg) throws IOException, SQLTransientException;
	}
	
	@FunctionalInterface
	private static interface ISampleB {
		Set getSet(Set<String> arg) throws EOFException, SQLException, TimeoutException;
	}
	
	@FunctionalInterface
	private static interface ISampleC {
		Set getSet(Set arg) throws Exception;
	}
	
	@FunctionalInterface
	private static interface ISampleD extends ISampleA, ISampleB {
		
		/**
		 * 原型とジェネリックス型の違いは許容されるので
		 * ISampleDは関数型インターフェースになる。
		 * 
		 * IOExceptionとEOFExceptionではEOFExceptionがサブクラスなので
		 * EOFExceptionをthrowsに指定できる。
		 * SQLTransientExceptionとSQLExceptionではSQLTransientExceptionが
		 * サブクラスなのでSQLTransientExceptionをthrowsに指定できる。
		 * TimeoutExceptionはそれ自身もそのサブクラスも他のスーパーインターフェースの
		 * メソッドでthrowsに指定されていないので，ISampleD.getSetのthrowsに
		 * 指定することができない。
		 */
		@Override
		Set<String> getSet(Set<String> arg) throws EOFException, SQLTransientException;
		
	}
	
	@FunctionalInterface
	private static interface ISampleE extends ISampleA, ISampleB, ISampleC {

		/**
		 * ISampleEは関数型インターフェースとして認められるが
		 * 以下のメソッド宣言はコンパイルエラーになる。
		 * 
		 * 関数型インターフェースとして有効かどうかと
		 * 実際にどのようなシグネチャのメソッドがオーバーライドできるかどうかは
		 * 別問題である。
		 */
		//@Override
		//Set<String> getSet(Set<String> arg) throws EOFException, SQLTransientException;		
		
		/**
		 * ISampleC.getSetがthrowsに指定しているExceptionは他のgetSetがthrowsに
		 * 指定している例外クラスとの共通のサブクラスにはなり得ないためthrowsに指定できない。
		 */
		//@Override
		//Set getSet(Set arg) throws Exception;
		
		@Override
		Set getSet(Set arg) throws EOFException, SQLTransientException;
	}
	
	@FunctionalInterface
	private static interface ISampleG1 {
		<E extends Exception> Object call() throws E;
	}
	
	@FunctionalInterface
	private static interface ISampleG2 {
		<F extends Exception> String call() throws Exception;
	}
	
	@FunctionalInterface
	private static interface ISampleG extends ISampleG1, ISampleG2 {
		
		/**
		 * スーパーインターフェースのメソッドの戻り値の型はそれぞれ
		 * ObjectとStringだが，より具象化されているString型を戻り値の
		 * 型とするようにしかオーバーライドできない。
		 * 
		 * String型はObject型に置換できるため，このインターフェースは
		 * 関数型インターフェースとして有効である。
		 */
		@Override
		String call();
		
		/**
		 * StringはObjectに置換可能だが，ObjectはStringに置換可能とは限らないため
		 * 以下のオーバーライドはコンパイルエラーになる。
		 */
		//@Override
		//Object call();
	}
	
	@Test
	public void 関数型インターフェースでスローできる例外を調べる() 
		throws IOException, EOFException, SQLTransientException{
		/**
		 * 以下のような書き方はできない。
		 * コンパイルエラーになる。
		 */
		//IOFunction f1 = () -> 100 throws IOException;
		/**
		 * throwsを指定するにはやはり匿名内部クラスを利用する必要がある。
		 */
		IOFunction f1 = new IOFunction() {
			@Override
			public int call() throws IOException {
				return 100;
			}
		};
		assertThat(f1.call(), is(100));
		
		IOFEOFFunction f2 = () -> 200;
		assertThat(f2.call(), is(200));
		
		NotExFunction f3 = () -> 300;
		assertThat(f3.call(), is(300));
		
		ISampleD f4 = args -> Collections.emptySet();
		assertThat(f4.getSet(null), is(Collections.emptySet()));
		
		ISampleE f5 = args -> Collections.emptySet();
		assertThat(f5.getSet(null), is(Collections.emptySet()));
		
		ISampleG f6 = () -> "Hello";
		assertThat(f6.call(), is("Hello"));
	}

	@Test
	public void 順次ストリームと並列ストリームを切り替える(){
		Stream<Integer> stream = Stream.of(1, 2, 3, 4, 5, 6, 7, 8, 9);
		
		/**
		 * Stream.parallelとStream.sequentialを両方とも呼び出した場合，
		 * より後に呼び出した方の命令が採用される。以下のコードでは
		 * 最後に呼び出されているのはparallelなのでストリームは並列になる。
		 * そのため最後のpeekではランダムな並びの数列が出力される。
		 */
		List<Integer> result = stream
			.parallel()
			.peek(i -> System.out.print(i + " "))
			.sequential()
			.peek(i -> System.out.print(i + " "))
			.parallel()
			.peek(i -> System.out.print(i + " "))
			/**
			 * 直前のpeekの結果はランダムな並びの数列を出力するにも関わらず，
			 * Stream.collectの結果得られるリストはStream.ofの引数順に並んだ
			 * 数列のリストになっている。Stream.unorderedを呼び出しても結果は変わらない。
			 */
			.unordered()
			.collect(toList());
		
		/**
		 * 終端操作(ここではStream.collect)が呼びだされたStreamに対して
		 * メソッド呼び出しを行うとIllegalStateExceptionが発生することがある。
		 */
		//stream.peek(System.out::println);
		//stream.count();
		//stream.sorted();
		/**
		 * Stream.sequentialやStream.parallelは中間操作なのだが
		 * 終端操作後に呼び出してもIllegalStateExceptionがスローされない。
		 */
		stream.sequential();
		stream.parallel();
		/**
		 * Stream.unorderedはIllegalStateExceptionがスローされる。
		 */
		//stream.unordered();
		
		System.out.println("");
		
		/**
		 * ストリームの終端操作を行った後のStreamに対してStream.isParallelを
		 * 呼び出した場合は予期しない結果になるかもしれないらしい。
		 * 
		 * 参考：
		 * http://docs.oracle.com/javase/jp/8/docs/api/java/util/stream/BaseStream.html
		 */
		System.out.println("ストリームは並列か？ : " + stream.isParallel());

		System.out.println("parallelとsequentialを交互に呼び出した後にリストを生成");
		
		System.out.println(result);
	}

	@Test
	public void findAnyの不定性を調べる() {
		List<Integer> source = Arrays.asList(0, 1, 2, 3, 4, 5, 6, 7, 8, 9);

		int result = source.stream()
			/**
			 * 並列ストリームでなければfindAnyの結果は常に等しくなる。
			 */
			.parallel()
			.filter(i -> i % 2 == 0)
			.findAny()
			.get();

		System.out.println("findAnyの結果 ... " + result);
	}
	
	@Test
	public void 空のOptionalを調べる(){
		Optional<String> op1 = Optional.empty();
		Optional<String> op2 = Optional.ofNullable(null);
		
		/**
		 * Optional.emptyで返されるOptionalとnullしか含まないOptionalは
		 * 等しいと見なされる。
		 */
		assertEquals(op1, op2);
	}
	
	@Test
	public void 並列ストリームと順次処理を組み合わせる() {
		IntStream sources = IntStream.range(0, 10);

		List<Integer> sample = new ArrayList<>();

		sources.parallel()
			.peek(i -> {
				/**
				 * 並列ストリームを利用しているので要素が追加される順序は
				 * 安定しない。
				 */
				sample.add(i);
			})
			/**
			 * Stream.forEachOrderedは要素の検出順序が保証される。
			 */
			.forEachOrdered(i -> System.out.print(i + " "));

		System.out.println("\n");

		sample.stream()
			.forEach(i -> System.out.print(i + " "));

		System.out.println("");
	}

	@Test
    public void 並列ストリームで原子的な計算を試みる() {
        AtomicInteger actual = new AtomicInteger(2);

        IntStream divs = IntStream.of(2, 2, 2);

        divs.parallel()
            .peek(div -> {
                actual.getAndUpdate(i -> i / div);
            })
            .peek(div -> {
                System.out.println(div + " is calculated");
            })
            .sum();
            /**
             * 中間操作peekを実行させるためだけに終端操作count実行
             * Java(build 9+181)ではcountが終端操作ではなくなっている。
             */
            //.count();

        AtomicInteger expected = new AtomicInteger(0);

        /**
         * AtomicIntegerにequalsやhashCodeは実装されていない。
         */
        assertThat(actual.get(), is(expected.get()));
    }

	@Test
	public void 並列ストリームでリダクションを行う() {
		IntStream stream = IntStream.of(2, 2, 2);

		/**
		 * 3つの2に対し順番にリダクション操作で除算を適用すれば
		 * 最後のint型の値は0になるはず。
		 */
		int expected = 0;

		IntBinaryOperator op = (a, b) -> a / b;

		int actual = stream.parallel()
			.reduce((a, b) -> {
				/**
				 * 並列ストリームなのでbが一つ前に行われた除算の結果とは限らない。
				 * a=2，b=1となっていることがある。
				 * この場合，除算の結果は2となりテストは失敗する。
				 */
				System.out.println(a + ", " + b);
				return op.applyAsInt(b, b);
			})
			.getAsInt();

		try {
			assertThat(actual, is(expected));
		} catch (AssertionError e) {
			/**
			 * 順次ストリームならば前の除算結果を使って
			 * 次の除算が行われることが保証される。
			 */
			actual = IntStream.of(2, 2, 2).reduce(op).getAsInt();
			assertThat(actual, is(expected));
		}
	}
	
	@Test
	public void 合計値をリダクションで計算する() {
		int result = Stream.of(1, 2, 3).reduce(0, (a, b) -> a + b);
		assertThat(result, is(6));
	}
	
	@Test
	public void 文字列連結をリダクションで実行する() {
		String result = Stream.of("Hello, ", "java ", "world.").reduce("", (a, b) -> a + b);
		assertThat(result, is("Hello, java world."));
	}
    
    @Test
    public void チェック例外をスローする関数をStreamと組み合わせて結果を得る() 
            throws ClassNotFoundException {
        List<Class> expected = Arrays.asList(Object.class, Integer.class, String.class);

        List<Class> actual = CheckedStream.of("java.lang.Object", "java.lang.Integer", "java.lang.String")
                .map(Class::forName)
                .unchecked()
                .collect(toList());
        
        assertThat(actual, is(expected));
    }
    
    @Test(expected = ClassNotFoundException.class)
    public void チェック例外をスローする関数をStreamと組み合わせてチェック例外をスローさせる() 
            throws ClassNotFoundException {
        CheckedStream.of("java.lang.Object", "java.lang.Integer", "java.lang.DummyString")
                .map(Class::forName)
                .unchecked()
                .collect(toList());
    }
    
	/**
	 * 参考:
	 * Joshua Bloch氏の2016/10/26のツイート
	 */
    @Test
    public void int型の配列をMIN_VALUEを加算しながらソートする() {
		int[] a = {5, 8, 1, 7, 3, 2, 4, 9, 0, 6};
		
		a = Arrays.stream(a)
			.map(i -> i + Integer.MIN_VALUE)
			.sorted()
			.map(i -> i + Integer.MIN_VALUE)
			.toArray();
		
		System.out.println(Arrays.toString(a));
    }
	
	/**
	 * HTMLElementのオブジェクト生成時に確保したメモリが解放されない。
	 * staticなラムダ式の評価だけを行った場合でもメモリが解放されない。
	 * HTMLElementのオブジェクトにnullを代入してもメモリは解放されない。
	 */
	private String getHTML(String name, String text) {
		HTMLElement element = new HTMLElement(name, text);
		String result = element.asHTML.get();
		return result;
		//return HTMLElement.asStaticHTML.apply(name, text);
	}
	
	@Test
	public void クロージャにおける循環参照でメモリリークが発生する() {
		Runtime runtime = Runtime.getRuntime();
		long beforeUsedMemory = runtime.totalMemory() - runtime.freeMemory();
		System.out.println("Before:Used memory = " + beforeUsedMemory);
		
		String name = "p";
		String text = "sample";
		int limit = 10;
		//メモリ使用量を分かりやすく増やすためにメソッドを何回も呼び出している。
		//メソッドを呼び出した後に余計なメモリを確保しないように戻り値は全て破棄している。
		for (int i = 0; i < limit; i++) {
			getHTML(name, text);
		}
		
		//String expected = "<p>sample</p>";
		//String actual = getHTML(name, text);
		//assertThat(actual, is(expected));
		
		//Runtime.gc()を呼び出せばメモリが解放される。
		//runtime.gc();
		long afterUsedMemory = runtime.totalMemory() - runtime.freeMemory();
		System.out.println("After:Used memory = " + afterUsedMemory);
		
		/**
		 * 多少メモリ使用量が増えているのは不思議ではないが
		 * HTMLElementで確保したメモリが全く解放されていない。
		 */
		assertTrue(afterUsedMemory > beforeUsedMemory);
	}

	/**
	 * 参考: JavaMagazine Vol.38
	 */
	@Test
	public void collectWithThreeParam() {
		// ラムダ式の引数名に分かりやすい名前をつけることで誤用を防ぐ。
		BiConsumer<StringBuilder, StringBuilder> appender =
			(builder, value) -> builder.append(value);

		var resultBuilder = IntStream.iterate(0, x -> (x + 1) % 26)
			// 並列ストリームを指定しても最後のcollectで得られる文字列の順序が
			// 不規則になることはない。collectに渡される文字列の順序が不規則になる。
			.parallel()
			.mapToObj(x -> new StringBuilder(Character.toString(x + 'A')))
			.limit(52)
			.peek(System.out::print)
			.collect(
				StringBuilder::new,
				appender,
				appender
				// appendの呼び出し元と引数が逆になっているため結果が空文字になってしまう。
				//(x, y) -> y.append(x),
				//(x, y) -> y.append(x)
			);

		var expected = "ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ";
		var actual = resultBuilder.toString();
		assertThat(actual, is(expected));
	}

}
