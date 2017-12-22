/**
 * TryCatchAndFinally
 */

package practicekotlin.kotlininaction.chapter2

import java.io.BufferedReader
import java.io.StringReader

private fun readNumber(source: String): Double? {
    val reader = BufferedReader(StringReader(source))
    return try {
        val line = reader.readLine()
        line.toDouble()
    } catch (e: NumberFormatException) {
        System.err.println(e.message)
        null
    } finally {
        reader.close()
    }
}

fun main(args: Array<String>) {
    println(readNumber("1.5d"))
    println(readNumber(".12"))
    println(readNumber("-.1"))
    println(readNumber("a"))
}
