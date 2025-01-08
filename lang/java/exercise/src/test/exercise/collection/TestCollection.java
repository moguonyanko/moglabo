package test.exercise.collection;

import java.util.*;

import static java.util.stream.Collectors.*;

import org.junit.*;
import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;

/**
 * 参考:
 * http://www.journaldev.com/13121/java-9-features-with-examples
 * JavaMagazine Vol.34
 */
public class TestCollection {

    /**
     * 以下のテストは不変なコレクションに対して要素を追加するメソッドを呼び出した時に
     * UnsupportedOperationExceptionがスローされることを確認している。
     * しかしputやaddといったメソッドはその名の通り本来は要素が追加されるのが
     * 自然な動作であり，これを実装していながらUnsupportedOperationExceptionを
     * スローするのはインターフェースの実装を事実上拒否しているに等しい。
     * あるインターフェースを実装するならば，そのインターフェースで定義されている振る舞いは
     * クライアントの入力に問題が無い限り提供しなければならない。
     * この問題の原因はオブジェクトの不変性をAPIの内部で制御する仕組みにしてしまったことだが，
     * おそらく旧バージョンとの互換性を取るために現在の形にならざる得なかったものと思われる。
     */

    @Test(expected = UnsupportedOperationException.class)
    public void createImmutableMap(){
        Map<String, Integer> map = Map.of("foo", 20, "bar", 30);
        map.put("baz", 40);
    }

    @Test(expected = UnsupportedOperationException.class)
    public void createImmutableList(){
        List<String> list = List.of("foo", "bar", "baz");
        list.set(1, "hoge");
    }

    @Test(expected = UnsupportedOperationException.class)
    public void createImmutableSet(){
        Set<String> set = Set.of("foo", "bar", "baz");
        set.add("hoge");
    }

    @Test
    public void modifyListByArraysAsList() {
        String[] sample = {"foo", "bar", "baz"};
        List<String> actual = Arrays.asList(sample);
        // Arrays.asListのリストは不変ではない。
        actual.set(1, "modified");
        List<String> expected = List.of("foo", "modified", "baz");
        assertThat(actual, is(expected));
    }

    private enum ClassId implements Comparator<ClassId> {
        A(1), B(2), C(3);

        private final int classNo;

        ClassId(int classNo) {
            this.classNo = classNo;
        }

        @Override
        public int compare(ClassId o1, ClassId o2) {
            return o1.classNo - o2.classNo;
        }
    }

    private enum Favorite {
        SLEEPING, READING, BASEBALL, SOCCER
    }

    private static class Student {
        private final ClassId classId;
        private final String name;
        private final int score;
        private final List<Favorite> favorites;

        Student(ClassId classId, String name, int score, List<Favorite> favorites) {
            this.classId = classId;
            this.name = name;
            this.score = score;
            this.favorites = favorites;
        }

        Student(ClassId classId, String name, int score) {
            this(classId, name, score, List.of());
        }

        @Override
        public boolean equals(Object obj) {
            if (!(obj instanceof Student)) {
                return false;
            }

            Student that = (Student)obj;
            return classId == that.classId &&
                name.equals(that.name) &&
                score == that.score;
        }

        @Override
        public int hashCode() {
            return Objects.hash(name, score);
        }

        private ClassId getClassId() {
            return classId;
        }

        private int getScore() {
            return score;
        }

        private List<Favorite> getFavorites() {
            return new ArrayList<>(favorites);
        }
    }

    @Test
    public void filteringCollection() {
        Map<ClassId, List<Student>> expected = new TreeMap<>(Map.of(
            ClassId.A, List.of(new Student(ClassId.A, "foo", 80)),
            ClassId.B, List.of(),
            ClassId.C, List.of(new Student(ClassId.C, "baz", 70),
                new Student(ClassId.C, "bze", 90))
        ));

        List<Student> students = List.of(
            new Student(ClassId.A, "foo", 80),
            new Student(ClassId.A, "fee", 65),
            new Student(ClassId.B, "bar", 50),
            new Student(ClassId.B, "bee", 55),
            new Student(ClassId.C, "baz", 70),
            new Student(ClassId.C, "bze", 90)
        );

        int borderScore = 70;

        Map<ClassId, List<Student>> result = students.stream()
            // ここでsortedしても結果のMapには反映されない。
            //.sorted(Comparator.comparing(Student::getClassId))
            .collect(
                groupingBy(
                    Student::getClassId,
                    filtering(student -> student.getScore() >= borderScore,
                        // 該当する要素が無いエントリの値は空のリストにする。
                        toList())
                )
            );

        Map<ClassId, List<Student>> actual = new TreeMap<>(result);

        assertThat(actual, is(expected));
    }

