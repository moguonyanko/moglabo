/**
 * ClassDelegationUsingTheByKeyword
 */

package practicekotlin.kotlininaction.chapter4

// by innerListと記述することで抽象メソッドの実装をinnerListに委譲できる。
// MutableCollectionインターフェースの他のメソッドを実装していなくても
// コンパイルエラーにならない。
private class LimitedList<T>(val innerList: MutableCollection<T> =
                             ArrayList<T>(), val limit: Int = 10):
        MutableCollection<T> by innerList {

    override fun add(element: T): Boolean {
        return if (size < limit) {
            innerList.add(element)
        } else {
            println("Limit over")
            false
        }
    }

    override fun addAll(elements: Collection<T>): Boolean {
        return if (size + elements.size < limit) {
            innerList.addAll(elements)
        } else {
            println("Limit over: ${size + elements.size - limit} items")
            false
        }
    }
}

fun main(args: Array<String>) {
    val list = LimitedList<String>(limit = 2)
    list.add("Apple")
    list.addAll(arrayListOf("orange", "banana", "lemon"))
}
