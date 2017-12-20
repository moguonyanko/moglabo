/**
 * DeclaringEnumClasses1
 */

package practicekotlin.kotlininaction.chapter2

import kotlin.math.abs

private enum class Card(val number: Int) {
    ACE(1),
    TWO(2),
    THREE(3),
    FOUR(4),
    FIVE(5),
    SIX(6),
    SEVEN(7),
    EIGHT(8),
    NINE(9),
    TEN(10),
    JACK(11),
    QUEEN(12),
    KING(13);

    val isEhuda: Boolean
        get() {
            return number > TEN.number
        }

}

private data class Player(val name: String, val cards: Array<Card>)

private fun blackjack(parent: Player, child: Player): Player {
    // ここでは絵札は10点とする。
    fun getNum(card: Card) = if (card.isEhuda) 10 else card.number
    val v1 = parent.cards.map { getNum(it) }.reduce { acc, i -> acc + i }
    val v2 = child.cards.map { getNum(it) }.reduce { acc, i -> acc + i }

    val d1 = abs(21 - v1)
    val d2 = abs(21 - v2)

    return if (d1 <= d2) parent else child
}

fun main(args: Array<String>) {
    val p1 = Player("Taro(parent)", arrayOf(Card.JACK, Card.ACE, Card.QUEEN))
    val p2 = Player("Jiro(child)", arrayOf(Card.KING, Card.THREE, Card.EIGHT))
    println("${p1.name} vs ${p2.name}: ${blackjack(p1, p2).name} won")
}
