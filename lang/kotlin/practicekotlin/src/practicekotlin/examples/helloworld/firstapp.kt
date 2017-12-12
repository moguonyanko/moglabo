package practicekotlin.examples.helloworld

/**
 * Simplest version
 *
 * Reference:
 * https://kotlinlang.org/docs/tutorials/getting-started.html
 * https://kotlinlang.org/docs/tutorials/koans.html
 *
 * さらにこのプロジェクトのプログラム作成では https://try.kotlinlang.org/ を参考にしている。
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
