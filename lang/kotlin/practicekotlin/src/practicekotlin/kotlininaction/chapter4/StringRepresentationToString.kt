/**
 * StringRepresentationToString
 */

package practicekotlin.kotlininaction.chapter4

private class MyMember(val name: String, val age: Int) {
    override fun toString() = "My name is $name, I am $age years old."
}

fun main(args: Array<String>) {
    val member = MyMember(name = "Taro", age = 20)
    println(member)
}