    @Test
    public void flatMappingCollection() {
        Map<ClassId, Set<Favorite>> expected = new TreeMap<>(Map.of(
            ClassId.A, Set.of(Favorite.SLEEPING, Favorite.BASEBALL, Favorite.READING),
            ClassId.B, Set.of(),
            ClassId.C, Set.of(Favorite.SLEEPING, Favorite.SOCCER, Favorite.READING)
        ));

        List<Student> students = List.of(
            new Student(ClassId.A, "foo", 80,
                List.of(Favorite.BASEBALL, Favorite.READING)),
            new Student(ClassId.A, "fee", 65,
                List.of(Favorite.SLEEPING, Favorite.READING)),
            new Student(ClassId.B, "bar", 50),
            new Student(ClassId.B, "bee", 55),
            new Student(ClassId.C, "baz", 70,
                List.of(Favorite.SLEEPING, Favorite.SOCCER)),
            new Student(ClassId.C, "bze", 90,
                List.of(Favorite.SLEEPING, Favorite.READING))
        );

        Map<ClassId, Set<Favorite>> result = students.stream()
            .collect(
                groupingBy(
                    Student::getClassId,
                    flatMapping(student -> student.getFavorites().stream(),
                        toSet())
                )
            );

        Map<ClassId, Set<Favorite>> actual = new TreeMap<>(result);

        assertThat(actual, is(expected));
    }

    /**
     * 参考:
     * JavaMagazine36
     */
    @Test
    public void  testRemoveElementFromList() {
        List<String> sample = Arrays.asList("foo", "bar", "baz", "fuga", "hoge");
        // AbstractListはremoveをサポートしないのでArrayListでラップする。
        List<String> l1 = new ArrayList<>(sample);
        List<String> expected = Arrays.asList("bar", "baz", "hoge");

        // ConcurrentModificationExceptionがスローされる。
//        l1.forEach(s -> {
//            if (s.startsWith("f")) {
//                l1.remove(s);
//            }
//        });

        // ListIteratorを使えば正常に値を削除できる。
        // しかし後述のArrayList.removeIfを使う方がシンプルである。
//        ListIterator<String> iterator = l1.listIterator();
//        while (iterator.hasNext()) {
//            if (iterator.next().startsWith("f")) {
//                // イテレータの元になったリストも変更される。
//                // 無論元のリストがremoveをサポートしていなければ
//                // UnsupportedOperationExceptionとなる。
//                iterator.remove();
//            }
//        }

        // ConcurrentModificationExceptionは発生しない。
        l1.removeIf(v -> v.startsWith("f"));

        assertThat(l1, is(expected));
    }

    /**
     * 参考:
     * Java magazine Vol.37
     */
    private static class ImmutableListA {
        private List<String> lst;
        ImmutableListA() {
            lst = Arrays.asList("Foo", "Bar", "Baz");
        }
        ImmutableListA(String[] elements) {
            lst = Arrays.asList(elements);
        }
        String get(int idx) {
            return lst.get(idx);
        }
    }

    private static class ImmutableListB {
        private List<String> lst;
        ImmutableListB(String ...elements) {
            lst = Collections.unmodifiableList(Arrays.asList(elements));
        }
        String get(int idx) {
            return lst.get(idx);
        }
    }

    @Test
    public void canNotMakeImmutableList() {
        ImmutableListA la = new ImmutableListA();
        String s1 = la.get(0);
        String expected = s1;
        s1 = "Modified";
        String actual = la.get(0);
        assertThat(actual, is(expected));

        // Arrays.asListの引数の配列を変更するとオブジェクトのリストも変更される。
        // Arrays.asListを使うと不変性が壊されるということである。
        String[] elements = {"apple", "orange", "banana"};
        ImmutableListA ia = new ImmutableListA(elements);
        elements[0] = "tomato";
        String expected2 = "tomato";
        String actual2 = ia.get(0);
        assertThat(actual2, is(expected2));
    }

    @Test
    public void canNotMakeImmutableListWithThoughUnmodifiableList() {
        String[] elements = {"Hello", "World", "!"};
        ImmutableListB imt = new ImmutableListB(elements);
        String modifiedString = "Hi";
        String expected = modifiedString;
        // 元の可変長引数リストを変更するとオブジェクト内のリストも変更されてしまう。
        // Collections.unmodifiableListの引数にArrays.asListが使われているため。
        elements[0] = modifiedString;
        String actual = imt.get(0);
        assertThat(actual, is(expected));
    }

    @Test
    public void catEqualsListAndSet() {
        LinkedList<Integer> llst = new LinkedList<>(Arrays.asList(1, 2, 3));
        HashSet<Integer> hset = new HashSet<>(Arrays.asList(1, 2, 3));
        // ListとSetの比較は構成要素が同じでもfalseになる。
        assertNotEquals(llst, hset);

        // lstとalstの型は実行時の型も含めて異なるがequalsはtrueを返す。
        ArrayList<Integer> alst = new ArrayList<>(Arrays.asList(1, 2, 3));
        assertEquals(alst, llst);

        // List同様、Set同士の型が異なっても構成要素が等しければequalsはtrueを返す。
        TreeSet<Integer> tset = new TreeSet<>(Arrays.asList(1, 2, 3));
        assertEquals(tset, hset);
    }

