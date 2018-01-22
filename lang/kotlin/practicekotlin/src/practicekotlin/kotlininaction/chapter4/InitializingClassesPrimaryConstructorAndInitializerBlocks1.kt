/**
 * InitializingClassesPrimaryConstructorAndInitializerBlocks1
 */

package practicekotlin.kotlininaction.chapter4

private class MyUser constructor(_name: String) {
    val name: String = _name

// 上のコードは以下のコードと同じ。
//    val name: String
//
//    init {
//        name = _name
//    }
}

fun main(args: Array<String>) {
    val user = MyUser("saburo")
    println(user.name)
}
