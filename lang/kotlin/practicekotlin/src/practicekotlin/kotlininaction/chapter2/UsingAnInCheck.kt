/**
 * UsingAnInCheck
 */

package practicekotlin.kotlininaction.chapter2

import java.util.TreeMap

private fun isNotLetter(c: Char) = c !in 'a'..'z' && c !in 'A'..'Z'

private fun isDigit(c: Char) = c in '0'..'9'

fun main(args: Array<String>) {
    //val map = TreeMap<Char, Boolean>()
    // associateToの第1引数でTreeMapコンストラクタを呼び出すなら
    // <>による型の指定を行わなくてもよい。型推論が効くためであろう。
    // 出力結果の順序はキー(ここではChar)の自然順序に従う。
    "Hello!World".associateTo(TreeMap(), { Pair(it, isNotLetter(it)) })
            .forEach { println("Is ${it.key} not letter: ${it.value}") }
    println(isDigit('3'))
}
