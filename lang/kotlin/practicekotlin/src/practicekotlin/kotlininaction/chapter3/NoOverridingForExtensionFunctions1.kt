/**
 * NoOverridingForExtensionFunctions1
 */

package practicekotlin.kotlininaction.chapter3

private open class Animal {
    open fun eat() = "eat the meat"
}

private class Cat: Animal() {
    override fun eat() = "eat the fish"
}

private fun Animal.display() = println(this.eat())

private fun Cat.display() = println("${this.eat()} by cat")

fun main(args: Array<String>) {
    // 型に指定したclassの関数が呼び出されるのでここでは
    // Animalのdisplayが呼び出される。しかしdisplayにて
    // this経由で呼び出しているeatは実体の型の関数が呼び出される。
    // つまりCatのeatが呼び出される。
    val animal: Animal = Cat()
    animal.display()
}
