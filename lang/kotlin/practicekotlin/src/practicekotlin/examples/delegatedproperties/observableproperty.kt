/**
 * Observable property
 */

package practicekotlin.examples.delegatedproperties

import kotlin.properties.Delegates

private class Car {
    // observableの引数は初期値。
    var speed: Int by Delegates.observable(0) {
        property, old, new -> println("$property: $old -> $new")
    }
}

fun main(args: Array<String>) {
    val car = Car()
    println("Car speed is ${car.speed}")
    car.speed = 100
    println("Now, car speed is ${car.speed}")
}
