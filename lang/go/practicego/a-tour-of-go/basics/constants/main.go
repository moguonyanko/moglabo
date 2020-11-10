package main

import "fmt"

const (
	// Big is sample value
	Big = 1 << 100
	// Small is sample value
	Small = Big >> 99
)

func toInt(x int) int {
	return x*10 + 1
}

func toFloat(x float64) float64 {
	return x * 0.1
}

func main() {
	fmt.Println(toInt(Small))
	fmt.Println(toFloat(Small))
	fmt.Println(toFloat(Big))
	// オーバーフローが発生する。
	// fmt.Println(toInt(Big))
}