    // Comparableを実装すればthrowExceptionWhenAddIncomparableElementは例外を
    // スローしない。
    private static class SampleStudent /* implements Comparable<SampleStudent> */ {
        private int no;
        private String name;

        SampleStudent(int no, String name) {
            this.no = no;
            this.name = name;
        }

        @Override
        public String toString() {
            return no + ":" + name;
        }

        @Override
        public boolean equals(Object obj) {
            if (obj instanceof SampleStudent) {
                var other = (SampleStudent)obj;
                return no == other.no &&
                    name.equals(other.name);
            }
            return false;
        }

        @Override
        public int hashCode() {
            return Objects.hash(no, name);
        }

//        @Override
//        public int compareTo(@NotNull SampleStudent o) {
//            return no - o.no;
//        }
    }

    // 参考: JavaMagazine Vol.41
    @Test(expected = ClassCastException.class)
    public void throwExceptionWhenAddIncomparableElement() {
        var s1 = new SampleStudent(2, "Bar");
        var s2 = new SampleStudent(3, "Baz");
        var s3 = new SampleStudent(1, "Foo");

        var ts = new TreeSet<>();
        // 要素がaddされた後API内部で要素の比較を行われるので要素がComparableでないと
        // ClassCastExceptionが発生してしまう。
        ts.add(s2);
        ts.add(s1);
        ts.add(s3);
        System.out.println(ts);
    }

    // 既存の変更不可能クラスがComparableでないがそれらを特定の順序で並び替えたい時に
    // Comparatorを併用する方法は有効である。
    // 新規クラスで順序を意識する必要がある場合はComparableを実装するべきだが、
    // 複数のクラスで共通に使われる並び替え方法が存在するなら、それをComparatorとして
    // 記述するのは妥当である。
    @Test
    public void testTreeSetWithComparatorIsNotThrowException() {
        var s1 = new SampleStudent(2, "Bar");
        var s2 = new SampleStudent(3, "Baz");
        var s3 = new SampleStudent(1, "Foo");

        // ラムダの引数の変数名はラムダの外側の変数名と衝突する。
        // 例えば (s1, s2) -> { return s1.no - s2.no; } とした場合など。
        // ここでは右辺の<>で型を明示することは必須である。そうしなければ変数stの型を解決できない。
        var ts = new TreeSet<SampleStudent>(Comparator.comparingInt(st -> st.no));
        // TreeSetをComparatorと共に生成したのでComparableでない要素をaddしても
        // 実行時例外は発生しない。
        ts.add(s2);
        ts.add(s1);
        ts.add(s3);

        var expected = Arrays.asList(s3, s1, s2);
        var actual = new ArrayList<>(ts);
        assertThat(actual, is(expected));
    }

    /**
     * 参考:
     * JavaMagazine Vol.42
     */
    @Test
    public void checkOrderedCollection() {
        var s0 = Set.of("My", "name", "is", "Bar", "Fuga");
        var s1 = new HashSet<>(s0);
        var s2 = new TreeSet<>(s0);

        // 左辺は順序付けされているコレクションであれば0にならない。
        var actual1 = s1.spliterator().characteristics() & Spliterator.ORDERED;
        assertFalse(actual1 != 0);

        var actual2 = s2.spliterator().characteristics() & Spliterator.ORDERED;
        assertTrue(actual2 != 0);

        // 順序付けされるコレクションとして生成し直せばtrueになる。
        var s3 = new LinkedHashSet<>(s1);
        var actual3 = s3.spliterator().characteristics() & Spliterator.ORDERED;
        assertTrue(actual3 != 0);

        // ストリームに対しても同じように順序付けされているかどうかのチェックを行える。
        var actual4 = s2.stream().spliterator().characteristics() &
            Spliterator.ORDERED;
        assertTrue(actual4 != 0);
    }
    
    /**
     * 参考:
     * https://www.baeldung.com/java-21-sequenced-collections
     */
    @Test
    public void SequencedSetで順序づけられたSetを生成できる() {
        // JDK21以降LinkedHashSetがSequencedSetになっておりgetFirstやgetLastが実装されている。
        var sampleSet = new LinkedHashSet<String>();
        sampleSet.add("Mike");
        sampleSet.add("Ami");
        sampleSet.add("Joe");
        
        assertSame("Mike", sampleSet.getFirst());
        assertSame("Joe", sampleSet.getLast());  
    }
    
    @Test
    public void SequencedMapで順序づけられたMapを生成できる() {
        var sampleMap = new LinkedHashMap<String, Integer>();
        sampleMap.put("Mike", 21);
        sampleMap.put("Ami", 19);
        sampleMap.put("Joe", 33);
        
        var revMap = sampleMap.reversed();
        
        var first = revMap.firstEntry();
        assertSame(33, first.getValue());
        var last = revMap.lastEntry();        
        assertSame(21, last.getValue());
    }

}
