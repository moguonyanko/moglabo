/**
 * DataClassesAndImmutabilityTheCopyMethod
 */

package practicekotlin.kotlininaction.chapter4

import java.util.*

private data class MyItem2(val name: String, val price: Int) {
    override fun equals(other: Any?): Boolean {
        // わざとnameだけで比較している。
        return if (other is MyItem2) {
            name == other.name
        } else {
            false
        }
    }

    // わざとnameでハッシュ値を計算させている。
    override fun hashCode() = Objects.hash(name)
}

fun main(args: Array<String>) {
    val item = MyItem2("ニッパー", 2490)
    val copiedItem = item.copy(price = 1980)
    // コピー元のプロパティは変化しない。
    println(item)
    // コピーされたdata classのオブジェクトもequalsの内容に従って比較される。
    // プロパティの値を変更してコピーしたとしてもそのプロパティがequalsで
    // 考慮されていなければ比較結果には全く影響が無い。
    println("Item == CopiedItem: ${item == copiedItem}")
}
