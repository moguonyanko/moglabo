/**
 * InterfacesInKotlin2
 */

package practicekotlin.kotlininaction.chapter4

private interface Player {
    fun play()

    fun description() = "I am player"
}

private interface Actor {
    fun action()

    fun description() = "I am actor"
}

private class MultiPlayer: Player, Actor {
    override fun play() {
        println("Playing...")
    }

    override fun action() {
        println("Action!")
    }

    override fun description(): String {
        val d1 = super<Player>.description()
        val d2 = super<Actor>.description()
        return "$d1 and $d2"
    }
}

fun main(args: Array<String>) {
    val p = MultiPlayer()
    p.play()
    p.action()
    println(p.description())
}
