/**
 * CreatingCollectionsInKotlin1
 */

package practicekotlin.kotlininaction.chapter3

fun main(args: Array<String>) {
    val names = listOf("taro", "mike", "peter")
    println(names.last { it.startsWith("m", false) })
    val scores = setOf(90, 65, 78, 60, 35, 54)
    println(scores.filter { it < 70 }.max())
}
