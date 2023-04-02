package main

import (
	"fmt"
	"math"
)

func sqrtString(x float64) string {
	if x < 0 {
		return sqrtString(-x) + "i"
	}
	return fmt.Sprint((math.Sqrt(x)))
}

func powString(x, n, lim float64) string {
	if v := math.Pow(x, n); v < lim {
		return fmt.Sprint(v)
	} else {
		return fmt.Sprint("上限に達しました：", lim)
	}
}

func main() {
	fmt.Println(
		sqrtString(11),
		sqrtString(-11),
		powString(3, 2, 10),
		powString(4, 3, 50)) // 改行すると文法ラー
}
