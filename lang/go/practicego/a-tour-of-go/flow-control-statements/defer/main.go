/**
 * 参考:
 * https://go.dev/tour/flowcontrol/12
 * https://go.dev/tour/flowcontrol/13
 */
package main

import "fmt"

func deferNumbers() {
	fmt.Println("カウント開始")

	// deferされた関数はスタックに積まれる。すなわち後に積まれたものから実行される。
	for i := 0; i < 10; i++ {
		defer fmt.Println(i)
	}

	fmt.Println("カウント終了")
}

func main() {
	// 引数の評価はされるが関数の呼び出しはmainの呼び出し後になる。
	defer fmt.Println("以上、宜しくお願いします。")

	fmt.Println("おはようございます")
	fmt.Println("今日もいい天気ですね")
	fmt.Println("本日もがんばりましょう")

	deferNumbers()
}
