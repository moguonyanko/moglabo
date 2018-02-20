/**
 * CompanionObjectsAPlaceForFactoryMethodsAndStaticMembers1
 */

package practicekotlin.kotlininaction.chapter4

import java.util.Random

private fun getRandomItemNumber(bound: Int) = Random().nextInt(bound)

// companion objectはstaticのメンバをまとめて定義するための要素だと理解すれば良いか？
// constructorがprivateで宣言されているのでこのクラス外でコンストラクタを呼び出して
// オブジェクト生成することはできない。
private class MyItem3 private constructor(val name: String, val number: Int = 0) {
    companion object {
        fun newItem(name: String) = MyItem3(name)

        fun newItem(name: String, bound: Int) =
                MyItem3(name, getRandomItemNumber(bound))
    }

    override fun toString() = "$number: $name"
}

fun main(args: Array<String>) {
    // コンストラクタはprivateで宣言されているためコンパイルエラー
    //val item0 = MyItem3("lemon")

    val item1 = MyItem3.newItem("hobby car")
    val item2 = MyItem3.newItem("bike", 10)
    val items = listOf(item1, item2)
    println(items)
}
