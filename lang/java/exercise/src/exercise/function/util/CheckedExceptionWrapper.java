package exercise.function.util;

/**
 * Throwableを継承したクラスはジェネリッククラスにできない。
 */
public class CheckedExceptionWrapper extends RuntimeException {

    private final Exception realException;

    public <X extends Exception> CheckedExceptionWrapper(X realException) {
        this.realException = realException;
    }

    public <X extends Exception> X getRealException() {
        return (X) realException;
    }
}
