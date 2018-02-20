/**
 * ObjectDeclarationsSingletonsMadeEasy1
 */
package practicekotlin.kotlininaction.chapter4

private data class ShopItem(val name: String, val itemNumber: Int) {
    object ItemNumberComparator : Comparator<ShopItem> {
        override fun compare(o1: ShopItem?, o2: ShopItem?): Int =
                o1!!.itemNumber.compareTo(o2!!.itemNumber)
    }
}

fun main(args: Array<String>) {
    val items = setOf(ShopItem("banana", itemNumber = 3),
            ShopItem("kiwi", itemNumber = 7),
            ShopItem("apple", itemNumber = 2))
    println(items.sortedWith(ShopItem.ItemNumberComparator))
}
