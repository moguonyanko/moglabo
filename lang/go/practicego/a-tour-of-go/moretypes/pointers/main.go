/**
 * 参考:
 * https://go.dev/tour/moretypes/1
 */

package main

import "fmt"

func displaySamplePointers() {
	n, m := 10, 200

	p1 := &n // :=は最初に値を束縛するときのみ使える。
	fmt.Println(*p1)
	*p1 = 111
	fmt.Println(n)

	p1 = &m
	*p1 = *p1 / 20
	fmt.Println(*p1)
}

func main() {
	displaySamplePointers()
}
