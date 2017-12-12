/**
 * Custom delegate
 */

package practicekotlin.examples.delegatedproperties

import kotlin.reflect.KProperty

private class MyDelegate() {
    // getValueおよびsetValueの関数名は変更不可能。
    operator fun getValue(self: Any?, prop: KProperty<*>): String {
        return "$self: getValue: \"${prop.name}\""
    }

    operator fun setValue(self: Any?, prop: KProperty<*>, value: String) {
        println("$self: setValue: \"${prop.name}\" to $value")
    }
}

private class Student {
    var info: String by MyDelegate()

    //override fun toString(): String {
    //    return "Sample Student"
    //}

    // 上のコードと同じ。
    override fun toString() = "Sample Student"
}

fun main(args: Array<String>) {
    val s = Student()
    println(s.info)
    s.info = "Practice Kotlin now!"
}
