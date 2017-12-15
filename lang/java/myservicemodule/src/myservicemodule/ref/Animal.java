package myservicemodule.ref;

public abstract class Animal {

    public void enjoy() {
        start();
        meow();
        end();
    }

    private void start() {
        System.out.println("Enjoy start");
    }

    private void end() {
        System.out.println("Enjoy end");
    }

    public abstract void meow();
}
