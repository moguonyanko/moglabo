package test.exercise.stream;

import java.security.SecureRandom;
import java.util.*;
import java.util.function.*;
import java.util.stream.Collectors;
import java.util.stream.DoubleStream;
import java.util.stream.IntStream;
import java.util.stream.Stream;
import java.util.regex.Pattern;
import static java.util.stream.Collectors.*;

import org.jetbrains.annotations.NotNull;
import org.junit.Test;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.*;

import exercise.stream.StreamUtil;

/**
 * 参考:
 * http://www.journaldev.com/13204/javase9-stream-api-improvements
 */
public class TestStream {

    @Test
    public void getResultBySum() {
        Integer[] src = new Integer[]{1, 2, 3, 4, 5};
        List<Integer> sample = Arrays.asList(src);

        int actual = StreamUtil.sum(sample);
        int expected = 15;

        assertThat(actual, is(expected));
    }

    @Test
    public void canGetResultByTakeWhileWithOrderedStream() {
        List<Integer> source = List.of(1, 2, 3, 4, 5, 6, 7);
        // takeWhileは条件を満たすまで要素を取得し続ける。
        List<Integer> actual = StreamUtil.take(source, i -> i < 4, ArrayList::new);
        List<Integer> expected = List.of(1, 2, 3);
        assertThat(actual, is(expected));
    }

    @Test
    public void canGetResultByTakeWhileWithUnorderedStream() {
        List<Integer> source = List.of(1, 2, 4, 3, 5, 6, 7);
        List<Integer> actual = StreamUtil.take(source, i -> i < 4, ArrayList::new);
        // 条件を満たさなくなった時点でストリームに対する処理は打ち切られる。
        List<Integer> expected = List.of(1, 2);
        assertThat(actual, is(expected));
    }

    @Test
    public void canGetResultByDropWhileWithOrderedStream() {
        List<Integer> source = List.of(1, 2, 3, 4, 5, 6, 7);
        // dropWhileは条件を満たすまで要素を捨て続ける。
        List<Integer> actual = StreamUtil.drop(source, i -> i < 4, ArrayList::new);
        List<Integer> expected = List.of(4, 5, 6, 7);
        assertThat(actual, is(expected));
    }

    @Test
    public void canGetResultByDropWhileWithUnorderedStream() {
        List<Integer> source = List.of(1, 2, 4, 3, 5, 6, 7);
        // 一度条件を満たさなくなったらその後に現れる要素は一切捨てられない。
        List<Integer> actual = StreamUtil.drop(source, i -> i < 4, ArrayList::new);
        List<Integer> expected = List.of(4, 3, 5, 6, 7);
        assertThat(actual, is(expected));
    }

    @Test
    public void iterateOfStream() {
        int expected = 15;
        // 第1引数が第2引数を満たす場合，第3引数を適用して再び第2引数を満たすかチェックされる。
        // 第2引数の述語は『現在の値がストリームの終端であるかどうか』を判定する。
        // 第1引数を0にすると以下のストリームの処理は無限ループする。0 * 2 = 0が繰り返されるため。
        // 5回目のiterateでは8 * 2 = 16で第2引数を満たさなくなりストリームの処理は終了される。
        int actual = IntStream.iterate(1, i -> i <= 10, i -> i * 2)
            .peek(System.out::println)
            .sum();
        assertThat(actual, is(expected));
    }

    @Test
    public void iterateOfStreamWithFilter() {
        int expected = 15;
        // limitが無いと永遠にストリームの処理が継続されてしまう。
        int actual = IntStream.iterate(1, i -> i * 2)
            .limit(5)
            .filter(i -> i <= 10)
            .sum();
        assertThat(actual, is(expected));
    }

    @Test
    public void makeNullableStream() {
        String expected = "";

        String actual = Stream.ofNullable(null)
            .takeWhile(Objects::isNull)
            // NullPointerExceptionはスローされない。
            // ofNullableにより空のストリームが生成されているからである。
            .map(Object::toString)
            .collect(Collectors.joining(""));

        assertThat(actual, is(expected));
    }

    private static boolean isMultiple(long x, long n) {
        return x % n == 0;
    }

