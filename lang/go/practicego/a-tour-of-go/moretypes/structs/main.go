/**
 * 参考:
 * https://go.dev/tour/moretypes/2
 * https://go.dev/tour/moretypes/3
 * https://go.dev/tour/moretypes/4
 * https://go.dev/tour/moretypes/5
 */

package main

import "fmt"

type Vector struct {
	X, Y int
}

type Student struct {
	name string
	age  int
}

var (
	v1 = Vector{10, 20}
	v2 = Vector{X: 100}
	v3 = Vector{}
	p1 = &Vector{10, 20}
)

func main() {
	v := Vector{10, 20}
	v.X = 100
	fmt.Println(v)

	p := &v
	p.X = 99
	fmt.Println(v)
	fmt.Println(*p) // 上と同じ

	fmt.Println(*&Student{"Masao", 69})

	fmt.Println(v1, v2, v3, *p1)
}
