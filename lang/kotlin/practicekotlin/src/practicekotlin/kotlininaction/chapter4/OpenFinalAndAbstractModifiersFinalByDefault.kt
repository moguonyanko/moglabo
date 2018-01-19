/**
 * OpenFinalAndAbstractModifiersFinalByDefault
 */

package practicekotlin.kotlininaction.chapter4

private interface Worker {
    fun work(): String
    val name: String
    fun description() = "I am $name"
}

// openなclassにprivateを指定することはできる。
private open class SampleWorker(val nameParam: String): Worker {
    override val name: String
        get() = nameParam

    // openな関数にprivateは指定できない。
    open fun moreWork() = "More work!"

    override fun work() = "Do work! ${moreWork()}"
}

fun main(args: Array<String>) {
    val worker = SampleWorker("Taro")
    println(worker.work())
    println(worker.description())
}
