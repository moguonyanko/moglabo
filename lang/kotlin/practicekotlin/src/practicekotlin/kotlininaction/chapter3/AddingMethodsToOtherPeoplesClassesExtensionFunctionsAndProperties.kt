/**
 * AddingMethodsToOtherPeoplesClassesExtensionFunctionsAndProperties
 */

package practicekotlin.kotlininaction.chapter3

// 戻り値の型は型推論により省略可能。
private fun Int.square() = this.times(this).times(this)

fun main(args: Array<String>) {
    println(2.square())
    println(3.square())
    println(4.square())
}
