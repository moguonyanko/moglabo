/**
 * AllAnyCountAndFindApplyingAPredicateToACollection1
 */

package practicekotlin.kotlininaction.chapter5

private data class Student5(val name: String, val score: Int)

private val passed = { s: Student5 -> s.score >= 80 }

fun main(args: Array<String>) {
    val students = listOf(Student5("foo", 90), Student5("bar", 85),
            Student5("baz", 99))
    val result = students.all(passed)
    println(result)

    println(students.any { it.score >= 90 })
    println(students.find { it.score >= 95 })
}
