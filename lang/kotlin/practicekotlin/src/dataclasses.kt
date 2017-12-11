/**
 * Data classes
 */

private data class Student(val name: String, val score: Int)

// privateを指定していないとコンパイルエラーになる。
// Studentクラスがprivateだからである。
private fun createStudent(): Student {
    return Student("Foo", 98)
}

fun main(args: Array<String>) {
    val student = createStudent()
    println("${student.name} has gotten ${student.score} points")

    val (name, score) = createStudent()
    println("$name has gotten $score points")

    println("${student.component1()} has gotten ${student.component2()} points")
}
