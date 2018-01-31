/**
 * ObjectEqualityEquals
 */

package practicekotlin.kotlininaction.chapter4

private class StudentId(val value: Int) {
    override fun equals(other: Any?): Boolean {
        return if (other is StudentId) {
            value == other.value
        } else {
            false
        }
    }
}

private class MyStudent(val name: String, val id: StudentId) {
    override fun equals(other: Any?): Boolean {
        // otherがnullならfalse
        return if (other is MyStudent) {
            name == other.name && id == other.id
        } else {
            false
        }
    }
}

fun main(args: Array<String>) {
    val s1 = MyStudent("foo", StudentId(1))
    val s2 = MyStudent("foo", StudentId(2))
    println("s1 == s2: ${s1 == s2}")
    val s3 = MyStudent("foo", StudentId(1))
    println("s1 == s3: ${s1 == s3}")

    val str: Any? = null
    println(str is String) // false
}
