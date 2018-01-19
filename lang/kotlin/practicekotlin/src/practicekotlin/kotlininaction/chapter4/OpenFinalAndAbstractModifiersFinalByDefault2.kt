/**
 * OpenFinalAndAbstractModifiersFinalByDefault2
 */

package practicekotlin.kotlininaction.chapter4

private abstract class Machine {
    // abstractとprivateは同時に指定できない。
    abstract fun action()

    private fun start() = println("Starting operation")

    private fun end() = println("Finished")

    fun operate() {
        start()
        action()
        end()
    }
}

// MachineではなくMachine()と記述する。
// abstract classの継承も通常のclassの継承と同じ。
private class MyMachine: Machine() {
    override fun action() {
        println("Now operating")
    }
}

fun main(args: Array<String>) {
    MyMachine().operate()
}
