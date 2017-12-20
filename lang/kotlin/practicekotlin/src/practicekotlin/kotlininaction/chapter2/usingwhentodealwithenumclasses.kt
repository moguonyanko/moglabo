/**
 * UsingWhenToDealWithEnumClasses
 */

package practicekotlin.kotlininaction.chapter2

private enum class EnColor {
    RED, BLUE, YELLOW, ORANGE, GREEN
}

private fun getJpColorName(color: EnColor) =
    when (color) {
        EnColor.RED -> "赤"
        EnColor.BLUE -> "青"
        EnColor.YELLOW -> "黄"
        EnColor.ORANGE -> "橙"
        EnColor.GREEN -> "緑"
    }

fun main(args: Array<String>) {
    EnColor.values().forEach {
        println("$it = ${getJpColorName(it)}")
    }
}
