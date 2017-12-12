package practicekotlin.examples.helloworld

/**
 * An object-oriented Hello
 */

private class Greeter(val name: String) {
    fun greet() {
        println("こんにちは、$name")
    }
}

fun main(args: Array<String>) {
    val name = if (!args.isEmpty()) args[0] else "no name"
    Greeter(name).greet()
}
