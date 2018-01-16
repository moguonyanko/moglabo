/**
 * UtilityFunctionsAsExtensions1
 */

package practicekotlin.kotlininaction.chapter3

fun main(args: Array<String>) {
    val list = arrayListOf("h", "e", "l", "l", "o")
    // 引数名を省略した場合，第1引数から割り当てられる。
    val result1 = list.joinToString(" ")
    println(result1)
    val result2 = list.joinToString(postfix = "!!!")
    println(result2)
}
