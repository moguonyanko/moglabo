/**
 * MakingYourCodeTidyLocalFunctionsAndExtensions1
 */

package practicekotlin.kotlininaction.chapter3

private class MyUser(val id: String, val name: String)

private fun saveUser(user: MyUser) {
    fun validate(user: MyUser, value: String?, field: String) {
        if (value.isNullOrBlank()) {
            throw IllegalArgumentException("User(${user.id}): " +
                    "$field is illegal")
        }
    }

    validate(user, user.name, "name")
}

fun main(args: Array<String>) {
    try {
        saveUser(MyUser("A001", "   "))
    } catch (ex: Exception) {
        println(ex.message)
    }
}
