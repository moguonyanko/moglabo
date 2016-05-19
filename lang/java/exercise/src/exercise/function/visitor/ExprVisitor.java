package exercise.function.visitor;

/**
 * 参考：
 * 「Javaとピザとデザインパターン」（ソフトバンク）
 */
@FunctionalInterface
public interface ExprVisitor<T> {
    
    T apply(T l, T r);
    
}
