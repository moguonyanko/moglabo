/**
 * Rectangle
 */

package practicekotlin.kotlininaction.chapter2

import java.util.Random

data class Rectangle(private val width: Double, private val height: Double) {
    val isSquare: Boolean get() = width == height
}

fun createRandomRectangle(): Rectangle {
    val random = Random(10)
    val rect = Rectangle(random.nextDouble(), random.nextDouble())
    println(rect)
    return rect
}
