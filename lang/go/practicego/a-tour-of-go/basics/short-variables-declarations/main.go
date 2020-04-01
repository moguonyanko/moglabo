package main

import "fmt"

var i = 100

// 関数の外側では常にvarが必要なので以下はコンパイルエラー
//i := 1

func main() {
	name := "Jiro"
	w, h := 100, 200

	fmt.Println(i, name, w, h)
}