    @Test
    public void countMultipleNumbersFromSplittableRandom() {
        var random = new SplittableRandom();
        var n = 3;
        var start = 1;
        var end = (long) Math.pow(2, 21);
        var size = end - start;
        // 以下の書き方はコンパイルエラーになる。
        //var start = 1,
        //    end = 10,
        //    size = end - start;

        // longsの第1引数が指定されないと無限ストリームになるのでメソッドが完了しない。
        var valueSize = random.longs(size, start, end)
            .parallel()
            .filter(i -> isMultiple(i, n))
            // boxed()はmapToObj(i -> i)と同じ。
            .boxed()
            .collect(toSet())
            .size();

        // テストされる数列がランダムで構築されるため結果も毎回変わる。
        System.out.println(valueSize);
    }

    private static class Student {

        private final String name;
        private final int age;

        private Student(String name, int age) {
            this.name = name;
            this.age = age;
        }

        private String getName() {
            return name;
        }

        private int getAge() {
            return age;
        }

        @Override
        public boolean equals(Object obj) {
            if (obj instanceof Student) {
                var other = (Student) obj;
                return name.equals(other.name) &&
                    age == other.age;
            }

            return false;
        }

        @Override
        public int hashCode() {
            return Objects.hash(name, age);
        }

    }

    @Test
    public void calcStreamElementsAverage() {
        var actual = Stream.of(new Student("Mike", 19), new Student("Hoge", 20),
            new Student("Poko", 33))
            .mapToInt(Student::getAge)
            .average()
            .orElseThrow(IllegalStateException::new);

        var expected = 24d;

        assertThat(actual, is(expected));
    }

    @Test
    public void filterWithFlatMap() {
        Predicate<Student> adult = s -> s.getAge() >= 20;

        var groupA = List.of(new Student("Mike", 17), new Student("Foo", 23));
        var groupB = List.of(new Student("Bar", 59), new Student("Baz", 16));
        var groupC = List.of(new Student("Poko", 19), new Student("Peko", 18));

        var stream = Stream.of(groupA, groupB, groupC);

        var expected = List.of("Foo", "Bar");

        // flatMapでList<Student>のStreamをStudentのStreamに変換している。
        var actual = stream.flatMap(groups -> groups.stream().filter(adult))
            .map(Student::getName)
            .collect(toList());

        assertThat(actual, is(expected));
    }

    /**
     * 参考:
     * http://java.boot.by/ocpjd11-upgrade-guide/ch04s02.html
     */
    @Test
    public void checkOrderedStreamBySpliterator() {
        var list = List.of(1, 2, 3, 4, 5);

        var sp1 = list.spliterator();
        assertTrue(sp1.hasCharacteristics(Spliterator.ORDERED));

        // 並列ストリームにしても順序あり
        var sp1a = list.stream().parallel().spliterator();
        assertTrue(sp1a.hasCharacteristics(Spliterator.ORDERED));

        // unorderedにすれば順序なし
        var sp1b = list.stream().unordered().spliterator();
        assertFalse(sp1b.hasCharacteristics(Spliterator.ORDERED));

        var set = Set.of(1, 2, 3, 4, 5);

        var sp2 = set.spliterator();
        assertFalse(sp2.hasCharacteristics(Spliterator.ORDERED));

        // 順序づけされたSetを経由してストリームを生成すれば順序あり
        var sp2a = new TreeSet<>(set).spliterator();
        assertTrue(sp2a.hasCharacteristics(Spliterator.ORDERED));

        var sp2b = new TreeSet<>(set).stream().unordered().spliterator();
        assertFalse(sp2b.hasCharacteristics(Spliterator.ORDERED));
    }

    private static class NotComparableClass {
    }

    private static class MyItem implements Comparable<MyItem> {
        private final int id;

        private MyItem() {
            var random = new SecureRandom();
            id = random.nextInt();
        }

        public int getId() {
            return id;
        }

        @Override
        public int compareTo(@NotNull MyItem o) {
            return id - o.id;
        }

        @Override
        public String toString() {
            return String.valueOf(id);
        }
    }

    @Test(expected = ClassCastException.class)
    public void throwExceptionWhenSortedNotComparableObjects() {
        Supplier<NotComparableClass> sp = NotComparableClass::new;
        Stream.generate(sp)
            .limit(10)
            .sorted()
            .collect(toList());
    }

    @Test
    public void canSortStream() {
        Supplier<MyItem> sp = MyItem::new;

        var results = Stream.generate(sp)
            .limit(10)
            .sorted()
            .collect(toList());

        System.out.println(results);

        // 上と同じ振る舞いになる。
        var results2 = Stream.generate(sp)
            .limit(10)
            .sorted(Comparator.comparing(MyItem::getId))
            .collect(toList());

        System.out.println(results2);
    }

