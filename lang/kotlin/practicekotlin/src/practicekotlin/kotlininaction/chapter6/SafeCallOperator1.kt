/**
 * 6.1.3.2 SafeCallOperator1
 */

package practicekotlin.kotlininaction.chapter6

private class Driver(val name: String)

private class Car(val name: String, val driver: Driver?)

private fun getDriverName(car: Car) = car.driver?.name

fun main(args: Array<String>) {
    val driver = Driver("mike")
    val normalCar = Car("my car", driver)
    val unmannedCar = Car("car2", null)
    println(getDriverName(normalCar))
    println(getDriverName(unmannedCar))
}
