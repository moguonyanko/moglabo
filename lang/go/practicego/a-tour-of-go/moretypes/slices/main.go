/**
 * 参考:
 * https://go.dev/tour/moretypes/7
 * https://go.dev/tour/moretypes/8
 */

package main

import "fmt"

// 要素数も型に含まれる。要素数が異なれば同じ方としてみなされずエラーとなる。
func sliceNames(names [5]string, start int, end int) []string {
	n := names[start:end]
	return n
}

func main() {
	names := [5]string{"Mike", "Foo", "Bar", "Baz", "Hoge"}
	var n = sliceNames(names, 1, 4)
	fmt.Println(n)

	n[0] = "Taro"
	fmt.Println(n) // 関数の戻り値に対して変更を加えても関数の引数に渡した配列には副作用がない。
	fmt.Println(names)

	var n2 = names[0:2]
	n2[1] = "Jiro" // namesに副作用がある。

	fmt.Println(n2)
	fmt.Println(names)
}
