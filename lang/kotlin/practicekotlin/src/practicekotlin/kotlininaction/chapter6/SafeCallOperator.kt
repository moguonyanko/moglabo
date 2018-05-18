/**
 * 6.1.3.1 SafeCallOperator
 */

package practicekotlin.kotlininaction.chapter6

// nullに対してメソッドを呼び出しても?が付いている場合は例外は発生しない。
// ただnullが返される。
// Null許容型は Nothing?型を受け取れるようになっている。
private fun square(n: Int?): Int? = n?.times(n)

// Null許容型でない変数に?を付けてもエラーにはならない。
private fun squareNonNull(n: Int) = n.times(n)

fun main(args: Array<String>) {
    println(square(9))
    println(squareNonNull(8))
    val n = null // Nothing?型になっている。
    println(square(n))
    //println(squareNonNull(n)) // IntはNothing?型の変数を受け取ればいのでエラー。
}
