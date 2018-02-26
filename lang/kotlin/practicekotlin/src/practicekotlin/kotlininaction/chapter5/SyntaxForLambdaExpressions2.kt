/**
 * SyntaxForLambdaExpressions2
 */

package practicekotlin.kotlininaction.chapter5

fun main(args: Array<String>) {
    // runは予約語ではない。
    val greeting = run { "Hello" }
    println("$greeting world")
}
