/**
 * JoinToString
 */

package practicekotlin.kotlininaction.chapter3

private fun <T> joinToString(
        collection: Collection<T>,
        separator: String,
        prefix: String,
        postfix: String
): String {
    val result = StringBuilder(prefix)

    for ((index, element) in collection.withIndex()) {
        if (index > 0) {
            result.append(separator)
        }
        result.append(element)
    }

    return result.append(postfix).toString()
}

fun main(args: Array<String>) {
    val set = setOf("One", "Two", "One", "Two", "Three")
    val result = joinToString(set, "♪", "[", "]")
    println(result)
}
