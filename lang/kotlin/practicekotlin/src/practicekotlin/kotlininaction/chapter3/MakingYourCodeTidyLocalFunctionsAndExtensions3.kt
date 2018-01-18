/**
 * MakingYourCodeTidyLocalFunctionsAndExtensions3
 */

package practicekotlin.kotlininaction.chapter3

private class MyUser3(val id: String, val name: String)

private fun MyUser3.validateUser() {
    fun validate(value: String?, field: String) {
        if (value.isNullOrBlank()) {
            // $idを${this.id}と書いても同じ。
            throw IllegalArgumentException("$id: Illegal $field")
        }
    }

    validate(name, "name")
}

fun main(args: Array<String>) {
    val user = MyUser3("C001", "   ")
    try {
        user.validateUser()
    } catch (ex: Exception) {
        println(ex.message)
    }
}
