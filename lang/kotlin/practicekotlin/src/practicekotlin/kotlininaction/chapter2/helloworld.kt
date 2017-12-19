/**
 * HelloWorld
 */

package practicekotlin.kotlininaction.chapter2

fun main(args: Array<String>) {
    println("oooHooHelloWorld".dropWhile { it.equals('o', false) })
}
