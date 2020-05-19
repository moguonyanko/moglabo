package exercise.rmi;

public class RemoteIntCalculator implements IntCalculator {

    @Override
    public Integer add(Integer a, Integer b) {
        return a + b;
    }

}
