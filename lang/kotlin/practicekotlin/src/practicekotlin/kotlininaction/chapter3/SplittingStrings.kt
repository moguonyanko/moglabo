/**
 * SplittingStrings
 */

package practicekotlin.kotlininaction.chapter3

fun main(args: Array<String>) {
    val text = "1,2.3-4\\5%6|7*8?9"
    val regex = "[,.\\-\\\\%|*?]".toRegex()
    println(text.split(regex))
}
