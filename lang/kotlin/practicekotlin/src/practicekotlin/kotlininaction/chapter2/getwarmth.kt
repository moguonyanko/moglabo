/**
 * GetWarmth
 */

package practicekotlin.kotlininaction.chapter2

private enum class WarmthColor {
    RED, BLUE, GREEN, YELLOW, ORANGE, WHITE, BLACK
}

private fun getWarmth(color: WarmthColor) = when(color) {
    WarmthColor.BLUE, WarmthColor.WHITE -> "冷たい"
    WarmthColor.GREEN -> "そうでもない"
    WarmthColor.RED, WarmthColor.YELLOW, WarmthColor.ORANGE -> "暖かい"
    // enumの要素を全て分類していない時にelseが無いとコンパイルエラーになる。
    else -> "よく分からない"
}

fun main(args: Array<String>) {
    val result = WarmthColor.values()
            .map { "${it.name} is ${getWarmth(it)}" }
            .reduce { acc, s -> "$acc\n$s" }
    println(result)
}
