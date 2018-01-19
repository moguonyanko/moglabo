/**
 * OpenFinalAndAbstractModifiersFinalByDefault1
 */

package practicekotlin.kotlininaction.chapter4

// privateで宣言しても既存の同名のclassやinterfaceと衝突するので
// コンパイルエラーになる。
private interface Worker2 {
    val name: String
    fun work()
}

// paramNameにvalが指定されていないとget()で参照できない。
private open class SampleWorker2(val paramName: String): Worker2 {
    override val name: String
        get() = paramName
    // finalとopenを同時に指定するのは不可。
    final override fun work() = println("Final work by $name")
}

// SampleWorker2ではなくSampleWorker2()と書く。
// 継承時にコンストラクタを呼び出すイメージか。
private class SampleSubWorker2(paramName: String): SampleWorker2(paramName) {
    // finalな関数はoverride不可。
    //override fun work() = println("Not work")
}

fun main(args: Array<String>) {
    SampleSubWorker2("Pochi").work()
}
