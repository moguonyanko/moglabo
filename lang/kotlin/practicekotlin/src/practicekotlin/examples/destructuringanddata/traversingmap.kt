package practicekotlin.examples.destructuringanddata

/**
 * Traversing a map
 */

private data class User(val name: String, val age: Int)

fun main(args: Array<String>) {
    val map = hashMapOf<String, User>()
    map.put("A001", User("foo", 23))
    map.put("A002", User("bar", 19))
    map.put("B001", User("taro", 44))

    for ((key, value) in map) {
        println("$key: ${value.name} is ${value.age} years old")
    }
}
