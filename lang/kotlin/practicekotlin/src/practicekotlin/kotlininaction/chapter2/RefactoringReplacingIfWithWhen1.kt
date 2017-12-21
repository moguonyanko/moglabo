/**
 * RefactoringReplacingIfWithWhen1
 */

package practicekotlin.kotlininaction.chapter2

// 他のファイルのprivate関数と名前やシグネチャが衝突してもprivate関数であれば問題無い。
private fun eval(e: Expr): Double =
        when (e) {
            is Term -> e.value
            is Multi -> eval(e.left) * eval(e.right)
            else -> throw IllegalArgumentException("Illegal: $e")
        }

fun main(args: Array<String>) {
    val x = Multi(Multi(Term(1.2), Term(3.3)),
            Multi(Term(-4.5), Term(-0.1)))
    println("%.4f".format(eval(x)))
}
