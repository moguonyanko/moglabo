package moglabo.practicejava.lang.animal.base;

/**
 * 参考
 * https://blogs.oracle.com/javamagazine/post/java-abstract-classes-methods-modifiers
 */
public abstract class AbstractAnimal {
    /**
     * protectedを外すとAccessibilityTestクラス内のSampleDogクラスでコンパイルエラーになる。
     */
    abstract protected String cry();
}
