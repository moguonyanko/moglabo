/**
 * Properties in map
 */

package practicekotlin.examples.delegatedproperties

// Map<String, Any?>のAny?がIntだとコンパイルエラーになる。
private class Item(map: Map<String, Any?>) {
    val name: String by map
    val price: Int by map
}

fun main(args: Array<String>) {
    val map = mapOf(
            "name" to "coffee",
            // 以下のpriceの値を"Hello"等のString値にしてもコンパイルは通ってしまう。
            // 実行するとClassCastExceptionがスローされる。
            // "120"にしても暗黙の型変換は行われずClassCastExceptionがスローされる。
            // これはその方が好ましい。
            "price" to 120
    )
    val item = Item(map)
    println("${item.name}: ${item.price} yen")
}
