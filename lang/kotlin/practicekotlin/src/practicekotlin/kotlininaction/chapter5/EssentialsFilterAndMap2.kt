/**
 * EssentialsFilterAndMap2
 */

package practicekotlin.kotlininaction.chapter5

fun main(args: Array<String>) {
    val data = setOf(1, 2, 3, 1, 2, 1, 3, 3, 3, 3, 3, 2, 2, 2)
    val result = data.map { it * it }
    println(result)
}
