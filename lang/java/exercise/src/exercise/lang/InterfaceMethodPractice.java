package exercise.lang;

/**
 * 参考:
 * https://docs.oracle.com/javase/9/language/toc.htm#JSLAN-GUID-E409CC44-9A8F-4043-82C8-6B95CD939296
 */
public interface InterfaceMethodPractice {
    // Java9からはインターフェース内にprivateメソッドを定義できる。
    // デフォルトメソッドのためのヘルパーメソッドとして使うのが適当か。
    private String getPrefix() {
        return "[";
    }
    private String getGreeting() {
        return "Hello";
    }
    private String getSuffix() {
        return "]";
    }
    default String greet() {
        return getPrefix() + getGreeting() + getSuffix();
    }
}
