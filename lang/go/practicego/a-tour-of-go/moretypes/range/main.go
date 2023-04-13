/**
 * 参考:
 * https://go.dev/tour/moretypes/16 - 17
 */

package main

import "fmt"

// 以下はコンパイルエラー。:=はローカルのスコープでしか使えない？
// nums := []int{1,2,3,4,5,6}
var nums = []int{1, 2, 3, 4, 5, 6}

func dumpNums() {
	for index, value := range nums {
		fmt.Printf("index=%d,value=%d\n", index, value)
	}
}

func dumpPows() {
	pow := make([]int, 10)
	for index := range pow {
		pow[index] = 1 << uint(index) // 2のindex乗と同じ
	}

	for _, value := range pow {
		fmt.Printf("%d\n", value)
	}
}

func main() {
	dumpNums()
	dumpPows()
}
