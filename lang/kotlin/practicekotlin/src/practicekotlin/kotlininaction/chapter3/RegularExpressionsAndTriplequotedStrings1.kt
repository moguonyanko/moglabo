/**
 * RegularExpressionsAndTriplequotedStrings1
 */

package practicekotlin.kotlininaction.chapter3

fun main(args: Array<String>) {
    // """で囲むことによって.のエスケープ文字が1個だけで済む。
    // "で囲んだ場合 \\. のように2個書かなければならない。
    val regex = """(.+)\.(.+)-(.+)""".toRegex()
    val result = regex.matchEntire("012.3456-7890")
    if (result != null) {
        val (one, two, three) = result.destructured
        println("$one, $two, $three")
    }
}
