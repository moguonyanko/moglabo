package practicekotlin.examples.basicsyntax

/**
 * is-checks and smart casts
 */

/**
 * mainの引数が args: Array<String> でないとメインメソッドとして認識されない。
 */
fun main(args: Array<String>) {
    println(getLength("Hello"))
    println(getLength(100))
}

fun getLength(obj: Any): Int? {
    if (obj is String) {
        return obj.length
    }
    return null
}
