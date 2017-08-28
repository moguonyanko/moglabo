package exercise.lang;

/**
 * 参考:
 * https://docs.oracle.com/javase/9/language/toc.htm#JSLAN-GUID-16A5183A-DC0D-4A96-B9D8-AAC9671222DD
 */
public class TryWithResourcesPractice {
    public static void main(String[] args) {
        final MyResource resource1 = new MyResource("Resource1");
        // Effectively final
        MyResource resource2 = new MyResource("Resource2");

        // Java7 or 8
        try (MyResource r1 = resource1; MyResource r2 = resource2) {
            System.out.println("Any work at Java7 or 8");
        }

        // Java9
        // Resourceがfinalあるいはeffectively finalであれば別の変数に代入しなくても
        // try-with-resources文で参照することができる。
        try (resource1; resource2) {
            System.out.println("Any work at Java9");
        }

        MyResource resource3 = new MyResource("Resource3");
        // finalあるいはeffectively finalでなければtry-with-resources文で直接参照することはできない。
        // Resourceをfinalにできない場合，Java7や8のように別の変数に代入する必要がある。
        resource3 = new MyResource("Resource3-1");
        //try (resource3) { // Compile error
        try (MyResource r3 = resource3) {
            System.out.println("Any work at Java9 again");
        }
    }
}

class MyResource implements AutoCloseable {
    private final String id;

    MyResource(String id) {
        this.id = id;
    }

    @Override
    public void close() {
        System.out.println(id + ":Closed");
    }
}
