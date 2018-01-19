/**
 * InterfacesInKotlin
 */

package practicekotlin.kotlininaction.chapter4

private interface AttachmentParts {
    fun squeeze(): String
}

private class StarAttachment: AttachmentParts {
    override fun squeeze() = "Star"
}

private class CircleAttachment: AttachmentParts {
    override fun squeeze() = "Circle"
}

fun main(args: Array<String>) {
    val parts = listOf(StarAttachment(), CircleAttachment())
    val figures = parts.map { it.squeeze() }
    println(figures)
}
