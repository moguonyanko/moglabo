/**
 * 5.5.1.1 Alphabet
 */

package practicekotlin.kotlininaction.chapter5

private fun alphabet() = ('A'..'Z').asSequence().toList()

fun main(args: Array<String>) {
    println(alphabet().toString())
}
