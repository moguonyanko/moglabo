/**
 * SealedClassesDefiningRestrictedClassHierarchies1
 */

package practicekotlin.kotlininaction.chapter4

// sealedを指定しないと通常のclassでもinner classでも継承できない。
// openを指定するのとどう違うのか。
private sealed class Base {
    class InnerSubBaseA: Base() {
        override fun toString() = "I am A"
    }

    class InnerSubBaseB: Base() {
        override fun toString() = "I am B"
    }

    override fun toString() = "It's Base"
}

// sealedされていても継承できる。
private class SubBase: Base() {
    override fun toString() = "It's SubBase"
}

private class Descriptor {
    fun description() = "${Base.InnerSubBaseA()} and ${Base.InnerSubBaseB()}"
}

fun main(args: Array<String>) {
    val descriptor = Descriptor()
    println(descriptor.description())
    println(SubBase())
}
