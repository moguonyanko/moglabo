/**
 * 参考:
 * https://go.dev/tour/moretypes/6
 */
package main

import "fmt"

func main() {
	var a [3]string
	a[0] = "こんにちは"
	a[1] = "こんばんは"
	a[2] = "おやすみ"
	// a[3] = "エラー" // コンパイルエラー
	fmt.Println(a)

	primes := [7]int{2, 3, 5, 7, 11, 13} // 足りない要素は0になる。
	fmt.Println(primes)
}
