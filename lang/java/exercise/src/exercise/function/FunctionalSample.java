package exercise.function;

/**
 * 参考:
 * JavaMagazine Vol.39
 */
public class FunctionalSample {
    private final IA ia = () -> System.out.println("Functional A");
    // 抽象メソッド1つしか実装されていない抽象クラスであっても
    // 関数型インターフェースにはなれない。以下はコンパイルエラーとなる。
    //private final AA aa = () -> System.out.println("Functional B");

    public static void main(String[] args) {
        var sample = new FunctionalSample();
        sample.ia.func();

        (new AB("Hey") {
            void func() {
                System.out.println(this.comment);
            }
        }).func();

        (new AB() {
            void func() {
                System.out.println(this.comment);
            }
        }).func();

        IB ib = () -> System.out.println(100);
        ib.execute();
    }
}

interface IA {
    void func();
}

interface IB {
    void func();
    default void execute() {
        func();
    }
}

abstract class AA {
    abstract void func();
}

abstract class AB {
    String comment;
    AB() {
        this("Hello");
    }
    AB(String comment) {
        this.comment = comment;
    }
    abstract void func();
}