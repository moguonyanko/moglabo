/**
 * IteratingOverMaps
 */

package practicekotlin.kotlininaction.chapter2

import java.util.TreeMap

fun main(args: Array<String>) {
    val map = ('A'..'F').associateTo(TreeMap(),
            { Pair(it, Integer.toBinaryString(it.toInt())) } )
    println(map)
    map.entries.forEach { println("${it.key}: ${it.value}") }
}
