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

}
