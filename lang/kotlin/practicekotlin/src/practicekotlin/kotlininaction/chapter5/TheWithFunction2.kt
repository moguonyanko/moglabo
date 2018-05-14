/**
 * 5.1.3 TheWithFunction2
 */

package practicekotlin.kotlininaction.chapter5

private fun numbers(min: Int, max: Int) = with(arrayListOf<String>()) {
    (min..max).forEach { add(it.toString()) }
    asSequence().joinToString()
}

fun main(args: Array<String>) {
    println(numbers(0, 10))
}
