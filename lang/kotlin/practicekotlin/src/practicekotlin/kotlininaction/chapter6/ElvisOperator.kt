/**
 * 6.1.4.1 ElvisOperator
 */

package practicekotlin.kotlininaction.chapter6

// sがnullの場合、即座にfalseが返されるのでnullを空文字として判定できない。
private fun isEmptyString(s: String?) = s?.length == 0

// Boolean型が返されることを明示しないとコンパイルエラーになる。
// 式ではなく文で関数宣言する場合、戻り値の型を明示する必要があるようだ。
private fun isNullOrEmptyString(s: String?): Boolean {
    return s == null || s.isEmpty()
}

private fun isEmptyString2(s: String?): Boolean {
    // ?:演算子(ElvisOperator)を用いた以下のコードは
    // JavaScriptにおける次のコードと同じと考えられる。
    // var len = (s && s.length) || 0
    // ?:の右辺はデフォルト値とみなせる。
    val len = s?.length ?: 0
    return len == 0
}

fun main(args: Array<String>) {
    println(isEmptyString("Hello"))
    println(isEmptyString(""))
    println(isEmptyString(null))

    println(isNullOrEmptyString("Hello"))
    println(isNullOrEmptyString(""))
    println(isNullOrEmptyString(null))

    println(isEmptyString2("Hello"))
    println(isEmptyString2(""))
    println(isEmptyString2(null))
}
