/**
 * 5.5.2.2 TheApplyFunction1
 */

package practicekotlin.kotlininaction.chapter5

// buildStringはwithを使った以下の構文の省略形と考えられる。
// with(StringBuilder()){ /* 何らかの処理 */ toString() }
private fun numbers(min: Int, max: Int) = buildString {
    for (number in min..max) {
        append(number)
    }
}

fun main(args: Array<String>) {
    println(numbers(0, 10))
}
