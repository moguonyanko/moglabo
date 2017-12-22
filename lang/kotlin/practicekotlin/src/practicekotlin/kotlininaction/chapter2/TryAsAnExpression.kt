/**
 * TryAsAnExpression
 */

package practicekotlin.kotlininaction.chapter2

import java.io.BufferedReader
import java.io.StringReader

private class MyBufferedReader(s: String): AutoCloseable {
    var bufferedReader: BufferedReader? = null

    init {
        bufferedReader = BufferedReader(StringReader(s))
    }

    fun read() = bufferedReader?.readLine()?.toDouble()

    override fun close() {
        bufferedReader?.close()
        println("Closed: ${this.javaClass.name}")
    }
}

private fun readDoubleNumber(param: String): Double {
    val reader = MyBufferedReader(param)
    val result = try {
        reader.read()
    } catch (e: NumberFormatException) {
        println("Not a number: ${e.message}")
        // 戻り値がAny型ならば以下のnullは書かなくてもコンパイルエラーにならない。
        null
    } finally {
        // 自動でcloseが呼び出される仕組みは存在しない？
        reader.close()
    }
    return result!!
}

fun main(args: Array<String>) {
    // NaNはtoDoubleでDoubleに変換可能
    val result = readDoubleNumber("NaN")
    println(result)
}
