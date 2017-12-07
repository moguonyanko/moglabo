/**
 * My first kotlin application
 *
 * Reference:
 * https://kotlinlang.org/docs/tutorials/getting-started.html
 * https://kotlinlang.org/docs/tutorials/koans.html
 */

/**
 * コマンドラインでのコンパイル:
 * kotlinc firstapp.kt -jdk-home ~/lib/jdk1.8.0 -jvm-target 1.8 -include-runtime -d firstapp.jar
 * コマンドラインでの実行:
 * java -jar firstapp.jar
 */

fun main(args: Array<String>) {
    println("Hello Kotlin world!")
}
