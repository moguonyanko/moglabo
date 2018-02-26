/**
 * MemberReferences1
 */

package practicekotlin.kotlininaction.chapter5

private data class Rect(val width: Int, val height: Int) {
    override fun toString() = "This rectangle size is ${width}x$height"
}

fun main(args: Array<String>) {
    val createRect = ::Rect
    val rect = createRect(300, 400)
    println(rect)
}
