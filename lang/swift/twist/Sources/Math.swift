func factorial(n: Int) -> Int {
    if n <= 1 {
        return n
    } else {
        return n * factorial(n: n - 1)
    }
}

// Unit tests

func testFactorial() throws {
    let expected = 3628800
    let actual = factorial(n: 10)
    
    try assertEquals(expected: expected, actual: actual)
}