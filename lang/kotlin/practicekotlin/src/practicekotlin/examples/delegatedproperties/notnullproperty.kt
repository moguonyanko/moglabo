/**
 * NotNull property
 */

package practicekotlin.examples.delegatedproperties

import kotlin.properties.Delegates

private class Card {
    var id: String by Delegates.notNull()

    fun init(id: String) {
        this.id = id
    }
}

fun main(args: Array<String>) {
    val card = Card()
    // NotNullなプロパティをnullの時に参照するとIllegalStateExceptionがスローされる。
    //println("Card id: ${card.id}")
    card.init("A001")
    println("Card id: ${card.id}")
}
