/**
 * CompanionObjectsAPlaceForFactoryMethodsAndStaticMembers
 */

package practicekotlin.kotlininaction.chapter4

private class Sample {
    companion object {
        fun hello() = "Hello companion!"
    }
}

fun main(args: Array<String>) {
    println(Sample.hello())
}
