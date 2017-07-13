//
//  recursion.swift
//  Algorithm
//
//

import Foundation

private func fib(n: Int64, memo: [Int64:Int64]) -> Int64 {
    var mm = memo
    if n == 1 || n == 2 {
        return 1
    }
    if !mm.keys.contains(n) {
        mm[n] = fib(n: n - 1, memo: mm) + fib(n: n - 2, memo: mm)
    }
    return mm[n]!
}

struct Recursion {
    static func main() {
        let n: Int64 = 30
        print("Fibonacchi number by \(n) = \(fib(n: n, memo: [:]))")
    }
}
