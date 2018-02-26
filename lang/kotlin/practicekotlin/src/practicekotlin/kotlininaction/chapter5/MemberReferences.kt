/**
 * MemberReferences
 */

package practicekotlin.kotlininaction.chapter5

private fun hello()= "Hello!"

fun main(args: Array<String>) {
    val greeting = run(::hello)
    println(greeting)
}
