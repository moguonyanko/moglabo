package moglabo.practicejava.lang;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

import moglabo.practicejava.lang.animal.Animal;

public class AccessibilityTest {
    
    /**
     * 参考
     * https://blogs.oracle.com/javamagazine/post/java-access-modifier-private-default-protected-public
     */
    private static class Cat extends Animal {
        private void test(Animal animal) {
            // this.walk()と同じ。ここのthisはCat型でありwalk()を参照することが
            // protectedによって許容されている。
            walk();
            // jumpはデフォルトスコープなのでパッケージ外からはアクセスできない。
            // jump();
            // animal.jump();
            
            // animalはAnimal型である。walk()を参照できるのはAnimalのサブクラスだけなので
            // コンパイルエラーになってしまう。thisとanimalが同じオブジェクトを指している
            // としてもエラーになってしまう。publicなら問題なくコンパイルして実行できる。
            // animal.walk();
            // 実行時の型はCatなのでキャストしてやればコンパイルできる。
            ((Cat)animal).walk();
        }
    }
    
    @Test
    void 継承したメソッドを呼び出せる() {
        var cat = new Cat();
        cat.test(cat);
    }
    
}
