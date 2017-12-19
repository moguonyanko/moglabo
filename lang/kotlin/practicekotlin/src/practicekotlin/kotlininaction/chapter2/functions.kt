/**
 * Functions
 */

package practicekotlin.kotlininaction.chapter2

fun isMultiple(a: Int, b: Int): Boolean {
    return a % b == 0
}

fun main(args: Array<String>) {
    val a = 49
    val b = 8

    println("$a is${if(isMultiple(a, b)) "" else " not"} a multiple of $b")
}
