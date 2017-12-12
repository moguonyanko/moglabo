package practicekotlin.examples.basicsyntax

/**
 * Use a for-loop
 */

fun main(args: Array<String>) {
    for (arg in args)
        print(arg)

    println()

    // indexをインクリメントする必要はない。
    for (index in args.indices)
        print(args[index])
}
