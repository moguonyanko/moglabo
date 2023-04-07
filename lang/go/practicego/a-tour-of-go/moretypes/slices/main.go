/**
 * 参考:
 * https://go.dev/tour/moretypes/7
 * https://go.dev/tour/moretypes/8
 * https://go.dev/tour/moretypes/9
 * https://go.dev/tour/moretypes/10
 * https://go.dev/tour/moretypes/11
 * https://go.dev/tour/moretypes/12
 */

package main

import "fmt"

// 要素数も型に含まれる。要素数が異なれば同じ方としてみなされずエラーとなる。
func sliceNames(names [5]string, start int, end int) []string {
	n := names[start:end]
	return n
}

func dumpSliceLiterals() {
	i := []int{1, 2, 3, 4, 5}

	i = i[2:] // 下を切り詰めると容量(cap)が減る。
	fmt.Println(i)
	fmt.Printf("i:len=%d cap=%d %v\n", len(i), cap(i), i)

	s := []struct {
		name string
		age  int
	}{
		{"Mike", 34},
		{"Taro", 18},
	}

	s = s[:1] // 上を切り詰めても容量(cap)は減らない。
	fmt.Println(s)
	fmt.Printf("s:len=%d cap=%d %v\n", len(s), cap(s), s)

	var nila []int
	fmt.Printf("nila:len=%d cap=%d %v\n", len(nila), cap(nila), nila)
	fmt.Println(nila == nil)
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

	dumpSliceLiterals()
}
