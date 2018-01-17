/**
 * ParsePath
 */

package practicekotlin.kotlininaction.chapter3

import java.nio.file.Paths

private fun getDir(path: String) = path.substringBeforeLast("/")

private fun getFileName(path: String) = path.substringAfterLast("/")

private fun getFileInfo(fileName: String): Pair<String, String> {
    val name = fileName.substringBeforeLast(".")
    val ext = fileName.substringAfterLast(".")
    return Pair(name, ext)
}

private fun displayPathInfo(path: String) {
    val fileName = getFileName(path)
    val dir = getDir(path)
    val info = getFileInfo(fileName)
    println("directory: $dir, name: ${info.first}, extension: ${info.second}")
}

fun main(args: Array<String>) {
    // ファイルが実際に存在しているかどうかはどうでもいい。
    val path = Paths.get("./sample.txt")
            .toAbsolutePath().toString()
    displayPathInfo(path)
}
