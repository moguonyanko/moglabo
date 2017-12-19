/**
 * CustomAccessors
 */

package practicekotlin.kotlininaction.chapter2

private class Person(val name: String, val age: Int) {
    val grown: Boolean
        get() {
            return age >= 20
        }
}

fun main(args: Array<String>) {
    val person = Person("taro", 21)
    println("Is ${person.name} grown up?: ${person.grown}")
}
