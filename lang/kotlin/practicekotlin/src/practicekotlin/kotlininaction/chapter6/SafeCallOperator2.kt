/**
 * 6.1.3.3 SafeCallOperator2
 */

package practicekotlin.kotlininaction.chapter6

private class Address(val city: String?, val town: String?, val lot: String?) {
    override fun toString() = "$city:$town:$lot"
}

private class Profile(val name: String, val address: Address?)

private class User(val profile: Profile?) {
    override fun toString() =
            "My name is ${profile?.name}, I am in ${profile?.address}"
}

// 戻り値の型を明示しないとUnit型が返されるとみなされて
// コンパイルエラーになってしまう。
private fun User.isInFirstLot(): Boolean {
    // プロパティを参照するコードの途中でnullがあると変数にnullが格納される。
    val lot = this.profile?.address?.lot
    println("The lot number is $lot")
    return lot?.startsWith("1") ?: false
}

fun main(args: Array<String>) {
    val address = Address(city = "FooCity", town = "BarTown", lot = "1-2-3")
    val profile = Profile("Mike", address)
    val user1 = User(profile)
    println(user1)
    println(user1.isInFirstLot())
    val user2 = User(Profile(name = "Tom", address = null))
    println(user2)
    println(user2.isInFirstLot())
}
