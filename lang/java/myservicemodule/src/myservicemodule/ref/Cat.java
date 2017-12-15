package myservicemodule.ref;

public class Cat extends Animal {
    @Override
    public void meow() {
        System.out.println("Nya Nya");
    }

    private void secretMeow() {
        System.out.println("Secret Nya Nya");
    }
}
