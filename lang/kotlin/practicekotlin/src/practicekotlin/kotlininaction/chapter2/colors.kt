/**
 * colors
 */

package practicekotlin.kotlininaction.chapter2

// Kotlinのenumはclassと明示する必要がある。
private enum class Color {
    RED, BLUE, YELLOW, ORANGE, WHIZTE, BLACK
}

fun main(args: Array<String>) {
    Color.values().forEach { System.out.println(it) }
}
