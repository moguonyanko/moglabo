/**
 * EssentialsFilterAndMap1
 */

package practicekotlin.kotlininaction.chapter5

private data class SampleCar(val name: String, val speed: Int = 0)

fun main(args: Array<String>) {
    val cars = listOf(SampleCar("MyCar", 120), SampleCar("YourCar", 200))
    val result = cars.filter { it.speed > 150 }
    println(result)
}
