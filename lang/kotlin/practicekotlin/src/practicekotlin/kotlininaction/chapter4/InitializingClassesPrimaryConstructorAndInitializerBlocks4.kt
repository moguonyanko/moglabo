/**
 * InitializingClassesPrimaryConstructorAndInitializerBlocks4
 */

package practicekotlin.kotlininaction.chapter4

// デフォルト値を指定しても明示的な型の指定は必要。
// 型推論されない。　
private class MyUser3(val name: String,
                      val admin: Boolean = false) {
    override fun toString(): String {
        // 三項演算子は存在しない？
        val tmp = if (admin) "" else "not"
        return "$name is $tmp administrator."
    }
}

fun main(args: Array<String>) {
    val u1 = MyUser3("foo", false)
    println(u1)
    val u2 = MyUser3("bar")
    println(u2)
    val u3 = MyUser3("baz", admin = true)
    println(u3)
}
