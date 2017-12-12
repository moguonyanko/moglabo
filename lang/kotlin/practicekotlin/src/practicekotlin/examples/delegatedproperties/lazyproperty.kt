/**
 * Lazy property
 */

package practicekotlin.examples.delegatedproperties

private class MyLazy {
    val name: String by lazy {
        // ここでnameプロパティを参照するとスタックオーバーフローになる。
        println("lazy property is accessed")
        // 2回目以降のプロパティ参照では以下のコードだけが評価され値が返される。
        "I am lazy!"
    }
}

fun main(args: Array<String>) {
    val obj = MyLazy()
    println("lazy property: ${obj.name}")
    println("lazy property: ${obj.name}")
}
