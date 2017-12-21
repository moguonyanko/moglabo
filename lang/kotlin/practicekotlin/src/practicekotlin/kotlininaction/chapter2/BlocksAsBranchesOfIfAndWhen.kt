/**
 * BlocksAsBranchesOfIfAndWhen
 */

package practicekotlin.kotlininaction.chapter2

private class DummyNum(val value: Int): Expr

fun evalWithLogging(e: Expr): Double =
        when(e) {
            is Term -> {
                println("Term consists of ${e.value}")
                e.value
            }
            is Multi -> {
                val l = evalWithLogging(e.left)
                val r = evalWithLogging(e.right)
                println("$l * $r")
                l * r
            }
            else -> {
                val msg = "Illegal argument: $e"
                throw IllegalArgumentException(msg)
            }
        }

fun main(args: Array<String>) {
    val x = Multi(Multi(Term(3.5), Term(10.0)), DummyNum(100))
    try {
        evalWithLogging(x)
    } catch (e: Exception) {
        println(e.message)
    }
}
