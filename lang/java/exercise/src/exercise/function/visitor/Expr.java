package exercise.function.visitor;

/**
 * 参考：
 * 「Javaとピザとデザインパターン」（ソフトバンク）
 */
public class Expr<T> {

    private final T left;
    private final T right;

    public Expr(T l, T r) {
        this.left = l;
        this.right = r;
    }
    
    public T accept(ExprVisitor<T> visitor){
        return visitor.apply(left, right);
    }

}
