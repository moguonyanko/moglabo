/**
 * ExtensionProperties
 */

package practicekotlin.kotlininaction.chapter3

private val String.firstChar: Char
    get() = this[0]

// valで宣言するとsetterを定義できない。
private var StringBuilder.firstChar: Char
    get() = this[0]
        // setterの引数の型は省略可能。ここではfirstCharの宣言部に指定している型
        // つまりCharしか指定できない。
    set(value) {
        this.replace(0, 1, value.toString())
    }

fun main(args: Array<String>) {
    println("Hello".firstChar)
    val s = StringBuilder("Apple")
    s.firstChar = 'P'
    println(s)
}
