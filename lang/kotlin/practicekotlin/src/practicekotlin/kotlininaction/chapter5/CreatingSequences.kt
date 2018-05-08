/**
 * CreatingSequences
 */

package practicekotlin.kotlininaction.chapter5

fun main(args: Array<String>) {
    val sampleNumbers = generateSequence(4) { it + 4 }
    val numbers = sampleNumbers.takeWhile { it < 120 }
            .filter { it <= 16 || it % 16 == 0 }
            .toList()
    println(numbers)

    val sample2 = generateSequence(0) { it + 1 }
    val sample3 = sample2.takeWhile { it <= 10 }
    val result = sample3.dropWhile { it <= 5 }
    println(result.toList())
    println(result.sum())
}
