/**
 * ImplementingPropertiesDeclaredInInterfaces
 */

package practicekotlin.kotlininaction.chapter4

private interface AttachType {
    fun getTypeName(): String
}

private class OriginalAttachType: AttachType {
    override fun getTypeName(): String = "original"
}

private class AttachTypeFactory {
    fun createAttachType(id: Int): AttachType {
        if (id == 1) {
            return OriginalAttachType()
        } else {
            throw UnsupportedOperationException("$id is not unsupported")
        }
    }
}

private interface Plug {
    val attachType: String
}

private class PlugFoo(override val attachType: String): Plug

// TODO:
// コンストラクタの引数にvalやvarを指定しなければならない時と
// 指定しなくてもいい時の区別がついていない。
private class PlugBar(val _attachType: String): Plug {
    override val attachType: String
        get() = "$_attachType for BAR"
}

private class PlugBaz(id: Int): Plug {
    private val attachTypeObj = AttachTypeFactory().createAttachType(id)
    override val attachType = attachTypeObj.getTypeName()
}

fun main(args: Array<String>) {
    val plugs = arrayOf(PlugFoo("circle"), PlugBar("square"), PlugBaz(1))
    val typeNames = plugs.map { it.attachType }
    typeNames.forEach { println(it) }
}
