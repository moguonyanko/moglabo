/**
 * 1.1_ATasteOfKotlin
 *
 * 参考:
 * https://try.kotlinlang.org/
 * kotlininactionパッケージ内の全てのファイルが上記リンクを参考にしている。
 */

package practicekotlin.kotlininaction.chapter1

private data class Student(val name: String, val score: Int? = null)

fun main(args: Array<String>) {
    val students = setOf(Student("bee"),
            Student("foo", 99),
            Student("bee", null))

    // デフォルト値が適用された上で等しいオブジェクトはSetから除外される。
    println("Students consists of ${students.size} person")

    val maxScoredStudent = students.maxBy { it.score ?: 0 }
    // maxByが返すのはStudent?なのでStudentのプロパティにアクセスするには
    // 変数に?や!!を付ける必要がある。
    println("Max scored student: ${maxScoredStudent?.name}")
}
