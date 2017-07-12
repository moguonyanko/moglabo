//
//  collections.swift
//  PracticeSwiftStandardLibrary
//

import Foundation

private func stepNumbers() {
    let startNumber = 1.0
    let endNumber = 10.0
    let step = 2.0
    let stridedValues = stride(from: startNumber, to: endNumber, by: step)
    print("\(stridedValues.sorted())")
}

struct Collections {
    static func main() {
        stepNumbers()
    }
}

