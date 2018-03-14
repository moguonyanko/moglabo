/**
 * EssentialsFilterAndMap4
 */

package practicekotlin.kotlininaction.chapter5

fun main(args: Array<String>) {
    val map = mapOf("foo" to 100, "bar" to 80, "baz" to 90)
    // mapValuesに副作用はない。
    val result = map.mapValues { 100 - it.value }
    println("Original map = $map")
    println("New map = $result")
}
