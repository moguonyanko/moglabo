/**
 * ObjectEqualityEquals1
 */

package practicekotlin.kotlininaction.chapter4

import java.util.*

private data class MyItem(val name: String, val code: String) {
    override fun equals(other: Any?): Boolean {
        return if (other is MyItem) {
            name == other.name && code == other.code
        } else {
            false
        }
    }

    override fun hashCode(): Int = Objects.hash(name, code)
}

fun main(args: Array<String>) {
    val set = hashSetOf(MyItem("トンカチ", "A001"), MyItem("トンカチ", "A002"))
    // ==演算子による比較はclassにhashCodeが実装されていなくても
    // equalsさえ正しく実装されていれば期待通りの結果になる。
    // ただしhashCodeが実装されていないとコンパイル時に警告される。
    println("Equality?: ${MyItem("トンカチ", "A001") == MyItem("トンカチ", "A001")}")
    // HashSet.containsはHashSetに含まれるオブジェクトのclassにhashCodeが
    // 実装されていなければ期待した結果にならない。しかしclassがData classであれば
    // hashCodeが実装されていなくても期待した結果が得られる。
    // Data classの場合はhashCodeが自動生成されているのかもしれない。
    println("Contains?: ${set.contains(MyItem("トンカチ", "A001"))}")
}
