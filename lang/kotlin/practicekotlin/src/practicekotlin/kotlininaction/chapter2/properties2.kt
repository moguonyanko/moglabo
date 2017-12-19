/**
 * Properties2
 */

package practicekotlin.kotlininaction.chapter2

private class User(
        val name: String,
        var age: Int = 0
)

fun main(args: Array<String>) {
    val user = User("Mike")
    user.age = 20
    print("${user.name} is ${user.age} years old")
}
