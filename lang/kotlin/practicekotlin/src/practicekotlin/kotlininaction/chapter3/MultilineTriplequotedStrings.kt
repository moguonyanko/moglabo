/**
 * MultilineTriplequotedStrings
 */

package practicekotlin.kotlininaction.chapter3

private val html = """<html>
    <head>
        <meta charset="UTF-8" />
        <title>Sample Page</title>
    </head>
    &nbsp;<body>
        <header>
            <h1>Sample Page</h1>
        </header>
        <main>
            <p>Welcome sample page!</p>
        </main>
    </body>
</html>"""

fun main(args: Array<String>) {
    // trimMarginに渡した文字列とその前の空白が除去される。
    println(html.trimMargin("&nbsp;"))
}
