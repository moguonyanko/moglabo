/**
 * IteratingOverNumbersRangesAndProgressions1
 */

package practicekotlin.kotlininaction.chapter2

fun main(args: Array<String>) {
    // 以下のコードから直接forEachを呼び出すことはできない。
    //(i in 30 downTo 1 step 2)
    // inの右辺値からdownToの値までstepの値ずつ下っていく。
    for (i in 30 downTo 1 step 3) {
        println(fizzBuzz(i))
    }
}
