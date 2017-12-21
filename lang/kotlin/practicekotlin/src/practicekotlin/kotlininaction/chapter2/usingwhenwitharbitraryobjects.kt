/**
 * UsingWhenWithArbitraryObjects
 */

package practicekotlin.kotlininaction.chapter2

enum class Color2 {
    RED, YELLOW, BLUE, VIOLET, INDIGO, ORANGE, GREEN
}

private fun getMixedColor(c1: Color2, c2: Color2) = when(setOf(c1, c2)) {
    setOf(Color2.RED, Color2.YELLOW) -> Color2.ORANGE
    setOf(Color2.BLUE, Color2.YELLOW) -> Color2.GREEN
    setOf(Color2.BLUE, Color2.VIOLET) -> Color2.INDIGO
    else -> throw Exception("未対応")
}

fun main(args: Array<String>) {
    println(getMixedColor(Color2.VIOLET, Color2.BLUE))
    // Javaにおけるチェック例外とそれに伴う例外処理の強制は存在しないようである。
    // 以下のtry-catchは無くてもコンパイルは成功する。
    try {
        println(getMixedColor(Color2.RED, Color2.BLUE))
    } catch (e: Exception) {
        println(e.message)
    }
}
