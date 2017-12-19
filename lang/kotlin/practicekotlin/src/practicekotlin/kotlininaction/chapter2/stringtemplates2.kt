/**
 * StringTemplates2
 */

package practicekotlin.kotlininaction.chapter2

fun main(args: Array<String>) {
    println("こんにちは ${if(args.isNotEmpty()) args[0] else "名無し"}")
}
