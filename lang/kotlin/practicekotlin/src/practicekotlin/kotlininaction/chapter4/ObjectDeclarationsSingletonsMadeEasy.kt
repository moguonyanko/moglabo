/**
 * ObjectDeclarationsSingletonsMadeEasy
 */

package practicekotlin.kotlininaction.chapter4

private data class MyTempData (val id: Int, val content: String) {
    override fun toString() = "($id: $content)"
}

private object DataIdComparator: Comparator<MyTempData> {
    override fun compare(o1: MyTempData?, o2: MyTempData?) =
            o1!!.id.compareTo(o2!!.id)
}

fun main(args: Array<String>) {
    val d1 = MyTempData(10, "data1")
    val d2 = MyTempData(8, "data2")
    println(DataIdComparator.compare(d1, d2))
    val dataList = arrayListOf(d1, d2)
    println(dataList.sortedWith(DataIdComparator))
}
