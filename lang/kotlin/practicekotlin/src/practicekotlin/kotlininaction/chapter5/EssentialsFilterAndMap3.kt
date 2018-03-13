/**
 * EssentialsFilterAndMap3
 */

package practicekotlin.kotlininaction.chapter5

private data class Student3(val name: String, val score: Int)

fun main(args: Array<String>) {
    val students = listOf(Student3("taro", 80), Student3("jiro", 100),
            Student3("saburo", 90))
    val avg = students.map { it.score }
            .reduce { acc, i -> i + acc }
            .div(students.size)
    println("average score: $avg")
}
