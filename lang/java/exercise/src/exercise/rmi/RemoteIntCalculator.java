package exercise.rmi;

public class RemoteIntCalculator implements Calculator<Integer> {

    @Override
    public int add(Integer a, Integer b) {
        return a + b;
    }

}
