//
//  sort.swift
//  Algorithm
//
//

import Foundation

private func getRandomPositiveNumbers(size: UInt32, max: UInt32) -> [Int] {
    var numbers: [Int] = []
    for _ in 0..<size {
        let number = arc4random_uniform(max)
        numbers.append(Int(number))
    }
    return numbers
}

struct Sort {
    static func main() {
        print("\(getRandomPositiveNumbers(size: 10, max: 100))")
    }
}
