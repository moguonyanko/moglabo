/**
 * EssentialsFilterAndMap
 */

package practicekotlin.kotlininaction.chapter5

fun main(args: Array<String>) {
    val list = arrayListOf("Hoge", "Foo", "happy", "Bar", "Baz")
    val result = list.filter { it.startsWith("h", ignoreCase = true) }
    println(result)
}
