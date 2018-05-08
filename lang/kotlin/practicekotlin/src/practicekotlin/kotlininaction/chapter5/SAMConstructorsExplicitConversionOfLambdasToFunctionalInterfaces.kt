/**
 * SAMConstructorsExplicitConversionOfLambdasToFunctionalInterfaces
 */

package practicekotlin.kotlininaction.chapter5

import java.util.concurrent.Callable
import kotlin.streams.toList

private fun createSquareCallable(n: Int): Callable<Int> = Callable { n * n }

fun main(args: Array<String>) {
    val generators = generateSequence(1) { it + 1 }

    // KotlinのSequenceとJavaのStreamでは有するメソッドが異なる。
    // 例えばpeekはStreamにしか存在しない。
    val callers = generators.takeWhile { it <= 10 }
            .map { createSquareCallable(it) }
            .toList()

    // parallelStreamではなくstreamとすると全てのタスクは
    // mainスレッドで実行される。
    val results = callers.parallelStream()
            .peek { println(Thread.currentThread().name) }
            .map { it.call() }

    println(results.toList())
}
