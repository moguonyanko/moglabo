package exercise.rmi;

public class RemoteCalculatorException extends Exception {

    RemoteCalculatorException(Throwable e) {
        super(e);
    }

    RemoteCalculatorException(String message) {
        super(message);
    }

}
