package practicekotlin.examples.destructuringanddata

/**
 * Auto generated functions
 */

private data class Member(val id: Int, val name: String)

fun main(args: Array<String>) {
    val member1 = Member(1, "foo")
    println("toString(): $member1")

    val member2 = Member(2, "bar")
    val member3 = Member(1, "foo")

    // プロパティを元にequalsとhashCodeが自動で生成されているらしい。
    // 両者のオブジェクトのプロパティの値が等しければオブジェクトは等しいと判定される。
    println("equals() and hashCode()")
    println("member1 == member2: ${member1 == member2}")
    println("member1 == member3: ${member1 == member3}")

    println("copy(): ${member1.copy()}")
    // プロパティ名無しでcopyに渡してもそれが最初のプロパティであればコンパイルに成功する。
    // println("copy(): ${member1.copy(100)}")
    // しかしプロパティ名を指定して渡す方が行儀が良いようである。警告されない。
    println("copy(): ${member1.copy(id = 100)}")
    println("copy(): ${member1.copy(name = "poo")}")
    println("copy(): ${member1.copy(200, "don")}")
}
