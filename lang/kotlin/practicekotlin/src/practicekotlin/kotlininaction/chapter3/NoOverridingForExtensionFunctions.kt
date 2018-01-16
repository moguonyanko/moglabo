/**
 * NoOverridingForExtensionFunctions
 */

package practicekotlin.kotlininaction.chapter3

// openが指定されていないclassは継承できない。
// openが指定されていない関数はoverrideできない。
private open class Input {
    // openな関数にprivateを指定することはできない。
    open fun action() = println("Input")
}

private class CheckBox: Input() {
    override fun action() = println("Checked")
}

fun main(args: Array<String>) {
    // 実体の型の関数が呼び出される。
    // つまりここではCheckBoxのactionが呼び出される。
    val ui: Input = CheckBox()
    ui.action()
}
