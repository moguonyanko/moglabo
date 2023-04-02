package main

import "fmt"

const LoopLimit = 10

func main() {
	sum := 0
	for index := 0; index < LoopLimit; index++ {
		sum += index
	}
	for sum < 5000 {
		sum += 5000
	}
	fmt.Println(sum)
}
