package main

import (
	"fmt"
	"math/cmplx"
)

// 大文字から始める変数はコメントがないと警告される。
var (
	// Disabled is sample bool value
	Disabled bool = false
	// MaxInt32 is sample uint32 value
	MaxInt32 uint32     = 1<<32 - 1
	x        complex128 = cmplx.Pow(2+3i, 2)
)

func main() {
	fmt.Printf("型: %T, 値: %v\n", Disabled, Disabled)
	fmt.Printf("型: %T, 値: %v\n", MaxInt32, MaxInt32)
	fmt.Printf("型: %T, 値: %v\n", x, x)
}
