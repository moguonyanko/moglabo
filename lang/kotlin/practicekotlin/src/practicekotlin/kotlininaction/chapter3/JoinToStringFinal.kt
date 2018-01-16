/**
 * JoinToStringFinal
 */

package practicekotlin.kotlininaction.chapter3

// Collectionを拡張して関数を追加している。
fun <T> Collection<T>.joinToString(
    separator: String = ":",
    prefix: String = "(",
    postfix: String = ")"
): String {
    val result = StringBuilder(prefix)

    for ((index, element) in this.withIndex()) {
        if (index > 0) {
            result.append(separator)
        }
        result.append(element)
    }

    return result.append(postfix).toString()
}

fun main(args: Array<String>) {
    val set = setOf("H", "E", "L", "L", "O")
    val result = set.joinToString(
            separator = ",",
            prefix = "[",
            postfix = "]"
    )
    println(result)
}
