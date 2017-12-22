/**
 * UsingAnInCheck1
 */

package practicekotlin.kotlininaction.chapter2

private fun distinct(c: Char) = when (c) {
    in 'a'..'z', in 'A'..'Z' -> "アルファベット"
    in '0'..'9' -> "数値"
    else -> "不明"
}

fun main(args: Array<String>) {
    "1ka=hd&4!0A-6".toCharArray().forEach {
        println("$it: ${distinct(it)}")
    }
}
