/**
 * 5.5.2.1 TheApplyFunction
 */

package practicekotlin.kotlininaction.chapter5

private fun sum(min: Int, max: Int) = arrayListOf<Int>().apply {
    (min..max).forEach { add(it * 2) }
}.sum() // ここで終端処理を呼び出さないと意図した結果は得られない。

fun main(args: Array<String>) {
    println(sum(1, 10))
}
