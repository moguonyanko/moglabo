package practicekotlin.examples.helloworld

/**
 * Reading a name from the command line
 *
 * 参考:
 * https://try.kotlinlang.org/
 */

fun main(args: Array<String>) {
    if (args.isEmpty()) {
        println("名前を示す引数がありません")
        return
    }
    println("こんにちは、${args[0]}")
}
