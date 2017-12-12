package practicekotlin.examples.helloworld

/**
 * Reading many names from the command line
 *
 * 参考:
 * https://try.kotlinlang.org/
 */

fun main(args: Array<String>) {
    for (name in args)
        println("こんにちは、$name")
}
