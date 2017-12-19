/**
 * StringTemplates1
 */

package practicekotlin.kotlininaction.chapter2

fun main(args: Array<String>) {
    var name = "no name"
    if (!args.isEmpty()) {
        name = args[0]
    } else {
        println("Arguments are empty!")
    }
    println("Hello, $name")
}
