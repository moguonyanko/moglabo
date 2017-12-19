/**
 * StringTemplates
 */

package practicekotlin.kotlininaction.chapter2

fun main(args: Array<String>) {
    println("Welcome, ${if(args.isNotEmpty()) args[0] else "no name"}")
}
