/**
 * 5.5.1.2 TheWithFunction1
 */

package practicekotlin.kotlininaction.chapter5

private fun alphabet(): String {
    val sb = StringBuffer()
    // JavaScriptのwithと同じ振る舞いのように見える。
    return with(sb) {
        // this.appendやthis.toStringのthisは省略可。
        ('A'..'Z').asSequence().forEach { append(it) }
        toString()
    }
}

fun main(args: Array<String>) {
    println(alphabet())
}
