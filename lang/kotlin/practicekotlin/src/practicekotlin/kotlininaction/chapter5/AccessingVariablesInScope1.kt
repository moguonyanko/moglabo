/**
 * AccessingVariablesInScope1
 */

package practicekotlin.kotlininaction.chapter5

private fun sumOverrNumbers(values: Collection<Int>, limit: Int = 0): Int {
    var result = 0
    // ラムダ式の内部から外部の変数を変更できる。
    values.forEach { if(it > limit) result += it }
    return result
}

fun main(args: Array<String>) {
    val values = listOf(1, 10, 90, -23, 51)
    println(sumOverrNumbers(values, 50))
}
