/**
 * ChangingAccessorVisibility
 */

package practicekotlin.kotlininaction.chapter4

private class IntCounter(initial: Int = 0) {
    // private setであってもvalでは宣言できない。
    var count = initial
        private set

    fun inc() = ++count
}

fun main(args: Array<String>) {
    val counter = IntCounter(initial = 10)
    while (counter.count < 100) {
        counter.inc()
    }
    // private setによりclass外部からの値代入はできない。
    // counter.count = 0
    println(counter.count)
}
