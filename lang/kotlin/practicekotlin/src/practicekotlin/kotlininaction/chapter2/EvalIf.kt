/**
 * EvalIf
 */

package practicekotlin.kotlininaction.chapter2

interface Expr

class Term(val value: Double): Expr

class Multi(val left: Expr, val right: Expr): Expr

private fun eval(e: Expr): Double =
        // returnを書いたらコンパイルエラー
        if (e is Term) {
            e.value
        } else if (e is Multi) {
            eval(e.left) * eval(e.right)
        } else {
            throw IllegalArgumentException("Illegal: $e")
        }

fun main(args: Array<String>) {
    val x = Multi(Multi(Term(19.3), Term(1.4)),
            Multi(Term(7.7), Term(0.0))) // 0ではDoubleとして解釈されない。
    println(eval(x))
}
