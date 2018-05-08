/**
 * CreatingSequences1
 */

package practicekotlin.kotlininaction.chapter5

import java.nio.file.Path
import java.nio.file.Paths

// generateSequenceの{}内が評価されるのは2番目の要素から。
// 最初はthisがそのままanyの{}に渡される。
private fun Path.isInsideUsersDirectory() =
        generateSequence(this) { println(it); it.parent }
                .any { println("Parent: ${it.fileName}"); it.fileName.toString() == "Users" }

fun main(args: Array<String>) {
    val path = Paths.get("/Users/dummy/foo/bar/baz/test.txt")
    println("Is $path inside users directory?: ${path.isInsideUsersDirectory()}")
}
