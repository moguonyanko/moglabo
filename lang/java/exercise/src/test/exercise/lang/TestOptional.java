package test.exercise.lang;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.function.Supplier;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.junit.Test;

import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;

/**
 * 参考:
 * http://www.journaldev.com/13121/java-9-features-with-examples
 * http://www.journaldev.com/13108/javase9-optional-class-improvements
 */
public class TestOptional {

    private enum Hobby {
        READING, BASEBALL, SLEEPING, MEAL, NONE
    }

    private static class Person {
        private final String name;
        private final List<Hobby> hobbies;

        Person(String name, List<Hobby> hobbies) {
            this.name = name;
            this.hobbies = hobbies;
        }

        List<Hobby> getHobbies() {
            return new ArrayList<>(hobbies);
        }

        @Override
        public String toString() {
            return name + ":" + hobbies;
        }

        @Override
        public boolean equals(Object obj) {
            if (obj instanceof Person) {
                Person another = (Person) obj;
                return name.equals(another.name) &&
                    hobbies.equals(another.hobbies);
            } else {
                return false;
            }
        }
    }

    private List<Optional<Person>> getSamplePeople() {
        List<Person> people = List.of(
            new Person("foo", List.of(Hobby.MEAL, Hobby.READING)),
            new Person("bar", List.of(Hobby.SLEEPING, Hobby.READING)),
            new Person("baz", List.of(Hobby.MEAL, Hobby.BASEBALL))
        );

        return people.stream()
            .map(Optional::of)
            .collect(Collectors.toList());
    }

    @Test
    public void runWithOptionalStream() {
        List<Optional<Person>> people = getSamplePeople();
        Stream<Optional<Person>> optionalStream = people.stream();
        Stream<Person> personStream = optionalStream.flatMap(Optional::stream);
        personStream.forEach(System.out::println);
    }

    @Test
    public void runWithIfPresentOrElse() {
        Person tempPerson = new Person("temp", List.of(Hobby.NONE));
        Optional.empty().ifPresentOrElse(System.out::println,
            () -> System.out.println(tempPerson));
    }

    @Test
    public void runWithOptionalOr() {
        Person hoge = new Person("hoge", List.of(Hobby.MEAL, Hobby.SLEEPING));
        Supplier<Optional<Person>> supplier =
            () -> Optional.of(new Person("dummy", List.of(Hobby.NONE)));
        Optional.of(hoge).or(supplier).ifPresent(System.out::println);
        Optional.empty().or(supplier).ifPresent(System.out::println);
    }

    /**
     * 参考:
     * JavaMagazine36
     */
    @Test
    public void checkLappedNulOptional() {
        // Optional.<String>empty()はOptional.ofNullable((String)null)と同じ。
        // emptyの前の<String>がないと後続のmapやorでコンパイルエラーとなる。
        String actual = Optional.<String>empty()
            // orElseGetはOptionalの元になった値と同じ型の値しか返せない。
            // しかしここでStringを返すと後続のOptional.mapがコンパイルエラーになる。
            //.orElseGet(() -> Optional.of("not null"))
            .flatMap(value -> {
                // nullをラップしたOptionalに対してflatMap及びmapは何も行わない。
                // したがって以下のコードが実行されることはない。
                System.out.println("flatMap");
                return Optional.of(Objects.requireNonNullElse(value, "not null"));
            })
            .map(String::toUpperCase)
            .or(() -> Optional.of("NULL"))
            .get();

        assertThat(actual, is("NULL"));

        // Optionalの目的の1つにnullチェックの排除があるのだから、
        // nullを含むOptionalに対してはOptional.mapもOptional.flatMapも
        // 何も行わないのである。
    }

    @Test
    public void compareEmptyOptionals() {
        var o1 = Optional.empty();

        var v = (String)null;
        var o2 = Optional.ofNullable(v);

        assertEquals(o1, o2);
    }

    /**
     * 参考:
     * http://java.boot.by/ocpjd11-upgrade-guide/ch04s03.html
     */
    @Test
    public void makeOptionalStreamWithFlatMap() {
        var src = List.of(
            Optional.empty(),
            Optional.of("Hello"),
            Optional.empty(),
            Optional.of("Hey"),
            Optional.of("Java Stream")
        );

        // emptyなOptionalを除外するためのflatMap
        // mapでは除外されない。
        var actual = src.stream()
            .flatMap(o -> o.isPresent() ? Stream.of(o) : Stream.empty())
            .collect(Collectors.toList());

        assertEquals(actual.size(), 3);

        // 終端処理を行ってcloseされたStreamに対しmapなどを呼び出すと
        // IllegalStateExceptionがスローされる。Streamは都度生成すること。

        var actual2 = src.stream()
            // 三項演算子を用いた上の記述方法と同じ意味を示す。
            .flatMap(Optional::stream)
            .collect(Collectors.toList());

        assertEquals(actual2.size(), 3);
    }

    @Test
    public void getValueByOptionalMaps() {
        var s = Optional.of("Java");

        // Optional.mapの引数のFunctionにはStringが渡される。そしてFunctionは
        // Tを返すことを要求される。Optional.mapの戻り値はOptional<T>である。
        var actual = s.map(String::length).get();
        assertThat(actual, is(4));

        // Optional.flatMapの引数のFunctionにもStringが渡されるが
        // FunctionはOptional<T>を返すことを要求される。
        // Optional.flatMapもOptional<T>を返す。
        var actual2 = s.flatMap(v -> Optional.of(v.length())).get();
        assertThat(actual2, is(4));
    }
    
    /**
     * 参考:
     * https://blogs.oracle.com/javamagazine/post/java-quiz-optional-objects
     */
    @Test
    public void nullのOptionalは空のOptionalと等しくなる() {
        var o1 = Optional.ofNullable(0).filter(v -> v == null);
        var o2 = Optional.ofNullable(null);
        assertTrue(o1.equals(o2));
    }

}
