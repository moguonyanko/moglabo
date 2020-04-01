package main

import "fmt"

func user() (name, code string) {
	name = "Mike"
	code = "A001"
	return
}

func main() {
	fmt.Println(user())
}