    @Test
    public void calcAverage() {
        var is = IntStream.rangeClosed(1, 10);
        // averageは終端処理なので返すのはStreamではなくOptionalDouble
        var actual = is.average().getAsDouble();
        var expected = 5.5;

        assertThat(actual, is(expected));
    }

    @Test
    public void collectSortedSet() {
        var src = Set.of(5, 2, 4, 3, 1);
        var expected = new TreeSet<>(src);
        var actual = src.stream().collect(toCollection(TreeSet::new));
        assertThat(actual, is(expected));

        // 最後のtoSetの振る舞い次第では途中のsortedによるソートは壊されてしまう。
        // 終端処理で壊してしまう可能性を考慮するとソートはできるだけ終端処理で行うのが
        // 好ましいのではないか。
        // var actual2 = src.stream().sorted().collect(toSet());
        // assertThat(actual2, is(expected));
    }

    @Test
    public void calcByAveragingDouble() {
        var students = List.of(new Student("Mike", 19),
            new Student("Pony", 21),
            new Student("Boo", 23));

        var actual = students.stream().collect(averagingDouble(Student::getAge));
        var expected = 21.0;
        assertThat(actual, is(expected));
    }

    @Test
    public void canPartTwoGroup() {
        var students = List.of(new Student("Mike", 19),
            new Student("Pony", 21),
            new Student("Boo", 23),
            new Student("Bar", 18),
            new Student("Foo", 30),
            new Student("Peter", 13));

        Predicate<Student> isAdult = student -> student.getAge() >= 20;

        var map = students.stream()
            .collect(partitioningBy(isAdult, counting()));
        var expected = 3L; // countingがLongを扱うためintではエラーになる
        assertThat(map.get(Boolean.TRUE), is(expected));
    }

    @Test
    public void canCreateUnorderedStream() {
        var stream = Stream.of(4, 2, 1, 3, 5);

        //UnaryOperator<Integer> square = i -> (int)Math.pow(i, 2);

        var expected = List.of(16d, 4d, 1d, 9d, 25d);
        // unorderedしたからといって順序(encounter order(検出順))が
        // いきなり変更されるわけではない。
        // parallelの際にunorderedすることでパフォーマンスの向上が
        // 図れることもあるということ。
        // https://docs.oracle.com/javase/jp/13/docs/api/java.base/java/util/stream/package-summary.html#Ordering
        var actual = stream
            .unordered()
            .parallel()
            //.map(square)
            // DoubleStreamなどを経由する場合boxedしないと
            // Collectors.toList()のみを引数にとるcollectが使えない。
            // パフォーマンスの観点ではこれらの基本データ型に特化した
            // Streamを使用する方が良いのだろうと思われる。
            .mapToDouble(i -> Math.pow(i, 2))
            .boxed()
            .collect(toList());

        assertThat(actual, is(expected));
    }

    @Test
    public void canSumValues() {
        var values = List.of(1, 2, 3, 4, 5);

        // mapToIntを経由するとreduceの戻り値がintになる。
        // 経由しない場合Integerとなる。
        var a = values.parallelStream().mapToInt(i -> i).reduce(0, (x, y) -> x + y);
        var b = values.parallelStream().mapToInt(i -> i).reduce(0, Integer::sum);
        var c = values.parallelStream().mapToInt(i -> i).sum();
        // IntStreamは以下のシグネチャのreduceを利用することができない。
        // そのためmapToIntを経由しようとするとコンパイルエラーとなる。
        var d = values.parallelStream().reduce(0,
            (acc, current) -> acc + current,
            (p1, p2) -> p1 + p2).intValue();

        assertEquals(a, b, c);
        assertEquals(c, d);
    }
    
    /**
     * 参考:
     * https://blogs.oracle.com/otnjp/quiz-advanced-collectors-ja
     */
    private static class Student2 {
        private final String name;
        private final int age;

        public Student2(String name, int age) {
            this.name = name;
            this.age = age;
        }

        public String getName() {
            return name;
        }

        public int getAge() {
            return age;
        }
    }
    
    @Test
    public void canUsePartitioningBy() {
        var s = Stream.of(new Student2("Mike", 19),
                new Student2("Joe", 34),
                new Student2("Peter", 17),
                new Student2("Anko", 20),
                new Student2("Taro", 78));
        
        Predicate<Student2> adult = student -> student.getAge() >= 20;
        var actual = s.collect(Collectors.partitioningBy(adult, Collectors.counting()));
        var expected = Map.of(true, 3L, false, 2L);

        assertThat(actual, is(expected));
        // 上と同じ結果になる。
//        assertTrue(actual.entrySet().containsAll(expected.entrySet()));
    }

