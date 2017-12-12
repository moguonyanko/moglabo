package practicekotlin.examples.helloworld

/**
 * A multi-language Hello
 */

fun main(args: Array<String>) {
    val language = if (!args.isEmpty()) args[0] else "JA"
    println(when (language) {
        "JA" -> "こんにちは"
        "EN" -> "Hello"
        else -> "$language には未対応です"
    })
}
