package moglabo.practicejava.lang.animal;

public class Animal {

    /**
     * protectedでAnimalのサブクラスの型を持つオブジェクト経由でのアクセスのみ許容する。
     * publicならAnimal型のオブジェクトであれば何でもアクセスできる。
     */
    protected void walk() {
        System.out.println("TokoToko");
    }

    void jump() {
        System.out.println("Pyon!");
    }
    
    public static void main(String[] args) {
        var animal = new Animal();
        animal.walk();
    }
}
