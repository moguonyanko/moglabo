/**
 * Null-checks
 */

fun parseDouble(s: String): Double? {
    try {
        return s.toDouble()
    } catch (err: NumberFormatException) {
        println("$s は数値ではありません")
    }
    return null
}

fun main(args: Array<String>) {
    if (args.size <= 1) {
        return
    }

    val x = parseDouble(args[0])
    val y = parseDouble(args[1])

    if (x != null && y != null) {
        println("$x * $y = ${x * y}")
    } else {
        println("パラメータにnullが含まれています")
    }
}
