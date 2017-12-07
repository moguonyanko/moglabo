/**
 * Use a conditional expression
 */

fun main(args: Array<String>) {
    if (args.size <= 1) {
        return
    }
    val result = min(args[0].toInt(), args[1].toInt())
    println("${args[0]} and ${args[1]}, $result is less than other")
}

fun min(x: Int, y: Int) = if (x < y) x else y
