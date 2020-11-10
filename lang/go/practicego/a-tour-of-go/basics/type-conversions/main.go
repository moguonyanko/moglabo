package main

import (
	"fmt"
	"math"
)

func main() {
	i1, i2 := 7, 13
	f1 := math.Sqrt(float64(i1*i1 + i2*i2))
	z1 := uint(f1)
	fmt.Println(i1, i2, f1, z1)
}
