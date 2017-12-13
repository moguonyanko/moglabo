/**
 * Composition of functions
 */

package practicekotlin.examples.callablereferences

// (U) -> R の()は必須。他についても同様。
private fun <T, U, R> compose(f: (T) -> U, g: (U) -> R): (T) -> R {
    // 関数の{}は必須。
    return { x -> g(f(x)) }
}

// isNullOrXXXをnullのオブジェクトに対して呼び出しても例外は発生しない。
// isBlankは"   "のような文字列に対して呼び出してもtrueを返す。
// isEmptyはfalseになる。isEmptyはisBlankと違い空文字を1文字と見なすということである。
private fun checkName(name: String?) = !name.isNullOrBlank()

private fun toUpperName(name: String?): String? {
    return when (name != null) {
        // リストに対して呼び出しているのはfilterなので，ここのtoUpperCaseは
        // 結果に反映されない。nameの後ろの!!が無いとStringの関数を呼び出せず
        // コンパイルエラーになる。String!からStringに変換されない。
        true -> name!!.toUpperCase()
        false -> name
    }
}

fun main(args: Array<String>) {
    val func = compose(::toUpperName, ::checkName)
    val names = listOf("mike", null, "taro", "", "   ", "¥n")
    val results = names.filter(func)
    println(results)
}
