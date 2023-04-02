/**
 * 参考:
 * https://go.dev/tour/flowcontrol/9
 * https://go.dev/tour/flowcontrol/10
 * https://go.dev/tour/flowcontrol/11
 */
package main

import (
	"fmt"
	"runtime"
	"time"
)

func getOS() string {
	switch os := runtime.GOOS; os {
	case "darwin":
		return "MacOSX"
	case "linux":
		return "Linux"
	default:
		return os
	}
}

func whenSaturady() string {
	today := time.Now().Weekday()
	switch time.Saturday {
	case today + 0:
		return "今日"
	case today + 1:
		return "明日"
	case today + 2:
		return "明後日"
	case today + 3:
		return "明明後日"
	default:
		return "ずっと先"
	}
}

func getGreeting() string {
	t := time.Now()
	switch {
	case t.Hour() < 12:
		return "おはようございます"
	case t.Hour() < 17:
		return "こんにちは"
	default:
		return "こんばんは"
	}
}

func main() {
	fmt.Println(getOS())
	fmt.Println("土曜日は", whenSaturady())
	fmt.Println(getGreeting())
}
