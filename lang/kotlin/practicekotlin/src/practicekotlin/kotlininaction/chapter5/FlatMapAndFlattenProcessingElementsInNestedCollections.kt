/**
 * FlatMapAndFlattenProcessingElementsInNestedCollections
 */

package practicekotlin.kotlininaction.chapter5

fun main(args: Array<String>) {
    val names = arrayListOf("foo", "bar", "baz")
    val result = names.flatMap(String::toList)
    println(result)
}
