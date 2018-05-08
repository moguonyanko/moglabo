/**
 * ExecutingSequenceOperationsIntermediateAndTerminalOperations1
 */

package practicekotlin.kotlininaction.chapter5

fun main(args: Array<String>) {
    val list = listOf("banana", "kiwi", "orange", "strawberry", "melon")
            // asSequenceを呼び出した場合は各要素1つずつに対してmapとfilterが
            // 適用される。
            // asSequenceを呼び出さなかった場合はまず全ての要素にmapを適用し、
            // その後で全ての要素にfilterが適用される。
            .asSequence()
            .map { println("Mapped: $it"); it.toUpperCase() }
            .filter { println("Filtered: $it"); it.contains("A") }
            .toList()

    println(list)
}
