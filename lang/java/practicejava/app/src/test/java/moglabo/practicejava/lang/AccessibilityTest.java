package moglabo.practicejava.lang;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

import moglabo.practicejava.lang.animal.Animal;
import moglabo.practicejava.lang.animal.impl.AbstractDog;

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
    
    private static class SampleDog extends AbstractDog {

        @Override
        protected String cry() {
            return "WANWAN";
        }
        
    }
    
    @Test
    void 継承したメソッドを呼び出せる() {
        var cat = new Cat();
        cat.test(cat);
    }
    
    
    @Test
    void アクセシビリティを考慮して抽象メソッドを実装できる() {
        var dog = new SampleDog();
        assertEquals("WANWAN", dog.cry());
    }
}
