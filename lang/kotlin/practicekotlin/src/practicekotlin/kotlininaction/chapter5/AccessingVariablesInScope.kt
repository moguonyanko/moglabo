/**
 * AccessingVariablesInScope
 */

package practicekotlin.kotlininaction.chapter5

private fun getUpperNames(names: Collection<String>, suffix: String = ""):
        Collection<String> {
    return names.map { "${it.toUpperCase()}$suffix" }
}

fun main(args: Array<String>) {
    val names = arrayListOf("foo", "bar", "baz")
    println(getUpperNames(names, "!!!"))
}
