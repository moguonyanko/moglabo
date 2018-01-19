/**
 * InnerAndNestedClassesNestedByDefault2
 */

package practicekotlin.kotlininaction.chapter4

import java.io.Closeable

private interface Closer: Closeable

private interface Manager {
    fun getCloser(): Closer
}

private class MyManager(val name: String): Manager {
    override fun getCloser() = MyCloser()

    fun description() = "The manager"

    // innerを付けていないとエンクロージングクラスのプロパティを参照できない。
    inner class MyCloser: Closer {
        fun description() = "The closer"

        override fun close() {
            println(this@MyManager.description())
            println(this.description())
            println("Closed by $name")
        }
    }
}

fun main(args: Array<String>) {
    val manager = MyManager("Taro")
    manager.getCloser().close()
}
