/**
 * Use ranges and in
 */

fun main(args: Array<String>) {
    if (args.isEmpty()) {
        return
    }

    val x = args[0].toInt()
    val y = 30
    // yがDoubleだと型の不一致によりコンパイルエラー
    if (x in 1 until y)
        println("$x は 1 から $y までに含まれます")

    for (a in 1..y)
        print("$a ")

    println()
    val array = arrayListOf<Int>()
    array.add(10)
    array.add(20)
    array.add(30)

    if (x !in 0 until array.size)
        println("入力値 $x はリストのサイズ ${array.size} と異なります")

    if (10 in array) // containsと同じことをする
        println("リストは10を含みます")
    if (100 in array)
        println("リストは100を含みます")
    else
        println("リストは100を含みません")
}
