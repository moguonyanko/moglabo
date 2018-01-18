/**
 * MakingYourCodeTidyLocalFunctionsAndExtensions2
 */

package practicekotlin.kotlininaction.chapter3

// プロパティにvalが指定されていないとプロパティを参照できない。
private class MyUser2(val id: String, var name: String)

// 関数の引数にvalやvarは指定できない。
private fun saveUser() {
    var usr = MyUser2("B001", "")
    usr = MyUser2("B002", "  ")

    fun validate(value: String?, field: String) {
        if (value.isNullOrBlank()) {
            // 不変でないオブジェクトであってもローカル関数内から参照できる。
            throw IllegalArgumentException("${usr.id} $field is invalid: $value")
        }
    }

    validate(usr.name, "name")
}

fun main(args: Array<String>) {
    try {
        saveUser()
    } catch (ex: Exception) {
        println(ex.message)
    }
}
