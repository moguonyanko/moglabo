/**
 * 6.1.4.2 ElvisOperator1
 */

package practicekotlin.kotlininaction.chapter6

private class AccountId(val code: String)

private class Profile2(val name: String, val age: Int)

private class Account(val id: AccountId, val profile: Profile2?)

private class IllegalAccountException(val account: Account): Exception() {
    override fun toString() = "${account.id.code} is illegal"
}

// ?:演算子の右辺のデフォルト値代わりに例外をスローすることもできる。
// Throwsアノテーションを記述しても例外処理を怠ることができてしまう。
// コンパイル時に警告されることもない。
// この例に関して言えばIllegalAccountExceptionは非チェック例外で良い。
@Throws(IllegalAccountException::class)
private fun isGrownUpAccount(account: Account): Boolean {
    val age = account.profile?.age
            ?: throw IllegalAccountException(account)
    return age >= 20
}

fun main(args: Array<String>) {
    try {
        val account1 = Account(AccountId("A001"), Profile2("mike", 21))
        val account2 = Account(AccountId("A002"), null)
        println("Is account(${account1.id.code}) grown up? = " +
                "${isGrownUpAccount(account1)}")
        println("Is account(${account2.id.code}) grown up? = " +
                "${isGrownUpAccount(account2)}")
    } catch (error: IllegalAccountException) {
        println(error)
    }
}
