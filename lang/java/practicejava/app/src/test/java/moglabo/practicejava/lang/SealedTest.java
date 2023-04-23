package moglabo.practicejava.lang;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

sealed class Animal permits Cat, Dog {} 

final class Cat extends Animal {}

final class Dog extends Animal {}

public class SealedTest {
    
    @Test
    void sealedクラスを使用できる() {
        var cat = new Cat();
        var dog = new Dog();
        assertNotNull(cat);
        assertNotNull(dog);
    }
    
}
