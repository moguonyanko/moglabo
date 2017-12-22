package practicekotlin.kotlininaction.chapter2

fun fizzBuzz(i: Int) = when {
    // whenブロック内で変数の定義はできない。
    //val a = 3
    //val b = 5
    i % (3 * 5) == 0 -> "フィズバズ "
    i % 5 == 0 -> "フィズ "
    i % 3 == 0 -> "バス "
    else -> "$i"
}

fun main(args: Array<String>) {
    (1..30).forEach { println(fizzBuzz(it)) }
}
