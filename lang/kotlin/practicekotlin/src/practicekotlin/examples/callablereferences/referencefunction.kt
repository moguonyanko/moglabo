/**
 * Reference to a function
 */

package practicekotlin.examples.callablereferences

private fun isEven(value: Int) = value % 2 == 0

fun main(args: Array<String>) {
    val values = listOf(43, 3, 2, 6, 96, 1, 8, 10, 22, 75)
    println(values.filter(::isEven))
}
