package practicekotlin.examples.basicsyntax

/**
 * Use when
 */

fun main(args: Array<String>) {
    println(cases(0))
    println(cases(false))
    println(cases(10.5))
    println(cases("こんにちは"))
    println(cases(fun() {}))
    println(cases(MySampleSubClass()))
}

private open class MySampleClass() {}

private class MySampleSubClass(): MySampleClass() {}

fun cases(obj: Any): String {
    return when (obj) {
        0 -> "Zero"
        "こんにちは" -> "Greeting"
        is Double -> "Double value"
        is Boolean -> "Boolean"
        is MySampleClass -> "My sample class"
        is Function<*> -> "Function"
        !is String -> "Not a string"
        else -> "Unknown"
    }
}