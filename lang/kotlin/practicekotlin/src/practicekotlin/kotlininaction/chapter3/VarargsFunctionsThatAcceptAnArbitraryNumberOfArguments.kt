/**
 * VarargsFunctionsThatAcceptAnArbitraryNumberOfArguments
 */

package practicekotlin.kotlininaction.chapter3

fun main(args: Array<String>) {
    // arrayListOfで生成されるのはArrayList。Arrayではない。
    val sample = arrayOf("Foo", "Bar", "Baz")
    val list = listOf("values: ", *sample)
    println(list)
}
