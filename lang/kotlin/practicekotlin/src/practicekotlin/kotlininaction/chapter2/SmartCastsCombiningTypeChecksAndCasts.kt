/**
 * SmartCastsCombiningTypeChecksAndCasts
 */

package practicekotlin.kotlininaction.chapter2

private interface Text

private class Word(val content: String): Text

private class Sentence(val content1: Text, val content2: Text): Text

private fun buildText(t: Text): String {
    if (t is Word) {
        // Wordのプロパティを参照しているがasを使ったキャストは必要無い。
        return t.content;
    }
    if (t is Sentence) {
        val s1 = buildText(t.content1)
        val s2 = buildText(t.content2)
        return s1 + s2
    }
    throw IllegalArgumentException("Illegal: $t")
}

fun main(args: Array<String>) {
    val s = Sentence(Sentence(Word("こんにちは"), Word("Kotlin")),
            Sentence(Word("Hello"), Word("World")))
    println(buildText(s))
}
