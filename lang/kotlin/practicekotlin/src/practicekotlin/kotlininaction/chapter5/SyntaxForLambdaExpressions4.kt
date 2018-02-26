/**
 * SyntaxForLambdaExpressions4
 */

package practicekotlin.kotlininaction.chapter5

fun main(args: Array<String>) {
    val multi = { x: Int, y: Int -> x * y }
    println(multi(9, 10))
}
