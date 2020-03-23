package main

import "fmt"

func deco(x, y string) (string, string) {
	return "@" + x, "?" + y
}

func main() {
	x, y := deco("foo", "bar")
	fmt.Println(x, y)
}
