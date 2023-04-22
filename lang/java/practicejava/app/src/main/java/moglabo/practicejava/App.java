package moglabo.practicejava;

public class App {

    public String getGreeting() {
        return "Bon voyage!";
    }

    public static void main(String[] args) {
        System.out.println(new App().getGreeting());
    }
}
