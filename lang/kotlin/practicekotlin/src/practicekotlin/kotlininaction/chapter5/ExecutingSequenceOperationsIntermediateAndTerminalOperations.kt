/**
 * ExecutingSequenceOperationsIntermediateAndTerminalOperations
 */

package practicekotlin.kotlininaction.chapter5

fun main(args: Array<String>) {
    val result = setOf("Foo", "Baz", "Bar", "Foo", "Baz").asSequence()
            .map { it.toUpperCase() }
            .filter { it.startsWith("B") }
            // filterはコレクションを返してこないので必要なコレクションを渡して
            // toCollectionを呼び出す。
            .toCollection(arrayListOf());

    println("Result -> $result")
}
