package practicekotlin.examples.destructuringanddata

/**
 * Destructuring declarations
 */

private class Human<out K, out V, out G>(val name: K, val height: V,
                                         val weight: G) {
    // 関数名の変更は不可能
    operator fun component1(): K {
        return name
    }

    operator fun component2(): V {
        return height
    }

    operator fun component3(): G {
        return weight
    }
}

fun main(args: Array<String>) {
    val human = Human("Taro", 175.6, 78.3)
    // 変数を2つしか宣言しない場合component3は捨てられる。
    val (name, h, w) = human
    print("$name の身長は $h cm，体重は $w kgです")
}
