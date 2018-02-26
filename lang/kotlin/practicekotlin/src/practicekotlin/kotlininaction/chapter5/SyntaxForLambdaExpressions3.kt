/**
 * SyntaxForLambdaExpressions3
 */

package practicekotlin.kotlininaction.chapter5

private data class Car(val name: String = "no name", val speed: Int = 0)

fun main(args: Array<String>) {
    val cars = listOf(Car("MyCar", 90), Car("SuperCar", 300),
            Car("HobbyCar", 10))
    val joinedName = cars.joinToString(separator = ", ",
            transform = { car -> car.name }) // 右辺の{}は必須。
    println(joinedName)
}
