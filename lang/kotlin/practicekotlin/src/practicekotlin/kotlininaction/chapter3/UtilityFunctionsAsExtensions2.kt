/**
 * UtilityFunctionsAsExtensions2
 */

package practicekotlin.kotlininaction.chapter3

// Collection<String>を拡張して関数を追加している。
// 引数の型指定は必須である。
private fun Collection<String>.join(
        separator: String = "-",
        prefix: String = "{",
        postfix: String = "}"
) = joinToString(separator, prefix, postfix)

fun main(args: Array<String>) {
    // Collection<Int>なので上のjoin関数を呼び出すことができない。
    //val numList = arrayListOf(1, 2, 3, 4, 5)
    //val result1 = numList.join();
    val strList = arrayListOf("A", "B", "C")
    val result = strList.join()
    println(result)
}
