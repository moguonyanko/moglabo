/**
 * CreatingCollectionsInKotlin
 */

package practicekotlin.kotlininaction.chapter3

fun main(args: Array<String>) {
    val set = hashSetOf("a", "b", "a", "a", "c")
    val arrayList = arrayListOf(6, 5, 3, 1, 7)
    val list = listOf(6, 5, 3, 1, 7)
    // キーが衝突した場合は後勝ち
    val map = hashMapOf("foo" to 60, "bar" to 70, "foo" to 100, "baz" to 80)

    println(set)
    println(set.javaClass)
    println(arrayList)
    println(arrayList.javaClass)
    println(list)
    println(list.javaClass)
    println(map)
    println(map.javaClass)
}
