package main

/**
 * 参考:
 * https://go-tour-jp.appspot.com/basics/1
 */

import (
	"fmt"
	"math/rand"
)

func main() {
	rand.Seed(100)
	fmt.Println("乱数生成:", rand.Intn(100))
}
