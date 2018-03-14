/**
 * AllAnyCountAndFindApplyingAPredicateToACollection
 */

package practicekotlin.kotlininaction.chapter5

private data class Student4(val name: String, val score: Int)

private val passed = { student: Student4 -> student.score >= 80 }

fun main(args: Array<String>) {
    val students = listOf(Student4("mike", 79), Student4("pola", 91),
            Student4("joe", 87))
    val isAllStudentsPassed = students.all(passed)
    println(isAllStudentsPassed)
}
