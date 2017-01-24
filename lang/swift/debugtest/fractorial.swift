func fractorial(n: Int) -> Int {
	if n <= 1 {
		return n
	} 

	return n * fractorial(n: n - 1)
}

let number = 4

print("\(number)! is equal to \(fractorial(n: number))")

