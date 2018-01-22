/**
 * AccessingABackingFieldFromAGetterOrSetter
 */

package practicekotlin.kotlininaction.chapter4

private class Member(_address: String) {
    var address = _address
        // valueはプロパティへ代入する値，fieldは代入されたプロパティを指す。
        set(value) {
            field = "Address: $value"
        }

    override fun toString() = "My profile -> $address"
}

fun main(args: Array<String>) {
    val member = Member("anywhere")
    member.address = "south town"
    println(member)
}
