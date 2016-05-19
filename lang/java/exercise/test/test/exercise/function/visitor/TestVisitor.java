package test.exercise.function.visitor;

import org.junit.Test;

import exercise.function.visitor.Expr;
import exercise.function.visitor.ExprVisitor;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

/**
 * 参考：
 * 「Javaとピザとデザインパターン」（ソフトバンク）
 * 
 * VisitorパターンのVisitorとは異なるもののように思える。
 * 
 */
public class TestVisitor {

    @Test
    public void 加算のビジターで計算できる(){
        ExprVisitor<Integer> visitor = (l, r) -> l + r;
        Expr<Integer> expr = new Expr<>(3, 7);
        
        int expected = 10;
        int actual = expr.accept(visitor);
        
        assertThat(actual, is(expected));
    }
    
    @Test
    public void 減算のビジターで計算できる(){
        ExprVisitor<Integer> visitor = (l, r) -> l - r;
        Expr<Integer> expr = new Expr<>(10, 5);
        
        int expected = 5;
        int actual = expr.accept(visitor);
        
        assertThat(actual, is(expected));
    }
    
    @Test
    public void 乗算のビジターで計算できる(){
        ExprVisitor<Integer> visitor = (l, r) -> l * r;
        Expr<Integer> expr = new Expr<>(2, 8);
        
        int expected = 16;
        int actual = expr.accept(visitor);
        
        assertThat(actual, is(expected));
    }
    
    @Test
    public void 除算のビジターで計算できる(){
        ExprVisitor<Double> visitor = (l, r) -> l / r;
        Expr<Double> expr = new Expr<>(10d, 2d);
        
        double expected = 5.0d;
        double actual = expr.accept(visitor);
        
        assertThat(actual, is(expected));
    }
    
}
