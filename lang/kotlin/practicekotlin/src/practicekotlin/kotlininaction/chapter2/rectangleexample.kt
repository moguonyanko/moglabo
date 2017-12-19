/**
 * RectangleExample
 */

package practicekotlin.kotlininaction.chapter2

// 同一パッケージ内の関数なのでimportは不要である。
//import practicekotlin.kotlininaction.chapter2.createRandomRectangle

fun main(args: Array<String>) {
    val rect = createRandomRectangle()
    println("Rectangle is ${if(rect.isSquare) "" else "not"} square")
}
