/**
 * FlatMapAndFlattenProcessingElementsInNestedCollections1
 */

package practicekotlin.kotlininaction.chapter5

private data class Car1(val name: String, val params: List<Int>)

fun main(args: Array<String>) {
    val cars = listOf(Car1("my car", listOf(10, 20, 30)),
            Car1("your car", listOf(10, 20, 30)),
            Car1("hobby car", listOf(1, 2, 3)),
            Car1("super car", listOf(1000, 20000, 10000)),
            Car1("big car", listOf(102, 210, 300)))

    val result = cars.flatMap { it.params }.toSet()
    println(result)
}
