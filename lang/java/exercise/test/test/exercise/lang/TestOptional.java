package test.exercise.lang;

import java.util.ArrayList;
import java.util.List;
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
                if (value != null) {
                    return Optional.of(value);
                } else {
                    return Optional.of("not null");
                }
            })
            .map(String::toUpperCase)
            .or(() -> Optional.of("NULL"))
            .get();

        assertThat(actual, is("NULL"));

        // Optionalの目的の1つにnullチェックの排除があるのだから、
        // nullを含むOptionalに対してはOptional.mapもOptional.flatMapも
        // 何も行わないのである。
    }
}
