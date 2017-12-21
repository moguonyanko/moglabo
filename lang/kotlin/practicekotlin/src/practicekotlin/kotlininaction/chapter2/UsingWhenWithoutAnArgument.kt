/**
 * UsingWhenWithoutAnArgument
 */

package practicekotlin.kotlininaction.chapter2

// setOfを使うバージョンの方がColor2の順序を気にしなくてよいので好ましい。
private fun getMixedColorOptimized(c1: Color2, c2: Color2) =
        when {
            (c1 == Color2.RED && c2 == Color2.YELLOW) ||
                    (c1 == Color2.YELLOW && c2 == Color2.RED) -> Color2.ORANGE
            (c1 == Color2.BLUE && c2 == Color2.YELLOW) ||
                    (c1 == Color2.YELLOW && c2 == Color2.BLUE) -> Color2.GREEN
            (c1 == Color2.BLUE && c2 == Color2.VIOLET) ||
                    (c1 == Color2.VIOLET && c2 == Color2.BLUE) -> Color2.INDIGO
            else -> throw UnsupportedOperationException("未対応の色です")
        }

fun main(args: Array<String>) {
    val baseColor = Color2.RED
    Color2.values().forEach {
        try {
            System.out.println("Mixed: ${getMixedColorOptimized(baseColor, it)}")
        } catch (e: UnsupportedOperationException) {
            System.err.println(e.message)
        }
    }
}
