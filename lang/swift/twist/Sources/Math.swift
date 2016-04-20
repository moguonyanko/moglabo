func fractorial(n: Int) -> Int {
    if n <= 1 {
        return n
    } else {
        return n * fractorial(n: n - 1)
    }
}