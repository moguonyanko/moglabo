/**
 * GroupByConvertingAListToAMapOfGroups
 */

package practicekotlin.kotlininaction.chapter5

import java.util.Objects

private data class Person1(val name: String, val age: Int, val code: String) {
    override fun equals(other: Any?): Boolean =
        when (other) {
            is Person1 -> code == other.code
            else -> false
        }

    override fun hashCode(): Int = Objects.hash(name, age, code)

    fun getFirstCode() = code.first()
}

fun main(args: Array<String>) {
    val persons = setOf(Person1("hoge", 19, "A001"), Person1("taro", 76, "A002"),
            Person1("fuga", 34, "B001"), Person1("hoge", 19, "C001"))
    val minors = persons.groupBy { it.age < 20 }
    println(minors)

    val list = persons.toList()
    println(list.groupBy(Person1::getFirstCode))
    //println(list.groupBy { it.code.first() })
}

