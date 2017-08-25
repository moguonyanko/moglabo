package exercise.lang;

public class InterfaceMethodPracticeImpl implements InterfaceMethodPractice {
    public static void main(String[] args) {
        InterfaceMethodPractice practice = new InterfaceMethodPracticeImpl();
        System.out.println(practice.greet());
    }
}