    /**
     * 参考:
     * https://blogs.oracle.com/otnjp/quiz-yourself-functional-interfaces-advanced-ja
     */
    @Test
    public void canCalcDoubleUnaryOperator() {
        var stream = DoubleStream.of(1.0, 3.0, 5.0);
        DoubleFunction<DoubleUnaryOperator> mapperFactory =
            exponent -> base -> Math.pow(base, exponent);

        // 上と同じ結果を返せるがexponentを受け取った段階でボクシング操作が発生するため
        // 上よりも効率は落ちる。
        //Function<Double, DoubleUnaryOperator> mapperFactory =
        //    exponent -> base -> Math.pow(base, exponent);

        // DoubleStreamのmapにはDoubleUnaryOperatorしか渡せない。仮に渡せるとしても
        // Stream<Double>をsumすることはできないのでコンパイルエラーとなる。
        //DoubleFunction<DoubleFunction<Double>> mapperFactory =
        //    exponent -> base -> Math.pow(base, exponent);

        // 上と同じ理由によりコンパイルエラーとなる。
        //Function<Double, DoubleFunction<Double>> mapperFactory =
        //    exponent -> base -> Math.pow(base, exponent);

        var pow = 2d;
        var actual = stream.map(mapperFactory.apply(pow)).sum();

        var expected = 35d;
        assertThat(actual, is(expected));
    }
    
    private static class MySample implements Comparable<MySample> {
        private final String name;

        public MySample(String name) {
            this.name = name;
        }
        
        String getName() {
            return name;
        }

        @Override
        public int compareTo(MySample o) {
            return name.compareTo(o.name);
        }

        @Override
        public String toString() {
            return getName();
        }
    }

    @Test
    public void Comparableな要素を含むコレクションをストリームでソートする() {
        var samples = Arrays.asList(new MySample("Foo"),
                new MySample("Bar"),
                new MySample("Baz"));
        // Comparableを実装していない要素を含むコレクションをストリームで
        // ソートしようとするとClassCastExceptionが発生する。
        var result = samples.stream().sorted().collect(Collectors.toList());
        assertNotNull(result);
        System.out.println(Arrays.toString(result.toArray()));
    }
    
    private static final Pattern SLASH_PATTERN = Pattern.compile("\\/");
    
    @Test
    public void splitAsStreamでストリームを処理できる() {
        var sample = "https://localhost/sample/index.php";
        var size = SLASH_PATTERN.splitAsStream(sample)
                .mapToInt(String::length)
                .sum();
        assertThat(size, is(30));
    }
    
    /**
     * 参考:
     * https://blogs.oracle.com/javamagazine/post/java-quiz-stream-api-side-effects
     */
    @Test
    public void 個数の分かっているストリームのストリームパイプラインは実行されない() {
        var list = new ArrayList<String>();
        var size = List.of("Hello", "World")
                .stream()
                .map(v -> {
                    // filterなどが呼ばれずストリームのサイズが確定しており
                    // 終端操作がcountなのでこのブロックは処理が到達しない。
                    // 意図せぬ動作を回避したければストリームの処理に副作用を持たせないことが肝要である。
                    list.add(v);
                    return v;
                })
                // 終端操作がcollectだとmap内の処理は実行される。
                //.collect(Collectors.joining());
                .count(); // 終端操作
        
        assertTrue(list.isEmpty());
    }
    
    private record MyStudent(String name, Integer score) {}
    
    /**
     * 参考:
     * https://blogs.oracle.com/javamagazine/post/java-stream-api-reduce-overloads
     */
    @Test
    public void reduceのcombinerで結果を結合できる() {
        var stream = List.of(
                new MyStudent("Masao", 10),
                new MyStudent("Taro", 9),
                new MyStudent("Jiro", 6),
                new MyStudent("Hime", 7),
                new MyStudent("Mike", 8)
        ).stream();
        var result = stream.reduce(Integer.valueOf(0), 
                (sum, ms) -> sum += ms.score, 
                /**
                 * TODO:
                 * combinerの使い方を調べる。少なくともコンパイルエラーにはならない。
                 */
                (sum1, sum2) -> sum1 * sum2);
        
        assertTrue(result == 40);
    }
}
