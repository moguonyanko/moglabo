/**
 * 6.1.1 NullableTypes
 */

package practicekotlin.kotlininaction.chapter6

private fun square(n: Int?): Int = if(n != null) n * n else 0

fun main(args: Array<String>) {
    println(square(2))
    val n = null
    println(n + 1) // これはOK
    //println(1 + n) // これはエラー
    println(square(n))
}
